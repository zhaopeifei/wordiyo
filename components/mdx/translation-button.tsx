'use client';

import { useState, useRef, useEffect } from 'react';
import { RiTranslate2 } from '@remixicon/react';
import { useTranslation } from './translation-context';

const LANG_LABELS: Record<string, string> = {
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
};

export function TranslationButton() {
  const { activeLanguage, setActiveLanguage, availableLanguages } =
    useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuOpen]);

  const isActive = activeLanguage !== null;

  function handleClick() {
    if (availableLanguages.length === 1) {
      setActiveLanguage(isActive ? null : availableLanguages[0]);
    } else {
      setMenuOpen(!menuOpen);
    }
  }

  function selectLang(lang: string) {
    setActiveLanguage(activeLanguage === lang ? null : lang);
    setMenuOpen(false);
  }

  return (
    <div ref={ref} className="fixed right-6 bottom-6 z-50">
      {menuOpen && availableLanguages.length > 1 && (
        <div className="bg-popover border-border mb-2 rounded-lg border p-1 shadow-lg">
          {availableLanguages.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => selectLang(lang)}
              className={`block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                activeLanguage === lang
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              {LANG_LABELS[lang] ?? lang}
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium shadow-lg transition-colors ${
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'bg-popover text-muted-foreground border-border hover:text-foreground border'
        }`}
      >
        <RiTranslate2 className="h-4 w-4" />
        {isActive
          ? LANG_LABELS[activeLanguage!] ?? activeLanguage
          : 'Translate'}
      </button>
    </div>
  );
}
