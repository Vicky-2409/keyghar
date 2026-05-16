import { SLUG_TO_CITY, CITIES } from "@/lib/constants";
import { findCityByLocality } from "@/lib/priceBands";
import type { ParsedQuery, PropertyType } from "@/lib/types";

const TYPE_MAP: Record<string, PropertyType> = {
  flat: "flat",
  flats: "flat",
  apartment: "apartment",
  apartments: "apartment",
  pg: "pg",
  villa: "villa",
  studio: "studio",
};

export function parseQuery(query: string, defaultCity?: string): ParsedQuery {
  const result: ParsedQuery = {};
  const q = query.trim();
  if (!q) return { city: defaultCity };

  const lower = q.toLowerCase();

  const bhkMatch = lower.match(/(\d)\s*bhk/i);
  if (bhkMatch) result.bedrooms = parseInt(bhkMatch[1], 10);

  for (const [key, type] of Object.entries(TYPE_MAP)) {
    if (lower.includes(key)) {
      result.propertyType = type;
      break;
    }
  }

  const budgetUnder = lower.match(/under\s*(\d+)k?|below\s*(\d+)k?/i);
  if (budgetUnder) {
    const num = parseInt(budgetUnder[1] || budgetUnder[2], 10);
    result.maxBudget = num < 1000 ? num * 1000 : num;
  }

  const budgetRange = lower.match(/(\d+)k?\s*-\s*(\d+)k?/i);
  if (budgetRange) {
    result.minBudget = parseInt(budgetRange[1], 10) * 1000;
    result.maxBudget = parseInt(budgetRange[2], 10) * 1000;
  }

  const inMatch = q.match(/\b(?:in|near|at)\s+([A-Za-z\s]+?)(?:\s*$|,|\s+under)/i);
  if (inMatch) {
    const place = inMatch[1].trim();
    const inferredCity = findCityByLocality(place);
    if (inferredCity) {
      result.locality = place;
      result.city = inferredCity;
    } else {
      const cityMatch = CITIES.find((c) => c.toLowerCase() === place.toLowerCase());
      if (cityMatch) result.city = cityMatch;
      else result.locality = place;
    }
  }

  for (const city of CITIES) {
    if (lower.includes(city.toLowerCase())) {
      result.city = city;
      break;
    }
  }

  if (!result.city) result.city = defaultCity ?? findCityByLocality(result.locality ?? "") ?? defaultCity;

  return result;
}

export function parsedToFilters(parsed: ParsedQuery) {
  return {
    bedrooms: parsed.bedrooms,
    propertyType: parsed.propertyType,
    minBudget: parsed.minBudget,
    maxBudget: parsed.maxBudget,
  };
}
