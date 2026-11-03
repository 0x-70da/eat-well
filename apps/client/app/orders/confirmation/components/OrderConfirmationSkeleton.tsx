import { Skeleton } from "@workspace/ui/components/skeleton";

export function OrderConfirmationSkeleton() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
      <Skeleton className="w-20 h-20 rounded-full mx-auto" />
      <Skeleton className="h-8 w-64 mx-auto" />
      <Skeleton className="h-4 w-96 mx-auto" />
      <Skeleton className="h-48 rounded-3xl" />
    </div>
  );
}
