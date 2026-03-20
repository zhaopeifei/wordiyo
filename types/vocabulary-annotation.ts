import type { Locale } from '@/content/site';
import type { WordEntry, MorphemeSegment } from '@/types/content';

export interface VocabularyWord {
  slug: string;
  lemma: string;
  pronunciation: { uk: string; us: string };
  definition: Record<Locale, string>;
  rootBreakdown: MorphemeSegment[];
  partOfSpeech: string[];
}

export function toVocabularyWord(entry: WordEntry): VocabularyWord {
  return {
    slug: entry.slug,
    lemma: entry.lemma,
    pronunciation: {
      uk: entry.pronunciation.uk.ipa,
      us: entry.pronunciation.us.ipa,
    },
    definition: entry.definition,
    rootBreakdown: entry.rootBreakdown,
    partOfSpeech: entry.partOfSpeech,
  };
}
