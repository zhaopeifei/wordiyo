export default function RootDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-10 px-4 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <div className="bg-muted h-4 w-16 animate-pulse rounded" />
        <div className="bg-muted h-4 w-4 animate-pulse rounded" />
        <div className="bg-muted h-4 w-16 animate-pulse rounded" />
        <div className="bg-muted h-4 w-4 animate-pulse rounded" />
        <div className="bg-muted h-4 w-24 animate-pulse rounded" />
      </div>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-end gap-3">
          <div className="bg-muted h-12 w-40 animate-pulse rounded-lg" />
          <div className="bg-muted h-6 w-20 animate-pulse rounded-full" />
        </div>
        <div className="flex gap-2">
          <div className="bg-muted h-9 w-24 animate-pulse rounded-full" />
          <div className="bg-muted h-9 w-24 animate-pulse rounded-full" />
        </div>
      </div>

      {/* Info card */}
      <div className="border-border rounded-[20px] border p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="bg-muted h-3 w-20 animate-pulse rounded" />
              <div className="flex gap-2">
                <div className="bg-muted h-7 w-16 animate-pulse rounded-full" />
                <div className="bg-muted h-7 w-20 animate-pulse rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Origin Summary */}
      <div className="space-y-2">
        <div className="bg-muted h-7 w-24 animate-pulse rounded-lg" />
        <div className="bg-muted h-5 w-full animate-pulse rounded" />
        <div className="bg-muted h-5 w-5/6 animate-pulse rounded" />
      </div>

      {/* Overview */}
      <div className="space-y-2">
        <div className="bg-muted h-7 w-32 animate-pulse rounded-lg" />
        <div className="bg-muted h-5 w-full animate-pulse rounded" />
        <div className="bg-muted h-5 w-3/4 animate-pulse rounded" />
      </div>

      {/* Associated Words */}
      <div className="space-y-4">
        <div className="bg-muted h-7 w-40 animate-pulse rounded-lg" />
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
    </div>
  );
}
