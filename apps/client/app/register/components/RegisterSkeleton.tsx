export function RegisterSkeleton() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-md animate-pulse">
      <div className="bg-card border border-border/80 rounded-3xl p-8 space-y-6">
        <div className="w-12 h-12 bg-muted rounded-2xl mx-auto" />
        <div className="h-6 bg-muted rounded-lg w-1/2 mx-auto" />
        <div className="h-4 bg-muted rounded-lg w-3/4 mx-auto" />
        <div className="space-y-4 pt-4">
          <div className="h-10 bg-muted rounded-xl" />
          <div className="h-10 bg-muted rounded-xl" />
          <div className="h-10 bg-muted rounded-xl" />
          <div className="h-10 bg-muted rounded-xl" />
          <div className="h-12 bg-muted rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
