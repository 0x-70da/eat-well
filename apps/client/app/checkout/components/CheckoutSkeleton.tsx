import { Skeleton } from "@workspace/ui/components/skeleton";

export function CheckoutSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Skeleton className="h-10 w-64 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="h-96 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
