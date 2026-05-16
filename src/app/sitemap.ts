import type { MetadataRoute } from "next";
import seoPages from "@/data/seoPages.json";
import { ALL_BLOG_POSTS } from "@/lib/blogPostsAll";
import { PROPERTY_BUNDLES } from "@/lib/propertyBundles";
import { getBundlePropertySlug } from "@/lib/canonicalListing";
import { SITE_URL } from "@/lib/constants";

const BASE = SITE_URL;

const STATIC_PATHS = [
  "",
  "/search",
  "/saved",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/blog",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = STATIC_PATHS.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path === "/blog" ? 0.85 : 0.8,
  }));

  const propertyRoutes = PROPERTY_BUNDLES.map((bundle) => ({
    url: `${BASE}/property/${getBundlePropertySlug(bundle)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.65,
  }));

  const seoRoutes = (seoPages as string[]).map((slug) => ({
    url: `${BASE}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const blogRoutes = ALL_BLOG_POSTS.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...propertyRoutes, ...seoRoutes, ...blogRoutes];
}
