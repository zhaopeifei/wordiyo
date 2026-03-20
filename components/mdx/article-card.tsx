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

interface ArticleCardProps {
  article: ArticleWithSlug;
  index: number;
}

export function ArticleCard({ article, index }: ArticleCardProps) {
  const { locale } = useLanguage();
  const diff = difficultyConfig[article.difficulty];
  const href = `/${article.category}/${article.slug}`;

  return (
    <Link href={href} className="group block">
      <article
        className="flex h-full cursor-pointer flex-col rounded-[20px] border border-border p-6 transition-all duration-200 hover:-translate-y-1 hover:bg-muted hover:shadow-md"
      >
        {/* Header: difficulty + reading time */}
        <div className="flex items-center gap-2">
          <span
            className={`${diff.className} rounded-full px-2.5 py-0.5 text-xs font-semibold`}
          >
            {diff.label[locale]}
          </span>
          <span className="text-muted-foreground text-xs">
            {article.readingTime}
          </span>
        </div>

        {/* Title */}
        <h2 className="font-heading mt-3 text-xl font-bold leading-tight">
          {locale === 'zh' ? article.titleZh : article.title}
        </h2>

        {/* Excerpt */}
        <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-relaxed">
          {locale === 'zh' ? article.excerptZh : article.excerpt}
        </p>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-[11px] font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-5">
          <span className="text-muted-foreground text-xs">
            {article.author} · {article.date}
          </span>
          <span
            className="text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full border border-border opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </article>
    </Link>
  );
}
