import { cn } from "@/lib/cn";

export function SkeletonListRow({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col border-b border-[#e0e0e0] sm:flex-row", className)}>
      <div className="aspect-[4/3] w-full shrink-0 shimmer sm:w-72 sm:min-h-[200px]" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-4 w-3/4 rounded shimmer" />
        <div className="h-3 w-1/2 rounded shimmer" />
        <div className="h-6 w-1/3 rounded shimmer" />
        <div className="mt-auto flex gap-2">
          <div className="h-9 w-28 rounded shimmer" />
          <div className="h-9 w-28 rounded shimmer" />
        </div>
      </div>
    </div>
  );
}
