import type { Locale } from './site';

// ---------------------------------------------------------------------------
// Query descriptors — tell the data layer how to fetch each collection
// ---------------------------------------------------------------------------

export interface RootCollectionQuery {
  kind: 'root';
  sortBy: 'word-count' | 'az';
  originLang?: string; // filter by roots.origin_lang
}

export interface WordCollectionQuery {
  kind: 'word';
  tagSlug: string; // matches tags.slug in the DB
}

// ---------------------------------------------------------------------------
// Collection definition
// ---------------------------------------------------------------------------

export interface Collection {
  slug: string;
  type: 'root' | 'word';
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  icon: string;
  category: 'roots' | 'exam' | 'academic' | 'frequency';
  query: RootCollectionQuery | WordCollectionQuery;
}

// ---------------------------------------------------------------------------
// All collections — adding a new one is just one more object here
// ---------------------------------------------------------------------------

export const COLLECTIONS: Collection[] = [
  // ── Word Roots ─────────────────────────────────────────────────────────
  {
    slug: 'top-roots',
    type: 'root',
    name: { en: 'Top Roots', zh: '高产词根' },
    description: {
      en: 'The most productive roots, ranked by number of associated words.',
      zh: '最高产的词根，按关联单词数排序。',
    },
    icon: 'bar-chart',
    category: 'roots',
    query: { kind: 'root', sortBy: 'word-count' },
  },
  {
    slug: 'latin-roots',
    type: 'root',
    name: { en: 'Latin Roots', zh: '拉丁词根' },
    description: {
      en: 'Roots inherited from Latin — the backbone of academic English.',
      zh: '源自拉丁语的词根——学术英语的基石。',
    },
    icon: 'bank',
    category: 'roots',
    query: { kind: 'root', sortBy: 'word-count', originLang: 'Latin' },
  },
  {
    slug: 'greek-roots',
    type: 'root',
    name: { en: 'Greek Roots', zh: '希腊词根' },
    description: {
      en: 'Roots from Ancient Greek — essential for science and medicine.',
      zh: '源自古希腊语的词根——科学与医学的核心词源。',
    },
    icon: 'ancient-gate',
    category: 'roots',
    query: { kind: 'root', sortBy: 'word-count', originLang: 'Greek' },
  },

  // ── Exam Vocabulary ────────────────────────────────────────────────────
  {
    slug: 'ielts',
    type: 'word',
    name: { en: 'IELTS', zh: '雅思' },
    description: {
      en: 'Essential vocabulary for the IELTS exam.',
      zh: '雅思考试核心词汇。',
    },
    icon: 'graduation-cap',
    category: 'exam',
    query: { kind: 'word', tagSlug: 'ielts' },
  },
  {
    slug: 'toefl',
    type: 'word',
    name: { en: 'TOEFL', zh: '托福' },
    description: {
      en: 'Essential vocabulary for the TOEFL exam.',
      zh: '托福考试核心词汇。',
    },
    icon: 'graduation-cap',
    category: 'exam',
    query: { kind: 'word', tagSlug: 'toefl' },
  },
  {
    slug: 'cet4',
    type: 'word',
    name: { en: 'CET-4', zh: '四级' },
    description: {
      en: 'College English Test Band 4 vocabulary.',
      zh: '大学英语四级考试词汇。',
    },
    icon: 'graduation-cap',
    category: 'exam',
    query: { kind: 'word', tagSlug: 'cet4' },
  },
  {
    slug: 'cet6',
    type: 'word',
    name: { en: 'CET-6', zh: '六级' },
    description: {
      en: 'College English Test Band 6 vocabulary.',
      zh: '大学英语六级考试词汇。',
    },
    icon: 'graduation-cap',
    category: 'exam',
    query: { kind: 'word', tagSlug: 'cet6' },
  },
  {
    slug: 'gre',
    type: 'word',
    name: { en: 'GRE', zh: 'GRE' },
    description: {
      en: 'Graduate Record Examination vocabulary.',
      zh: 'GRE 考试核心词汇。',
    },
    icon: 'graduation-cap',
    category: 'exam',
    query: { kind: 'word', tagSlug: 'gre' },
  },
  {
    slug: 'gaokao',
    type: 'word',
    name: { en: 'Gaokao', zh: '高考' },
    description: {
      en: 'National College Entrance Examination vocabulary.',
      zh: '高考英语核心词汇。',
    },
    icon: 'graduation-cap',
    category: 'exam',
    query: { kind: 'word', tagSlug: 'gk' },
  },
  {
    slug: 'kaoyan',
    type: 'word',
    name: { en: 'Kaoyan', zh: '考研' },
    description: {
      en: 'Graduate school entrance exam vocabulary.',
      zh: '考研英语核心词汇。',
    },
    icon: 'graduation-cap',
    category: 'exam',
    query: { kind: 'word', tagSlug: 'ky' },
  },
  {
    slug: 'zhongkao',
    type: 'word',
    name: { en: 'Zhongkao', zh: '中考' },
    description: {
      en: 'High school entrance exam vocabulary.',
      zh: '中考英语核心词汇。',
    },
    icon: 'graduation-cap',
    category: 'exam',
    query: { kind: 'word', tagSlug: 'zk' },
  },
  // ── Academic Word Lists ────────────────────────────────────────────────
  {
    slug: 'awl',
    type: 'word',
    name: { en: 'AWL', zh: '学术词表' },
    description: {
      en: 'Academic Word List — 570 word families essential for university study.',
      zh: '学术词汇表——大学学习必备的 570 个词族。',
    },
    icon: 'award',
    category: 'academic',
    query: { kind: 'word', tagSlug: 'awl' },
  },
  {
    slug: 'ngsl-1000',
    type: 'word',
    name: { en: 'NGSL 1000', zh: 'NGSL 1000' },
    description: {
      en: 'New General Service List — the first 1,000 most important words.',
      zh: '新通用服务词表——最重要的前 1,000 个单词。',
    },
    icon: 'book-open',
    category: 'frequency',
    query: { kind: 'word', tagSlug: 'ngsl-1000' },
  },
  {
    slug: 'ngsl-2000',
    type: 'word',
    name: { en: 'NGSL 2000', zh: 'NGSL 2000' },
    description: {
      en: 'New General Service List — words ranked 1,001 to 2,000.',
      zh: '新通用服务词表——排名 1,001 至 2,000 的单词。',
    },
    icon: 'book-open',
    category: 'frequency',
    query: { kind: 'word', tagSlug: 'ngsl-2000' },
  },
  {
    slug: 'ngsl-3000',
    type: 'word',
    name: { en: 'NGSL 3000', zh: 'NGSL 3000' },
    description: {
      en: 'New General Service List — words ranked 2,001 to 3,000.',
      zh: '新通用服务词表——排名 2,001 至 3,000 的单词。',
    },
    icon: 'book-open',
    category: 'frequency',
    query: { kind: 'word', tagSlug: 'ngsl-3000' },
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getCollectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export function getCollectionsByCategory(category: Collection['category']): Collection[] {
  return COLLECTIONS.filter((c) => c.category === category);
}

/** Category display order and labels for the Hub page. */
export const COLLECTION_CATEGORIES: {
  key: Collection['category'];
  label: Record<Locale, string>;
}[] = [
  { key: 'roots', label: { en: 'Word Roots', zh: '词根合集' } },
  { key: 'exam', label: { en: 'Exam Vocabulary', zh: '考试词汇' } },
  { key: 'academic', label: { en: 'Academic', zh: '学术词汇' } },
  { key: 'frequency', label: { en: 'Frequency Lists', zh: '词频分级' } },
];
