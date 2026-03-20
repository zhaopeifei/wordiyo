'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import {
  RiCircleLine,
  RiStarLine,
  RiStarHalfLine,
  RiStarFill,
  RiBookmarkLine,
} from '@remixicon/react';
import { useAuth } from '@/components/auth-provider';
import { useLanguage } from '@/components/language-provider';
import { ScrollFadeIn } from './scroll-fade-in';

const masteryLevels = [
  {
    icon: RiCircleLine,
    labelEn: 'Unknown',
    labelZh: '不认识',
    descEn: 'New to you',
    descZh: '还没见过',
  },
  {
    icon: RiStarLine,
    labelEn: 'Seen',
    labelZh: '见过',
    descEn: 'Encountered before',
    descZh: '接触过',
  },
  {
    icon: RiStarHalfLine,
    labelEn: 'Familiar',
    labelZh: '熟悉',
    descEn: 'Recognize it',
    descZh: '能认出来',
  },
  {
    icon: RiStarFill,
    labelEn: 'Mastered',
    labelZh: '掌握',
    descEn: 'Know it well',
    descZh: '完全掌握',
  },
];

export function CtaSection() {
  const { locale } = useLanguage();
  const { user, signInWithGoogle } = useAuth();

  const href = user ? '/my-words' : undefined;

  return (
    <ScrollFadeIn>
      <section>
        <div className="mx-auto max-w-2xl space-y-8 text-center">
          {/* header */}
          <div className="space-y-2">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest">
              {locale === 'en' ? 'Your Vocabulary' : '你的词汇本'}
            </p>
            <h2 className="font-heading text-foreground text-3xl font-bold">
              {locale === 'en'
                ? 'Track your mastery, build your word bank'
                : '标记掌握程度，打造专属词汇本'}
            </h2>
            <p className="text-muted-foreground text-base">
              {locale === 'en'
                ? 'Mark any word or root with your mastery level. Your progress is saved automatically — review what you know and focus on what you don\'t.'
                : '为任意单词或词根标记掌握程度，进度自动保存——随时回顾已掌握的内容，专注攻克薄弱词汇。'}
            </p>
          </div>

          {/* mastery level demo */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            {masteryLevels.map((level, i) => {
              const Icon = level.icon;
              return (
                <motion.div
                  key={level.labelEn}
                  className="flex flex-col items-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted/50">
                    <Icon className="h-6 w-6 text-foreground" />
                  </div>
                  <span className="text-foreground text-sm font-semibold">
                    {locale === 'en' ? level.labelEn : level.labelZh}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {locale === 'en' ? level.descEn : level.descZh}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="space-y-3">
            {href ? (
              <Link
                href={href}
                className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25"
              >
                <RiBookmarkLine className="h-4 w-4" />
                {locale === 'en' ? 'Go to My Words' : '查看我的词汇本'}
              </Link>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25"
              >
                <RiBookmarkLine className="h-4 w-4" />
                {locale === 'en'
                  ? 'Sign in to start tracking'
                  : '登录开始记录'}
              </button>
            )}
            <p className="text-muted-foreground text-xs">
              {locale === 'en'
                ? 'Free with Google sign-in — your progress syncs across devices'
                : '使用 Google 登录即可使用，进度跨设备同步'}
            </p>
          </div>
        </div>
      </section>
    </ScrollFadeIn>
  );
}
