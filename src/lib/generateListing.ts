import titleTemplates from "@/data/titleTemplates.json";
import {
  getBundleByIndex,
  getBundleIndexFromSeed,
  findBundleByFolder,
  extractBundleFolderFromSeed,
} from "@/lib/propertyBundles";
import amenitiesList from "@/data/amenities.json";
import {
  boolWithChance,
  hashString,
  intBetween,
  pick,
  pickN,
  seededRandom,
} from "@/lib/seed";
import { slugify } from "@/lib/slugify";
import {
  computeBasePrice,
  getLocalitiesForCity,
  getLocalityEntry,
} from "@/lib/priceBands";
import type { Furnishing, Property, PropertyFilters, PropertyType, SearchContext } from "@/lib/types";
import { CITIES, DEFAULT_CITY } from "@/lib/constants";
import { encodeBase64Url, decodeBase64Url } from "@/lib/base64url";

function encodeSeed(seed: string): string {
  return `p-${encodeBase64Url(seed)}`;
}

function decodeSeed(id: string): string | null {
  if (!id.startsWith("p-")) return null;
  try {
    return decodeBase64Url(id.slice(2));
  } catch {
    return null;
  }
}

const OWNER_NAMES = [
  "Rajesh Kumar", "Priya Sharma", "Arun Menon", "Deepa Iyer", "Vikram Singh",
  "Anita Desai", "Suresh Reddy", "Kavitha Nair", "Rahul Mehta", "Sneha Patel",
  "Karthik Subramanian", "Meera Joshi", "Amit Gupta", "Lakshmi Venkat", "Sanjay Rao",
];

const OWNER_ROLES = ["Property Consultant", "Owner", "Verified Broker", "Listing Partner"];

const POSTED_OPTIONS = [
  "1 hour ago", "2 hours ago", "5 hours ago", "8 hours ago",
  "12 hours ago", "1 day ago", "2 days ago", "3 days ago", "5 days ago",
];

const PROPERTY_TYPES: PropertyType[] = ["apartment", "flat", "pg", "villa", "studio"];
const FURNISHING: Furnishing[] = ["furnished", "semi-furnished", "unfurnished"];

function generateTitle(
  rng: () => number,
  propertyType: PropertyType,
  locality: string
): string {
  if (propertyType === "pg") {
    return `${pick(rng, titleTemplates.pgNames)} - ${locality}`;
  }
  const prefix = pick(rng, titleTemplates.prefixes);
  const middle = pick(rng, titleTemplates.middles);
  return `${prefix} ${middle} - ${locality}`;
}

function generatePhone(rng: () => number): string {
  const digits = Array.from({ length: 5 }, () => intBetween(rng, 0, 9)).join("");
  return `+91 98${intBetween(rng, 10, 99)} ${digits} ${intBetween(rng, 100, 999)}`;
}

function matchesFilters(property: Property, filters?: PropertyFilters): boolean {
  if (!filters) return true;
  if (filters.minBudget && property.price < filters.minBudget) return false;
  if (filters.maxBudget && property.price > filters.maxBudget) return false;
  if (filters.propertyType && property.propertyType !== filters.propertyType) return false;
  if (filters.bedrooms !== undefined && property.bedrooms !== filters.bedrooms) return false;
  if (filters.furnishing && property.furnishing !== filters.furnishing) return false;
  if (filters.parking && !property.filterFlags.parking) return false;
  if (filters.lift && !property.filterFlags.lift) return false;
  if (filters.petFriendly && !property.filterFlags.petFriendly) return false;
  if (filters.bachelorAllowed && !property.filterFlags.bachelorAllowed) return false;
  if (filters.familyPreferred && !property.filterFlags.familyPreferred) return false;
  if (filters.immediateMoveIn && !property.filterFlags.immediateMoveIn) return false;
  if (filters.verifiedOnly && !property.filterFlags.verified) return false;
  if (filters.metroNearby && !property.filterFlags.metroNearby) return false;
  if (filters.gatedCommunity && !property.filterFlags.gatedCommunity) return false;
  return true;
}

export function generateListing(
  seed: string,
  context: SearchContext = {}
): Property {
  const hash = hashString(seed);
  const rng = seededRandom(hash);

  const city = context.city ?? DEFAULT_CITY;
  const folderFromSeed = extractBundleFolderFromSeed(seed);
  const bundle =
    (folderFromSeed ? findBundleByFolder(folderFromSeed) : undefined) ??
    getBundleByIndex(getBundleIndexFromSeed(seed, hashString, city), city);

  const localityMatches =
    !context.locality ||
    context.locality.toLowerCase() === bundle.locality.toLowerCase();
  const useBundleMeta = bundle.city === city && localityMatches;

  const locs = getLocalitiesForCity(city);
  const locality = context.locality ?? (useBundleMeta ? bundle.locality : pick(rng, locs).name);

  const locEntry = getLocalityEntry(city, locality) ?? locs[0];

  let propertyType: PropertyType =
    context.filters?.propertyType ?? pick(rng, PROPERTY_TYPES);
  if (propertyType === "villa" && rng() > 0.15) propertyType = "apartment";

  let bedrooms =
    context.filters?.bedrooms ??
    (useBundleMeta
      ? bundle.bedrooms
      : propertyType === "pg"
        ? 1
        : propertyType === "studio"
          ? 0
          : intBetween(rng, 1, 3));

  if (propertyType === "studio") bedrooms = 0;
  if (propertyType === "pg") bedrooms = 1;

  const furnishing: Furnishing =
    context.filters?.furnishing ??
    (useBundleMeta ? bundle.furnishing : pick(rng, FURNISHING));

  const basePrice = useBundleMeta
    ? bundle.price
    : computeBasePrice(city, locality, bedrooms || 1, furnishing, propertyType);
  const priceNoise = intBetween(rng, -1500, 2500);
  const price = Math.max(5000, basePrice + priceNoise);
  const roundedPrice = Math.round(price / 500) * 500;

  const sqft = useBundleMeta
    ? bundle.sqft + intBetween(rng, -30, 30)
    : (propertyType === "pg" ? 120 : bedrooms === 0 ? 450 : bedrooms * 380) +
      intBetween(rng, 40, 180);
  const bathrooms = propertyType === "pg" ? 1 : Math.max(1, bedrooms);

  const title = useBundleMeta
    ? bundle.title
    : generateTitle(rng, propertyType, locality);
  const listingId = encodeSeed(`${seed}|bundle:${bundle.folder}`);
  const slug = listingId;

  const badges: Property["badges"] = [];
  if (boolWithChance(rng, 0.4)) badges.push("VERIFIED");
  if (boolWithChance(rng, 0.15)) badges.push("FEATURED");
  if (boolWithChance(rng, 0.1)) badges.push("HOT_DEAL");

  const filterFlags = {
    parking: boolWithChance(rng, 0.65),
    lift: boolWithChance(rng, 0.55),
    petFriendly: boolWithChance(rng, 0.35),
    bachelorAllowed: boolWithChance(rng, 0.7),
    familyPreferred: boolWithChance(rng, 0.6),
    immediateMoveIn: boolWithChance(rng, 0.45),
    metroNearby: boolWithChance(rng, 0.4),
    gatedCommunity: boolWithChance(rng, 0.5),
    verified: badges.includes("VERIFIED"),
  };

  const images = [...bundle.images];
  const amenities = pickN(rng, amenitiesList as string[], intBetween(rng, 6, 12));
  const nearbyPlaces = locEntry.nearby ?? pickN(rng, ["Metro Station", "Mall", "IT Park", "Hospital"], 3);

  const ownerName = pick(rng, OWNER_NAMES);
  const amenityHighlight = amenities.slice(0, 4).join(", ");
  const commuteNote = filterFlags.metroNearby
    ? "Metro connectivity nearby makes daily commuting easier."
    : `Well connected to ${nearbyPlaces[0] ?? "local hubs"} and neighbourhood markets.`;
  const tenantNote = filterFlags.bachelorAllowed
    ? "Suitable for working professionals and bachelors."
    : filterFlags.familyPreferred
      ? "Preferred for families seeking a quiet residential setup."
      : "Open to families and working professionals.";
  const parkingNote = filterFlags.parking ? "Dedicated parking available." : "";
  const description = [
    `This ${furnishing} ${bedrooms || "studio"} ${propertyType} for rent in ${locality}, ${city} offers ${sqft} sq.ft of living space at ₹${roundedPrice.toLocaleString("en-IN")}/month.`,
    `Highlights include ${amenityHighlight || "essential conveniences"} with ${commuteNote}`,
    tenantNote,
    parkingNote,
    filterFlags.immediateMoveIn
      ? "Available for immediate move-in subject to agreement and standard security deposit."
      : "Move-in date flexible; schedule a visit to confirm availability.",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    id: listingId,
    slug,
    title,
    city,
    locality,
    price: roundedPrice,
    sqft,
    bedrooms,
    bathrooms,
    propertyType,
    furnishing,
    amenities,
    nearbyPlaces,
    images,
    badges,
    activity: {
      viewsToday: intBetween(rng, 5, 42),
      contactedToday: intBetween(rng, 1, 9),
      postedAgo: pick(rng, POSTED_OPTIONS),
    },
    filterFlags,
    owner: {
      name: ownerName,
      role: pick(rng, OWNER_ROLES),
      rating: Math.round((4.2 + rng() * 0.7) * 10) / 10,
      listingsCount: intBetween(rng, 12, 220),
      avatarSeed: slugify(ownerName),
      phone: generatePhone(rng),
    },
    description,
  };
}

export function listingFromSlug(slug: string): Property {
  const decoded = decodeSeed(slug);
  if (decoded) {
    const baseSeed = decoded.split("|bundle:")[0];
    const bundleFolder = decoded.match(/\|bundle:([^|]+)$/)?.[1];
    const bundle = bundleFolder ? findBundleByFolder(bundleFolder) : undefined;
    if (bundle) {
      return generateListing(decoded, {
        city: bundle.city,
        locality: bundle.locality,
      });
    }
    const [city, locality, , , filtersJson, sort] = baseSeed.split("|");
    let filters: PropertyFilters = {};
    try {
      filters = JSON.parse(filtersJson || "{}") as PropertyFilters;
    } catch {
      filters = {};
    }
    return generateListing(baseSeed, {
      city,
      locality: locality && locality !== "all" ? locality : undefined,
      filters,
      sort: (sort as SearchContext["sort"]) ?? "relevance",
    });
  }

  if (slug.startsWith("prop-")) {
    for (const city of CITIES) {
      for (let page = 0; page < 12; page++) {
        for (let attempt = 0; attempt < 64; attempt++) {
          const seed = `${city}|all|${page}|${attempt}|{}|relevance`;
          const listing = generateListing(seed, { city });
          if (listing.id === slug) return listing;
        }
      }
    }
  }

  const parts = slug.split("-");
  const cityGuess = parts[parts.length - 1];
  const cityMap: Record<string, string> = {
    guindy: "Chennai", velachery: "Chennai", omr: "Chennai", chennai: "Chennai",
    pune: "Pune", hinjewadi: "Pune", wakad: "Pune",
    bangalore: "Bangalore", koramangala: "Bangalore",
    mumbai: "Mumbai", hyderabad: "Hyderabad", gachibowli: "Hyderabad",
  };
  const city = cityMap[cityGuess] ?? DEFAULT_CITY;
  const localityPart = parts.slice(-2, -1)[0] ?? parts[parts.length - 1];
  const locality =
    localityPart.charAt(0).toUpperCase() + localityPart.slice(1).replace(/-/g, " ");

  return generateListing(`detail-${slug}`, { city, locality });
}

export function generateListings(context: SearchContext = {}): Property[] {
  const page = context.page ?? 0;
  const pageSize = context.pageSize ?? 24;
  const city = context.city ?? DEFAULT_CITY;
  const locality = context.locality;
  const filters = context.filters;
  const sort = context.sort ?? "relevance";

  const results: Property[] = [];
  const usedBundles = new Set<string>();
  let attempt = 0;
  const maxAttempts = pageSize * 8;

  while (results.length < pageSize && attempt < maxAttempts) {
    const seed = `${city}|${locality ?? "all"}|${page}|${attempt}|${JSON.stringify(filters ?? {})}|${sort}`;
    const listing = generateListing(seed, { ...context, city, locality });
    const bundleKey = extractBundleFolderFromSeed(decodeSeed(listing.id) ?? "");

    if (bundleKey && usedBundles.has(bundleKey)) {
      attempt++;
      continue;
    }
    if (matchesFilters(listing, filters)) {
      if (bundleKey) usedBundles.add(bundleKey);
      results.push(listing);
    }
    attempt++;
  }

  if (sort === "price-asc") results.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") results.sort((a, b) => b.price - a.price);
  if (sort === "newest") results.reverse();

  return results;
}

export function estimateCount(context: SearchContext = {}): number {
  const base = 180;
  const city = context.city ?? DEFAULT_CITY;
  const locs = getLocalitiesForCity(city).length;
  let count = base + locs * 42 + (context.page ?? 0) * 12;
  if (context.locality) count = Math.floor(count * 0.35);
  if (context.filters?.bedrooms) count = Math.floor(count * 0.55);
  if (context.filters?.verifiedOnly) count = Math.floor(count * 0.4);
  const filterCount = Object.values(context.filters ?? {}).filter(Boolean).length;
  count = Math.floor(count * Math.max(0.25, 1 - filterCount * 0.08));
  return Math.max(12, count + (hashString(JSON.stringify(context)) % 80));
}
