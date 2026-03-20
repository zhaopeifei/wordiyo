'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useLanguage } from '@/components/language-provider'
import Link from 'next/link'
import {
  RiNodeTree,
  RiBarChartBoxLine,
  RiBookOpenLine,
} from '@remixicon/react'

/* ------------------------------------------------------------------ */
/*  Slides — three learning approaches                                 */
/* ------------------------------------------------------------------ */

const CYCLE_MS = 6000

interface HeroSlide {
  tabEn: string
  tabZh: string
  icon: typeof RiNodeTree
  titleEn: React.ReactNode
  titleZh: React.ReactNode
  subtitleEn: string
  subtitleZh: string
  ctaHref: string
  ctaEn: string
  ctaZh: string
}

const slides: HeroSlide[] = [
  {
    tabEn: 'Word Roots',
    tabZh: '词根词源',
    icon: RiNodeTree,
    titleEn: (
      <>
        Master vocabulary
        <br className="hidden sm:block" />{' '}
        <span className="text-primary">through word roots</span>
      </>
    ),
    titleZh: (
      <>
        通过<span className="text-primary">词根词源</span>
        <br className="hidden sm:block" />
        掌握英语词汇
      </>
    ),
    subtitleEn:
      'Understand one root, unlock a family of words. Every word is decomposed into Latin or Greek building blocks with color-coded morpheme analysis.',
    subtitleZh:
      '理解一个词根，掌握一族单词。每个单词都被拆解为拉丁或希腊语构件，配合词素着色标注，让词汇记忆有迹可循。',
    ctaHref: '/root',
    ctaEn: 'Explore roots →',
    ctaZh: '探索词根 →',
  },
  {
    tabEn: 'Word Lists',
    tabZh: '词库列表',
    icon: RiBarChartBoxLine,
    titleEn: (
      <>
        Build vocabulary with
        <br className="hidden sm:block" />{' '}
        <span className="text-primary">curated word lists</span>
      </>
    ),
    titleZh: (
      <>
        通过<span className="text-primary">精选词库</span>
        <br className="hidden sm:block" />
        高效记忆词汇
      </>
    ),
    subtitleEn:
      'Browse word lists by exam (TOEFL, IELTS, GRE, CET-4/6), frequency (NGSL 1000–3000), and academic vocabulary — each with bilingual examples.',
    subtitleZh:
      '按考试（托福、雅思、GRE、四六级）、词频（NGSL 1000–3000）和学术词汇等维度浏览词库，每个单词配有双语例句。',
    ctaHref: '/explore',
    ctaEn: 'Browse lists →',
    ctaZh: '浏览词库 →',
  },
  {
    tabEn: 'Reading',
    tabZh: '语境阅读',
    icon: RiBookOpenLine,
    titleEn: (
      <>
        Acquire vocabulary
        <br className="hidden sm:block" />{' '}
        <span className="text-primary">through reading</span>
      </>
    ),
    titleZh: (
      <>
        通过<span className="text-primary">语境阅读</span>
        <br className="hidden sm:block" />
        自然习得词汇
      </>
    ),
    subtitleEn:
      'Read classic English articles with vocabulary annotations — click any highlighted word to see its definition and morpheme breakdown.',
    subtitleZh:
      '阅读经典英文文章，词汇自动标注——点击任意高亮词即可查看释义和词素拆解，在语境中自然习得。',
    ctaHref: '/read',
    ctaEn: 'Start reading →',
    ctaZh: '开始阅读 →',
  },
]

/* ------------------------------------------------------------------ */
/*  Floating morpheme pills                                            */
/* ------------------------------------------------------------------ */

const floatingPills = [
  { text: 'struct', type: 'root' as const, x: '6%', y: '22%', delay: 0 },
  { text: 'pre-', type: 'prefix' as const, x: '90%', y: '14%', delay: 1.8 },
  { text: 'bio', type: 'root' as const, x: '82%', y: '68%', delay: 0.9 },
  { text: '-tion', type: 'suffix' as const, x: '8%', y: '72%', delay: 2.4 },
  { text: 'spec', type: 'root' as const, x: '88%', y: '42%', delay: 0.4 },
  { text: 'trans-', type: 'prefix' as const, x: '4%', y: '46%', delay: 1.5 },
  { text: '-ible', type: 'suffix' as const, x: '76%', y: '82%', delay: 2.0 },
  { text: 'duct', type: 'root' as const, x: '14%', y: '86%', delay: 0.7 },
]

const pillStyles = {
  root: 'bg-primary/20 text-primary border-primary/30',
  prefix: 'bg-muted/60 text-muted-foreground border-border',
  suffix: 'bg-muted/60 text-muted-foreground border-border',
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function HeroSection() {
  const { locale } = useLanguage()
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback((i: number) => {
    setActiveIndex(i)
    setPaused(true)
  }, [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, CYCLE_MS)
    return () => clearInterval(id)
  }, [paused])

  const slide = slides[activeIndex]

  return (
    <section
      className="relative min-h-[90vh] overflow-hidden"
      style={{
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        marginTop: 'calc(-2.5rem - 72px)',
      }}
    >
      {/* ---- Background layers ---- */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.08] via-card/80 to-background" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-primary/[0.04]" />

      <motion.div
        className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/[0.07] blur-[120px]"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-primary/[0.06] blur-[100px]"
        animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-primary/[0.10] blur-[80px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="bg-dots pointer-events-none absolute inset-0 opacity-[0.04]" />

      {/* Floating morpheme pills */}
      {floatingPills.map((pill) => (
        <motion.span
          key={pill.text}
          className={`absolute hidden select-none pointer-events-none rounded-lg border px-2.5 py-1 text-[11px] font-bold opacity-0 sm:block ${pillStyles[pill.type]}`}
          style={{ left: pill.x, top: pill.y }}
          animate={{
            opacity: [0, 0.7, 0.7, 0],
            y: [10, -8, -8, -20],
            rotate: [0, -2, 2, 0],
          }}
          transition={{
            duration: 8,
            delay: pill.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {pill.text}
        </motion.span>
      ))}

      {/* ---- Main content ---- */}
      <div className="relative z-10 flex min-h-[90vh] items-center justify-center px-6 pt-28 pb-16 sm:px-12">
        <div className="mx-auto max-w-3xl space-y-8 text-center">
          {/* Small h1 — platform overview */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-muted-foreground text-sm font-semibold uppercase tracking-[0.2em]"
          >
            {locale === 'en'
              ? 'Multiple paths to master English vocabulary'
              : '多种方式，系统掌握英语词汇'}
          </motion.h1>

          {/* ---- Approach tabs ---- */}
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            {slides.map((s, i) => {
              const Icon = s.icon
              const isActive = i === activeIndex
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {locale === 'en' ? s.tabEn : s.tabZh}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="hero-tab-bg"
                      className="absolute inset-0 -z-10 rounded-full border border-primary/20 bg-primary/10"
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* ---- Ripple transition content ---- */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ clipPath: 'circle(0% at 50% 50%)' }}
              animate={{ clipPath: 'circle(150% at 50% 50%)' }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="space-y-6"
            >
              <h2 className="font-heading text-foreground text-3xl font-bold !leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl">
                {locale === 'en' ? slide.titleEn : slide.titleZh}
              </h2>
              <p className="text-muted-foreground mx-auto max-w-xl text-base leading-relaxed sm:text-lg">
                {locale === 'en' ? slide.subtitleEn : slide.subtitleZh}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* ---- CTA ---- */}
          <motion.div
            key={`cta-${activeIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Link
              href={slide.ctaHref}
              className="bg-primary text-primary-foreground inline-block rounded-full px-8 py-3 text-sm font-semibold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25"
            >
              {locale === 'en' ? slide.ctaEn : slide.ctaZh}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
