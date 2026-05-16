import { notFound } from "next/navigation";
import { listingFromSlug } from "@/lib/generateListing";
import { PropertyDetailClient } from "@/components/property/PropertyDetailClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { BRAND_NAME, SITE_URL } from "@/lib/constants";
import seoPages from "@/data/seoPages.json";

function localitySeoPath(locality: string, city: string): string {
  const ls = locality.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const pages = seoPages as string[];
  const match =
    pages.find((p) => p.includes(ls) && p.includes("bhk")) ??
    pages.find((p) => p.endsWith(`-${ls}`)) ??
    `flats-for-rent-in-${city.toLowerCase()}`;
  return `/${match}`;
}
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = listingFromSlug(slug);
  const title = `${property.title} — ${property.locality}, ${property.city}`;
  const canonical = `${SITE_URL}/property/${slug}`;

  return {
    title,
    description: property.description.slice(0, 160),
    alternates: { canonical },
    openGraph: {
      title: property.title,
      description: `Rent from ₹${property.price}/mo in ${property.locality}, ${property.city}`,
      images: property.images[0] ? [{ url: property.images[0] }] : undefined,
      url: canonical,
    },
  };
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  if (!slug) notFound();

  const property = listingFromSlug(slug);

  const listingJsonLd = {
    "@context": "https://schema.org",
    "@type": "Apartment",
    name: property.title,
    description: property.description,
    numberOfRooms: property.bedrooms || undefined,
    floorSize: { "@type": "QuantitativeValue", value: property.sqft, unitCode: "FTK" },
    address: {
      "@type": "PostalAddress",
      addressLocality: property.locality,
      addressRegion: property.city,
      addressCountry: "IN",
    },
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    image: property.images,
    url: `${SITE_URL}/property/${slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: property.city,
        item: `${SITE_URL}/search?city=${encodeURIComponent(property.city)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: property.locality,
        item: `${SITE_URL}${localitySeoPath(property.locality, property.city)}`,
      },
      { "@type": "ListItem", position: 4, name: property.title },
    ],
  };

  return (
    <>
      <JsonLd data={listingJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <PropertyDetailClient property={property} />
    </>
  );
}
