"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bath, Bed, Heart, MapPin, Maximize, Eye, Phone, User } from "lucide-react";
import type { Property } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/cn";
import { useState } from "react";
import { ContactModal } from "@/components/property/ContactModal";
import { useContactAccessContext } from "@/providers/ContactAccessProvider";

function formatPrice(price: number) {
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lakh`;
  return `₹${price.toLocaleString("en-IN")}`;
}

export function PropertyCard({
  property,
  index = 0,
  layout = "grid",
}: {
  property: Property;
  index?: number;
  layout?: "grid" | "horizontal";
}) {
  const { saved, toggle } = useWishlist(property.id);
  const [contactOpen, setContactOpen] = useState(false);
  const { requestContactAccess } = useContactAccessContext();

  const openContact = () => requestContactAccess(() => setContactOpen(true));

  const furnishingLabel = property.furnishing
    .replace("-", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  if (layout === "horizontal") {
    return (
      <>
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: (index % 10) * 0.03 }}
          className="group flex flex-col sm:flex-row hover:bg-[#fafafa] transition-colors"
        >
          <Link
            href={`/property/${property.id}`}
            className="relative block w-full shrink-0 sm:w-72 md:w-80 aspect-[4/3] sm:aspect-auto sm:min-h-[220px] overflow-hidden bg-muted"
          >
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover"
              sizes="320px"
            />
            {property.images.length > 1 && (
              <span className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white">
                + {property.images.length - 1} photos
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggle();
              }}
              className="absolute right-2 top-2 rounded-full bg-white p-2 shadow"
              aria-label="Wishlist"
            >
              <Heart className={cn("h-4 w-4", saved && "fill-primary text-primary")} />
            </button>
          </Link>

          <div className="flex flex-1 flex-col p-4 sm:p-5">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="rounded border border-border px-2 py-0.5 text-[11px] font-medium">
                Immediate
              </span>
              <span className="rounded border border-border px-2 py-0.5 text-[11px] font-medium">
                {furnishingLabel}
              </span>
              {property.badges.slice(0, 1).map((b) => (
                <Badge key={b} type={b} />
              ))}
            </div>

            <Link href={`/property/${property.id}`}>
              <h3 className="text-base font-bold text-foreground hover:text-primary line-clamp-2">
                {property.title}
              </h3>
            </Link>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {property.locality}, {property.city}
            </p>

            <p className="mt-2 text-2xl font-bold text-foreground">
              {formatPrice(property.price)}
              <span className="text-sm font-normal text-muted-foreground"> /Month</span>
            </p>

            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <li>Config: {property.bedrooms > 0 ? `${property.bedrooms} BHK` : "Studio"}</li>
              <li>Rent Type: Rent</li>
              <li className="flex items-center gap-1">
                <Maximize className="h-3 w-3" /> {property.sqft} sqft
              </li>
              <li className="flex items-center gap-1">
                <Bed className="h-3 w-3" /> {property.bedrooms} BHK
              </li>
              <li className="flex items-center gap-1">
                <Bath className="h-3 w-3" /> {property.bathrooms} Bath
              </li>
            </ul>

            <p className="mt-3 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
              {property.description}
            </p>

            <div className="mt-2 flex flex-wrap gap-1">
              {property.nearbyPlaces.slice(0, 3).map((p) => (
                <span key={p} className="text-[11px] text-primary">
                  {p}
                </span>
              ))}
            </div>

            <div className="mt-auto pt-4 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" /> {property.activity.viewsToday} viewed today
              </span>
              <span>· Posted {property.activity.postedAgo}</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={openContact}
                className="inline-flex items-center gap-1.5 rounded border-2 border-primary px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary hover:bg-primary/5"
              >
                <Phone className="h-3.5 w-3.5" />
                Contact Owner
              </button>
              <button
                type="button"
                onClick={openContact}
                className="inline-flex items-center gap-1.5 rounded bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary-foreground hover:opacity-90"
              >
                <User className="h-3.5 w-3.5" />
                View Contact
              </button>
            </div>
          </div>
        </motion.article>
        <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} property={property} />
      </>
    );
  }

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: (index % 12) * 0.04 }}
        className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-md"
      >
        <Link href={`/property/${property.id}`} className="block relative aspect-[4/3] overflow-hidden">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute left-2 top-2 flex gap-1">
            {property.badges.map((b) => (
              <Badge key={b} type={b} />
            ))}
          </div>
        </Link>
        <div className="p-4">
          <Link href={`/property/${property.id}`}>
            <h3 className="font-semibold line-clamp-1 hover:text-primary">{property.title}</h3>
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">
            {property.locality}, {property.city}
          </p>
          <p className="mt-2 text-lg font-bold text-primary">
            {formatPrice(property.price)}
            <span className="text-sm font-normal text-muted-foreground">/mo</span>
          </p>
          <button
            type="button"
            onClick={openContact}
            className="mt-3 w-full rounded bg-primary py-2 text-sm font-semibold text-primary-foreground"
          >
            Contact Owner
          </button>
        </div>
      </motion.article>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} property={property} />
    </>
  );
}
