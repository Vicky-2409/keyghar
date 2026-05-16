import Link from "next/link";
import { BRAND_NAME, BRAND_SHORT } from "@/lib/constants";
import { cn } from "@/lib/cn";

export function BrandLogo({
  className,
  compact,
  variant = "light",
}: {
  className?: string;
  compact?: boolean;
  variant?: "light" | "dark";
}) {
  const onDark = variant === "dark";

  return (
    <Link href="/" className={cn("flex shrink-0 items-center gap-2.5", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-black text-white shadow-sm">
        {BRAND_SHORT}
      </span>
      {!compact && (
        <span className="flex flex-col leading-tight">
          <span
            className={cn(
              "text-xl font-extrabold tracking-tight",
              onDark ? "text-white" : "text-[#1a1a2e]"
            )}
          >
            {BRAND_NAME}
          </span>
          <span
            className={cn(
              "text-[9px] font-semibold uppercase tracking-[0.2em]",
              onDark ? "text-white/60" : "text-[#0065B3]"
            )}
          >
            Rent · Buy · PG
          </span>
        </span>
      )}
    </Link>
  );
}
