"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { generateListings } from "@/lib/generateListing";
import type { Property, SearchContext } from "@/lib/types";

export function useInfiniteListings(context: SearchContext) {
  const [listings, setListings] = useState<Property[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);
  const contextKey = JSON.stringify({
    city: context.city,
    locality: context.locality,
    filters: context.filters,
    sort: context.sort,
    query: context.query,
  });

  const loadPage = useCallback(
    async (pageNum: number, reset = false) => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 300));
      const ctx: SearchContext = JSON.parse(contextKey);
      const batch = generateListings({
        ...ctx,
        page: pageNum,
        pageSize: 24,
      });
      setListings((prev) => (reset ? batch : [...prev, ...batch]));
      setHasMore(pageNum < 12);
      setLoading(false);
    },
    [contextKey]
  );

  useEffect(() => {
    setPage(0);
    setListings([]);
    setHasMore(true);
    loadPage(0, true);
  }, [contextKey, loadPage]);

  useEffect(() => {
    if (page === 0) return;
    loadPage(page, false);
  }, [page, loadPage]);

  useEffect(() => {
    const el = observerRef.current;
    if (!el || loading || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loading && hasMore) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading, hasMore]);

  return { listings, loading, hasMore, observerRef, page };
}
