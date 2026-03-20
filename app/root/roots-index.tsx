'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { RiNodeTree } from '@remixicon/react';
import { useLanguage } from '@/components/language-provider';
import { CustomSelect } from '@/components/ui/custom-select';
import { RootCard } from '@/components/root-card';
import { Pagination, PAGE_SIZE } from '@/components/pagination';
import type { RootEntry } from '@/types/content';

interface RootsIndexProps {
  roots: RootEntry[];
}



export const RootsIndex = ({ roots }: RootsIndexProps) => {
  const { dictionary, locale } = useLanguage();

  const [sortBy, setSortBy] = useState<string>('az');
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  const sortOptions = useMemo(
    () => [
      { value: 'az', label: dictionary.sortAZ },
      { value: 'za', label: dictionary.sortZA },
      { value: 'most', label: dictionary.sortMostWords },
      { value: 'fewest', label: dictionary.sortFewestWords },
    ],
    [dictionary.sortAZ, dictionary.sortZA, dictionary.sortMostWords, dictionary.sortFewestWords],
  );

  // Sort
  const filteredRoots = useMemo(() => {
    let result = roots;

    switch (sortBy) {
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
      case 'az':
      default:
        result = [...result].sort((a, b) => a.slug.localeCompare(b.slug));
        break;
    }

    return result;
  }, [roots, sortBy]);

  // Reset to page 1 when filters/sort change
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
    <div className="space-y-10">
      {/* Section header */}
      <header className="space-y-3">
        <h1 className="font-heading text-foreground text-4xl font-bold sm:text-5xl">
          <RiNodeTree className="mr-3 inline-block h-10 w-10" />
          {dictionary.roots}
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg">{dictionary.rootOverview}</p>
      </header>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <CustomSelect
          value={sortBy}
          onChange={handleSortChange}
          aria-label={dictionary.sortAZ}
          options={sortOptions}
        />

        <span className="text-muted-foreground text-sm">
          {dictionary.showing} {filteredRoots.length} {dictionary.of} {roots.length}
        </span>
      </div>

      {/* Root cards grid */}
      <div ref={gridRef} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedRoots.map((root) => (
          <RootCard key={root.slug} root={root} />
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
    </div>
  );
};
