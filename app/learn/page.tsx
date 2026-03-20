import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SITE_NAME, SITE_URL } from '@/content/site';
import { getAllArticles } from '@/lib/content/articles';
import { ArticleList } from '@/components/mdx/article-list';

export const metadata: Metadata = {
  title: 'Etymology & Vocabulary Learning Guides',
  description:
    'Learn English vocabulary through word roots, prefixes, suffixes, and etymology stories. Build lasting word knowledge with proven strategies.',
  alternates: { canonical: `${SITE_URL}/learn` },
  openGraph: {
    title: `Etymology & Vocabulary Learning Guides | ${SITE_NAME}`,
    description:
      'Learn English vocabulary through word roots, prefixes, suffixes, and etymology stories. Build lasting word knowledge with proven strategies.',
    url: `${SITE_URL}/learn`,
  },
};

export default async function LearnPage() {
  const articles = await getAllArticles('learn');

  return (
    <Suspense>
      <ArticleList
        articles={articles}
        title={{
          en: 'Learn',
          zh: '学习',
        }}
        subtitle={{
          en: 'Word roots, affixes, etymology stories, and learning strategies.',
          zh: '词根、词缀、词源故事和学习策略。',
        }}
      />
    </Suspense>
  );
}
