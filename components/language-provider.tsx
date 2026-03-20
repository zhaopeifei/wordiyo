'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LOCALE, SUPPORTED_LANGUAGES, type Locale, type LocalePreference } from '@/content/site';
import { getDictionary } from '@/lib/i18n/dictionaries';

const STORAGE_KEY = 'preferred-locale';

function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;
  const lang = navigator.language?.toLowerCase() ?? '';
  if (lang.startsWith('zh')) return 'zh';
  return 'en';
}

function readStoredPreference(): LocalePreference {
  if (typeof window === 'undefined') return 'auto';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'zh') return stored;
  return 'auto';
}

function resolveLocale(preference: LocalePreference): Locale {
  if (preference === 'auto') return detectBrowserLocale();
  return preference;
}

interface LanguageContextValue {
  locale: Locale;
  preference: LocalePreference;
  dictionary: Record<string, string>;
  setPreference: (pref: LocalePreference) => void;
  availableLocales: readonly Locale[];
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [preference, setPreferenceState] = useState<LocalePreference>('auto');
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);

  // Hydrate from localStorage + browser on mount
  useEffect(() => {
    const stored = readStoredPreference();
    setPreferenceState(stored);
    setLocale(resolveLocale(stored));
  }, []);

  const setPreference = useCallback((pref: LocalePreference) => {
    setPreferenceState(pref);
    setLocale(resolveLocale(pref));
    if (typeof window !== 'undefined') {
      if (pref === 'auto') {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, pref);
      }
    }
  }, []);

  const value = useMemo(() => ({
    locale,
    preference,
    dictionary: getDictionary(locale),
    setPreference,
    availableLocales: SUPPORTED_LANGUAGES,
  }), [locale, preference, setPreference]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
