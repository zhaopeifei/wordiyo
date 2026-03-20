'use client';

import { useMemo, type ReactNode, type ReactElement } from 'react';
import { Children, isValidElement, cloneElement } from 'react';
import Link from 'next/link';
import type { VocabularyWord } from '@/types/vocabulary-annotation';

/** Tags whose text content should NOT be annotated. */
const SKIP_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'code', 'pre', 'a']);

interface AnnotatedContentProps {
  children: ReactNode;
  vocabularyWords: VocabularyWord[];
}

export function AnnotatedContent({ children, vocabularyWords }: AnnotatedContentProps) {
  const wordMap = useMemo(() => {
    const map = new Map<string, VocabularyWord>();
    for (const w of vocabularyWords) {
      map.set(w.lemma.toLowerCase(), w);
    }
    return map;
  }, [vocabularyWords]);

  const pattern = useMemo(() => {
    if (wordMap.size === 0) return null;
    // Sort by length descending so longer matches win
    const escaped = Array.from(wordMap.keys())
      .sort((a, b) => b.length - a.length)
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    return new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');
  }, [wordMap]);

  if (!pattern || vocabularyWords.length === 0) return <>{children}</>;

  const regex = pattern;

  // Track whether each word has been annotated (first occurrence gets underline)
  const seenWords = new Set<string>();

  function annotateText(text: string): ReactNode[] {
    const parts: ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    regex.lastIndex = 0;

    while ((match = regex.exec(text)) !== null) {
      const word = match[1];
      const key = word.toLowerCase();
      const vocabWord = wordMap.get(key);
      if (!vocabWord) continue;

      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      const isFirst = !seenWords.has(key);
      if (isFirst) seenWords.add(key);

      parts.push(
        <Link
          key={`${key}-${match.index}`}
          href={`/word/${vocabWord.slug}`}
          className={
            isFirst
              ? 'border-b border-dashed border-primary/40 hover:border-primary transition-colors'
              : 'hover:text-primary transition-colors'
          }
        >
          {word}
        </Link>,
      );

      lastIndex = match.index + word.length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  }

  function processNode(node: ReactNode): ReactNode {
    if (typeof node === 'string') {
      const result = annotateText(node);
      return result.length === 1 ? result[0] : <>{result}</>;
    }

    if (!isValidElement(node)) return node;

    const el = node as ReactElement<Record<string, unknown>>;
    const tag = typeof el.type === 'string' ? el.type : '';

    if (SKIP_TAGS.has(tag)) return node;

    const children = el.props.children;
    if (!children) return node;

    const processedChildren = Children.map(children as ReactNode, processNode);

    return cloneElement(el, {}, processedChildren);
  }

  return <>{Children.map(children, processNode)}</>;
}
