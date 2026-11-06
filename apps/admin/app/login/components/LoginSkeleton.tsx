import { Skeleton } from "@workspace/ui/components/skeleton";

export function LoginSkeleton() {
  return (
    <div className="mx-auto w-full max-w-md space-y-6 rounded-2xl border border-border/40 bg-card p-8 shadow-sm">
      <div className="flex flex-col items-center space-y-3">
        <Skeleton className="h-14 w-14 rounded-2xl" />
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  );
}
