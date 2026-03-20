export default function WordDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-10 px-4 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <div className="bg-muted h-4 w-16 animate-pulse rounded" />
        <div className="bg-muted h-4 w-4 animate-pulse rounded" />
        <div className="bg-muted h-4 w-24 animate-pulse rounded" />
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="bg-muted h-10 w-48 animate-pulse rounded-lg" />
        <div className="flex gap-2">
          <div className="bg-muted h-8 w-20 animate-pulse rounded-full" />
          <div className="bg-muted h-8 w-20 animate-pulse rounded-full" />
        </div>
      </div>

      {/* Pronunciation pills */}
      <div className="flex gap-3">
        <div className="bg-muted h-10 w-40 animate-pulse rounded-full" />
        <div className="bg-muted h-10 w-40 animate-pulse rounded-full" />
      </div>

      {/* Definition card */}
      <div className="border-border rounded-[20px] border p-6">
        <div className="bg-muted h-3 w-24 animate-pulse rounded" />
        <div className="bg-muted mt-3 h-7 w-full animate-pulse rounded" />
        <div className="bg-muted mt-2 h-5 w-2/3 animate-pulse rounded" />
      </div>

      {/* Morpheme breakdown */}
      <div className="space-y-4">
        <div className="bg-muted h-7 w-40 animate-pulse rounded-lg" />
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted h-16 w-24 animate-pulse rounded-2xl" />
          ))}
        </div>
        <div className="bg-muted h-5 w-full animate-pulse rounded" />
        <div className="bg-muted h-5 w-3/4 animate-pulse rounded" />
      </div>

      {/* Examples */}
      <div className="space-y-4">
        <div className="bg-muted h-7 w-24 animate-pulse rounded-lg" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="bg-muted h-7 w-7 shrink-0 animate-pulse rounded-full" />
            <div className="flex-1 space-y-1">
              <div className="bg-muted h-5 w-full animate-pulse rounded" />
              <div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
