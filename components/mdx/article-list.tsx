'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import type { ArticleWithSlug } from '@/types/article';
import { ArticleCard } from './article-card';
import { useLanguage } from '@/components/language-provider';

function getAllTags(articles: ArticleWithSlug[]): string[] {
  const tags = new Set<string>();
  for (const a of articles) {
    for (const t of a.tags) tags.add(t);
  }
  return Array.from(tags).sort();
}

interface ArticleListProps {
  articles: ArticleWithSlug[];
  title: { en: string; zh: string };
  subtitle: { en: string; zh: string };
}

export function ArticleList({ articles, title, subtitle }: ArticleListProps) {
  const { locale } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTag = searchParams.get('tag');
  const tags = getAllTags(articles);

  const filtered = activeTag
    ? articles.filter((a) => a.tags.includes(activeTag))
    : articles;

  function setTag(tag: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (tag) {
      params.set('tag', tag);
    } else {
      params.delete('tag');
    }
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : '', { scroll: false });
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-foreground text-3xl font-bold md:text-4xl">
          {title[locale]}
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          {subtitle[locale]}
        </p>
      </div>

      {/* Tag filter */}
      {tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setTag(null)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              activeTag === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {locale === 'zh' ? '全部' : 'All'}
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTag(tag === activeTag ? null : tag)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                activeTag === tag
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Article grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((article, i) => (
            <ArticleCard key={article.slug} article={article} index={i} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground py-12 text-center">
          {locale === 'zh' ? '暂无文章...' : 'No articles yet...'}
        </p>
      )}
    </div>
  );
}
