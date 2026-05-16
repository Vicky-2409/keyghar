"use client";

import { useEffect, useState } from "react";
import { listingFromSlug } from "@/lib/generateListing";
import { getWishlist } from "@/lib/wishlist";
import { PropertyCard } from "@/components/search/PropertyCard";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Property } from "@/lib/types";

export default function SavedPage() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const load = () => {
      const slugs = getWishlist();
      setProperties(slugs.map((id) => listingFromSlug(id)));
    };
    load();
    window.addEventListener("wishlist-updated", load);
    return () => window.removeEventListener("wishlist-updated", load);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Your shortlist</h1>
      <p className="mt-1 text-muted-foreground text-sm">
        Homes you&apos;ve saved to compare and contact later
      </p>

      {properties.length === 0 ? (
        <div className="mt-12 text-center">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <p className="mt-4 font-medium">No saved properties yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Tap the heart on any listing to save it here.
          </p>
          <Link
            href="/search"
            className="mt-6 inline-block rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
