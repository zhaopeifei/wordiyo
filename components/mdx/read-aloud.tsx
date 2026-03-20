'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import { RiPlayLine, RiPauseLine, RiStopLine } from '@remixicon/react';
import { useLanguage } from '@/components/language-provider';
import { useReadAloud } from '@/hooks/use-read-aloud';

interface ReadAloudProps {
  children: ReactNode;
}

export function ReadAloud({ children }: ReadAloudProps) {
  const { dictionary } = useLanguage();
  const contentRef = useRef<HTMLDivElement>(null);
  const {
    supported,
    isPlaying,
    currentParagraphIndex,
    play,
    pause,
    resume,
    stop,
  } = useReadAloud(contentRef);

  // Highlight the current paragraph
  useEffect(() => {
    if (!contentRef.current) return;
    const elements = contentRef.current.querySelectorAll('p, li, h2, h3, h4, blockquote');
    elements.forEach((el, i) => {
      if (i === currentParagraphIndex) {
        el.classList.add('bg-primary/5', 'rounded-lg', '-mx-2', 'px-2', 'py-1');
      } else {
        el.classList.remove('bg-primary/5', 'rounded-lg', '-mx-2', 'px-2', 'py-1');
      }
    });

    // Scroll current paragraph into view
    if (currentParagraphIndex >= 0 && currentParagraphIndex < elements.length) {
      elements[currentParagraphIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentParagraphIndex]);

  if (!supported) return <div ref={contentRef}>{children}</div>;

  return (
    <div>
      {/* Controls */}
      <div className="mb-4 flex items-center gap-2">
        {!isPlaying ? (
          <button
            type="button"
            onClick={currentParagraphIndex >= 0 ? resume : play}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3.5 py-1.5 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <RiPlayLine className="h-3.5 w-3.5" />
            {dictionary.readAloud}
          </button>
        ) : (
          <button
            type="button"
            onClick={pause}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3.5 py-1.5 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <RiPauseLine className="h-3.5 w-3.5" />
            {dictionary.pause}
          </button>
        )}
        {(isPlaying || currentParagraphIndex >= 0) && (
          <button
            type="button"
            onClick={stop}
            className="inline-flex items-center gap-1.5 rounded-full bg-muted text-muted-foreground px-3.5 py-1.5 text-sm font-medium hover:bg-muted/80 transition-colors"
          >
            <RiStopLine className="h-3.5 w-3.5" />
            {dictionary.stop}
          </button>
        )}
      </div>

      {/* Content */}
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
