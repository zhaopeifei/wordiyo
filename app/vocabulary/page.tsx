import type { Metadata } from 'next';
import { VocabularyPage } from './index';
import { SITE_NAME, SITE_URL } from '@/content/site';

export const revalidate = 86400;

const description =
  'Your personal vocabulary tracker — review words and roots by mastery level.';

export const metadata: Metadata = {
  title: `My Vocabulary | ${SITE_NAME}`,
  description,
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/vocabulary` },
  openGraph: { title: `My Vocabulary | ${SITE_NAME}`, description, url: `${SITE_URL}/vocabulary` },
};

export default function Page() {
  return <VocabularyPage />;
}
