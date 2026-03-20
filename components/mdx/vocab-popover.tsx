'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/language-provider';
import { morphemeClass } from '@/lib/morpheme-utils';
import type { VocabularyWord } from '@/types/vocabulary-annotation';

interface VocabPopoverContentProps {
  word: VocabularyWord;
}

export function VocabPopoverContent({ word }: VocabPopoverContentProps) {
  const { locale } = useLanguage();

  return (
    <div className="space-y-2.5">
      {/* Lemma + IPA */}
      <div>
        <Link
          href={`/word/${word.slug}`}
          className="font-heading text-foreground text-lg font-bold hover:text-primary transition-colors"
        >
          {word.lemma}
        </Link>
        {word.partOfSpeech.length > 0 && (
          <span className="text-muted-foreground ml-2 text-xs font-mono">
            {word.partOfSpeech.join(', ')}
          </span>
        )}
        <div className="text-muted-foreground mt-0.5 text-xs font-mono">
          {word.pronunciation.uk}
        </div>
      </div>

      {/* Morpheme breakdown pills */}
      {word.rootBreakdown.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          {word.rootBreakdown.map((seg, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-muted-foreground text-xs">+</span>}
              <span
                className={`${morphemeClass[seg.type]} rounded-md px-1.5 py-0.5 text-xs font-medium`}
              >
                {seg.surface}
              </span>
            </span>
          ))}
        </div>
      )}

      {/* Bilingual definition */}
      <div className="text-sm">
        <p className="text-foreground">{word.definition.en}</p>
        {word.definition.zh && locale !== 'en' && (
          <p className="text-muted-foreground mt-0.5">{word.definition.zh}</p>
        )}
      </div>

      {/* Link */}
      <Link
        href={`/word/${word.slug}`}
        className="text-primary hover:underline text-xs font-medium"
      >
        View full word page →
      </Link>
    </div>
  );
}
