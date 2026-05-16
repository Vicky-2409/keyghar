import type { Property } from "@/lib/types";
import { PropertyCard } from "./PropertyCard";
import { AdUnit } from "@/components/ads/AdUnit";

export function PropertyList({ listings }: { listings: Property[] }) {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-b-xl border border-t-0 border-border bg-card">
      {listings.map((property, index) => (
        <div key={property.id}>
          {index === 3 && (
            <div className="border-b border-border bg-[#f4f6f8] px-4 py-3">
              <AdUnit slot="search-mid" format="horizontal" />
            </div>
          )}
          <PropertyCard property={property} index={index} layout="horizontal" />
        </div>
      ))}
    </div>
  );
}
