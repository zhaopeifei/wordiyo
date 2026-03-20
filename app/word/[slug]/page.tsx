import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { WordDetail } from './index';
import { DEFAULT_LOCALE, SITE_NAME, SITE_URL } from '@/content/site';
import { getWordBySlug, getRootBySlug } from '@/lib/db';

export const revalidate = 3600; // ISR: rebuild at most once per hour


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const word = await getWordBySlug(slug);

  if (!word) {
    return { title: SITE_NAME };
  }

  const title = `${word.lemma} - Definition, Meaning & Etymology`;
  const description = `${word.lemma}: ${word.definition[DEFAULT_LOCALE]}. ${word.morphologyNote[DEFAULT_LOCALE]}. Learn word roots, examples, and collocations.`;
  const url = `${SITE_URL}/word/${word.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

const WordDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const word = await getWordBySlug(slug);

  if (!word) {
    notFound();
  }

  const parentRootSegment = word.rootBreakdown.find((s) => s.type === 'root' && s.rootSlug);
  const parentRoot = parentRootSegment?.rootSlug ? await getRootBySlug(parentRootSegment.rootSlug) : undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: word.lemma,
    description: word.definition[DEFAULT_LOCALE],
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: SITE_NAME,
      url: SITE_URL,
    },
    url: `${SITE_URL}/word/${word.slug}`,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Roots', item: `${SITE_URL}/root` },
      ...(parentRoot ? [{
        '@type': 'ListItem', position: 3,
        name: parentRoot.variants[0] ?? parentRoot.slug,
        item: `${SITE_URL}/root/${parentRoot.slug}`,
      }] : []),
      {
        '@type': 'ListItem', position: parentRoot ? 4 : 3,
        name: word.lemma,
        item: `${SITE_URL}/word/${word.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <WordDetail word={word} parentRoot={parentRoot ?? undefined} />
    </>
  );
};

export default WordDetailPage;
