'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Lang = 'en-US' | 'en-GB';

/** Speech rate presets */
const RATE_WORD = 0.8;
const RATE_SENTENCE = 0.9;

let voicesLoaded = false;
let cachedVoices: SpeechSynthesisVoice[] = [];

/** Load voices with cross-browser handling */
function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (voicesLoaded && cachedVoices.length > 0) {
    return Promise.resolve(cachedVoices);
  }

  return new Promise((resolve) => {
    let voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      cachedVoices = voices;
      voicesLoaded = true;
      resolve(voices);
      return;
    }

    // Chrome: voices load async
    const onChanged = () => {
      voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        speechSynthesis.removeEventListener('voiceschanged', onChanged);
        cachedVoices = voices;
        voicesLoaded = true;
        resolve(voices);
      }
    };
    speechSynthesis.addEventListener('voiceschanged', onChanged);

    // Safety timeout for browsers that never fire the event
    setTimeout(() => {
      voices = speechSynthesis.getVoices();
      cachedVoices = voices;
      voicesLoaded = true;
      resolve(voices);
    }, 3000);
  });
}

/** Pick the best voice for a given lang */
function pickVoice(lang: Lang): SpeechSynthesisVoice | undefined {
  const normalised = lang.toLowerCase();
  // Prefer local voices (offline, lower latency)
  const local = cachedVoices.filter(
    (v) => v.lang.replace('_', '-').toLowerCase().startsWith(normalised) && v.localService,
  );
  if (local.length > 0) return local[0];

  const any = cachedVoices.filter(
    (v) => v.lang.replace('_', '-').toLowerCase().startsWith(normalised),
  );
  return any[0];
}

export function useSpeech() {
  const [supported, setSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    setSupported(true);

    // Pre-load voices + silent warm-up
    loadVoices().then(() => {
      const warmup = new SpeechSynthesisUtterance('');
      warmup.volume = 0;
      speechSynthesis.speak(warmup);
    });
  }, []);

  /** Speak a word (slower rate for clarity) */
  const speakWord = useCallback(
    (text: string, lang: Lang = 'en-US') => {
      if (!supported) return;
      speechSynthesis.cancel();

      // Small delay for Firefox cancel() bug
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = RATE_WORD;
        const voice = pickVoice(lang);
        if (voice) utterance.voice = voice;
        utteranceRef.current = utterance;
        speechSynthesis.speak(utterance);
      }, 50);
    },
    [supported],
  );

  /** Speak a sentence / phrase (natural rate) */
  const speakSentence = useCallback(
    (text: string, lang: Lang = 'en-US') => {
      if (!supported) return;
      speechSynthesis.cancel();

      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = RATE_SENTENCE;
        const voice = pickVoice(lang);
        if (voice) utterance.voice = voice;
        utteranceRef.current = utterance;
        speechSynthesis.speak(utterance);
      }, 50);
    },
    [supported],
  );

  return { supported, speakWord, speakSentence };
}
