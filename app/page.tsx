import type { Metadata } from 'next';
import { HomeScreen } from './home/index';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/content/site';
import {
  getRoots,
  getFeaturedWords,
  getWordCount,
  getExampleCount,
  getTagCount,
} from '@/lib/db';

export const revalidate = 3600; // ISR: rebuild at most once per hour

export const metadata: Metadata = {
  title: {
    absolute: 'Wordiyo - Learn English Vocabulary Through Word Roots & Etymology',
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'Wordiyo - Learn English Vocabulary Through Word Roots & Etymology',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
};

const HomePage = async () => {
  const [allRoots, breakdownWords, wordCount, exampleCount, tagCount] =
    await Promise.all([
      getRoots(),
      getFeaturedWords(4),
      getWordCount(),
      getExampleCount(),
      getTagCount(),
    ]);

  const featuredRoots = [...allRoots]
    .sort((a, b) => b.associatedWords.length - a.associatedWords.length)
    .slice(0, 6);

  return (
    <HomeScreen
      roots={featuredRoots}
      totalRoots={allRoots.length}
      totalWords={wordCount}
      totalExamples={exampleCount}
      totalTags={tagCount}
      breakdownWords={breakdownWords}
    />
  );
};

export default HomePage;
