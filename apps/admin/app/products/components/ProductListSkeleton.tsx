import { Skeleton } from "@workspace/ui/components/skeleton";

export function ProductListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="space-y-4 rounded-xl border border-border bg-card p-6">
        <Skeleton className="h-9 w-64" />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
