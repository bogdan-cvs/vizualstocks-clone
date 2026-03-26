export default function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="bg-[#1a1d27] border border-[#2d3039] rounded-xl p-5 animate-pulse">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-lg bg-[#252830]" />
          <div className="flex-1 space-y-2">
            <div className="h-6 w-48 bg-[#252830] rounded" />
            <div className="h-4 w-72 bg-[#252830] rounded" />
          </div>
        </div>
      </div>
      {/* Chart grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#1a1d27] border border-[#2d3039] rounded-xl p-5 animate-pulse"
          >
            <div className="flex justify-between mb-4">
              <div className="h-4 w-32 bg-[#252830] rounded" />
              <div className="h-6 w-36 bg-[#252830] rounded" />
            </div>
            <div className="h-64 bg-[#252830] rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
