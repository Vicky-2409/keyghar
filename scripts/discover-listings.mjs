/**
 * Discover Sulekha Chennai rental listing paths from category/locality pages.
 * Output: scripts/discovered-urls.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "discovered-urls.json");
const BASE = "https://property.sulekha.com";

const LOCALITIES = [
  "velachery", "adyar", "anna-nagar", "t-nagar", "guindy", "omr", "tambaram",
  "chromepet", "porur", "madipakkam", "pallikaranai", "sholinganallur",
  "thoraipakkam", "perungudi", "nungambakkam", "mylapore", "besant-nagar",
  "kolathur", "villivakkam", "ambattur", "avadi", "poonamallee", "medavakkam",
  "kodambakkam", "kk-nagar", "ashok-nagar", "saidapet", "west-mambalam",
  "ramapuram", "mogappair", "virugambakkam", "valasaravakkam", "koyambedu",
  "kilpauk", "egmore", "royapettah", "purasawalkam", "aminjikarai", "vadapalani",
  "kazhipathur", "navalur", "kelambakkam", "adyar", "pallavaram", "gerugambakkam",
  "selaiyur", "kovilambakkam", "injambakkam", "alandur", "pallavaram",
];

const SEED_PAGES = [
  "/1-bhk-apartments-flats-for-rent/chennai",
  "/2-bhk-apartments-flats-for-rent/chennai",
  "/3-bhk-apartments-flats-for-rent/chennai",
  "/4-bhk-apartments-flats-for-rent/chennai",
  "/apartments-flats-for-rent/chennai",
  "/semi-furnished-apartments-flats-for-rent/chennai",
  "/fully-furnished-apartments-flats-for-rent/chennai",
  "/unfurnished-apartments-flats-for-rent/chennai",
  "/12000-18000-rs-apartments-flats-for-rent/chennai",
  "/18000-25000-rs-apartments-flats-for-rent/chennai",
  "/25000-50000-rs-apartments-flats-for-rent/chennai",
  "/5000-8000-rs-apartments-flats-for-rent/chennai",
  "/8000-12000-rs-apartments-flats-for-rent/chennai",
];

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
};

const paths = new Set();

async function scrapePage(url) {
  try {
    const t = await fetch(url, { headers }).then((r) => (r.ok ? r.text() : ""));
    [...t.matchAll(/apartments-flats-for-rent-only\/[a-z0-9-]+-\d+-ad/g)].forEach((m) =>
      paths.add(m[0])
    );
  } catch {
    /* skip */
  }
}

const urls = [
  ...SEED_PAGES.map((p) => `${BASE}${p}`),
  ...LOCALITIES.flatMap((loc) => [
    `${BASE}/apartments-flats-for-rent/${loc}-chennai`,
    `${BASE}/1-bhk-apartments-flats-for-rent/${loc}-chennai`,
    `${BASE}/2-bhk-apartments-flats-for-rent/${loc}-chennai`,
    `${BASE}/3-bhk-apartments-flats-for-rent/${loc}-chennai`,
  ]),
];

console.log(`Scanning ${urls.length} pages...`);
for (let i = 0; i < urls.length; i++) {
  await scrapePage(urls[i]);
  if ((i + 1) % 20 === 0) console.log(`  ${i + 1}/${urls.length} — ${paths.size} listings`);
  await new Promise((r) => setTimeout(r, 200));
}

const list = [...paths].map((p) => ({
  path: p,
  url: `${BASE}/${p}`,
  id: p.match(/-(\d+)-ad$/)?.[1],
}));

fs.writeFileSync(OUT, JSON.stringify(list, null, 2));
console.log(`\nSaved ${list.length} listings to ${OUT}`);
