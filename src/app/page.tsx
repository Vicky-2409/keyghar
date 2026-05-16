import type { Metadata } from "next";
import { HomePageClient } from "@/components/home/HomePageClient";
import { generateListings } from "@/lib/generateListing";
import { BRAND_NAME, BRAND_TAGLINE, DEFAULT_CITY, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${BRAND_NAME} — Flats, Houses & PG for Rent in India`,
  description: BRAND_TAGLINE,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${BRAND_NAME} — Rental Homes`,
    description: BRAND_TAGLINE,
    url: SITE_URL,
    siteName: BRAND_NAME,
    type: "website",
  },
};

export default function HomePage() {
  const featured = generateListings({
    city: DEFAULT_CITY,
    page: 0,
    pageSize: 6,
    sort: "relevance",
  });

  return <HomePageClient initialFeatured={featured} />;
}
