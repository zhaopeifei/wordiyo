/**
 * Supabase data access layer — barrel re-export.
 *
 * Import from `@/lib/db` to access all DB query functions.
 */

export {
  getRoots,
  getRootBySlug,
  getRootSlugs,
  getRootsBySlugs,
  getRootCount,
  getRootsByOrigin,
  getRootCountByOrigin,
} from './roots';

export {
  getWordBySlug,
  getWordsByRootSlug,
  getWordsBySlugs,
  getWordSlugs,
  getFeaturedWords,
  getWordCount,
  getBestBreakdownWord,
  getWordsByTag,
  getWordCountByTag,
  getExampleCount,
  getTagCount,
} from './words';

export {
  getAffixes,
  getAffixBySlug,
  getAffixCount,
} from './affixes';
