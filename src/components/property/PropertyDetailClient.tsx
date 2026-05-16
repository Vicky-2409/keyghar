"use client";

import { useState } from "react";
import Link from "next/link";
import { Bed, Bath, Maximize, MapPin, Lock } from "lucide-react";
import type { Property } from "@/lib/types";
import { SulekhaGallery } from "./SulekhaGallery";
import { AmenitiesGrid } from "./AmenitiesGrid";
import { MapPreview } from "./MapPreview";
import { ContactSidebar } from "./ContactSidebar";
import { RelatedProperties } from "./RelatedProperties";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { useContactAccessContext } from "@/providers/ContactAccessProvider";
import { AdUnit } from "@/components/ads/AdUnit";

const TABS = ["Photos", "Overview", "Amenities", "Locality", "Owner"] as const;
type Tab = (typeof TABS)[number];

function formatPrice(price: number) {
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lakh`;
  return `₹${price.toLocaleString("en-IN")}`;
}

export function PropertyDetailClient({ property }: { property: Property }) {
  const [tab, setTab] = useState<Tab>("Photos");
  const { isUnlocked, requestContactAccess } = useContactAccessContext();

  const furnishingLabel = property.furnishing
    .replace("-", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-12">
      <div className="border-b border-[#e0e0e0] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 text-xs text-[#888]">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-1">/</span>
          <Link href={`/search?city=${encodeURIComponent(property.city)}`} className="hover:text-primary">
            {property.city}
          </Link>
          <span className="mx-1">/</span>
          <span className="text-[#333]">{property.locality}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-5">
        <div className="rounded border border-[#e0e0e0] bg-white p-4 sm:p-5">
          <div className="flex flex-wrap gap-2 mb-2">
            {property.badges.map((b) => (
              <Badge key={b} type={b} />
            ))}
            {property.filterFlags.immediateMoveIn && (
              <span className="rounded border border-[#ddd] px-2 py-0.5 text-[11px] font-semibold text-[#444]">
                Immediate
              </span>
            )}
            <span className="rounded border border-[#ddd] px-2 py-0.5 text-[11px] font-semibold text-[#444]">
              {furnishingLabel}
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#222] sm:text-2xl">{property.title}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-[#666]">
            <MapPin className="h-4 w-4 shrink-0" />
            {property.locality}, {property.city}
          </p>
          <p className="mt-3 text-2xl font-bold text-primary">
            {formatPrice(property.price)}
            <span className="text-sm font-normal text-[#888]"> / month</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#555]">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bed className="h-4 w-4" /> {property.bedrooms} BHK
              </span>
            )}
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" /> {property.bathrooms} Bath
            </span>
            <span className="flex items-center gap-1">
              <Maximize className="h-4 w-4" /> {property.sqft} sqft
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 border-t border-[#eee] pt-3 text-xs text-[#777]">
            <span>{property.activity.viewsToday} viewed today</span>
            <span>{property.activity.contactedToday} contacted</span>
            <span>Posted {property.activity.postedAgo}</span>
          </div>
        </div>

        <nav className="mt-4 flex overflow-x-auto border-b border-[#e0e0e0] bg-white scrollbar-hide">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "shrink-0 border-b-2 px-5 py-3 text-sm font-semibold transition-colors",
                tab === t
                  ? "border-primary text-primary"
                  : "border-transparent text-[#555] hover:text-primary"
              )}
            >
              {t}
            </button>
          ))}
        </nav>

        <div className="mt-4 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded border border-[#e0e0e0] bg-white p-4 sm:p-5">
              {tab === "Photos" && (
                <SulekhaGallery images={property.images} title={property.title} />
              )}
              {tab === "Overview" && (
                <section id="overview">
                  <h2 className="mb-3 border-b border-[#e0e0e0] pb-2 text-lg font-bold">Overview</h2>
                  <p className="leading-relaxed text-[#555]">{property.description}</p>
                  <dl className="mt-6 grid gap-3 sm:grid-cols-2 text-sm">
                    <div className="flex justify-between border-b border-[#eee] py-2">
                      <dt className="text-[#888]">Property Type</dt>
                      <dd className="font-medium capitalize">{property.propertyType}</dd>
                    </div>
                    <div className="flex justify-between border-b border-[#eee] py-2">
                      <dt className="text-[#888]">Furnishing</dt>
                      <dd className="font-medium">{furnishingLabel}</dd>
                    </div>
                    <div className="flex justify-between border-b border-[#eee] py-2">
                      <dt className="text-[#888]">Bedrooms</dt>
                      <dd className="font-medium">{property.bedrooms || "—"}</dd>
                    </div>
                    <div className="flex justify-between border-b border-[#eee] py-2">
                      <dt className="text-[#888]">Bathrooms</dt>
                      <dd className="font-medium">{property.bathrooms}</dd>
                    </div>
                  </dl>
                </section>
              )}
              {tab === "Amenities" && (
                <section id="amenities">
                  <h2 className="mb-4 border-b border-[#e0e0e0] pb-2 text-lg font-bold">Amenities</h2>
                  <AmenitiesGrid amenities={property.amenities} />
                </section>
              )}
              {tab === "Locality" && (
                <section id="locality">
                  <h2 className="mb-3 border-b border-[#e0e0e0] pb-2 text-lg font-bold">Locality</h2>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {property.nearbyPlaces.map((p) => (
                      <span
                        key={p}
                        className="rounded-full border border-[#ddd] bg-[#fafafa] px-3 py-1 text-sm text-[#444]"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                  <MapPreview locality={property.locality} city={property.city} />
                </section>
              )}
              {tab === "Owner" && (
                <section id="owner">
                  <h2 className="mb-3 border-b border-[#e0e0e0] pb-2 text-lg font-bold">Owner Details</h2>
                  {isUnlocked ? (
                    <div className="space-y-2 text-sm text-[#555]">
                      <p>
                        <span className="font-semibold text-[#333]">Name:</span> {property.owner.name}
                      </p>
                      <p>
                        <span className="font-semibold text-[#333]">Role:</span> {property.owner.role}
                      </p>
                      <p>
                        <span className="font-semibold text-[#333]">Rating:</span> {property.owner.rating} / 5
                      </p>
                      <p>
                        <span className="font-semibold text-[#333]">Listings:</span>{" "}
                        {property.owner.listingsCount} properties
                      </p>
                      <p>
                        <span className="font-semibold text-[#333]">Phone:</span> {property.owner.phone}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-[#e0e0e0] bg-[#fafafa] p-6 text-center">
                      <Lock className="mx-auto h-8 w-8 text-primary" />
                      <p className="mt-3 text-sm text-[#555]">
                        Subscribe for ₹49/month to view owner name, phone, and contact details.
                      </p>
                      <button
                        type="button"
                        onClick={() => requestContactAccess(() => {})}
                        className="mt-4 rounded bg-primary px-6 py-2.5 text-sm font-bold uppercase text-white hover:bg-[#004d8c]"
                      >
                        Subscribe ₹49/month
                      </button>
                    </div>
                  )}
                </section>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <ContactSidebar property={property} />
          </div>
        </div>

        <AdUnit slot="property-mid" format="horizontal" className="mt-6 rounded border border-[#e0e0e0] bg-white p-4" />

        <div className="mt-6 rounded border border-[#e0e0e0] bg-white p-4">
          <RelatedProperties
            city={property.city}
            locality={property.locality}
            excludeSlug={property.slug}
          />
        </div>
      </div>

    </div>
  );
}
