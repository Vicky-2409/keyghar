import seoPages from "@/data/seoPages.json";
import { SLUG_TO_CITY } from "@/lib/constants";
import { findCityByLocality } from "@/lib/priceBands";
import type { ParsedSeoSlug, PropertyType } from "@/lib/types";

const VALID_SLUGS = new Set(seoPages as string[]);

export function isValidSeoSlug(slug: string): boolean {
  if (VALID_SLUGS.has(slug)) return true;
  return /^\d-bhk|flats-for-rent|houses-for-rent|apartments-in|pg-in|villa-in/.test(slug);
}

export function parseSeoSlug(slug: string): ParsedSeoSlug | null {
  if (!isValidSeoSlug(slug)) return null;

  const result: ParsedSeoSlug = { rawSlug: slug };
  const parts = slug.split("-");

  const bhkIdx = parts.findIndex((p) => p === "bhk");
  if (bhkIdx > 0 && !isNaN(parseInt(parts[bhkIdx - 1], 10))) {
    result.bedrooms = parseInt(parts[bhkIdx - 1], 10);
  }

  if (slug.includes("flats") || slug.includes("houses")) result.propertyType = "flat";
  if (slug.includes("apartments")) result.propertyType = "apartment";
  if (slug.includes("pg")) result.propertyType = "pg";
  if (slug.includes("villa")) result.propertyType = "villa";

  const inIdx = parts.indexOf("in");
  if (inIdx >= 0 && inIdx < parts.length - 1) {
    const locationParts = parts.slice(inIdx + 1);
    const locationSlug = locationParts.join("-");
    const locationName = locationParts
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");

    const cityFromSlug = SLUG_TO_CITY[locationSlug];
    if (cityFromSlug) {
      result.city = cityFromSlug.charAt(0).toUpperCase() + cityFromSlug.slice(1);
    } else {
      const inferred = findCityByLocality(locationName);
      if (inferred) {
        result.city = inferred;
        result.locality = locationName;
      } else {
        result.locality = locationName;
        result.city = findCityByLocality(locationName);
      }
    }
  }

  for (const [citySlug, cityName] of Object.entries(SLUG_TO_CITY)) {
    if (slug.includes(citySlug) && !result.locality) {
      result.city = cityName.charAt(0).toUpperCase() + cityName.slice(1);
    }
  }

  return result;
}

export function seoSlugToTitle(slug: ParsedSeoSlug): string {
  const parts: string[] = [];
  if (slug.bedrooms) parts.push(`${slug.bedrooms} BHK`);
  if (slug.propertyType) {
    const labels: Record<PropertyType, string> = {
      flat: "Flats",
      apartment: "Apartments",
      pg: "PG Accommodation",
      villa: "Villas",
      studio: "Studios",
    };
    parts.push(labels[slug.propertyType]);
  } else {
    parts.push("Properties");
  }
  parts.push("for Rent");
  if (slug.locality) parts.push(`in ${slug.locality}`);
  else if (slug.city) parts.push(`in ${slug.city}`);
  return parts.join(" ");
}
