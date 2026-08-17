export function CurrentSkeleton() {
  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="skeleton h-5 w-48 rounded-lg" />
          <div className="flex items-end gap-4 mt-4">
            <div className="skeleton w-16 h-16 rounded-3xl" />
            <div className="flex-1">
              <div className="skeleton h-16 w-32 rounded-lg" />
              <div className="skeleton h-4 w-28 rounded-lg mt-2" />
            </div>
          </div>
          <div className="skeleton h-4 w-64 rounded-lg mt-4" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="skeleton h-10 w-40 rounded-xl" />
          <div className="skeleton h-10 w-40 rounded-xl" />
          <div className="skeleton h-10 w-40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function MetricsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="glass rounded-2xl p-4 min-h-[140px]">
          <div className="skeleton h-4 w-20 rounded-lg" />
          <div className="skeleton h-8 w-16 rounded-lg mt-4" />
          <div className="skeleton h-1.5 w-full rounded-full mt-3" />
        </div>
      ))}
    </div>
  );
}

export function ForecastSkeleton() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="skeleton h-4 w-24 rounded-lg mb-4" />
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1 min-w-[52px]">
            <div className="skeleton h-3 w-10 rounded" />
            <div className="skeleton w-5 h-5 rounded-full" />
            <div className="skeleton h-4 w-8 rounded" />
          </div>
        ))}
      </div>
      <div className="skeleton h-24 w-full rounded-lg mt-3" />
    </div>
  );
}

export function DailySkeleton() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="skeleton h-4 w-28 rounded-lg mb-4" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="skeleton h-4 w-10 rounded" />
            <div className="skeleton w-5 h-5 rounded-full" />
            <div className="skeleton h-4 flex-1 rounded" />
            <div className="skeleton h-1.5 w-24 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
