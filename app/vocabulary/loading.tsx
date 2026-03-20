export default function VocabularyLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="bg-muted h-10 w-48 animate-pulse rounded-lg" />
        <div className="bg-muted h-5 w-72 animate-pulse rounded" />
      </div>

      {/* Tabs */}
      <div className="bg-muted h-10 w-40 animate-pulse rounded-full" />

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border-border h-20 animate-pulse rounded-[16px] border" />
        ))}
      </div>

      {/* Word cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border-border h-[170px] animate-pulse rounded-[20px] border p-5">
            <div className="bg-muted h-6 w-32 rounded" />
            <div className="bg-muted mt-3 h-4 w-full rounded" />
            <div className="bg-muted mt-2 h-4 w-2/3 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
