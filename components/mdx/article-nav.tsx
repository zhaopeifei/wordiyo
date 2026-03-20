'use client';

import Link from 'next/link';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import { useLanguage } from '@/components/language-provider';

interface ArticleNavLink {
  slug: string;
  title: string;
  titleZh: string;
  category: string;
}

interface ArticleNavProps {
  prev?: ArticleNavLink | null;
  next?: ArticleNavLink | null;
}

export function ArticleNav({ prev, next }: ArticleNavProps) {
  const { dictionary, locale } = useLanguage();

  if (!prev && !next) return null;

  return (
    <nav className="mt-12 grid gap-4 grid-cols-1 sm:grid-cols-2" aria-label="Article navigation">
      {prev ? (
        <Link
          href={`/${prev.category}/${prev.slug}`}
          className="bg-card border-border rounded-xl border p-4 hover:border-primary transition-colors group flex items-center gap-3"
        >
          <RiArrowLeftSLine className="h-5 w-5 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
          <div className="min-w-0">
            <p className="text-muted-foreground text-xs font-medium uppercase">
              {dictionary.previousArticle}
            </p>
            <p className="text-foreground font-medium truncate group-hover:text-primary transition-colors">
              {locale === 'zh' ? prev.titleZh : prev.title}
            </p>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/${next.category}/${next.slug}`}
          className="bg-card border-border rounded-xl border p-4 hover:border-primary transition-colors group flex items-center gap-3 justify-end text-right"
        >
          <div className="min-w-0">
            <p className="text-muted-foreground text-xs font-medium uppercase">
              {dictionary.nextArticle}
            </p>
            <p className="text-foreground font-medium truncate group-hover:text-primary transition-colors">
              {locale === 'zh' ? next.titleZh : next.title}
            </p>
          </div>
          <RiArrowRightSLine className="h-5 w-5 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
