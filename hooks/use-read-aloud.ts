'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface ReadAloudState {
  isPlaying: boolean;
  currentParagraphIndex: number;
  currentCharIndex: number;
  currentCharLength: number;
  supportsBoundary: boolean;
}

export function useReadAloud(contentRef: React.RefObject<HTMLElement | null>) {
  const [state, setState] = useState<ReadAloudState>({
    isPlaying: false,
    currentParagraphIndex: -1,
    currentCharIndex: -1,
    currentCharLength: 0,
    supportsBoundary: false,
  });

  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const paragraphsRef = useRef<string[]>([]);
  const currentIdxRef = useRef(0);

  // Detect boundary event support (Chrome supports it, Safari doesn't)
  useEffect(() => {
    if (!supported) return;
    const u = new SpeechSynthesisUtterance('test');
    // Chrome fires 'boundary', Safari doesn't
    const hasBoundary = 'onboundary' in u;
    setState((s) => ({ ...s, supportsBoundary: hasBoundary }));
  }, [supported]);

  const extractParagraphs = useCallback(() => {
    if (!contentRef.current) return [];
    const elements = contentRef.current.querySelectorAll('p, li, h2, h3, h4, blockquote');
    return Array.from(elements)
      .map((el) => (el.textContent ?? '').trim())
      .filter((text) => text.length > 0);
  }, [contentRef]);

  const speakParagraph = useCallback(
    (index: number) => {
      const paragraphs = paragraphsRef.current;
      if (index >= paragraphs.length) {
        // Finished
        window.speechSynthesis.cancel();
        setState((s) => ({
          ...s,
          isPlaying: false,
          currentParagraphIndex: -1,
          currentCharIndex: -1,
          currentCharLength: 0,
        }));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(paragraphs[index]);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;

      utterance.onboundary = (e) => {
        if (e.name === 'word') {
          setState((s) => ({
            ...s,
            currentCharIndex: e.charIndex,
            currentCharLength: e.charLength ?? 0,
          }));
        }
      };

      utterance.onend = () => {
        currentIdxRef.current = index + 1;
        speakParagraph(index + 1);
      };

      utteranceRef.current = utterance;
      setState((s) => ({
        ...s,
        isPlaying: true,
        currentParagraphIndex: index,
        currentCharIndex: -1,
        currentCharLength: 0,
      }));
      window.speechSynthesis.speak(utterance);
    },
    [],
  );

  const play = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    paragraphsRef.current = extractParagraphs();
    currentIdxRef.current = 0;
    speakParagraph(0);
  }, [supported, extractParagraphs, speakParagraph]);

  const pause = useCallback(() => {
    if (!supported) return;
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setState((s) => ({ ...s, isPlaying: false }));
    }
  }, [supported]);

  const resume = useCallback(() => {
    if (!supported) return;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setState((s) => ({ ...s, isPlaying: true }));
    }
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setState({
      isPlaying: false,
      currentParagraphIndex: -1,
      currentCharIndex: -1,
      currentCharLength: 0,
      supportsBoundary: state.supportsBoundary,
    });
  }, [supported, state.supportsBoundary]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel();
    };
  }, [supported]);

  return {
    supported,
    ...state,
    play,
    pause,
    resume,
    stop,
  };
}
