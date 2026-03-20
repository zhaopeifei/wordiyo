import type { Metadata } from 'next';
import { PrivacyPage } from './index';
import { SITE_NAME, SITE_URL } from '@/content/site';

export const revalidate = 86400;

const description =
  'Privacy Policy for Wordiyo — learn how we handle your data.';

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE_NAME}`,
  description,
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: { title: `Privacy Policy | ${SITE_NAME}`, description, url: `${SITE_URL}/privacy` },
};

export default function Page() {
  return <PrivacyPage />;
}
