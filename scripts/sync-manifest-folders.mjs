import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = path.join(ROOT, "src", "data", "propertyImages.json");
const IMG_ROOT = path.join(ROOT, "public", "images", "properties");

const dirs = fs.readdirSync(IMG_ROOT, { withFileTypes: true }).filter((d) => d.isDirectory());
const data = JSON.parse(fs.readFileSync(MANIFEST, "utf-8"));

const synced = data.map((entry) => {
  const dir = dirs.find((d) => d.name.includes(entry.id));
  if (!dir) return null;
  const files = fs
    .readdirSync(path.join(IMG_ROOT, dir.name))
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort();
  return {
    ...entry,
    folder: dir.name,
    images: files.map((f) => `/images/properties/${dir.name}/${f}`),
  };
}).filter(Boolean);

fs.writeFileSync(MANIFEST, JSON.stringify(synced, null, 2));
console.log(`Synced ${synced.length} bundles to disk folders.`);
