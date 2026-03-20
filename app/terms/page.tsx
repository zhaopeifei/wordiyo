import type { Metadata } from 'next';
import { TermsPage } from './index';
import { SITE_NAME, SITE_URL } from '@/content/site';

export const revalidate = 86400;

const description =
  'Terms of Service for Wordiyo — our terms for using the platform.';

export const metadata: Metadata = {
  title: `Terms of Service | ${SITE_NAME}`,
  description,
  alternates: { canonical: `${SITE_URL}/terms` },
  openGraph: { title: `Terms of Service | ${SITE_NAME}`, description, url: `${SITE_URL}/terms` },
};

export default function Page() {
  return <TermsPage />;
}
