"use client";

import { useMemo, useState } from "react";
import { useQueryStates, parseAsString, parseAsInteger, parseAsBoolean } from "nuqs";
import { SlidersHorizontal, X } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { FilterSidebar } from "./FilterSidebar";
import { PropertyList } from "./PropertyList";
import { SkeletonListRow } from "@/components/ui/SkeletonListRow";
import { FilterChips } from "./FilterChips";
import { useInfiniteListings } from "@/hooks/useInfiniteListings";
import { parseQuery, parsedToFilters } from "@/lib/parseQuery";
import { estimateCount } from "@/lib/generateListing";
import type { PropertyFilters, SortOption } from "@/lib/types";
import { DEFAULT_CITY, EMPTY_FILTERS } from "@/lib/constants";

type SearchResultsProps = {
  initialQuery?: string;
  initialCity?: string;
  initialLocality?: string;
  initialFilters?: PropertyFilters;
  title?: string;
};

export function SearchResults({
  initialQuery = "",
  initialCity = DEFAULT_CITY,
  initialLocality,
  initialFilters = EMPTY_FILTERS,
  title,
}: SearchResultsProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState<SortOption>("relevance");

  const [q, setQ] = useQueryStates({
    q: parseAsString.withDefault(initialQuery),
    city: parseAsString.withDefault(initialCity),
    locality: parseAsString,
    maxBudget: parseAsInteger,
    bedrooms: parseAsInteger,
    propertyType: parseAsString,
    furnishing: parseAsString,
    parking: parseAsBoolean,
    lift: parseAsBoolean,
    petFriendly: parseAsBoolean,
    bachelorAllowed: parseAsBoolean,
    familyPreferred: parseAsBoolean,
    immediateMoveIn: parseAsBoolean,
    verifiedOnly: parseAsBoolean,
    metroNearby: parseAsBoolean,
    gatedCommunity: parseAsBoolean,
  });

  const parsed = useMemo(() => parseQuery(q.q || "", q.city || DEFAULT_CITY), [q.q, q.city]);

  const filters: PropertyFilters = useMemo(
    () => ({
      ...initialFilters,
      ...parsedToFilters(parsed),
      maxBudget: q.maxBudget ?? initialFilters.maxBudget ?? parsed.maxBudget,
      minBudget: parsed.minBudget,
      bedrooms: q.bedrooms ?? initialFilters.bedrooms ?? parsed.bedrooms,
      propertyType:
        (q.propertyType as PropertyFilters["propertyType"]) ??
        initialFilters.propertyType ??
        parsed.propertyType,
      furnishing:
        (q.furnishing as PropertyFilters["furnishing"]) ?? initialFilters.furnishing,
      parking: q.parking ?? undefined,
      lift: q.lift ?? undefined,
      petFriendly: q.petFriendly ?? undefined,
      bachelorAllowed: q.bachelorAllowed ?? undefined,
      familyPreferred: q.familyPreferred ?? undefined,
      immediateMoveIn: q.immediateMoveIn ?? undefined,
      verifiedOnly: q.verifiedOnly ?? undefined,
      metroNearby: q.metroNearby ?? undefined,
      gatedCommunity: q.gatedCommunity ?? undefined,
    }),
    [q, parsed, initialFilters]
  );

  const city = q.city || parsed.city || initialCity;
  const locality = q.locality || initialLocality || parsed.locality;

  const context = useMemo(
    () => ({ city, locality, filters, sort, query: q.q }),
    [city, locality, filters, sort, q.q]
  );

  const { listings, loading, hasMore, observerRef } = useInfiniteListings(context);
  const count = estimateCount(context);

  const handleFilterChange = (newFilters: PropertyFilters) => {
    setQ({
      maxBudget: newFilters.maxBudget ?? null,
      bedrooms: newFilters.bedrooms ?? null,
      propertyType: newFilters.propertyType ?? null,
      furnishing: newFilters.furnishing ?? null,
      parking: newFilters.parking ?? null,
      lift: newFilters.lift ?? null,
      petFriendly: newFilters.petFriendly ?? null,
      bachelorAllowed: newFilters.bachelorAllowed ?? null,
      familyPreferred: newFilters.familyPreferred ?? null,
      immediateMoveIn: newFilters.immediateMoveIn ?? null,
      verifiedOnly: newFilters.verifiedOnly ?? null,
      metroNearby: newFilters.metroNearby ?? null,
      gatedCommunity: newFilters.gatedCommunity ?? null,
    });
  };

  const headerTitle =
    title ??
    `${count}+ Properties${locality ? ` in ${locality}` : ""}${city ? `, ${city}` : ""}`;

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24 md:pb-8">
      <div className="sticky top-14 z-30 border-b border-[#e0e0e0] bg-white px-4 py-3 shadow-sm">
        <SearchBar defaultQuery={q.q} defaultCity={city} compact />
      </div>
      <FilterChips city={city} />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">{headerTitle}</h1>
            {q.q && (
              <p className="text-sm text-muted-foreground mt-1">
                Showing results for &quot;{q.q}&quot;
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
            >
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium md:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-8">
          <div className="hidden w-72 shrink-0 md:block">
            <div className="sticky top-36 rounded border border-[#e0e0e0] bg-white p-5 shadow-sm">
              <h2 className="font-semibold mb-4">Filters</h2>
              <FilterSidebar filters={filters} onChange={handleFilterChange} />
            </div>
          </div>

          <div className="flex-1">
            {loading && listings.length === 0 ? (
              <div className="overflow-hidden rounded border border-[#e0e0e0] bg-white">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonListRow key={i} />
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                <p className="font-semibold">No properties match your filters</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try broadening your search or clearing some filters.
                </p>
                <button
                  onClick={() => handleFilterChange({})}
                  className="mt-4 text-sm font-medium text-primary hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <PropertyList listings={listings} />
            )}
            {loading && listings.length > 0 && (
              <div className="mt-4 overflow-hidden rounded border border-[#e0e0e0] bg-white">
                {Array.from({ length: 2 }).map((_, i) => (
                  <SkeletonListRow key={`sk-${i}`} />
                ))}
              </div>
            )}
            {hasMore && <div ref={observerRef} className="h-8 mt-8" />}
          </div>
        </div>
      </div>

      {filterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setFilterOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Filters</h2>
              <button onClick={() => setFilterOpen(false)} aria-label="Close filters">
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterSidebar filters={filters} onChange={handleFilterChange} />
            <button
              onClick={() => setFilterOpen(false)}
              className="mt-6 w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
