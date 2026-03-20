'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/components/language-provider';
import { ScrollFadeIn } from './scroll-fade-in';
import type { WordEntry, MorphemeSegment } from '@/types/content';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface BreakdownSectionProps {
  words: WordEntry[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function morphemeClass(type: MorphemeSegment['type']): string {
  switch (type) {
    case 'prefix':
      return 'morpheme-prefix';
    case 'root':
    case 'stem':
      return 'morpheme-root';
    case 'suffix':
      return 'morpheme-suffix';
    case 'connector':
      return 'morpheme-connector';
    default:
      return 'morpheme-connector';
  }
}

/** Color-coded label badge styles to match morpheme pill styles */
function typeLabelClass(type: MorphemeSegment['type']): string {
  switch (type) {
    case 'root':
    case 'stem':
      return 'bg-primary/15 text-primary border border-primary/25';
    case 'prefix':
      return 'bg-muted text-muted-foreground border border-border';
    case 'suffix':
      return 'bg-muted text-muted-foreground border border-border';
    default:
      return 'bg-muted text-muted-foreground border border-border';
  }
}

const typeLabels: Record<string, Record<string, string>> = {
  prefix: { en: 'prefix', zh: '前缀' },
  root: { en: 'root', zh: '词根' },
  stem: { en: 'stem', zh: '词干' },
  suffix: { en: 'suffix', zh: '后缀' },
  connector: { en: 'link', zh: '连接' },
  other: { en: 'other', zh: '其他' },
};

/* ------------------------------------------------------------------ */
/*  Bilingual copy                                                     */
/* ------------------------------------------------------------------ */

const copy = {
  en: {
    label: 'Core Feature',
    title: 'See how words are built',
    description:
      'Every word is decomposed into its Latin or Greek building blocks, color-coded by type.',
    result: 'Result',
    cta: 'See full entry',
  },
  zh: {
    label: '核心功能',
    title: '看看单词是怎么组装的',
    description: '每个单词都被拆解为拉丁或希腊语构件，按类型着色标注。',
    result: '结果',
    cta: '查看完整词条',
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const AUTO_CYCLE_MS = 5000;

export function BreakdownSection({ words }: BreakdownSectionProps) {
  const { locale } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % words.length);
  }, [words.length]);

  useEffect(() => {
    if (paused || words.length <= 1) return;
    const id = setInterval(next, AUTO_CYCLE_MS);
    return () => clearInterval(id);
  }, [paused, next, words.length]);

  if (words.length === 0) return null;

  const t = copy[locale] ?? copy.en;
  const selectedWord = words[selectedIndex];

  return (
    <ScrollFadeIn>
      <section>
        <div className="mx-auto max-w-2xl space-y-8 text-center">
          {/* ---- header ---- */}
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm font-semibold uppercase tracking-widest">
              {t.label}
            </p>
            <h2 className="font-heading text-foreground text-3xl font-bold">
              {t.title}
            </h2>
            <p className="text-muted-foreground text-base">
              {t.description}
            </p>
          </div>

          {/* ---- word selector (text + underline style) ---- */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {words.map((word, i) => (
              <button
                key={word.slug}
                onClick={() => {
                  setSelectedIndex(i);
                  setPaused(true);
                }}
                className="relative px-1 py-1 text-sm font-semibold transition-colors duration-200"
              >
                <span
                  className={
                    i === selectedIndex
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }
                >
                  {word.lemma}
                </span>
                {i === selectedIndex && (
                  <motion.div
                    layoutId="breakdown-tab"
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* ---- morpheme display ---- */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {selectedWord.rootBreakdown.map((seg, i) => (
                <motion.div
                  key={`${seg.surface}-${i}`}
                  className="flex items-center gap-3 sm:gap-4"
                  variants={itemVariants}
                >
                  {i > 0 && (
                    <span className="text-muted-foreground/30 text-xl font-light select-none">
                      +
                    </span>
                  )}
                  <div className="flex flex-col items-center gap-2">
                    <motion.span
                      className={`${morphemeClass(seg.type)} inline-flex rounded-xl px-6 py-3 text-xl font-bold`}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {seg.surface}
                    </motion.span>
                    <span className={`${typeLabelClass(seg.type)} rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider`}>
                      {typeLabels[seg.type]?.[locale] ?? typeLabels[seg.type]?.en ?? seg.type}
                    </span>
                    {seg.meaning && (
                      <span className="text-muted-foreground text-xs">
                        {seg.meaning[locale] ?? seg.meaning.en}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* ---- result ---- */}
          <motion.div
            key={`result-${selectedIndex}`}
            className="space-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: 'easeOut',
              delay: 0.1 + selectedWord.rootBreakdown.length * 0.12,
            }}
          >
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest">
              {t.result}
            </p>
            <p className="font-heading text-3xl font-bold text-primary">
              {selectedWord.lemma}
            </p>
            <p className="text-muted-foreground text-sm">
              {selectedWord.definition[locale] ?? selectedWord.definition.en}
            </p>
          </motion.div>

          {/* ---- CTA (outline style to differ from morpheme root) ---- */}
          <Link
            href={`/word/${selectedWord.slug}`}
            className="border-border text-foreground hover:border-primary/40 hover:text-primary inline-flex items-center gap-1 rounded-full border px-5 py-2 text-sm font-semibold transition"
          >
            {t.cta}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>
    </ScrollFadeIn>
  );
}
