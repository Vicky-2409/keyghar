"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

type Chip = { label: string; href: string; match?: string };

function buildChips(city: string): Chip[] {
  const c = encodeURIComponent(city);
  return [
    { label: "All", href: `/search?city=${c}`, match: "search" },
    { label: "1 BHK", href: "/1-bhk-apartments-flats-for-rent-in-chennai", match: "1-bhk" },
    { label: "2 BHK", href: "/2-bhk-apartments-flats-for-rent-in-chennai", match: "2-bhk" },
    { label: "3 BHK", href: "/3-bhk-apartments-flats-for-rent-in-chennai", match: "3-bhk" },
    {
      label: "Furnished",
      href: `/search?city=${c}&furnishing=furnished`,
      match: "furnishing=furnished",
    },
    {
      label: "Semi Furnished",
      href: `/search?city=${c}&furnishing=semi-furnished`,
      match: "semi-furnished",
    },
    {
      label: "Verified",
      href: `/search?city=${c}&verifiedOnly=true`,
      match: "verifiedOnly",
    },
  ];
}

export function FilterChips({ city }: { city: string }) {
  const pathname = usePathname();
  const chips = buildChips(city);

  return (
    <div className="flex gap-2 overflow-x-auto border-b border-[#e0e0e0] bg-white px-4 py-2 scrollbar-hide">
      {chips.map((chip) => {
        const active =
          (chip.match && pathname.includes(chip.match)) ||
          (chip.label === "All" && pathname === "/search");
        return (
          <Link
            key={chip.label}
            href={chip.href}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-xs font-semibold",
              active
                ? "border-primary bg-primary text-white"
                : "border-[#ddd] bg-white text-[#444] hover:border-primary hover:text-primary"
            )}
          >
            {chip.label}
          </Link>
        );
      })}
    </div>
  );
}
