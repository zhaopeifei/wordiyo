import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE_NAME, SITE_URL } from '@/content/site';
import { getArticle, getAllArticles } from '@/lib/content/articles';
import { compileMdxFromFile } from '@/lib/content/compile-mdx';
import { getMdxSource } from '@/lib/content/loader';
import { extractHeadings } from '@/lib/content/extract-headings';
import { extractTranslationLanguages } from '@/lib/content/extract-translations';
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from '@/lib/content/article-jsonld';
import { getWordsBySlugs } from '@/lib/db/words';
import { toVocabularyWord } from '@/types/vocabulary-annotation';
import { ArticleHeader } from '@/components/mdx/article-header';
import { ArticleSidebar } from '@/components/mdx/article-sidebar';
import { AnnotatedContent } from '@/components/mdx/annotated-content';
import { VocabSummaryCards } from '@/components/mdx/vocab-summary-cards';
import { ArticleNav } from '@/components/mdx/article-nav';
import { ReadingProgress } from '@/components/mdx/reading-progress';
import { ReadAloud } from '@/components/mdx/read-aloud';
import { TranslationProvider } from '@/components/mdx/translation-context';
import { TranslationButton } from '@/components/mdx/translation-button';

export async function generateStaticParams() {
  const articles = await getAllArticles('read');
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle('read', slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `${SITE_URL}/read/${slug}` },
    openGraph: {
      title: `${article.title} | ${SITE_NAME}`,
      description: article.excerpt,
      url: `${SITE_URL}/read/${slug}`,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
    },
  };
}

export default async function ReadArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [article, allArticles] = await Promise.all([
    getArticle('read', slug),
    getAllArticles('read'),
  ]);
  if (!article) notFound();

  const [mdxContent, wordEntries] = await Promise.all([
    compileMdxFromFile('read', slug),
    getWordsBySlugs(article.vocabulary ?? []),
  ]);

  const source = getMdxSource('read', slug);
  const headings = source ? extractHeadings(source) : [];
  const availableLanguages = source ? extractTranslationLanguages(source) : [];
  const vocabularyWords = wordEntries.map(toVocabularyWord);

  // Compute prev/next
  const currentIndex = allArticles.findIndex((a) => a.slug === slug);
  const prev = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const next = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  // JSON-LD
  const articleJsonLd = buildArticleJsonLd(article, 'read');
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(article, 'read');

  const articleContent = (
    <div className="prose-article">
      <AnnotatedContent vocabularyWords={vocabularyWords}>
        {mdxContent}
      </AnnotatedContent>
    </div>
  );

  const hasTranslations = availableLanguages.length > 0;

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="flex gap-10">
        {/* Main content */}
        <article className="min-w-0 flex-1">
          <ArticleHeader article={article} />
          <ReadAloud>
            {hasTranslations ? (
              <TranslationProvider availableLanguages={availableLanguages}>
                {articleContent}
                <TranslationButton />
              </TranslationProvider>
            ) : (
              articleContent
            )}
          </ReadAloud>
          <ArticleNav
            prev={prev ? { slug: prev.slug, title: prev.title, titleZh: prev.titleZh, category: 'read' } : null}
            next={next ? { slug: next.slug, title: next.title, titleZh: next.titleZh, category: 'read' } : null}
          />
        </article>

        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <ArticleSidebar headings={headings} vocabularyWords={vocabularyWords} />
        </aside>
      </div>

      {/* Vocabulary summary — full width below article */}
      <VocabSummaryCards wordEntries={wordEntries} />
    </>
  );
}
