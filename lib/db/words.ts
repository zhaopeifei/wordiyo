/**
 * Word queries — fetches word data from Supabase and maps to WordEntry.
 *
 * The words table may contain >1000 rows (up to ~15 000). Functions that
 * return all words use pagination with `.range()` to work around the
 * Supabase default 1 000-row limit.
 */

import type { WordEntry } from '@/types/content';
import { supabase } from '@/lib/supabase';
import {
  mapWord,
  type MorphemeSegmentRow,
  type WordExampleRow,
  type WordRow,
  type WordSenseRow,
} from './mappers';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const PAGE_SIZE = 1000;

/**
 * Paginated fetch for large tables.
 * Returns all rows matching a query builder function.
 */
async function fetchAllRows<T>(
  table: string,
  columns: string,
  orderBy?: string,
): Promise<T[]> {
  const allRows: T[] = [];
  let from = 0;
  let hasMore = true;

  while (hasMore) {
    let query = supabase.from(table).select(columns).range(from, from + PAGE_SIZE - 1);
    if (orderBy) {
      query = query.order(orderBy);
    }
    const { data, error } = await query;

    if (error) {
      console.error(`fetchAllRows(${table}) error:`, error);
      return allRows;
    }

    if (!data || data.length === 0) {
      hasMore = false;
    } else {
      allRows.push(...(data as T[]));
      from += PAGE_SIZE;
      if (data.length < PAGE_SIZE) {
        hasMore = false;
      }
    }
  }

  return allRows;
}

/**
 * Hydrate a single word row with its segments, examples, tags, and related words.
 */
async function hydrateWord(row: WordRow): Promise<WordEntry> {
  const [segments, examples, tagJoins, relWords1, relWords2, senses] =
    await Promise.all([
      // Morpheme segments with joined root/affix slugs
      supabase
        .from('morpheme_segments')
        .select('*, roots(slug, meaning), affixes(slug, meaning)')
        .eq('word_id', row.id)
        .order('sort_order')
        .then((r) => (r.data ?? []) as MorphemeSegmentRow[]),

      // Examples
      supabase
        .from('word_examples')
        .select('*')
        .eq('word_id', row.id)
        .order('sort_order')
        .then((r) => (r.data ?? []) as WordExampleRow[]),

      // Tags (via word_tags join)
      supabase
        .from('word_tags')
        .select('tags!inner(slug)')
        .eq('word_id', row.id)
        .then((r) =>
          (r.data ?? []).map(
            (wt) => (wt.tags as unknown as { slug: string }).slug,
          ),
        ),

      // Related words (bidirectional word_relations)
      supabase
        .from('word_relations')
        .select('w2:words!word_relations_word_id_2_fkey(slug)')
        .eq('word_id_1', row.id)
        .then((r) =>
          (r.data ?? [])
            .map((wr) => (wr.w2 as unknown as { slug: string } | null)?.slug)
            .filter((s): s is string => !!s),
        ),

      supabase
        .from('word_relations')
        .select('w1:words!word_relations_word_id_1_fkey(slug)')
        .eq('word_id_2', row.id)
        .then((r) =>
          (r.data ?? [])
            .map((wr) => (wr.w1 as unknown as { slug: string } | null)?.slug)
            .filter((s): s is string => !!s),
        ),

      // Word senses (per-POS definitions)
      supabase
        .from('word_senses')
        .select('*')
        .eq('word_id', row.id)
        .order('sort_order')
        .then((r) => (r.data ?? []) as WordSenseRow[]),
    ]);

  const relatedWordSlugs = [...relWords1, ...relWords2];

  return mapWord(row, segments, examples, tagJoins, relatedWordSlugs, senses);
}

/**
 * Hydrate multiple word rows in parallel (batched).
 */
async function hydrateWords(rows: WordRow[]): Promise<WordEntry[]> {
  return Promise.all(rows.map(hydrateWord));
}

// ---------------------------------------------------------------------------
// getWordBySlug — Full word with segments, examples, tags, related words
// ---------------------------------------------------------------------------

export async function getWordBySlug(
  slug: string,
): Promise<WordEntry | null> {
  const { data: row, error } = await supabase
    .from('words')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !row) return null;

  return hydrateWord(row as WordRow);
}

// ---------------------------------------------------------------------------
// getWordsByRootSlug — All words for a root (via root_words join)
// ---------------------------------------------------------------------------

export async function getWordsByRootSlug(
  rootSlug: string,
): Promise<WordEntry[]> {
  // First get the root id
  const { data: root, error: rootErr } = await supabase
    .from('roots')
    .select('id')
    .eq('slug', rootSlug)
    .single();

  if (rootErr || !root) return [];

  // Get word ids from root_words
  const { data: joins } = await supabase
    .from('root_words')
    .select('word_id')
    .eq('root_id', root.id);

  if (!joins || joins.length === 0) return [];

  const wordIds = joins.map((j) => j.word_id as number);

  // Fetch word rows
  const { data: wordRows } = await supabase
    .from('words')
    .select('*')
    .in('id', wordIds)
    .order('slug');

  if (!wordRows || wordRows.length === 0) return [];

  return hydrateWords(wordRows as WordRow[]);
}

// ---------------------------------------------------------------------------
// getWordSlugs — For generateStaticParams (paginated)
// ---------------------------------------------------------------------------

export async function getWordSlugs(): Promise<string[]> {
  const rows = await fetchAllRows<{ slug: string }>('words', 'slug', 'slug');
  return rows.map((r) => r.slug);
}

// ---------------------------------------------------------------------------
// getFeaturedWords — Curated words for the homepage
// ---------------------------------------------------------------------------

const FEATURED_SLUGS = [
  'construct',     // con + struct
  'biology',       // bio + logy
  'transport',     // trans + port
  'incredible',    // in + cred + ible
  'microscope',    // micro + scope
  'international', // inter + nation + al
];

export async function getFeaturedWords(
  limit: number = 6,
): Promise<WordEntry[]> {
  const slugs = FEATURED_SLUGS.slice(0, limit);
  const { data: wordRows } = await supabase
    .from('words')
    .select('*')
    .in('slug', slugs);

  if (!wordRows || wordRows.length === 0) return [];

  // Preserve curated order
  const bySlug = new Map(wordRows.map((r) => [(r as WordRow).slug, r as WordRow]));
  const ordered = slugs.map((s) => bySlug.get(s)).filter(Boolean) as WordRow[];
  return hydrateWords(ordered);
}

// ---------------------------------------------------------------------------
// getWordCount
// ---------------------------------------------------------------------------

export async function getWordCount(): Promise<number> {
  const { count, error } = await supabase
    .from('words')
    .select('*', { count: 'exact', head: true });

  if (error || count === null) {
    console.error('getWordCount error:', error);
    return 0;
  }

  return count;
}

// ---------------------------------------------------------------------------
// getWordsByTag — Lightweight bulk query for collection list pages
//
// Unlike hydrateWord() which does 5 queries per word (N+1 problem),
// this fetches word rows + morpheme segments in 2 bulk queries.
// Examples, tags, and related words are omitted — not needed for cards.
// ---------------------------------------------------------------------------

export async function getWordsByTag(
  tagSlug: string,
): Promise<WordEntry[]> {
  // 1. Find tag id
  const { data: tag, error: tagErr } = await supabase
    .from('tags')
    .select('id')
    .eq('slug', tagSlug)
    .single();

  if (tagErr || !tag) return [];

  // 2. Get word ids from word_tags (paginated)
  const wordIds: number[] = [];
  let offset = 0;
  while (true) {
    const { data, error } = await supabase
      .from('word_tags')
      .select('word_id')
      .eq('tag_id', tag.id)
      .range(offset, offset + PAGE_SIZE - 1);
    if (error || !data || data.length === 0) break;
    wordIds.push(...data.map((wt) => wt.word_id as number));
    if (data.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  if (wordIds.length === 0) return [];

  // 3. Fetch word rows in bulk (batched to avoid Supabase IN limit)
  const BATCH = 500;
  const allWordRows: WordRow[] = [];
  for (let i = 0; i < wordIds.length; i += BATCH) {
    const batch = wordIds.slice(i, i + BATCH);
    const { data } = await supabase
      .from('words')
      .select('*')
      .in('id', batch)
      .order('slug');
    if (data) allWordRows.push(...(data as WordRow[]));
  }

  if (allWordRows.length === 0) return [];

  // 4. Fetch morpheme segments + tags in bulk
  // Use smaller batches for sub-queries: each word has multiple segments/tags,
  // so 500 words can produce 1500+ rows, exceeding Supabase's 1000-row limit.
  const SUB_BATCH = 200;
  const allIds = allWordRows.map((w) => w.id);
  const segmentsByWordId = new Map<number, MorphemeSegmentRow[]>();
  const tagsByWordId = new Map<number, string[]>();

  for (let i = 0; i < allIds.length; i += SUB_BATCH) {
    const batch = allIds.slice(i, i + SUB_BATCH);

    const { data: segData } = await supabase
      .from('morpheme_segments')
      .select('*, roots(slug, meaning), affixes(slug, meaning)')
      .in('word_id', batch)
      .order('sort_order');
    if (segData) {
      for (const seg of segData as MorphemeSegmentRow[]) {
        const list = segmentsByWordId.get(seg.word_id) ?? [];
        list.push(seg);
        segmentsByWordId.set(seg.word_id, list);
      }
    }

    const { data: tagData } = await supabase
      .from('word_tags')
      .select('word_id, tags!inner(slug)')
      .in('word_id', batch);
    if (tagData) {
      for (const wt of tagData) {
        const slug = (wt.tags as unknown as { slug: string }).slug;
        const list = tagsByWordId.get(wt.word_id) ?? [];
        list.push(slug);
        tagsByWordId.set(wt.word_id, list);
      }
    }
  }

  // 5. Map to WordEntry (no examples, no related words)
  return allWordRows.map((row) =>
    mapWord(row, segmentsByWordId.get(row.id) ?? [], [], tagsByWordId.get(row.id) ?? [], []),
  );
}

// ---------------------------------------------------------------------------
// getWordCountByTag — Count words for a given tag slug (lightweight)
// ---------------------------------------------------------------------------

export async function getWordCountByTag(
  tagSlug: string,
): Promise<number> {
  const { data: tag, error: tagErr } = await supabase
    .from('tags')
    .select('id')
    .eq('slug', tagSlug)
    .single();

  if (tagErr || !tag) return 0;

  const { count, error } = await supabase
    .from('word_tags')
    .select('*', { count: 'exact', head: true })
    .eq('tag_id', tag.id);

  if (error || count === null) return 0;
  return count;
}

// ---------------------------------------------------------------------------
// getWordsBySlugs — Bulk fetch words by slugs (lightweight, no examples)
// ---------------------------------------------------------------------------

export async function getWordsBySlugs(slugs: string[]): Promise<WordEntry[]> {
  if (slugs.length === 0) return [];

  const BATCH = 500;
  const allWordRows: WordRow[] = [];
  for (let i = 0; i < slugs.length; i += BATCH) {
    const batch = slugs.slice(i, i + BATCH);
    const { data } = await supabase
      .from('words')
      .select('*')
      .in('slug', batch)
      .order('slug');
    if (data) allWordRows.push(...(data as WordRow[]));
  }

  if (allWordRows.length === 0) return [];

  const SUB_BATCH = 200;
  const allIds = allWordRows.map((w) => w.id);
  const segmentsByWordId = new Map<number, MorphemeSegmentRow[]>();
  const tagsByWordId = new Map<number, string[]>();

  for (let i = 0; i < allIds.length; i += SUB_BATCH) {
    const batch = allIds.slice(i, i + SUB_BATCH);

    // Fetch morpheme segments
    const { data: segData } = await supabase
      .from('morpheme_segments')
      .select('*, roots(slug, meaning), affixes(slug, meaning)')
      .in('word_id', batch)
      .order('sort_order');
    if (segData) {
      for (const seg of segData as MorphemeSegmentRow[]) {
        const list = segmentsByWordId.get(seg.word_id) ?? [];
        list.push(seg);
        segmentsByWordId.set(seg.word_id, list);
      }
    }

    // Fetch tags
    const { data: tagData } = await supabase
      .from('word_tags')
      .select('word_id, tags!inner(slug)')
      .in('word_id', batch);
    if (tagData) {
      for (const wt of tagData) {
        const slug = (wt.tags as unknown as { slug: string }).slug;
        const list = tagsByWordId.get(wt.word_id) ?? [];
        list.push(slug);
        tagsByWordId.set(wt.word_id, list);
      }
    }
  }

  return allWordRows.map((row) =>
    mapWord(row, segmentsByWordId.get(row.id) ?? [], [], tagsByWordId.get(row.id) ?? [], []),
  );
}

// ---------------------------------------------------------------------------
// getBestBreakdownWord — A word with prefix + root + suffix in segments
// ---------------------------------------------------------------------------

export async function getBestBreakdownWord(): Promise<WordEntry | null> {
  // Strategy: find words that have at least one segment of each type
  // (prefix, root, suffix). We use an RPC-like approach with multiple
  // subqueries. Since Supabase doesn't support HAVING with array_agg
  // easily, we use a pragmatic approach: fetch words that have >= 3
  // segments, then filter in code.

  // Get word_ids that have >= 3 segments
  const { data: candidates } = await supabase
    .from('morpheme_segments')
    .select('word_id, type')
    .in('type', ['prefix', 'root', 'stem', 'suffix']);

  if (!candidates || candidates.length === 0) return null;

  // Group by word_id and find one with all three types
  const typesByWordId = new Map<number, Set<string>>();
  for (const seg of candidates) {
    const wordId = seg.word_id as number;
    const types = typesByWordId.get(wordId) ?? new Set();
    types.add(seg.type as string);
    typesByWordId.set(wordId, types);
  }

  let bestWordId: number | null = null;
  for (const [wordId, types] of typesByWordId) {
    if (types.has('prefix') && (types.has('root') || types.has('stem')) && types.has('suffix')) {
      bestWordId = wordId;
      break;
    }
  }

  // Fallback: word with most segment types
  if (bestWordId === null) {
    let maxTypes = 0;
    for (const [wordId, types] of typesByWordId) {
      if (types.size > maxTypes) {
        maxTypes = types.size;
        bestWordId = wordId;
      }
    }
  }

  if (bestWordId === null) return null;

  const { data: row } = await supabase
    .from('words')
    .select('*')
    .eq('id', bestWordId)
    .single();

  if (!row) return null;

  return hydrateWord(row as WordRow);
}

// ---------------------------------------------------------------------------
// getExampleCount — Total number of bilingual examples
// ---------------------------------------------------------------------------

export async function getExampleCount(): Promise<number> {
  const { count, error } = await supabase
    .from('word_examples')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('getExampleCount error:', error);
    return 0;
  }
  return count ?? 0;
}

// ---------------------------------------------------------------------------
// getTagCount — Number of distinct exam/category tags
// ---------------------------------------------------------------------------

export async function getTagCount(): Promise<number> {
  const { count, error } = await supabase
    .from('tags')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('getTagCount error:', error);
    return 0;
  }
  return count ?? 0;
}
