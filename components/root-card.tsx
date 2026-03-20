'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/language-provider';
import { MasteryButtons } from '@/components/mastery-buttons';
import type { RootEntry } from '@/types/content';

interface RootCardProps {
  root: RootEntry;
}

export function RootCard({ root }: RootCardProps) {
  const { locale } = useLanguage();
  const overview = root.overview[locale] ?? root.overview.en;

  return (
    <Link href={`/root/${root.slug}`} className="group block">
      <article className="flex h-full cursor-pointer flex-col rounded-[20px] border border-border p-5 transition-all duration-200 hover:-translate-y-1 hover:bg-muted hover:shadow-md">
        {/* Name + origin */}
        <div className="flex items-baseline gap-2">
          <h3 className="font-heading text-foreground text-2xl font-bold">{root.slug}</h3>
          <span className="text-muted-foreground/50 text-xs">{root.languageOfOrigin}</span>
        </div>

        {/* Overview */}
        <p className="text-muted-foreground mt-3 line-clamp-2 text-sm leading-relaxed">
          {overview}
        </p>

        {/* Footer: word count + mastery */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="text-muted-foreground text-xs font-semibold">
            {root.associatedWords.length} {locale === 'zh' ? '个单词' : 'words'}
          </span>
          <MasteryButtons type="root" slug={root.slug} />
        </div>
      </article>
    </Link>
  );
}
