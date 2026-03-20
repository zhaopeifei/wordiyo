'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import {
  RiGraduationCapLine,
  RiBarChartBoxLine,
  RiNodeTree,
} from '@remixicon/react';
import { useLanguage } from '@/components/language-provider';
import { ScrollFadeIn } from './scroll-fade-in';
import { getCollectionsByCategory } from '@/content/collections';

const examCollections = getCollectionsByCategory('exam');
const frequencyCollections = [
  ...getCollectionsByCategory('frequency'),
  ...getCollectionsByCategory('academic'),
];
const rootCollections = getCollectionsByCategory('roots');

interface CategoryCard {
  icon: typeof RiGraduationCapLine;
  titleEn: string;
  titleZh: string;
  descEn: string;
  descZh: string;
  collections: typeof examCollections;
  maxItems?: number;
}

const CARDS: CategoryCard[] = [
  {
    icon: RiGraduationCapLine,
    titleEn: 'By Exam',
    titleZh: '按考试',
    descEn:
      'Word lists tailored for major English exams — TOEFL, IELTS, GRE, CET-4/6, and more. Focus on the vocabulary that matters for your target test.',
    descZh:
      '为主流英语考试量身定制的词汇表——托福、雅思、GRE、四六级等，聚焦目标考试的核心词汇。',
    collections: examCollections,
    maxItems: 5,
  },
  {
    icon: RiBarChartBoxLine,
    titleEn: 'By Frequency',
    titleZh: '按词频',
    descEn:
      'Organized by how often words appear in real English — from the top 1,000 most common words to advanced academic vocabulary.',
    descZh:
      '按词汇在真实英语中的出现频率排列——从最常用的 1000 词到高阶学术词汇，循序渐进。',
    collections: frequencyCollections,
  },
  {
    icon: RiNodeTree,
    titleEn: 'By Root',
    titleZh: '按词根',
    descEn:
      'Explore words grouped by their Latin and Greek roots. Learn one root and unlock an entire family of related vocabulary.',
    descZh:
      '按拉丁和希腊词根分组探索单词。学会一个词根，解锁一整族相关词汇。',
    collections: rootCollections,
  },
];

export function ExploreSection() {
  const { locale } = useLanguage();

  return (
    <section className="space-y-8">
      <ScrollFadeIn>
        <div className="space-y-3 text-center">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest">
            {locale === 'en' ? 'Explore' : '探索'}
          </p>
          <h2 className="font-heading text-foreground text-3xl font-bold">
            {locale === 'en'
              ? 'Explore vocabulary your way'
              : '多维度浏览词汇'}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-base">
            {locale === 'en'
              ? 'Browse curated word lists organized by exam type, usage frequency, and word roots — each designed to help you build vocabulary systematically.'
              : '按考试类型、使用频率、词根词源等多个维度浏览精选词汇列表——每一种方式都助你系统化构建词汇体系。'}
          </p>
        </div>
      </ScrollFadeIn>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card, i) => {
          const Icon = card.icon;
          const displayCollections = card.maxItems
            ? card.collections.slice(0, card.maxItems)
            : card.collections;

          return (
            <motion.div
              key={card.titleEn}
              className="h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href="/explore"
                className="group flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:bg-muted hover:shadow-md"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>

                <h3 className="text-foreground text-lg font-semibold">
                  {locale === 'en' ? card.titleEn : card.titleZh}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  {locale === 'en' ? card.descEn : card.descZh}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {displayCollections.map((c) => (
                    <span
                      key={c.slug}
                      className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {c.name[locale]}
                    </span>
                  ))}
                </div>

                <p className="text-muted-foreground mt-auto flex items-center gap-1 pt-2 text-xs font-medium">
                  {locale === 'en'
                    ? `${card.collections.length} lists`
                    : `${card.collections.length} 个列表`}
                  <span className="text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    →
                  </span>
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center">
        <Link
          href="/explore"
          className="border-border bg-background text-foreground hover:border-primary/40 hover:text-primary inline-flex items-center gap-1 rounded-full border px-5 py-2 text-sm font-semibold transition"
        >
          {locale === 'en'
            ? 'Browse all word lists \u2192'
            : '浏览全部词汇列表 \u2192'}
        </Link>
      </div>
    </section>
  );
}
