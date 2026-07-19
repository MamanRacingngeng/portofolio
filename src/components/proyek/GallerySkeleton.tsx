export function GallerySkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-72 rounded-3xl border-[3px] border-border bg-accent-2/40 sm:h-96" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-80 rounded-3xl border-[3px] border-border bg-accent-2/30" />
        <div className="h-80 rounded-3xl border-[3px] border-border bg-accent-2/30" />
        <div className="h-80 rounded-3xl border-[3px] border-border bg-accent-2/30" />
      </div>
    </div>
  );
}
