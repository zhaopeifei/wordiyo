import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { RootDetail } from './index';
import { DEFAULT_LOCALE, SITE_NAME, SITE_URL } from '@/content/site';
import { getRootBySlug, getWordsByRootSlug } from '@/lib/db';

export const revalidate = 3600; // ISR: rebuild at most once per hour

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const root = await getRootBySlug(slug);

  if (!root) {
    return { title: SITE_NAME };
  }

  const title = `${root.variants.join('/')} - Word Root Meaning & Origin`;
  const wordCount = root.associatedWords.length;
  const description = `The root "${root.variants[0]}" means "${root.meaning[DEFAULT_LOCALE]}" in ${root.languageOfOrigin}. Explore ${wordCount} related words, etymology, and examples.`;
  const url = `${SITE_URL}/root/${root.slug}`;

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

const RootDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const root = await getRootBySlug(slug);

  if (!root) {
    notFound();
  }

  const associatedWords = await getWordsByRootSlug(slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: root.variants.join(', '),
    description: root.originSummary[DEFAULT_LOCALE],
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: SITE_NAME,
      url: SITE_URL,
    },
    url: `${SITE_URL}/root/${root.slug}`,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Roots', item: `${SITE_URL}/root` },
      { '@type': 'ListItem', position: 3, name: root.variants[0] ?? root.slug, item: `${SITE_URL}/root/${root.slug}` },
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
      <RootDetail root={root} associatedWords={associatedWords} />
    </>
  );
};

export default RootDetailPage;
