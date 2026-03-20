'use client';

import { ReactNode } from 'react';
import { LanguageProvider } from '@/components/language-provider';
import { AuthProvider } from '@/components/auth-provider';
import { MasteryProvider } from '@/components/mastery-provider';
import { ThemeProvider } from 'next-themes';

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
      <LanguageProvider>
        <AuthProvider>
          <MasteryProvider>{children}</MasteryProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};
