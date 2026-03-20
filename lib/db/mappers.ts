/**
 * Database row types and mapper functions.
 *
 * Maps snake_case Supabase rows to camelCase TypeScript types
 * defined in `types/content.ts`.
 */

import type { Locale } from '@/content/site';
import type {
  AffixEntry,
  EtymologyType,
  LanguageOfOrigin,
  MorphemeSegment,
  RootEntry,
  SemanticDomain,
  WordEntry,
  WordSense,
} from '@/types/content';

// ---------------------------------------------------------------------------
// DB Row interfaces (what Supabase `.select()` returns)
// ---------------------------------------------------------------------------

export interface RootRow {
  id: number;
  slug: string;
  variants: string[];
  meaning: Record<Locale, string>;
  origin_summary: Record<Locale, string>;
  origin_lang: string;
  etymology: string | null;
  pie_root: string | null;
  semantic_domains: string[];
  grimm_law_group: string | null;
}

export interface WordRow {
  id: number;
  slug: string;
  lemma: string;
  ipa_uk: string | null;
  ipa_us: string | null;
  pos: string[];
  definition: Record<Locale, string>;
  morphology_note: Record<Locale, string> | null;
  collocations: Record<Locale, string[]> | null;
  etymology_type: string;
  frequency: string | null;
  frequency_rank: number | null;
}

export interface MorphemeSegmentRow {
  id: number;
  word_id: number;
  surface: string;
  type: string;
  root_id: number | null;
  affix_id: number | null;
  sort_order: number;
  // Joined data (from Supabase nested selects)
  roots?: { slug: string; meaning: Record<Locale, string> } | null;
  affixes?: { slug: string; meaning: Record<Locale, string> } | null;
}

export interface WordExampleRow {
  id: number;
  word_id: number;
  content: Record<Locale, string>;
  sort_order: number;
}

export interface WordSenseRow {
  id: number;
  word_id: number;
  pos: string;
  definition: Record<Locale, string>;
  sort_order: number;
}

export interface AffixRow {
  id: number;
  slug: string;
  form: string;
  type: string;
  meaning: Record<Locale, string>;
  overview: Record<Locale, string> | null;
  origin_lang: string | null;
  variants: string[] | null;
  pos_function: string | null;
  grimm_law_group: string | null;
  base_affix_id: number | null;
  base_affix?: { slug: string } | null;
}

export interface TagRow {
  id: number;
  slug: string;
  name: Record<Locale, string>;
  type: string;
  description: Record<Locale, string> | null;
  sort_order: number;
}

// ---------------------------------------------------------------------------
// Mapper: Root
// ---------------------------------------------------------------------------

const DEFAULT_BILINGUAL: Record<Locale, string> = { en: '', zh: '' };

/**
 * Convert a Supabase root row + associated data into a `RootEntry`.
 *
 * @param row            - The raw root row from Supabase
 * @param wordSlugs      - Slugs of words associated with this root (via root_words)
 * @param relatedSlugs   - Slugs of related roots (via root_relations)
 * @param overview       - Optional explicit overview; falls back to origin_summary
 */
export function mapRoot(
  row: RootRow,
  wordSlugs: string[],
  relatedSlugs: string[],
  overview?: Record<Locale, string>,
): RootEntry {
  return {
    slug: row.slug,
    variants: row.variants,
    meaning: row.meaning,
    languageOfOrigin: row.origin_lang as LanguageOfOrigin,
    etymology: row.etymology ?? undefined,
    // DB roots table does not have a separate `overview` column.
    // Use the provided override, or fall back to origin_summary.
    overview: overview ?? row.origin_summary ?? DEFAULT_BILINGUAL,
    originSummary: row.origin_summary ?? DEFAULT_BILINGUAL,
    semanticDomains: row.semantic_domains as SemanticDomain[],
    relatedRoots: relatedSlugs,
    associatedWords: wordSlugs,
    grimmLawGroup: row.grimm_law_group ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// Mapper: Word
// ---------------------------------------------------------------------------

/**
 * Convert a Supabase word row + associated data into a `WordEntry`.
 */
export function mapWord(
  row: WordRow,
  segments: MorphemeSegmentRow[],
  examples: WordExampleRow[],
  tagSlugs: string[],
  relatedWordSlugs: string[],
  senses?: WordSenseRow[],
): WordEntry {
  return {
    slug: row.slug,
    lemma: row.lemma,
    pronunciation: {
      uk: { ipa: row.ipa_uk ?? '' },
      us: { ipa: row.ipa_us ?? '' },
    },
    partOfSpeech: row.pos,
    definition: row.definition,
    senses: senses && senses.length > 0
      ? senses.sort((a, b) => a.sort_order - b.sort_order).map(mapWordSense)
      : undefined,

    // Each DB example row has `content: {en: "...", zh: "..."}`.
    // The TypeScript type expects `Array<Record<Locale, string[]>>`,
    // so wrap each locale string in an array.
    examples: examples
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((ex) => ({
        en: [ex.content.en ?? ''],
        zh: [ex.content.zh ?? ''],
      })),

    rootBreakdown: segments
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mapSegment),

    morphologyNote: row.morphology_note ?? DEFAULT_BILINGUAL,
    relatedWords: relatedWordSlugs,

    collocations: row.collocations ?? undefined,
    frequency: (row.frequency as WordEntry['frequency']) ?? undefined,
    tags: tagSlugs.length > 0 ? tagSlugs : undefined,

    // Enrichment fields
    frequencyRank: row.frequency_rank ?? undefined,
    etymologyType: (row.etymology_type as EtymologyType) ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// Mapper: WordSense
// ---------------------------------------------------------------------------

function mapWordSense(row: WordSenseRow): WordSense {
  return {
    pos: row.pos,
    definition: row.definition,
    sortOrder: row.sort_order,
  };
}

// ---------------------------------------------------------------------------
// Mapper: MorphemeSegment
// ---------------------------------------------------------------------------

function mapSegment(row: MorphemeSegmentRow): MorphemeSegment {
  const meaning = row.roots?.meaning ?? row.affixes?.meaning ?? undefined;
  return {
    surface: row.surface,
    type: row.type as MorphemeSegment['type'],
    rootSlug: row.roots?.slug ?? undefined,
    affixSlug: row.affixes?.slug ?? undefined,
    meaning: meaning ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// Mapper: Affix
// ---------------------------------------------------------------------------

/**
 * Convert a Supabase affix row into an `AffixEntry`.
 *
 * Note: `AffixEntry.examples` expects `string[]` (word slugs). The DB does
 * not store this directly, so we return an empty array. This can be populated
 * later via a join with `morpheme_segments`.
 */
export function mapAffix(row: AffixRow): AffixEntry {
  return {
    slug: row.slug,
    form: row.form,
    type: row.type as AffixEntry['type'],
    meaning: row.meaning,
    overview: row.overview ?? DEFAULT_BILINGUAL,
    languageOfOrigin: (row.origin_lang as LanguageOfOrigin) ?? 'Other',
    examples: [], // DB gap — populate later from morpheme_segments join
    grimmLawGroup: row.grimm_law_group ?? undefined,
    baseAffixSlug: row.base_affix?.slug ?? undefined,
  };
}
