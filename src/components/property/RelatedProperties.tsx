import { generateListings } from "@/lib/generateListing";
import { PropertyCard } from "@/components/search/PropertyCard";

export function RelatedProperties({
  city,
  locality,
  excludeSlug,
}: {
  city: string;
  locality: string;
  excludeSlug: string;
}) {
  const listings = generateListings({
    city,
    locality,
    page: 99,
    pageSize: 4,
  }).filter((p) => p.slug !== excludeSlug);

  return (
    <section>
      <h2 className="text-xl font-bold">Similar Properties</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {listings.slice(0, 4).map((p, i) => (
          <PropertyCard key={p.id} property={p} index={i} />
        ))}
      </div>
    </section>
  );
}
