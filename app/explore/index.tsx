'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/language-provider';
import {
  COLLECTIONS,
  COLLECTION_CATEGORIES,
  getCollectionsByCategory,
} from '@/content/collections';
import type { Collection } from '@/content/collections';
import { CollectionIcon } from '@/components/collection-icon';

interface ExploreHubProps {
  counts: Record<string, number>;
}


const CollectionCard = ({
  collection,
  count,
  index,
}: {
  collection: Collection;
  count: number;
  index: number;
}) => {
  const { locale, dictionary } = useLanguage();

  return (
    <Link href={`/explore/${collection.slug}`} className="group block">
      <article
        className="flex h-full cursor-pointer flex-col rounded-[20px] border border-border p-5 transition-all duration-200 hover:-translate-y-1 hover:bg-muted hover:shadow-md"
      >
        <div className="flex items-start gap-3">
          <CollectionIcon icon={collection.icon} className="h-7 w-7 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-foreground text-lg font-bold">
              {collection.name[locale]}
            </h3>
            <p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-relaxed">
              {collection.description[locale]}
            </p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="bg-muted text-muted-foreground rounded-full px-3 py-0.5 text-xs font-semibold">
            {count.toLocaleString()} {collection.type === 'root' ? dictionary.searchRoots.toLowerCase() : dictionary.words}
          </span>
          <span
            className="text-muted-foreground flex h-7 w-7 items-center justify-center rounded-full border border-border opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        </div>
      </article>
    </Link>
  );
};

export const ExploreHub = ({ counts }: ExploreHubProps) => {
  const { locale, dictionary } = useLanguage();

  return (
    <div className="space-y-12">
      {/* Page header */}
      <header className="space-y-3">
        <h1 className="font-heading text-foreground text-4xl font-bold sm:text-5xl">
          <span className="mr-3 inline-block">📋</span>
          {dictionary.explore}
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          {dictionary.exploreSubtitle}
        </p>
      </header>

      {/* Category sections */}
      {COLLECTION_CATEGORIES.map((cat) => {
        const items = getCollectionsByCategory(cat.key);
        if (items.length === 0) return null;

        return (
          <section key={cat.key}>
            <h2 className="text-foreground border-border mb-5 border-b pb-2 text-lg font-bold">
              {cat.label[locale]}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((c, i) => (
                <CollectionCard
                  key={c.slug}
                  collection={c}
                  count={counts[c.slug] ?? 0}
                  index={i}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
