"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import trendingData from "@/data/trending.json";
import { TrendingUp } from "lucide-react";

type TrendItem = { label: string; query: string; slug: string };

export function TrendingSearches({ city }: { city: string }) {
  const items = (trendingData as Record<string, TrendItem[]>)[city] ?? [];

  if (items.length === 0) return null;

  return (
    <section className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <TrendingUp className="h-4 w-4 text-primary" />
          Trending in {city}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {items.map((item, i) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/${item.slug}`}
                className="inline-block rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary hover:bg-primary/5 transition-colors"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
