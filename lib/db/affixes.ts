/**
 * Affix queries — fetches affix data from Supabase and maps to AffixEntry.
 */

import type { AffixEntry } from '@/types/content';
import { supabase } from '@/lib/supabase';
import { mapAffix, type AffixRow } from './mappers';

// ---------------------------------------------------------------------------
// getAffixes — All affixes
// ---------------------------------------------------------------------------

export async function getAffixes(): Promise<AffixEntry[]> {
  const { data, error } = await supabase
    .from('affixes')
    .select('*')
    .order('type')
    .order('slug');

  if (error || !data) {
    console.error('getAffixes error:', error);
    return [];
  }

  return (data as AffixRow[]).map(mapAffix);
}

// ---------------------------------------------------------------------------
// getAffixBySlug — Single affix
// ---------------------------------------------------------------------------

export async function getAffixBySlug(
  slug: string,
): Promise<AffixEntry | null> {
  const { data: row, error } = await supabase
    .from('affixes')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !row) return null;

  return mapAffix(row as AffixRow);
}

// ---------------------------------------------------------------------------
// getAffixCount
// ---------------------------------------------------------------------------

export async function getAffixCount(): Promise<number> {
  const { count, error } = await supabase
    .from('affixes')
    .select('*', { count: 'exact', head: true });

  if (error || count === null) {
    console.error('getAffixCount error:', error);
    return 0;
  }

  return count;
}
