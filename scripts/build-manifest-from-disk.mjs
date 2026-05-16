import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMG_ROOT = path.join(ROOT, "public", "images", "properties");
const MANIFEST = path.join(ROOT, "src", "data", "propertyImages.json");
const DISCOVERED = path.join(ROOT, "scripts", "discovered-urls.json");
const MIN_PHOTOS = 2;

const discoveredById = new Map();
if (fs.existsSync(DISCOVERED)) {
  for (const item of JSON.parse(fs.readFileSync(DISCOVERED, "utf-8"))) {
    if (item.id) discoveredById.set(item.id, item);
  }
}

function metaFromPath(pathStr, url, folderName) {
  const pathPart = pathStr.replace(/-ad$/, "");
  const id = pathPart.match(/-(\d+)$/)?.[1] ?? folderName.match(/(\d{8,})$/)?.[1];

  const cityMatch = pathPart.match(/-in-[a-z0-9-]+-([a-z]+)-\d+$/i);
  const citySlug = cityMatch?.[1] ?? "chennai";
  const city = citySlug.charAt(0).toUpperCase() + citySlug.slice(1);

  const localitySlug = pathPart.match(/-in-([a-z0-9-]+)-[a-z]+-\d+$/i)?.[1];
  const locality = localitySlug
    ? localitySlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : folderName.split("-")[0];

  const bhk = parseInt(pathPart.match(/(\d+)-bhk/i)?.[1] || folderName.match(/(\d)bhk/)?.[1] || "1", 10);
  const sqft = parseInt(pathPart.match(/^(\d+)-sqft/i)?.[1] || "600", 10);

  return {
    id,
    folder: folderName,
    locality,
    city,
    bedrooms: bhk,
    sqft,
    title: `${bhk} BHK Apartment for Rent in ${locality}`,
    price: bhk === 1 ? 9000 + (parseInt(id || "0", 10) % 25) * 650 : 15000 + (parseInt(id || "0", 10) % 30) * 850,
    furnishing: "semi-furnished",
    sourceUrl: url,
  };
}

const manifest = [];

for (const d of fs.readdirSync(IMG_ROOT, { withFileTypes: true }).filter((x) => x.isDirectory())) {
  const files = fs
    .readdirSync(path.join(IMG_ROOT, d.name))
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort();
  if (files.length < MIN_PHOTOS) continue;

  let id = d.name.match(/(\d{8,})$/)?.[1];
  if (!id) {
    const guess = [...discoveredById.values()].find((x) => {
      const loc = x.path.match(/-in-([a-z0-9-]+)-/i)?.[1] ?? "";
      return loc && d.name.toLowerCase().includes(loc.slice(0, 8));
    });
    if (guess) id = guess.id;
  }
  if (!id) continue;

  const disc = discoveredById.get(id);
  const meta = disc
    ? metaFromPath(disc.path, disc.url, d.name)
    : {
        id,
        folder: d.name,
        locality: d.name.split("-")[0],
        city: "Chennai",
        bedrooms: parseInt(d.name.match(/(\d)bhk/)?.[1] || "2", 10),
        sqft: 600,
        title: `Apartment for Rent`,
        price: 15000,
        furnishing: "semi-furnished",
        sourceUrl: "",
      };

  manifest.push({
    ...meta,
    images: files.map((f) => `/images/properties/${d.name}/${f}`),
  });
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
console.log(`Manifest: ${manifest.length} properties (${MIN_PHOTOS}+ photos each).`);
if (manifest.length < 400) {
  console.warn(`Have ${manifest.length} homes. For more unique photos run: npm run scrape:all`);
}
