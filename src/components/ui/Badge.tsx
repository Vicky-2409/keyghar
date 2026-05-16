import { cn } from "@/lib/cn";
import type { Badge as BadgeType } from "@/lib/types";

const styles: Record<BadgeType, string> = {
  VERIFIED: "bg-emerald-500/90 text-white",
  FEATURED: "bg-amber-500/90 text-white",
  HOT_DEAL: "bg-rose-500/90 text-white",
};

export function Badge({ type, className }: { type: BadgeType; className?: string }) {
  return (
    <span
      className={cn(
        "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        styles[type],
        className
      )}
    >
      {type.replace("_", " ")}
    </span>
  );
}
