import { HomePageClient } from "@/components/home/HomePageClient";
import { generateListings } from "@/lib/generateListing";
import { DEFAULT_CITY } from "@/lib/constants";

export default function HomePage() {
  const featured = generateListings({
    city: DEFAULT_CITY,
    page: 0,
    pageSize: 6,
    sort: "relevance",
  });

  return <HomePageClient initialFeatured={featured} />;
}
