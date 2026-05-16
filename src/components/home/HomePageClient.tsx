"use client";

import { useState } from "react";
import { Hero } from "@/components/home/Hero";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { TrendingSearches } from "@/components/home/TrendingSearches";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { TrustSection } from "@/components/home/TrustSection";
import { DEFAULT_CITY } from "@/lib/constants";
import type { Property } from "@/lib/types";

export function HomePageClient({
  initialFeatured,
}: {
  initialFeatured: Property[];
}) {
  const [city, setCity] = useState(DEFAULT_CITY);

  return (
    <>
      <Hero city={city} onCityChange={setCity} />
      <CategoryStrip />
      <TrendingSearches city={city} />
      <TrustSection />
      <FeaturedProperties city={city} initialListings={initialFeatured} />
    </>
  );
}
