'use client';

import Link from 'next/link';
import { useCallback, useMemo, useRef, useState } from 'react';
import { RiArrowLeftLine } from '@remixicon/react';
import { CollectionIcon } from '@/components/collection-icon';
import { useLanguage } from '@/components/language-provider';
import { CustomSelect } from '@/components/ui/custom-select';
import { WordCard } from '@/components/word-card';
import { MasteryButtons } from '@/components/mastery-buttons';
import { Pagination, PAGE_SIZE } from '@/components/pagination';
import type { Collection } from '@/content/collections';
import type { RootEntry, WordEntry } from '@/types/content';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CollectionDetailProps {
  collection: Collection;
  roots: RootEntry[];
  words: WordEntry[];
}

// ---------------------------------------------------------------------------
// Root collection view
// ---------------------------------------------------------------------------

const RootCollectionView = ({ roots }: { roots: RootEntry[] }) => {
  const { dictionary, locale } = useLanguage();

  const [sortBy, setSortBy] = useState<string>('most');
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  const sortOptions = useMemo(
    () => [
      { value: 'most', label: dictionary.sortMostWords },
      { value: 'fewest', label: dictionary.sortFewestWords },
      { value: 'az', label: dictionary.sortAZ },
      { value: 'za', label: dictionary.sortZA },
    ],
    [dictionary],
  );

  const filteredRoots = useMemo(() => {
    let result = roots;
    switch (sortBy) {
      case 'az':
        result = [...result].sort((a, b) => a.slug.localeCompare(b.slug));
        break;
      case 'za':
        result = [...result].sort((a, b) => b.slug.localeCompare(a.slug));
        break;
      case 'most':
        result = [...result].sort(
          (a, b) => b.associatedWords.length - a.associatedWords.length,
        );
        break;
      case 'fewest':
        result = [...result].sort(
          (a, b) => a.associatedWords.length - b.associatedWords.length,
        );
        break;
    }
    return result;
  }, [roots, sortBy]);

  const handleSortChange = useCallback((v: string) => {
    setSortBy(v);
    setCurrentPage(1);
  }, []);

  const totalPages = Math.max(1, Math.ceil(filteredRoots.length / PAGE_SIZE));
  const paginatedRoots = filteredRoots.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <CustomSelect
          value={sortBy}
          onChange={handleSortChange}
          aria-label={dictionary.sortMostWords}
          options={sortOptions}
        />
        <span className="text-muted-foreground text-sm">
          {dictionary.showing} {filteredRoots.length} {dictionary.of} {roots.length}
        </span>
      </div>

      <div ref={gridRef} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedRoots.map((root) => {
          return (
            <Link key={root.slug} href={`/root/${root.slug}`} className="group block">
              <article
                className="flex h-full cursor-pointer flex-col rounded-[20px] border border-border p-6 transition-all duration-200 hover:-translate-y-1 hover:bg-muted hover:shadow-md"
              >
                <div>
                  <h2 className="font-heading text-foreground text-2xl font-bold">
                    {root.variants[0] ?? root.slug}
                  </h2>
                  <span
                    className="bg-muted text-muted-foreground mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-semibold"
                  >
                    {root.languageOfOrigin}
                  </span>
                </div>

                <p className="text-muted-foreground mt-4 line-clamp-3 text-sm leading-relaxed">
                  {root.overview[locale]}
                </p>

                <div className="mt-auto flex items-center justify-between pt-5">
                  <span className="text-muted-foreground text-sm font-semibold">
                    {root.associatedWords.length} {dictionary.words}
                  </span>
                  <MasteryButtons type="root" slug={root.slug} />
                </div>
              </article>
            </Link>
          );
        })}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
    </>
  );
};

// ---------------------------------------------------------------------------
// Word collection view
// ---------------------------------------------------------------------------

const WordCollectionView = ({ words }: { words: WordEntry[] }) => {
  const { dictionary, locale } = useLanguage();

  const [posFilter, setPosFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('az');
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  const posOptions = useMemo(
    () => [
      { value: 'all', label: dictionary.filterAll },
      { value: 'n.', label: dictionary.filterNoun },
      { value: 'v.', label: dictionary.filterVerb },
      { value: 'adj.', label: dictionary.filterAdj },
      { value: 'adv.', label: dictionary.filterAdv },
    ],
    [dictionary],
  );

  const sortOptions = useMemo(
    () => [
      { value: 'az', label: dictionary.sortAZ },
      { value: 'za', label: dictionary.sortZA },
      { value: 'freq', label: dictionary.sortFrequency },
    ],
    [dictionary],
  );

  const filteredWords = useMemo(() => {
    let result = words;
    if (posFilter !== 'all') {
      result = result.filter((w) => w.partOfSpeech.includes(posFilter));
    }
    switch (sortBy) {
      case 'az':
        result = [...result].sort((a, b) => a.slug.localeCompare(b.slug));
        break;
      case 'za':
        result = [...result].sort((a, b) => b.slug.localeCompare(a.slug));
        break;
      case 'freq':
        result = [...result].sort((a, b) => {
          const aRank = a.frequencyRank ?? 999999;
          const bRank = b.frequencyRank ?? 999999;
          return aRank - bRank;
        });
        break;
    }
    return result;
  }, [words, posFilter, sortBy]);

  const handlePosChange = useCallback((v: string) => {
    setPosFilter(v);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((v: string) => {
    setSortBy(v);
    setCurrentPage(1);
  }, []);

  const totalPages = Math.max(1, Math.ceil(filteredWords.length / PAGE_SIZE));
  const paginatedWords = filteredWords.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <CustomSelect
          value={posFilter}
          onChange={handlePosChange}
          aria-label={dictionary.filterAll}
          options={posOptions}
        />
        <CustomSelect
          value={sortBy}
          onChange={handleSortChange}
          aria-label={dictionary.sortAZ}
          options={sortOptions}
        />
        <span className="text-muted-foreground text-sm">
          {dictionary.showing} {filteredWords.length} {dictionary.of} {words.length}
        </span>
      </div>

      <div ref={gridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedWords.map((word, index) => (
          <WordCard key={word.slug} word={word} />
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
    </>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export const CollectionDetail = ({
  collection,
  roots,
  words,
}: CollectionDetailProps) => {
  const { locale } = useLanguage();
  const total = collection.type === 'root' ? roots.length : words.length;
  const unit = collection.type === 'root' ? 'roots' : 'words';

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/explore"
        className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
      >
        <RiArrowLeftLine className="h-4 w-4" />
        {locale === 'zh' ? '全部集合' : 'All Collections'}
      </Link>

      {/* Header */}
      <header className="space-y-3">
        <h1 className="font-heading text-foreground text-4xl font-bold sm:text-5xl">
          <CollectionIcon icon={collection.icon} className="mr-3 inline-block h-10 w-10" />
          {collection.name[locale]}
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          {collection.description[locale]}
        </p>
        <p className="text-muted-foreground text-sm">
          {total.toLocaleString()} {unit}
        </p>
      </header>

      {/* Content */}
      {collection.type === 'root' ? (
        <RootCollectionView roots={roots} />
      ) : (
        <WordCollectionView words={words} />
      )}
    </div>
  );
};
