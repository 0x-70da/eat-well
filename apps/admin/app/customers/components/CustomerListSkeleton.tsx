import { Skeleton } from "@workspace/ui/components/skeleton";

export function CustomerListSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-44" />
      <div className="space-y-4 rounded-xl border border-border bg-card p-6">
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
