import type { Metadata } from 'next';
import { RootsIndex } from './roots-index';
import { getRoots } from '@/lib/db';
import { SITE_NAME, SITE_URL } from '@/content/site';

export const revalidate = 3600; // ISR: rebuild at most once per hour

export async function generateMetadata(): Promise<Metadata> {
  const roots = await getRoots();
  const title = 'English Word Roots - Latin & Greek Root List';
  const description = `Browse ${roots.length}+ English word roots from Latin, Greek, and Indo-European origins. Learn how roots unlock vocabulary and build word knowledge.`;
  const url = `${SITE_URL}/root`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} | ${SITE_NAME}`, description, url },
  };
}

const RootIndexPage = async () => {
  const roots = await getRoots();
  return <RootsIndex roots={roots} />;
};

export default RootIndexPage;
