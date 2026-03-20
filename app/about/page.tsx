import type { Metadata } from 'next';
import { AboutSection } from './index';
import { SITE_NAME, SITE_URL } from '@/content/site';
import { getRootCount, getWordCount, getAffixCount } from '@/lib/db';

export const revalidate = 86400; // ISR: rebuild at most once per day

const description =
  "Learn about Wordiyo — a bilingual etymology atlas powered by Grimm's Law. Discover how one root unlocks an entire word family.";

export const metadata: Metadata = {
  title: 'About Wordiyo - Etymology-Based Vocabulary Learning',
  description,
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: { title: `About Wordiyo - Etymology-Based Vocabulary Learning | ${SITE_NAME}`, description, url: `${SITE_URL}/about` },
};

const AboutPage = async () => {
  const [totalRoots, totalWords, totalAffixes] = await Promise.all([
    getRootCount(),
    getWordCount(),
    getAffixCount(),
  ]);
  return (
    <AboutSection
      totalRoots={totalRoots}
      totalWords={totalWords}
      totalAffixes={totalAffixes}
    />
  );
};

export default AboutPage;
