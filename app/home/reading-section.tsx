'use client'

import { motion } from 'motion/react'
import { useLanguage } from '@/components/language-provider'
import Link from 'next/link'
import { ScrollFadeIn } from './scroll-fade-in'

const articleText = {
  before: 'The Renaissance was a period of ',
  word1: 'extraordinary',
  between: ' cultural and ',
  word2: 'intellectual',
  after:
    ' revival in Europe, marking the transition from the medieval to the modern world.',
}

export function ReadingSection() {
  const { locale } = useLanguage()

  return (
    <section className="space-y-8">
      {/* Section header */}
      <ScrollFadeIn>
        <div className="space-y-3 text-center">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest">
            {locale === 'en' ? 'Reading' : '阅读'}
          </p>
          <h2 className="font-heading text-foreground text-3xl font-bold">
            {locale === 'en'
              ? 'Learn words in real context'
              : '在真实语境中学习词汇'}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-xl text-base">
            {locale === 'en'
              ? 'Read classic English articles with vocabulary annotations — click any highlighted word to see its definition and morpheme breakdown.'
              : '阅读经典英文文章，词汇自动标注——点击高亮词即可查看释义和词素拆解。'}
          </p>
        </div>
      </ScrollFadeIn>

      {/* Simulated article mockup */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-card border-border mx-auto max-w-2xl rounded-2xl border p-6 sm:p-8"
      >
        <div className="relative">
          {/* Article text */}
          <p className="text-foreground text-base leading-relaxed sm:text-lg">
            {articleText.before}
            <motion.span
              className="text-primary border-primary/30 cursor-pointer border-b font-semibold"
              initial={{ opacity: 1 }}
              whileInView={{
                opacity: [1, 0.5, 1],
              }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 1.5 }}
            >
              {articleText.word1}
            </motion.span>
            {articleText.between}
            <motion.span
              className="text-primary border-primary/30 cursor-pointer border-b font-semibold"
              initial={{ opacity: 1 }}
              whileInView={{
                opacity: [1, 0.5, 1],
              }}
              viewport={{ once: true }}
              transition={{ delay: 1.0, duration: 1.5 }}
            >
              {articleText.word2}
            </motion.span>
            {articleText.after}
          </p>

          {/* Tooltip for "intellectual" */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="bg-background border-border mt-5 max-w-[240px] rounded-xl border p-5 shadow-lg sm:ml-auto"
          >
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-foreground font-bold">
                intellectual
              </span>
              <span className="text-muted-foreground text-xs">adj.</span>
            </div>
            <p className="text-muted-foreground mt-1.5 text-sm">
              {locale === 'en'
                ? 'relating to the intellect'
                : '智力的；知识分子的'}
            </p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="border-border text-muted-foreground rounded-md border px-2 py-0.5 text-[11px]">
                intel-
              </span>
              <span className="bg-primary text-primary-foreground rounded-md px-2 py-0.5 text-[11px] font-medium">
                lect
              </span>
              <span className="border-border text-muted-foreground rounded-md border px-2 py-0.5 text-[11px]">
                -ual
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/read"
          className="border-border bg-background text-foreground hover:border-primary/40 hover:text-primary inline-flex items-center gap-1 rounded-full border px-5 py-2 text-sm font-semibold transition"
        >
          {locale === 'en' ? 'Start reading \u2192' : '开始阅读 \u2192'}
        </Link>
      </div>
    </section>
  )
}
