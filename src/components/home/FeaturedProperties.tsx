"use client";

import { useMemo } from "react";
import { PropertyList } from "@/components/search/PropertyList";
import Link from "next/link";
import type { Property } from "@/lib/types";
import { generateListings } from "@/lib/generateListing";

export function FeaturedProperties({
  city,
  initialListings,
}: {
  city: string;
  initialListings?: Property[];
}) {
  const listings = useMemo(
    () =>
      generateListings({
        city,
        page: 0,
        pageSize: 6,
        sort: "relevance",
      }),
    [city]
  );

  return (
    <section className="bg-[#f4f6f8] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4 rounded-t-xl border border-[#dde3eb] bg-white px-4 py-3 shadow-sm">
          <h2 className="text-lg font-bold">Featured Properties in {city}</h2>
          <Link
            href={`/search?city=${encodeURIComponent(city)}`}
            className="text-sm font-semibold text-primary hover:underline"
          >
            View all →
          </Link>
        </div>
        <PropertyList listings={listings} />
      </div>
    </section>
  );
}
