import { encodeBase64Url } from "@/lib/base64url";
import type { PropertyImageBundle } from "@/lib/propertyBundles";
import { generateListing } from "@/lib/generateListing";

/** Stable /property/[slug] URL for a scraped listing bundle (sitemap + SEO). */
export function getBundlePropertySlug(bundle: PropertyImageBundle): string {
  const seed = `canonical|bundle:${bundle.folder}`;
  return encodeBase64Url(`${seed}|bundle:${bundle.folder}`);
}

export function getCanonicalPropertyForBundle(bundle: PropertyImageBundle) {
  const slug = getBundlePropertySlug(bundle);
  return generateListing(`canonical|bundle:${bundle.folder}`, {
    city: bundle.city,
    locality: bundle.locality,
  });
}
