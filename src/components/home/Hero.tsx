"use client";

import { SearchBar } from "@/components/search/SearchBar";
import citiesData from "@/data/cities.json";
import { DEFAULT_CITY, BRAND_STATS } from "@/lib/constants";
import { Building2, BadgeCheck, Users } from "lucide-react";

type CityData = { name: string; heroTitle: string };

export function Hero({
  city = DEFAULT_CITY,
  onCityChange,
}: {
  city?: string;
  onCityChange?: (city: string) => void;
}) {
  const cityConfig = (citiesData as CityData[]).find((c) => c.name === city) ?? citiesData[0];

  return (
    <section className="relative overflow-hidden border-b border-[#dde3eb] bg-white">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0065b3]/5 via-transparent to-[#e31e24]/5" />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            {onCityChange && (
              <select
                value={city}
                onChange={(e) => onCityChange(e.target.value)}
                className="mb-4 rounded-md border border-[#dde3eb] bg-white px-3 py-2 text-sm font-semibold text-[#333] shadow-sm"
              >
                {(citiesData as CityData[]).map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
            <h1 className="text-3xl font-extrabold leading-tight text-[#1a1a2e] sm:text-4xl lg:text-[2.75rem]">
              {cityConfig.heroTitle}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#5c6578]">
              Discover verified apartments, independent houses & PGs. Connect directly with owners —
              no brokerage on thousands of listings.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-md">
              {[
                { icon: Building2, label: "Listings", value: BRAND_STATS.listings },
                { icon: BadgeCheck, label: "Verified", value: "100%" },
                { icon: Users, label: "Owners", value: BRAND_STATS.owners },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-lg border border-[#dde3eb] bg-white/80 px-3 py-3 text-center shadow-sm"
                >
                  <Icon className="mx-auto h-5 w-5 text-primary" />
                  <p className="mt-1 text-lg font-bold text-[#1a1a2e]">{value}</p>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-[#888]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#dde3eb] bg-white p-5 shadow-lg shadow-[#0065b3]/5">
            <p className="text-sm font-bold text-[#1a1a2e]">Search by city, locality or budget</p>
            <p className="mt-1 text-xs text-[#888]">Flats · Houses · PG · Furnished homes</p>
            <div className="mt-4">
              <SearchBar defaultCity={city} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
