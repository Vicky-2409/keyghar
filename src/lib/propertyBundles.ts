import propertyImagesData from "@/data/propertyImages.json";
import type { Furnishing, PropertyType } from "@/lib/types";

export type PropertyImageBundle = {
  folder: string;
  images: string[];
  id: string;
  title: string;
  locality: string;
  city: string;
  price: number;
  bedrooms: number;
  sqft: number;
  furnishing: Furnishing;
  sourceUrl: string;
};

export const PROPERTY_BUNDLES = propertyImagesData as PropertyImageBundle[];

const bundlesByCity = new Map<string, PropertyImageBundle[]>();

for (const bundle of PROPERTY_BUNDLES) {
  const list = bundlesByCity.get(bundle.city) ?? [];
  list.push(bundle);
  bundlesByCity.set(bundle.city, list);
}

export function getBundlesForCity(city: string): PropertyImageBundle[] {
  return bundlesByCity.get(city) ?? [];
}

export function getBundleByIndex(index: number, city?: string): PropertyImageBundle {
  const pool = city ? getBundlesForCity(city) : PROPERTY_BUNDLES;
  if (pool.length === 0) {
    if (PROPERTY_BUNDLES.length === 0) {
      throw new Error("No property image bundles. Run: node scripts/scrape-sulekha-images.mjs");
    }
    return PROPERTY_BUNDLES[0];
  }
  return pool[((index % pool.length) + pool.length) % pool.length];
}

export function getBundleIndexFromSeed(
  seed: string,
  hashFn: (s: string) => number,
  city?: string
): number {
  const pool = city ? getBundlesForCity(city) : PROPERTY_BUNDLES;
  if (pool.length === 0) return 0;
  return hashFn(seed) % pool.length;
}

export function findBundleByFolder(folder: string): PropertyImageBundle | undefined {
  return PROPERTY_BUNDLES.find((b) => b.folder === folder);
}

export function extractBundleFolderFromSeed(seed: string): string | undefined {
  return seed.match(/\|bundle:([^|]+)$/)?.[1];
}
