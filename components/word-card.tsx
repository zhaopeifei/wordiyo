'use client';

import Link from 'next/link';
import { useCallback } from 'react';
import { RiVolumeUpLine } from '@remixicon/react';
import { useLanguage } from '@/components/language-provider';
import { MasteryButtons } from '@/components/mastery-buttons';
import { useSpeech } from '@/hooks/use-speech';
import { getCardTags } from '@/lib/tag-utils';
import type { WordEntry } from '@/types/content';

// ---------------------------------------------------------------------------
// Definition text cleanup
// ---------------------------------------------------------------------------

/** Strip field markers like [计] [经] [医] and normalise line breaks */
function cleanDefinition(raw: string): string {
  return raw
    .replace(/\[[\u4e00-\u9fff]{1,4}\]\s*/g, '') // remove [计] [经] etc.
    .replace(/\\r\\n|\\r|\\n/g, '\n') // literal escaped sequences
    .replace(/\r\n|\r/g, '\n') // actual carriage returns
    .replace(/\n{2,}/g, '\n') // collapse multiple newlines
    .trim();
}

// ---------------------------------------------------------------------------
// Tag badges (replaces frequency stars)
// ---------------------------------------------------------------------------

function TagBadges({ tags, locale }: { tags: string[]; locale: string }) {
  const resolved = getCardTags(tags, locale, 3);
  if (resolved.length === 0) return null;
  return (
    <div className="flex items-center gap-1 opacity-60">
      {resolved.map((tag) => (
        <span
          key={tag.slug}
          className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${tag.color}`}
        >
          {tag.label}
        </span>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pronunciation button
// ---------------------------------------------------------------------------

function PronunciationButton({ lemma }: { lemma: string }) {
  const { supported, speakWord } = useSpeech();

  const handleSpeak = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      speakWord(lemma);
    },
    [speakWord, lemma],
  );

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={handleSpeak}
      className="text-muted-foreground hover:text-primary shrink-0 cursor-pointer rounded-full p-2 transition-colors"
      aria-label={`Play pronunciation of ${lemma}`}
    >
      <RiVolumeUpLine className="h-4 w-4" />
    </button>
  );
}

// ---------------------------------------------------------------------------
// WordCard component
// ---------------------------------------------------------------------------

interface WordCardProps {
  word: WordEntry;
}

export function WordCard({ word }: WordCardProps) {
  const { locale } = useLanguage();

  const rawDef = word.definition[locale] ?? word.definition.en ?? '';
  const cleaned = cleanDefinition(rawDef);

  return (
    <Link href={`/word/${word.slug}`} className="group block">
      <article
        className="flex h-[170px] cursor-pointer flex-col rounded-[20px] border border-border p-5 transition-all duration-200 hover:-translate-y-1 hover:bg-muted hover:shadow-md"
      >
        {/* Top row: word + pronunciation */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-heading text-foreground truncate text-xl font-bold">
            {word.lemma}
          </h3>
          <PronunciationButton lemma={word.lemma} />
        </div>

        {/* Definition (cleaned, clamped) */}
        <p className="text-muted-foreground mt-2 line-clamp-2 whitespace-pre-line text-sm leading-relaxed">
          {cleaned}
        </p>

        {/* Bottom row: tags + mastery */}
        <div className="mt-auto flex items-center gap-2 pt-2">
          <div className="min-w-0 flex-1">
            <TagBadges tags={word.tags ?? []} locale={locale} />
          </div>
          <div className="shrink-0">
            <MasteryButtons type="word" slug={word.slug} />
          </div>
        </div>
      </article>
    </Link>
  );
}
