'use client';

import Link from 'next/link';
import { RiVolumeUpLine } from '@remixicon/react';
import { motion } from 'motion/react';
import { useLanguage } from '@/components/language-provider';
import { Breadcrumb } from '@/components/breadcrumb';
import { cn } from '@/lib/utils';
import { MasteryButtons } from '@/components/mastery-buttons';
import { useSpeech } from '@/hooks/use-speech';
import { getDetailTags } from '@/lib/tag-utils';
import type { WordEntry, MorphemeSegment, RootEntry } from '@/types/content';

interface WordDetailProps {
  word: WordEntry;
  parentRoot?: RootEntry;
}

const morphemeClass: Record<MorphemeSegment['type'], string> = {
  root: 'morpheme-root',
  stem: 'morpheme-root',
  prefix: 'morpheme-prefix',
  suffix: 'morpheme-suffix',
  connector: 'morpheme-connector',
  other: 'morpheme-connector',
};

const morphemeContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const morphemeItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

const badgeColor = 'bg-primary text-primary-foreground';

// ---------------------------------------------------------------------------
// Enrichment UI helpers
// ---------------------------------------------------------------------------

function getEtymologyTypeColor(): string {
  return 'bg-muted text-muted-foreground';
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const WordDetail = ({ word, parentRoot }: WordDetailProps) => {
  const { dictionary, locale } = useLanguage();
  const localizedDefinition = word.definition[locale] ?? word.definition.en;
  const localizedMorphology = word.morphologyNote[locale] ?? word.morphologyNote.en;

  const parentRootSegment = word.rootBreakdown.find((s) => s.type === 'root' && s.rootSlug);

  const { supported: speechSupported, speakWord, speakSentence } = useSpeech();

  return (
    <article className="space-y-10">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: dictionary.home, href: '/' },
          ...(parentRoot
            ? [{ label: parentRoot.variants[0] ?? parentRoot.slug, href: `/root/${parentRoot.slug}` }]
            : []),
          { label: word.lemma },
        ]}
      />

      {/* Header: lemma + mastery */}
      <header className="space-y-3">
        <h1 className="font-heading text-foreground text-4xl">{word.lemma}</h1>
        <MasteryButtons type="word" slug={word.slug} showLabels />
      </header>

      {/* Pronunciation pills */}
      <div className="flex flex-wrap gap-3">
        <span className="bg-muted inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
          <span>🇬🇧 UK</span>
          <span className="text-foreground font-mono">{word.pronunciation.uk.ipa}</span>
          {speechSupported && (
            <button
              type="button"
              onClick={() => speakWord(word.lemma, 'en-GB')}
              className="text-muted-foreground hover:text-primary cursor-pointer transition-colors"
              aria-label="Listen UK pronunciation"
            >
              <RiVolumeUpLine className="h-4 w-4" />
            </button>
          )}
        </span>
        <span className="bg-muted inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
          <span>🇺🇸 US</span>
          <span className="text-foreground font-mono">{word.pronunciation.us.ipa}</span>
          {speechSupported && (
            <button
              type="button"
              onClick={() => speakWord(word.lemma, 'en-US')}
              className="text-muted-foreground hover:text-primary cursor-pointer transition-colors"
              aria-label="Listen US pronunciation"
            >
              <RiVolumeUpLine className="h-4 w-4" />
            </button>
          )}
        </span>
      </div>

      {/* Tags */}
      {word.tags && word.tags.length > 0 && (() => {
        const tags = getDetailTags(word.tags, locale);
        if (tags.length === 0) return null;
        return (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag.slug} className={`rounded-full px-2.5 py-1 text-xs font-bold ${tag.color}`}>
                {tag.label}
              </span>
            ))}
          </div>
        );
      })()}

      {/* Definition */}
      <section className="space-y-4">
        <h2 className="font-heading text-foreground text-lg font-semibold">{word.senses && word.senses.length > 0
            ? dictionary.definitions
            : dictionary.wordOverview}</h2>

        {word.senses && word.senses.length > 0 ? (
          <div className="space-y-3">
            {word.senses.map((sense) => (
              <div key={sense.pos} className="flex gap-3">
                <span className="text-muted-foreground w-8 shrink-0 text-right font-mono text-sm">{sense.pos}</span>
                <div>
                  <p className="text-foreground text-base">
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
          <p className="text-foreground text-base">{localizedDefinition}</p>
        )}
      </section>

      {/* Root Breakdown */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-foreground text-lg font-semibold">
            🧩 {dictionary.wordBreakdown}
          </h2>
          {/* B3: Etymology Type Badge */}
          {word.etymologyType && word.etymologyType !== 'unknown' && (
            <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', getEtymologyTypeColor())}>
              {getEtymologyTypeLabel(word.etymologyType, locale)}
            </span>
          )}
        </div>

        <motion.div
          className="flex flex-wrap items-center gap-3"
          variants={morphemeContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {word.rootBreakdown.map((segment, idx) => {
            const block = (
              <div
                className={`${morphemeClass[segment.type]} flex flex-col items-center rounded-2xl px-6 py-4`}
              >
                <span className="text-lg font-bold">{segment.surface}</span>
                <span className="mt-1 text-xs opacity-80">{segment.meaning?.[locale] ?? segment.meaning?.en ?? segment.type}</span>
              </div>
            );

            const content = segment.rootSlug ? (
              <Link href={`/root/${segment.rootSlug}`}>
                {block}
              </Link>
            ) : (
              block
            );

            return (
              <motion.div key={`wrap-${idx}`} className="flex items-center gap-3" variants={morphemeItemVariants}>
                {idx > 0 && <span className="text-muted-foreground text-xl font-bold">+</span>}
                {content}
              </motion.div>
            );
          })}

          <motion.div className="flex items-center gap-3" variants={morphemeItemVariants}>
            <span className="text-muted-foreground text-xl font-bold">=</span>
            <span className="text-primary text-2xl font-bold">
              {word.lemma}
            </span>
          </motion.div>
        </motion.div>

        {/* Morphology note */}
        <p className="text-muted-foreground">{localizedMorphology}</p>
      </section>

      {/* Collocations */}
      {word.collocations && word.collocations.en?.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-heading text-foreground text-lg font-semibold">{dictionary.collocations}</h2>
          <ul className="space-y-2">
            {word.collocations.en.map((collocation, idx) => {
              const chineseTranslation = word.collocations?.zh?.[idx] ?? '';
              return (
                <li key={collocation} className="flex items-center gap-3">
                  <span className="text-muted-foreground w-6 shrink-0 text-right font-mono text-sm font-normal">
                    {idx + 1}.
                  </span>
                  <span
                    className="text-foreground cursor-pointer text-base"
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
                      <RiVolumeUpLine className="h-4 w-4" />
                    </button>
                  )}
                  {chineseTranslation && (
                    <span className="text-muted-foreground shrink-0 text-sm">{chineseTranslation}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Examples */}
      <section className="space-y-4">
        <h2 className="font-heading text-foreground text-lg font-semibold">{dictionary.examples}</h2>

        <ul className="space-y-4">
          {word.examples.map((example, idx) => {
            const englishSentences = example.en ?? [];
            const localizedSentences = example[locale] ?? [];
            const englishText = englishSentences.join(' ');
            const localizedText = localizedSentences.join(' ');
            const showTranslation = locale !== 'en' && localizedText.length > 0;

            return (
              <li key={`${englishText}-${idx}`} className="flex items-start gap-4">
                <span className="text-muted-foreground mt-0.5 w-6 shrink-0 text-right font-mono text-sm font-normal">
                  {idx + 1}.
                </span>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start gap-2">
                    <p className="text-foreground flex-1 text-lg">{englishText}</p>
                    {speechSupported && (
                      <button
                        type="button"
                        onClick={() => speakSentence(englishText)}
                        className="text-muted-foreground hover:text-primary mt-1 shrink-0 cursor-pointer transition-colors"
                        aria-label="Play example sentence"
                      >
                        <RiVolumeUpLine className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {showTranslation && (
                    <p className="text-muted-foreground text-sm">{localizedText}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Related Words */}
      {word.relatedWords.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-heading text-foreground text-lg font-semibold">{dictionary.relatedWords}</h2>
          <div className="flex flex-wrap gap-2">
            {word.relatedWords.map((related) => (
              <Link
                key={related}
                href={`/word/${related}`}
                className="border-border hover:border-primary hover:text-primary rounded-full border px-4 py-2 text-sm transition-colors"
              >
                {related}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bottom back link */}
      <Link
        href={parentRoot ? `/root/${parentRoot.slug}` : '/root'}
        className="border-border text-foreground hover:text-primary hover:bg-muted inline-flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
      >
        ← {parentRoot
          ? `${locale === 'zh' ? '返回词根' : 'Back to'} ${parentRoot.variants[0] ?? parentRoot.slug}`
          : dictionary.backToRoots}
      </Link>
    </article>
  );
};
