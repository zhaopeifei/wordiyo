'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/language-provider';
import { Breadcrumb } from '@/components/breadcrumb';
import { WordCard } from '@/components/word-card';
import { MasteryButtons } from '@/components/mastery-buttons';
import type { RootEntry, WordEntry } from '@/types/content';

/* ── Component ──────────────────────────────────────────────── */

interface RootDetailProps {
  root: RootEntry;
  associatedWords: WordEntry[];
}

export const RootDetail = ({ root, associatedWords }: RootDetailProps) => {
  const { dictionary, locale } = useLanguage();
  const localizedOrigin = root.originSummary[locale] ?? root.originSummary.en;
  const associatedWordEntries = associatedWords;

  return (
    <article className="space-y-10">
      {/* ── Breadcrumb ────────────────────────────────────── */}
      <Breadcrumb
        items={[
          { label: dictionary.home, href: '/' },
          { label: dictionary.roots, href: '/root' },
          { label: root.variants[0] ?? root.slug },
        ]}
      />

      {/* ── Header ──────────────────────────────────────── */}
      <header className="space-y-3">
        <div className="flex items-end gap-3">
          <h1 className="font-heading text-foreground text-4xl font-bold sm:text-5xl">
            {root.slug}
          </h1>
          <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-bold">
            {root.languageOfOrigin}
          </span>
        </div>
        <MasteryButtons type="root" slug={root.slug} showLabels />
      </header>

      {/* ── Info card ───────────────────────────────────── */}
      <section className="border-border bg-card rounded-[20px] border p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Variants */}
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
              {dictionary.variants}
            </p>
            <div className="flex flex-wrap gap-2">
              {root.variants.map((v) => (
                <span
                  key={v}
                  className="border-border bg-background text-foreground rounded-full border px-3 py-1 text-sm font-semibold"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>

          {/* Related Roots */}
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
              {dictionary.relatedRoots}
            </p>
            <div className="flex flex-wrap gap-2">
              {root.relatedRoots.length > 0 ? (
                root.relatedRoots.map((slug) => (
                  <Link
                    key={slug}
                    href={`/root/${slug}`}
                    className="border-border bg-background text-foreground hover:border-primary hover:text-primary rounded-full border px-3 py-1 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {slug}
                  </Link>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">--</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── About This Root ──────────────────────────────── */}
      <section className="space-y-2">
        <h2 className="font-heading text-foreground text-xl font-bold">{dictionary.aboutThisRoot}</h2>
        <p className="text-foreground/90 text-lg leading-relaxed">{localizedOrigin}</p>
      </section>

      {/* ── Associated Words ────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="font-heading text-foreground text-xl font-bold">
          {dictionary.associatedWords}
        </h2>
        {associatedWordEntries.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {associatedWordEntries.map((word, idx) => (
              <WordCard key={word.slug} word={word} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            {locale === 'zh' ? '暂无关联词汇。' : 'No associated words recorded yet.'}
          </p>
        )}
      </section>
    </article>
  );
};
