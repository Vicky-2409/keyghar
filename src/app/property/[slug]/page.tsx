import { notFound } from "next/navigation";
import { listingFromSlug } from "@/lib/generateListing";
import { PropertyDetailClient } from "@/components/property/PropertyDetailClient";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = listingFromSlug(slug);
  return {
    title: `${property.title} — ${property.locality}, ${property.city}`,
    description: property.description.slice(0, 160),
    openGraph: {
      title: property.title,
      description: `Rent from ₹${property.price}/mo in ${property.locality}`,
      images: [property.images[0]],
    },
  };
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  if (!slug) notFound();

  const property = listingFromSlug(slug);

  return <PropertyDetailClient property={property} />;
}
