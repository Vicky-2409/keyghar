import { notFound } from "next/navigation";
import { Suspense } from "react";
import { parseSeoSlug, seoSlugToTitle, isValidSeoSlug } from "@/lib/parseSeoSlug";
import { parsedToFilters } from "@/lib/parseQuery";
import { SearchResults } from "@/components/search/SearchResults";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { BRAND_NAME, SITE_URL } from "@/lib/constants";
import type { Metadata } from "next";

type Props = { params: Promise<{ seoSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seoSlug } = await params;
  const parsed = parseSeoSlug(seoSlug);
  if (!parsed) return { title: "Not Found" };
  const title = seoSlugToTitle(parsed);
  return {
    title: `${title} | ${BRAND_NAME}`,
    description: `Browse ${title.toLowerCase()}. Verified listings with photos, prices, and owner contact.`,
    alternates: { canonical: `${SITE_URL}/${seoSlug}` },
  };
}

function SeoSearchContent({ seoSlug }: { seoSlug: string }) {
  const parsed = parseSeoSlug(seoSlug);
  if (!parsed) notFound();

  const filters = parsedToFilters(parsed);
  const initialQuery = [
    parsed.bedrooms ? `${parsed.bedrooms} BHK` : "",
    parsed.propertyType ?? "properties",
    parsed.locality ? `in ${parsed.locality}` : parsed.city ? `in ${parsed.city}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <SearchResults
      initialQuery={initialQuery}
      initialCity={parsed.city}
      initialLocality={parsed.locality}
      initialFilters={filters}
      title={seoSlugToTitle(parsed)}
    />
  );
}

export default async function SeoPage({ params }: Props) {
  const { seoSlug } = await params;
  if (!isValidSeoSlug(seoSlug)) notFound();

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      }
    >
      <SeoSearchContent seoSlug={seoSlug} />
    </Suspense>
  );
}
