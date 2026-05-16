import citiesData from "@/data/cities.json";
import localitiesData from "@/data/localities.json";

type LocalityEntry = { name: string; tier: number; nearby: string[] };
type CityEntry = {
  name: string;
  priceMultiplier: number;
  baseRent: { min: number; max: number };
};

const cities = citiesData as CityEntry[];
const localities = localitiesData as Record<string, LocalityEntry[]>;

export function getCityConfig(city: string): CityEntry {
  return cities.find((c) => c.name.toLowerCase() === city.toLowerCase()) ?? cities[0];
}

export function getLocalitiesForCity(city: string): LocalityEntry[] {
  return localities[city] ?? localities["Chennai"];
}

export function getLocalityEntry(city: string, localityName: string): LocalityEntry | undefined {
  return getLocalitiesForCity(city).find(
    (l) => l.name.toLowerCase() === localityName.toLowerCase()
  );
}

export function findCityByLocality(localityName: string): string | undefined {
  const normalized = localityName.toLowerCase();
  for (const [city, locs] of Object.entries(localities)) {
    if (locs.some((l) => l.name.toLowerCase() === normalized)) return city;
  }
  return undefined;
}

export function computeBasePrice(
  city: string,
  locality: string,
  bedrooms: number,
  furnishing: "furnished" | "semi-furnished" | "unfurnished",
  propertyType: string
): number {
  const cityConfig = getCityConfig(city);
  const loc = getLocalityEntry(city, locality) ?? { tier: 2, name: locality, nearby: [] };
  const tierFactor = loc.tier === 1 ? 1.25 : loc.tier === 2 ? 1 : 0.85;
  const bhkFactor = propertyType === "pg" ? 0.45 : 0.7 + bedrooms * 0.35;
  const furnishFactor =
    furnishing === "furnished" ? 1.15 : furnishing === "semi-furnished" ? 1 : 0.88;
  const mid = (cityConfig.baseRent.min + cityConfig.baseRent.max) / 2;
  return Math.round(mid * cityConfig.priceMultiplier * tierFactor * bhkFactor * furnishFactor);
}
