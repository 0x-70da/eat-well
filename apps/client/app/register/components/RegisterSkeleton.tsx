export function RegisterSkeleton() {
  return (
    <div className="container mx-auto max-w-md animate-pulse px-4 py-16">
      <div className="space-y-6 rounded-3xl border border-border/80 bg-card p-8">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-muted" />
        <div className="mx-auto h-6 w-1/2 rounded-lg bg-muted" />
        <div className="mx-auto h-4 w-3/4 rounded-lg bg-muted" />
        <div className="space-y-4 pt-4">
          <div className="h-10 rounded-xl bg-muted" />
          <div className="h-10 rounded-xl bg-muted" />
          <div className="h-10 rounded-xl bg-muted" />
          <div className="h-10 rounded-xl bg-muted" />
          <div className="h-12 rounded-2xl bg-muted" />
        </div>
      </div>
    </div>
  );
}
