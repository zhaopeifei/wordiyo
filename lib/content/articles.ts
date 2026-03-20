import { cache } from 'react';
import type { ArticleMeta, ArticleWithSlug } from '@/types/article';
import { getAllSlugs, loadMeta } from './loader';

export type { ArticleWithSlug };

export const getArticle = cache(
  async (category: string, slug: string): Promise<ArticleWithSlug | null> => {
    try {
      const meta = await loadMeta<ArticleMeta>(category, slug);
      return { ...meta, slug };
    } catch {
      return null;
    }
  }
);

export const getAllArticles = cache(
  async (category: 'learn' | 'read'): Promise<ArticleWithSlug[]> => {
    const slugs = getAllSlugs(category);
    const articles: ArticleWithSlug[] = [];

    for (const slug of slugs) {
      const article = await getArticle(category, slug);
      if (article) articles.push(article);
    }

    return articles.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }
);

export const getArticlesByTag = cache(
  async (
    category: 'learn' | 'read',
    tag: string
  ): Promise<ArticleWithSlug[]> => {
    const all = await getAllArticles(category);
    return all.filter((a) => a.tags.includes(tag));
  }
);

export function getAllTags(articles: ArticleWithSlug[]): string[] {
  const tags = new Set<string>();
  for (const a of articles) {
    for (const t of a.tags) tags.add(t);
  }
  return Array.from(tags).sort();
}
