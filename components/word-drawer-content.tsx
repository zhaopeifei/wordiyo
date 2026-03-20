'use client';

import Link from 'next/link';
import { RiVolumeUpLine } from '@remixicon/react';
import { useLanguage } from '@/components/language-provider';
import { MasteryButtons } from '@/components/mastery-buttons';
import { useSpeech } from '@/hooks/use-speech';
import { cn } from '@/lib/utils';
import { morphemeClass } from '@/lib/morpheme-utils';
import { getDetailTags } from '@/lib/tag-utils';
import type { WordEntry } from '@/types/content';

function getEtymologyTypeColor(type: string): string {
  const colors: Record<string, string> = {
    'root-derived': 'bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    'native': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
    'loanword': 'bg-amber-50 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    'blend': 'bg-violet-50 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
    'onomatopoeia': 'bg-pink-50 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
    'eponym': 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
  };
  return colors[type] ?? 'bg-muted text-muted-foreground';
}

function getEtymologyTypeLabel(type: string, locale: string): string {
  const labels: Record<string, Record<string, string>> = {
    'root-derived': { en: 'Root-derived', zh: '词根派生' },
    'native': { en: 'Native English', zh: '原生英语' },
    'loanword': { en: 'Loanword', zh: '外来词' },
    'blend': { en: 'Blend', zh: '混合词' },
    'onomatopoeia': { en: 'Onomatopoeia', zh: '拟声词' },
    'eponym': { en: 'Eponym', zh: '人名词' },
  };
  return labels[type]?.[locale] ?? type;
}

const badgeColor = 'bg-primary text-primary-foreground';

interface WordDrawerContentProps {
  word: WordEntry;
}

export function WordDrawerContent({ word }: WordDrawerContentProps) {
  const { dictionary, locale } = useLanguage();
  const localizedDefinition = word.definition[locale] ?? word.definition.en;
  const localizedMorphology = word.morphologyNote[locale] ?? word.morphologyNote.en;

  const { supported: speechSupported, speakWord, speakSentence } = useSpeech();

  return (
    <div className="space-y-6">
      {/* Lemma + mastery */}
      <div className="space-y-2">
        <h2 className="font-heading text-foreground text-3xl font-bold">{word.lemma}</h2>
        <MasteryButtons type="word" slug={word.slug} showLabels />
      </div>

      {/* Pronunciation */}
      <div className="flex flex-wrap gap-2">
        <span className="bg-muted inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm">
          <span>🇬🇧</span>
          <span className="text-foreground font-mono text-xs">{word.pronunciation.uk.ipa}</span>
          {speechSupported && (
            <button
              type="button"
              onClick={() => speakWord(word.lemma, 'en-GB')}
              className="text-muted-foreground hover:text-primary cursor-pointer transition-colors"
              aria-label="Listen UK pronunciation"
            >
              <RiVolumeUpLine className="h-3.5 w-3.5" />
            </button>
          )}
        </span>
        <span className="bg-muted inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm">
          <span>🇺🇸</span>
          <span className="text-foreground font-mono text-xs">{word.pronunciation.us.ipa}</span>
          {speechSupported && (
            <button
              type="button"
              onClick={() => speakWord(word.lemma, 'en-US')}
              className="text-muted-foreground hover:text-primary cursor-pointer transition-colors"
              aria-label="Listen US pronunciation"
            >
              <RiVolumeUpLine className="h-3.5 w-3.5" />
            </button>
          )}
        </span>
      </div>

      {/* Tags */}
      {word.tags && word.tags.length > 0 && (() => {
        const tags = getDetailTags(word.tags, locale);
        if (tags.length === 0) return null;
        return (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag.slug} className={`rounded-full px-2 py-0.5 text-xs font-bold ${tag.color}`}>
                {tag.label}
              </span>
            ))}
          </div>
        );
      })()}

      {/* Definition */}
      <section className="space-y-3">
        <h3 className="font-heading text-foreground text-lg font-semibold">
          {word.senses && word.senses.length > 0
            ? dictionary.definitions
            : dictionary.wordOverview}
        </h3>

        {word.senses && word.senses.length > 0 ? (
          <div className="space-y-2">
            {word.senses.map((sense) => (
              <div key={sense.pos} className="flex gap-2">
                <span className="text-muted-foreground w-8 shrink-0 text-right font-mono text-sm">{sense.pos}</span>
                <div>
                  <p className="text-foreground">
                    {sense.definition.en.charAt(0).toUpperCase() + sense.definition.en.slice(1)}
                  </p>
                  {sense.definition.zh && (
                    <p className="text-muted-foreground mt-0.5 text-sm">
                      {sense.definition.zh}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-foreground text-sm">{localizedDefinition}</p>
        )}
      </section>

      {/* Root breakdown (compact, no animation) */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="font-heading text-foreground text-lg font-semibold">
            🧩 {dictionary.wordBreakdown}
          </h3>
          {word.etymologyType && word.etymologyType !== 'unknown' && (
            <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', getEtymologyTypeColor(word.etymologyType))}>
              {getEtymologyTypeLabel(word.etymologyType, locale)}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {word.rootBreakdown.map((segment, idx) => {
            const block = (
              <div
                className={`${morphemeClass[segment.type]} flex flex-col items-center rounded-xl px-4 py-2.5`}
              >
                <span className="text-base font-bold">{segment.surface}</span>
                <span className="mt-0.5 text-[10px] opacity-80">{segment.meaning?.[locale] ?? segment.meaning?.en ?? segment.type}</span>
              </div>
            );

            const content = segment.rootSlug ? (
              <Link href={`/root/${segment.rootSlug}`}>{block}</Link>
            ) : (
              block
            );

            return (
              <div key={`seg-${idx}`} className="flex items-center gap-2">
                {idx > 0 && <span className="text-muted-foreground font-bold">+</span>}
                {content}
              </div>
            );
          })}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-bold">=</span>
            <span className="from-primary to-accent bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent">
              {word.lemma}
            </span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">{localizedMorphology}</p>
      </section>

      {/* Collocations */}
      {word.collocations && word.collocations.en?.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-heading text-foreground text-lg font-semibold">
            {dictionary.collocations}
          </h3>
          <ul className="space-y-2">
            {word.collocations.en.map((collocation, idx) => {
              const chineseTranslation = word.collocations?.zh?.[idx] ?? '';
              return (
                <li key={collocation} className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground w-5 shrink-0 text-right font-mono font-normal">
                    {idx + 1}.
                  </span>
                  <span
                    className="text-foreground cursor-pointer"
                    onClick={() => speechSupported && speakSentence(collocation)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        speechSupported && speakSentence(collocation);
                      }
                    }}
                  >
                    {collocation}
                  </span>
                  {speechSupported && (
                    <button
                      type="button"
                      onClick={() => speakSentence(collocation)}
                      className="text-muted-foreground hover:text-primary shrink-0 cursor-pointer transition-colors"
                      aria-label={`Play pronunciation of ${collocation}`}
                    >
                      <RiVolumeUpLine className="h-3 w-3" />
                    </button>
                  )}
                  {chineseTranslation && (
                    <span className="text-muted-foreground shrink-0 text-xs">{chineseTranslation}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Examples */}
      {word.examples.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-heading text-foreground text-lg font-semibold">
            {dictionary.examples}
          </h3>
          <ul className="space-y-2">
            {word.examples.map((example, idx) => {
              const englishText = (example.en ?? []).join(' ');
              const localizedText = (example[locale] ?? []).join(' ');
              const showTranslation = locale !== 'en' && localizedText.length > 0;

              return (
                <li key={`ex-${idx}`} className="flex items-start gap-2 text-sm">
                  <span className="text-muted-foreground w-5 shrink-0 text-right font-mono font-normal">
                    {idx + 1}.
                  </span>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-start gap-1.5">
                      <p className="text-foreground">{englishText}</p>
                      {speechSupported && (
                        <button
                          type="button"
                          onClick={() => speakSentence(englishText)}
                          className="text-muted-foreground hover:text-primary shrink-0 cursor-pointer transition-colors"
                          aria-label="Play example sentence"
                        >
                          <RiVolumeUpLine className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    {showTranslation && (
                      <p className="text-muted-foreground text-xs">{localizedText}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Related words */}
      {word.relatedWords.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-heading text-foreground text-lg font-semibold">
            {dictionary.relatedWords}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {word.relatedWords.map((related) => (
              <Link
                key={related}
                href={`/word/${related}`}
                className="border-border hover:border-primary hover:text-primary rounded-full border px-3 py-1.5 text-sm transition-colors"
              >
                {related}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
