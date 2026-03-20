'use client';

import type { RootEntry, WordEntry } from '@/types/content';
import { HeroSection } from './hero-section';
import { StatsSection } from './stats-section';
import { BreakdownSection } from './breakdown-section';
import { ExploreSection } from './explore-section';
import { ReadingSection } from './reading-section';
import { RootsSection } from './roots-section';
import { CtaSection } from './cta-section';

interface HomeScreenProps {
  roots: RootEntry[];
  totalRoots: number;
  totalWords: number;
  totalExamples: number;
  totalTags: number;
  breakdownWords: WordEntry[];
}

/** Full-bleed wrapper that breaks out of the max-w container */
function FullBleed({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative py-16 sm:py-20 ${className}`}
      style={{
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
      }}
    >
      <div className="mx-auto w-full max-w-5xl px-4">{children}</div>
    </div>
  );
}

export const HomeScreen = ({
  roots,
  totalRoots,
  totalWords,
  totalExamples,
  totalTags,
  breakdownWords,
}: HomeScreenProps) => {
  return (
    <div>
      {/* Hero — full bleed, own background */}
      <HeroSection />

      {/* Stats — default bg */}
      <div className="py-16 sm:py-20">
        <StatsSection
          totalRoots={totalRoots}
          totalWords={totalWords}
          totalExamples={totalExamples}
          totalTags={totalTags}
        />
      </div>

      {/* Breakdown — subtle card-like bg band */}
      <FullBleed className="bg-card/50">
        <BreakdownSection words={breakdownWords} />
      </FullBleed>

      {/* Explore — default bg */}
      <div className="py-16 sm:py-20">
        <ExploreSection />
      </div>

      {/* Reading — subtle bg band */}
      <FullBleed className="bg-card/50">
        <ReadingSection />
      </FullBleed>

      {/* Roots — default bg */}
      <div className="py-16 sm:py-20">
        <RootsSection roots={roots} totalRoots={totalRoots} />
      </div>

      {/* CTA — subtle bg band */}
      <FullBleed className="bg-card/50">
        <CtaSection />
      </FullBleed>
    </div>
  );
};
