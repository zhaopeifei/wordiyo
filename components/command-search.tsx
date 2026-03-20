'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { RiSearchLine, RiCloseLine, RiLoader4Line } from '@remixicon/react';
import { useLanguage } from '@/components/language-provider';
import { ROOTS } from '@/content/roots';
import { AFFIXES } from '@/content/affixes';

interface SearchWord {
  slug: string;
  lemma: string;
  pos: string[];
  definition: { en: string; zh: string };
}

interface CommandSearchProps {
  open: boolean;
  onClose: () => void;
}

export const CommandSearch = ({ open, onClose }: CommandSearchProps) => {
  const { locale, dictionary } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [apiWords, setApiWords] = useState<SearchWord[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (open) {
      setQuery('');
      setApiWords([]);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Debounced API search for words
  const fetchWords = useCallback((q: string) => {
    clearTimeout(debounceRef.current);
    abortRef.current?.abort();

    if (q.length < 2) {
      setApiWords([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setApiWords(data.words ?? []);
      } catch {
        // aborted or network error
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    fetchWords(q);
    return () => {
      clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, [query, fetchWords]);

  // Client-side filtering for roots and affixes (instant)
  // Prioritize slug/variant prefix matches over meaning matches
  const clientResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (q.length === 0) return { roots: [], affixes: [] };

    // Roots: prefix matches first, then meaning matches
    const rootSlugMatches = ROOTS.filter(
      (r) =>
        r.slug.startsWith(q) ||
        r.variants.some((v) => v.startsWith(q)),
    );
    const rootSlugSet = new Set(rootSlugMatches.map((r) => r.slug));
    const rootMeaningMatches = ROOTS.filter(
      (r) =>
        !rootSlugSet.has(r.slug) &&
        (r.meaning.en.toLowerCase().includes(q) ||
          r.meaning.zh.includes(q)),
    );
    const rootResults = [...rootSlugMatches, ...rootMeaningMatches].slice(0, 8);

    // Affixes: prefix matches first, then meaning matches
    const affixSlugMatches = AFFIXES.filter(
      (a) =>
        a.slug.startsWith(q) ||
        a.form.toLowerCase().startsWith(q),
    );
    const affixSlugSet = new Set(affixSlugMatches.map((a) => a.slug));
    const affixMeaningMatches = AFFIXES.filter(
      (a) =>
        !affixSlugSet.has(a.slug) &&
        (a.meaning.en.toLowerCase().includes(q) ||
          a.meaning.zh.includes(q)),
    );
    const affixResults = [...affixSlugMatches, ...affixMeaningMatches].slice(0, 8);

    return { roots: rootResults, affixes: affixResults };
  }, [query]);

  const hasQuery = query.trim().length > 0;
  const hasResults =
    clientResults.roots.length > 0 ||
    clientResults.affixes.length > 0 ||
    apiWords.length > 0;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative mx-auto mt-[10vh] w-full max-w-xl px-4">
        <div className="bg-card border-border overflow-hidden rounded-2xl border shadow-2xl">
          <div className="border-border flex items-center gap-3 border-b px-4">
            <RiSearchLine className="text-muted-foreground h-5 w-5 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dictionary.searchPlaceholder}
              className="bg-transparent text-foreground placeholder:text-muted-foreground h-14 flex-1 text-base outline-none"
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Clear"
              >
                <RiCloseLine className="h-4 w-4" />
              </button>
            )}
            <kbd className="border-border bg-muted text-muted-foreground hidden rounded-md border px-2 py-0.5 text-xs sm:inline-block">
              ESC
            </kbd>
          </div>

          {hasQuery && (
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {!hasResults && !loading && (
                <p className="text-muted-foreground px-4 py-8 text-center text-sm">
                  {dictionary.searchNoResults}
                </p>
              )}

              {clientResults.roots.length > 0 && (
                <div className="mb-2">
                  <p className="text-muted-foreground px-3 py-2 text-xs font-bold uppercase tracking-wider">
                    {dictionary.searchRoots}
                  </p>
                  {clientResults.roots.map((root) => (
                    <Link
                      key={root.slug}
                      href={`/root/${root.slug}`}
                      onClick={onClose}
                      className="text-foreground hover:bg-muted flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors"
                    >
                      <span className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold">
                        {root.variants[0]?.[0]?.toUpperCase() ?? '?'}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold">{root.variants.join(', ')}</p>
                        <p className="text-muted-foreground truncate text-xs">
                          {root.meaning[locale] ?? root.meaning.en}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {clientResults.affixes.length > 0 && (
                <div className="mb-2">
                  <p className="text-muted-foreground px-3 py-2 text-xs font-bold uppercase tracking-wider">
                    {dictionary.searchAffixes}
                  </p>
                  {clientResults.affixes.map((affix) => (
                    <Link
                      key={affix.slug}
                      href={`/affix/${affix.slug}`}
                      onClick={onClose}
                      className="text-foreground hover:bg-muted flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors"
                    >
                      <span className="bg-accent text-accent-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold">
                        {affix.type === 'prefix' ? '←' : '→'}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold">{affix.form}</p>
                        <p className="text-muted-foreground truncate text-xs">
                          {affix.meaning[locale] ?? affix.meaning.en}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {(apiWords.length > 0 || loading) && (
                <div>
                  <p className="text-muted-foreground px-3 py-2 text-xs font-bold uppercase tracking-wider">
                    {dictionary.searchWords}
                  </p>
                  {apiWords.map((word) => (
                    <Link
                      key={word.slug}
                      href={`/word/${word.slug}`}
                      onClick={onClose}
                      className="text-foreground hover:bg-muted flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors"
                    >
                      <span className="bg-muted text-muted-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold">
                        {word.lemma[0]?.toUpperCase() ?? '?'}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold">{word.lemma}</p>
                        <p className="text-muted-foreground truncate text-xs">
                          {word.definition[locale] ?? word.definition.en}
                        </p>
                      </div>
                    </Link>
                  ))}
                  {loading && (
                    <div className="flex items-center justify-center py-4">
                      <RiLoader4Line className="text-muted-foreground h-5 w-5 animate-spin" />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
