import { Skeleton } from "@workspace/ui/components/skeleton";

export function OrderTrackSkeleton() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-8">
      <Skeleton className="h-12 w-full max-w-xl mx-auto rounded-2xl" />
      <Skeleton className="h-96 w-full rounded-3xl" />
    </div>
  );
}
