"use client";

import { cn } from "@/lib/cn";
import type { PropertyFilters, PropertyType, Furnishing } from "@/lib/types";

type FilterSidebarProps = {
  filters: PropertyFilters;
  onChange: (filters: PropertyFilters) => void;
  className?: string;
};

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "flat", label: "Flat" },
  { value: "apartment", label: "Apartment" },
  { value: "pg", label: "PG" },
  { value: "villa", label: "Villa" },
  { value: "studio", label: "Studio" },
];

const BHK_OPTIONS = [1, 2, 3];
const FURNISHING: Furnishing[] = ["furnished", "semi-furnished", "unfurnished"];

const BOOL_FILTERS: { key: keyof PropertyFilters; label: string }[] = [
  { key: "parking", label: "Parking" },
  { key: "lift", label: "Lift" },
  { key: "petFriendly", label: "Pet Friendly" },
  { key: "bachelorAllowed", label: "Bachelor Allowed" },
  { key: "familyPreferred", label: "Family Preferred" },
  { key: "immediateMoveIn", label: "Immediate Move-in" },
  { key: "verifiedOnly", label: "Verified Properties" },
  { key: "metroNearby", label: "Nearby Metro" },
  { key: "gatedCommunity", label: "Gated Community" },
];

export function FilterSidebar({ filters, onChange, className }: FilterSidebarProps) {
  const update = (patch: Partial<PropertyFilters>) => onChange({ ...filters, ...patch });

  const toggleBool = (key: keyof PropertyFilters) => {
    update({ [key]: !filters[key] } as Partial<PropertyFilters>);
  };

  return (
    <aside className={cn("space-y-6", className)}>
      <div>
        <h3 className="font-semibold text-sm">Budget (₹/month)</h3>
        <div className="mt-3 space-y-2">
          <input
            type="range"
            min={5000}
            max={100000}
            step={1000}
            value={filters.maxBudget ?? 50000}
            onChange={(e) => update({ maxBudget: parseInt(e.target.value, 10) })}
            className="w-full accent-primary"
          />
          <p className="text-sm text-muted-foreground">
            Up to ₹{(filters.maxBudget ?? 50000).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm">Property Type</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {PROPERTY_TYPES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                update({ propertyType: filters.propertyType === value ? undefined : value })
              }
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                filters.propertyType === value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-muted"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm">BHK</h3>
        <div className="mt-2 flex gap-2">
          {BHK_OPTIONS.map((bhk) => (
            <button
              key={bhk}
              type="button"
              onClick={() =>
                update({ bedrooms: filters.bedrooms === bhk ? undefined : bhk })
              }
              className={cn(
                "rounded-lg border px-4 py-1.5 text-sm font-medium",
                filters.bedrooms === bhk
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:bg-muted"
              )}
            >
              {bhk} BHK
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm">Furnishing</h3>
        <div className="mt-2 space-y-2">
          {FURNISHING.map((f) => (
            <label key={f} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="furnishing"
                checked={filters.furnishing === f}
                onChange={() => update({ furnishing: f })}
                className="accent-primary"
              />
              <span className="capitalize">{f.replace("-", " ")}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm">More Filters</h3>
        <div className="mt-2 space-y-2">
          {BOOL_FILTERS.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={!!filters[key]}
                onChange={() => toggleBool(key)}
                className="accent-primary rounded"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onChange({})}
        className="w-full rounded-xl border border-border py-2 text-sm font-medium hover:bg-muted"
      >
        Clear All Filters
      </button>
    </aside>
  );
}
