'use client';

import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';

export const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="border-border bg-background flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border text-base transition-all hover:rotate-12 hover:border-primary"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
};
