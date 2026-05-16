import { Suspense } from "react";
import { SearchResults } from "@/components/search/SearchResults";
import { SkeletonCard } from "@/components/ui/SkeletonCard";

export const metadata = {
  title: "Search Rentals",
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
