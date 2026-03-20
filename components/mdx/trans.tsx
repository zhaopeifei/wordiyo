'use client';

import type { ReactNode } from 'react';
import { useTranslation } from './translation-context';

export function Trans({ lang, children }: { lang: string; children: ReactNode }) {
  const { activeLanguage } = useTranslation();

  if (activeLanguage !== lang) return null;

  return (
    <div className="border-primary/30 bg-primary/5 text-muted-foreground mb-4 rounded-r-lg border-l-2 py-2 pl-4 text-sm">
      {children}
    </div>
  );
}
