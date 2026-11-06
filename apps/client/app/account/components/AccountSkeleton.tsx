export function AccountSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8 animate-pulse">
      <div className="h-40 bg-muted rounded-3xl" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-32 bg-muted rounded-3xl" />
        <div className="h-32 bg-muted rounded-3xl" />
        <div className="h-32 bg-muted rounded-3xl" />
      </div>
    </div>
  );
}
