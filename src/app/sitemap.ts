import type { MetadataRoute } from "next";
import seoPages from "@/data/seoPages.json";

import { SITE_URL } from "@/lib/constants";

const BASE = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/search", "/saved"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const seoRoutes = (seoPages as string[]).map((slug) => ({
    url: `${BASE}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...seoRoutes];
}
