'use client';

import Link from 'next/link';
import type { ArticleWithSlug } from '@/types/article';
import { useLanguage } from '@/components/language-provider';

const difficultyConfig = {
  beginner: {
    label: { en: 'Beginner', zh: '入门' },
    className: 'bg-muted text-muted-foreground',
  },
  intermediate: {
    label: { en: 'Intermediate', zh: '中级' },
    className: 'bg-muted text-muted-foreground',
  },
  advanced: {
    label: { en: 'Advanced', zh: '高级' },
    className: 'bg-muted text-muted-foreground',
  },
} as const;

export function ArticleHeader({ article }: { article: ArticleWithSlug }) {
  const { locale } = useLanguage();
  const diff = difficultyConfig[article.difficulty];
  const categoryLabel =
    article.category === 'learn'
      ? { en: 'Learn', zh: '学习' }
      : { en: 'Read', zh: '阅读' };

  return (
    <header className="mb-8">
      {/* Breadcrumb */}
      <nav className="text-muted-foreground mb-4 text-sm">
        <Link
          href={`/${article.category}`}
          className="hover:text-primary transition-colors"
        >
          {categoryLabel[locale]}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">
          {locale === 'zh' ? article.titleZh : article.title}
        </span>
      </nav>

      {/* Title */}
      <h1 className="font-heading text-foreground text-3xl font-bold leading-tight md:text-4xl">
        {locale === 'zh' ? article.titleZh : article.title}
      </h1>

      {/* Meta row */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span
          className={`${diff.className} rounded-full px-2.5 py-0.5 text-xs font-semibold`}
        >
          {diff.label[locale]}
        </span>
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="text-muted-foreground mt-3 text-sm">
        {article.author} · {article.date} · {article.readingTime}
      </div>

      <hr className="border-border mt-6" />
    </header>
  );
}
