'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion } from 'motion/react'
import { useLanguage } from '@/components/language-provider'

interface StatsSectionProps {
  totalRoots: number
  totalWords: number
  totalExamples: number
  totalTags: number
}

function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0)
  const startedRef = useRef(false)

  const start = useCallback(() => {
    if (startedRef.current) return
    startedRef.current = true

    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - (1 - progress) * (1 - progress)
      setValue(Math.round(eased * target))

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [target, duration])

  return { value, start }
}

export function StatsSection({
  totalRoots,
  totalWords,
  totalExamples,
  totalTags,
}: StatsSectionProps) {
  const { locale } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)

  const roots = useCountUp(totalRoots)
  const words = useCountUp(totalWords)
  const examples = useCountUp(totalExamples)
  const tags = useCountUp(totalTags)

  const countUps = [roots, words, examples, tags]

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          countUps.forEach((cu, i) => {
            setTimeout(() => cu.start(), i * 100)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stats = [
    {
      value: roots.value,
      suffix: '',
      en: 'Word Roots',
      zh: '个词根',
    },
    {
      value: words.value,
      suffix: '+',
      en: 'Vocabulary',
      zh: '个词汇',
    },
    {
      value: examples.value,
      suffix: '',
      en: 'Bilingual Examples',
      zh: '条双语例句',
    },
    {
      value: tags.value,
      suffix: '+',
      en: 'Exam Tags',
      zh: '种考试标签',
    },
  ]

  return (
    <section ref={sectionRef} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.en}
          className="border-border bg-card rounded-2xl border px-6 py-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="font-heading text-primary text-3xl font-bold tabular-nums sm:text-4xl">
            {stat.value.toLocaleString()}
            {stat.suffix}
          </div>
          <div className="text-muted-foreground mt-1 text-sm">
            {locale === 'en' ? stat.en : stat.zh}
          </div>
        </motion.div>
      ))}
    </section>
  )
}
