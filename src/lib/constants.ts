import type { PropertyFilters } from "@/lib/types";

export const EMPTY_FILTERS: PropertyFilters = {};

export const BRAND_NAME = "KeyGhar";
export const BRAND_SHORT = "KG";
export const BRAND_TAGLINE =
  "India's trusted platform to rent flats, houses & PGs — zero brokerage on owner listings.";
export const BRAND_STATS = {
  listings: "1,000+",
  cities: "5",
  owners: "500+",
};

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://keyghar.online";

export const DEFAULT_CITY = "Chennai";

export const CITIES = [
  "Chennai",
  "Pune",
  "Bangalore",
  "Mumbai",
  "Hyderabad",
] as const;

export type CityName = (typeof CITIES)[number];

export const CITY_SLUGS: Record<string, string> = {
  Chennai: "chennai",
  Pune: "pune",
  Bangalore: "bangalore",
  Mumbai: "mumbai",
  Hyderabad: "hyderabad",
};

export const SLUG_TO_CITY: Record<string, string> = Object.fromEntries(
  Object.entries(CITY_SLUGS).map(([k, v]) => [v, k])
);
