import { SITE_NAME, SITE_URL } from '@/content/site';
import type { ArticleWithSlug } from '@/types/article';

export function buildArticleJsonLd(article: ArticleWithSlug, category: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    author: {
      '@type': article.author === SITE_NAME ? 'Organization' : 'Person',
      name: article.author,
    },
    datePublished: article.date,
    url: `${SITE_URL}/${category}/${article.slug}`,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    inLanguage: 'en',
    keywords: article.tags,
  };
}

export function buildBreadcrumbJsonLd(article: ArticleWithSlug, category: string) {
  const categoryLabel = category === 'learn' ? 'Learn' : 'Read';
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryLabel,
        item: `${SITE_URL}/${category}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `${SITE_URL}/${category}/${article.slug}`,
      },
    ],
  };
}
