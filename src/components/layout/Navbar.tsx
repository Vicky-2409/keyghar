"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, ChevronDown, ShieldCheck } from "lucide-react";
import { CITIES, DEFAULT_CITY, BRAND_STATS } from "@/lib/constants";
import { useEffect, useState } from "react";
import { getWishlist } from "@/lib/wishlist";
import { cn } from "@/lib/cn";
import { ContactPassBadge } from "@/components/layout/ContactPassBadge";
import { BrandLogo } from "@/components/layout/BrandLogo";

export function Navbar() {
  const pathname = usePathname();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [city, setCity] = useState(DEFAULT_CITY);

  useEffect(() => {
    const update = () => setWishlistCount(getWishlist().length);
    update();
    window.addEventListener("wishlist-updated", update);
    return () => window.removeEventListener("wishlist-updated", update);
  }, []);

  const isRent =
    pathname === "/" ||
    pathname.startsWith("/search") ||
    pathname.startsWith("/property") ||
    pathname.includes("bhk");

  return (
    <header className="sticky top-0 z-50 border-b border-[#dde3eb] bg-white shadow-sm">
      <div className="hidden border-b border-[#e8ecf1] bg-[#1a1a2e] sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-[11px] text-white/90">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[#4ade80]" />
            Verified listings · Zero brokerage on select homes
          </span>
          <span>
            {BRAND_STATS.listings} properties · {BRAND_STATS.cities} cities
          </span>
        </div>
      </div>
      <div className="mx-auto flex h-[3.75rem] max-w-7xl items-center justify-between gap-4 px-4">
        <BrandLogo />

        <nav className="hidden items-center gap-0.5 md:flex">
          <Link
            href="/search"
            className={cn(
              "rounded-md px-4 py-2 text-sm font-semibold transition-colors",
              isRent ? "bg-primary/10 text-primary" : "text-[#444] hover:bg-[#f4f6f8] hover:text-primary"
            )}
          >
            Rent
          </Link>
          <Link
            href="/search"
            className="rounded-md px-4 py-2 text-sm font-semibold text-[#444] transition-colors hover:bg-[#f4f6f8] hover:text-primary"
          >
            Buy
          </Link>
          <Link
            href="/search?propertyType=pg"
            className="rounded-md px-4 py-2 text-sm font-semibold text-[#444] transition-colors hover:bg-[#f4f6f8] hover:text-primary"
          >
            PG / Hostel
          </Link>
          <Link
            href="/saved"
            className="rounded-md px-4 py-2 text-sm font-semibold text-[#444] transition-colors hover:bg-[#f4f6f8] hover:text-primary"
          >
            Shortlist
          </Link>
          <Link
            href="/blog"
            className="rounded-md px-4 py-2 text-sm font-semibold text-[#444] transition-colors hover:bg-[#f4f6f8] hover:text-primary"
          >
            Guides
          </Link>
          <Link
            href="/about"
            className="rounded-md px-4 py-2 text-sm font-semibold text-[#444] transition-colors hover:bg-[#f4f6f8] hover:text-primary"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ContactPassBadge />
          <div className="relative hidden sm:block">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="appearance-none rounded-md border border-[#dde3eb] bg-white py-2 pl-3 pr-8 text-sm font-medium text-[#333] shadow-sm"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666]" />
          </div>
          <Link href="/saved" className="relative rounded-md p-2 text-[#555] hover:bg-[#f4f6f8] hover:text-primary">
            <Heart className={cn("h-5 w-5", wishlistCount > 0 && "fill-accent text-accent")} />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            href={`/search?city=${encodeURIComponent(city)}`}
            className="hidden rounded-md bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-sm hover:bg-[#c41a20] sm:inline-flex"
          >
            Search
          </Link>
        </div>
      </div>
    </header>
  );
}
