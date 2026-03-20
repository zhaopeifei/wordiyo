import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DEFAULT_LOCALE, SITE_NAME, SITE_URL } from '@/content/site';
import { COLLECTIONS, getCollectionBySlug } from '@/content/collections';
import type { Collection } from '@/content/collections';
import {
  getRoots,
  getRootsByOrigin,
  getRootCount,
  getRootCountByOrigin,
  getWordsByTag,
  getWordCountByTag,
} from '@/lib/db';
import { CollectionDetail } from './index';
import type { RootEntry, WordEntry } from '@/types/content';

export const revalidate = 3600; // ISR: rebuild at most once per hour

// Only pre-render root collections at build time (small dataset).
// Word collections (thousands of items) are generated on first request via ISR.
export async function generateStaticParams() {
  return COLLECTIONS
    .filter((c) => c.type === 'root')
    .map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return {};

  // Fetch item count for the title
  const q = collection.query;
  let itemCount = 0;
  if (q.kind === 'root') {
    itemCount = q.originLang ? await getRootCountByOrigin(q.originLang) : await getRootCount();
  } else {
    itemCount = await getWordCountByTag(q.tagSlug);
  }

  const countLabel = itemCount > 0 ? `${itemCount.toLocaleString()} ` : '';
  const itemType = collection.type === 'root' ? 'Roots' : 'Words';
  const title = `${collection.name[DEFAULT_LOCALE]} - ${countLabel}${itemType} Vocabulary List`;
  const description = `${collection.description[DEFAULT_LOCALE]} Browse ${countLabel}${itemType.toLowerCase()} with definitions, word roots, and examples.`;
  const url = `${SITE_URL}/explore/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} | ${SITE_NAME}`, description, url, type: 'article' },
    twitter: { card: 'summary', title: `${title} | ${SITE_NAME}`, description },
  };
}

/** Fetch roots for a root-type collection. */
async function fetchRoots(collection: Collection): Promise<RootEntry[]> {
  const q = collection.query;
  if (q.kind !== 'root') return [];

  let roots: RootEntry[];
  if (q.originLang) {
    roots = await getRootsByOrigin(q.originLang);
  } else {
    roots = await getRoots();
  }

  // Sort by word count (descending) for top-roots style
  if (q.sortBy === 'word-count') {
    roots.sort((a, b) => b.associatedWords.length - a.associatedWords.length);
  }

  return roots;
}

/** Fetch words for a word-type collection. */
async function fetchWords(collection: Collection): Promise<WordEntry[]> {
  const q = collection.query;
  if (q.kind !== 'word') return [];
  return getWordsByTag(q.tagSlug);
}

const CollectionPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const roots = collection.type === 'root' ? await fetchRoots(collection) : [];
  const words = collection.type === 'word' ? await fetchWords(collection) : [];

  const itemCount = collection.type === 'root' ? roots.length : words.length;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.name[DEFAULT_LOCALE],
    description: collection.description[DEFAULT_LOCALE],
    url: `${SITE_URL}/explore/${slug}`,
    numberOfItems: itemCount,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Explore', item: `${SITE_URL}/explore` },
      { '@type': 'ListItem', position: 3, name: collection.name[DEFAULT_LOCALE], item: `${SITE_URL}/explore/${slug}` },
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
      <CollectionDetail
        collection={collection}
        roots={roots}
        words={words}
      />
    </>
  );
};

export default CollectionPage;
