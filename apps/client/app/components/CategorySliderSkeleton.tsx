import { Skeleton } from "@workspace/ui/components/skeleton";

export function CategorySliderSkeleton() {
  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex justify-between items-end">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 rounded-2xl border border-border bg-card flex flex-col items-center space-y-3">
            <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}
