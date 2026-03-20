'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface TranslationContextValue {
  activeLanguage: string | null;
  setActiveLanguage: (lang: string | null) => void;
  availableLanguages: string[];
}

const TranslationContext = createContext<TranslationContextValue | null>(null);

export function TranslationProvider({
  children,
  availableLanguages,
}: {
  children: ReactNode;
  availableLanguages: string[];
}) {
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);

  return (
    <TranslationContext.Provider
      value={{ activeLanguage, setActiveLanguage, availableLanguages }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return ctx;
}
