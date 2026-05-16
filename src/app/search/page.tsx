import { Suspense } from "react";
import { SearchResults } from "@/components/search/SearchResults";
import { SkeletonCard } from "@/components/ui/SkeletonCard";

import type { Metadata } from "next";
import { BRAND_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Search Rentals — Flats, PG & Houses`,
  description: `Search rental homes across India on ${BRAND_NAME}. Filter by city, BHK, budget, and furnishing.`,
  alternates: { canonical: `${SITE_URL}/search` },
};

function SearchFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchResults />
    </Suspense>
  );
}
