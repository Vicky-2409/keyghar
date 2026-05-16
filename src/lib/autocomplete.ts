import trending from "@/data/trending.json";
import localitiesData from "@/data/localities.json";
import { CITIES } from "@/lib/constants";

export type Suggestion = {
  label: string;
  type: "locality" | "city" | "trending";
  query: string;
  city?: string;
};

const localitySuggestions: Suggestion[] = [];
for (const [city, locs] of Object.entries(localitiesData)) {
  for (const loc of locs as { name: string }[]) {
    localitySuggestions.push({
      label: `${loc.name}, ${city}`,
      type: "locality",
      query: `Properties in ${loc.name}`,
      city,
    });
  }
}

const citySuggestions: Suggestion[] = CITIES.map((city) => ({
  label: city,
  type: "city" as const,
  query: `Flats in ${city}`,
  city,
}));

const trendingSuggestions: Suggestion[] = [];
for (const [city, items] of Object.entries(trending)) {
  for (const item of items as { label: string; query: string }[]) {
    trendingSuggestions.push({
      label: item.label,
      type: "trending",
      query: item.query,
      city,
    });
  }
}

const ALL_SUGGESTIONS = [...localitySuggestions, ...citySuggestions, ...trendingSuggestions];

export function getAutocompleteSuggestions(input: string, limit = 8): Suggestion[] {
  const q = input.trim().toLowerCase();
  if (!q) return trendingSuggestions.slice(0, limit);

  return ALL_SUGGESTIONS.filter((s) => s.label.toLowerCase().includes(q))
    .sort((a, b) => {
      const aStarts = a.label.toLowerCase().startsWith(q) ? 0 : 1;
      const bStarts = b.label.toLowerCase().startsWith(q) ? 0 : 1;
      return aStarts - bStarts;
    })
    .slice(0, limit);
}
