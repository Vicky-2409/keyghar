import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const MANIFEST = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "data",
  "propertyImages.json"
);

const data = JSON.parse(fs.readFileSync(MANIFEST, "utf-8"));
const seen = new Set();

function metaFromUrl(sourceUrl) {
  const pathPart = sourceUrl.split("/").pop().replace(/-ad$/, "");
  const id = pathPart.match(/-(\d+)$/)?.[1];
  const localitySlug = pathPart.match(/-in-([a-z0-9-]+)-chennai-\d+$/i)?.[1];
  const bhk = parseInt(pathPart.match(/(\d+)-bhk/i)?.[1] || "1", 10);
  const sqft = parseInt(pathPart.match(/^(\d+)-sqft/i)?.[1] || "550", 10);
  const locality = localitySlug
    ? localitySlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "Chennai";

  const title = `${bhk} BHK Residential Apartment for Rent in ${locality}`;
  return { id, locality, city: "Chennai", bedrooms: bhk, sqft, title };
}

const fixed = [];
for (const entry of data) {
  const meta = metaFromUrl(entry.sourceUrl);
  const folder = `${meta.locality.toLowerCase().replace(/\s+/g, "-")}-${meta.bedrooms}bhk-${meta.id}`;
  if (seen.has(folder)) continue;
  seen.add(folder);

  fixed.push({
    ...entry,
    folder,
    ...meta,
    price: entry.price > 1000 ? entry.price : undefined,
  });
}

// sensible default prices from sqft/bhk
for (const e of fixed) {
  if (!e.price || e.price < 1000) {
    e.price = e.bedrooms === 1 ? 12000 + (e.sqft % 8) * 1000 : 18000 + (e.sqft % 10) * 1500;
  }
}

fs.writeFileSync(MANIFEST, JSON.stringify(fixed, null, 2));
console.log(`Fixed ${fixed.length} unique property bundles.`);
