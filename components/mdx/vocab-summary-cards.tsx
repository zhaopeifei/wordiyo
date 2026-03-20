'use client';

import { useLanguage } from '@/components/language-provider';
import { WordCard } from '@/components/word-card';
import type { WordEntry } from '@/types/content';

interface VocabSummaryCardsProps {
  wordEntries: WordEntry[];
}

export function VocabSummaryCards({ wordEntries }: VocabSummaryCardsProps) {
  const { dictionary } = useLanguage();

  if (wordEntries.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="font-heading text-foreground text-2xl font-bold mb-6">
        {dictionary.vocabularySummary}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wordEntries.map((word, index) => (
          <WordCard key={word.slug} word={word} />
        ))}
      </div>
    </section>
  );
}
