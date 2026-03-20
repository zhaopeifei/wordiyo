'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { TOCItem } from '@/lib/content/extract-headings';
import { useLanguage } from '@/components/language-provider';
import type { VocabularyWord } from '@/types/vocabulary-annotation';

interface ArticleSidebarProps {
  headings: TOCItem[];
  vocabularyWords?: VocabularyWord[];
}

export function ArticleSidebar({ headings, vocabularyWords }: ArticleSidebarProps) {
  const { dictionary, locale } = useLanguage();
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px' }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0 && (!vocabularyWords || vocabularyWords.length === 0)) return null;

  return (
    <div className="sticky top-24 hidden lg:block space-y-8">
      {/* TOC */}
      {headings.length > 0 && (
        <nav aria-label="Table of contents">
          <h3 className="text-muted-foreground mb-3 text-xs font-semibold uppercase tracking-wider">
            {dictionary.onThisPage}
          </h3>
          <ul className="border-border space-y-1 border-l">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={`block border-l-2 py-1 text-sm transition-colors ${
                    heading.level === 3 ? 'pl-6' : 'pl-4'
                  } ${
                    activeId === heading.id
                      ? 'border-primary text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground border-transparent'
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Key Vocabulary */}
      {vocabularyWords && vocabularyWords.length > 0 && (
        <nav aria-label="Key vocabulary">
          <h3 className="text-muted-foreground mb-3 text-xs font-semibold uppercase tracking-wider">
            {dictionary.keyVocabulary}
          </h3>
          <ul className="space-y-1.5">
            {vocabularyWords.map((word) => (
              <li key={word.slug}>
                <Link
                  href={`/word/${word.slug}`}
                  className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
                >
                  <span className="text-foreground font-medium">{word.lemma}</span>
                  <span className="ml-1.5 text-xs">
                    {locale === 'zh' && word.definition.zh
                      ? word.definition.zh.slice(0, 15)
                      : word.definition.en.slice(0, 30)}
                    {(locale === 'zh' && word.definition.zh
                      ? word.definition.zh.length > 15
                      : word.definition.en.length > 30) && '…'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
