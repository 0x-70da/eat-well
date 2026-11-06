export function MyOrdersSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 bg-muted rounded-xl w-48" />
        <div className="h-4 bg-muted rounded-lg w-72" />
      </div>
      <div className="space-y-4">
        <div className="h-44 bg-muted rounded-3xl" />
        <div className="h-44 bg-muted rounded-3xl" />
        <div className="h-44 bg-muted rounded-3xl" />
      </div>
    </div>
  );
}
