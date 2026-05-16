import type { Property } from "@/lib/types";
import { PropertyCard } from "./PropertyCard";

export function PropertyList({ listings }: { listings: Property[] }) {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-b-xl border border-t-0 border-border bg-card">
      {listings.map((property, index) => (
        <PropertyCard key={property.id} property={property} index={index} layout="horizontal" />
      ))}
    </div>
  );
}
