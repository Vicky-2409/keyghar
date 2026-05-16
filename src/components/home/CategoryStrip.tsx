"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const CATEGORIES = [
  { label: "Apartments / Flats", href: "/search" },
  { label: "1 BHK", href: "/1-bhk-apartments-flats-for-rent-in-chennai" },
  { label: "2 BHK", href: "/2-bhk-apartments-flats-for-rent-in-chennai" },
  { label: "3 BHK", href: "/3-bhk-apartments-flats-for-rent-in-chennai" },
  { label: "Fully Furnished", href: "/search?furnishing=furnished" },
  { label: "Semi Furnished", href: "/search?furnishing=semi-furnished" },
];

export function CategoryStrip() {
  const pathname = usePathname();

  return (
    <div className="border-b border-[#e0e0e0] bg-white">
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
              pathname === cat.href
                ? "border-primary bg-primary text-white"
                : "border-[#ddd] bg-white text-[#444] hover:border-primary hover:text-primary"
            )}
          >
            {cat.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
