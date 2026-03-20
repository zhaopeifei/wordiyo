'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { useLanguage } from '@/components/language-provider';
import { RootCard } from '@/components/root-card';
import { ScrollFadeIn } from './scroll-fade-in';
import type { RootEntry } from '@/types/content';

interface RootsSectionProps {
  roots: RootEntry[];
  totalRoots: number;
}

export function RootsSection({ roots, totalRoots }: RootsSectionProps) {
  const { locale } = useLanguage();

  return (
    <section className="space-y-8">
      <ScrollFadeIn>
        <div className="space-y-2">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest">
            {locale === 'en' ? 'Featured Roots' : '精选词根'}
          </p>
          <h2 className="font-heading text-foreground text-3xl font-bold">
            {locale === 'en'
              ? 'Start with the building blocks'
              : '从构词基石开始'}
          </h2>
          <p className="text-muted-foreground max-w-xl text-base">
            {locale === 'en'
              ? `Each root connects to dozens of English words. Explore ${totalRoots} roots and the vocabulary follows.`
              : `每个词根关联数十个英文单词。探索 ${totalRoots} 个词根，词汇量自然增长。`}
          </p>
        </div>
      </ScrollFadeIn>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roots.map((root, i) => (
          <motion.div
            key={root.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          >
            <RootCard root={root} />
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/root"
          className="border-border bg-background text-foreground hover:border-primary/40 hover:text-primary inline-flex items-center gap-1 rounded-full border px-5 py-2 text-sm font-semibold transition"
        >
          {locale === 'en'
            ? `View all ${totalRoots} roots \u2192`
            : `查看全部 ${totalRoots} 个词根 \u2192`}
        </Link>
      </div>
    </section>
  );
}
