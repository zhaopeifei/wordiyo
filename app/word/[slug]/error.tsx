'use client';

import Link from 'next/link';

export default function WordDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-20 text-center">
      <p className="text-destructive text-lg font-medium">
        Something went wrong loading this word.
      </p>
      <p className="text-muted-foreground mt-2 text-sm">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 py-2 text-sm font-medium transition-colors"
        >
          Try again
        </button>
        <Link
          href="/root"
          className="border-border text-foreground hover:text-primary rounded-full border px-5 py-2 text-sm font-medium transition-colors"
        >
          Back to roots
        </Link>
      </div>
    </div>
  );
}
