import { cn } from "@/lib/cn";

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
        className
      )}
    >
      <div className="aspect-[4/3] shimmer" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded-lg shimmer" />
        <div className="h-3 w-1/2 rounded-lg shimmer" />
        <div className="h-5 w-1/3 rounded-lg shimmer" />
        <div className="flex gap-2">
          <div className="h-3 w-20 rounded shimmer" />
          <div className="h-3 w-24 rounded shimmer" />
        </div>
      </div>
    </div>
  );
}
