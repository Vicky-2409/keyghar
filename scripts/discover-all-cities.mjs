/**
 * Discover Sulekha rental listing URLs across cities, localities, and paginated search pages.
 * Output: scripts/discovered-urls.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "discovered-urls.json");
const BASE = "https://property.sulekha.com";

const CITIES = [
  "chennai",
  "bangalore",
  "hyderabad",
  "pune",
  "mumbai",
  "delhi",
  "kolkata",
  "coimbatore",
  "kochi",
  "ahmedabad",
  "noida",
  "gurgaon",
  "ghaziabad",
  "jaipur",
  "nagpur",
];

const CATEGORY_PAGES = [
  "1-bhk-apartments-flats-for-rent",
  "2-bhk-apartments-flats-for-rent",
  "3-bhk-apartments-flats-for-rent",
  "4-bhk-apartments-flats-for-rent",
  "apartments-flats-for-rent",
  "semi-furnished-apartments-flats-for-rent",
  "fully-furnished-apartments-flats-for-rent",
  "unfurnished-apartments-flats-for-rent",
  "5000-8000-rs-apartments-flats-for-rent",
  "8000-12000-rs-apartments-flats-for-rent",
  "12000-18000-rs-apartments-flats-for-rent",
  "18000-25000-rs-apartments-flats-for-rent",
  "25000-50000-rs-apartments-flats-for-rent",
  "independent-house-for-rent",
  "1-bhk-independent-house-for-rent",
  "2-bhk-independent-house-for-rent",
  "3-bhk-independent-house-for-rent",
];

/** Locality slugs per major city — boosts unique listing discovery */
const LOCALITIES = {
  chennai: [
    "velachery", "adyar", "anna-nagar", "t-nagar", "guindy", "omr", "tambaram",
    "chromepet", "porur", "madipakkam", "pallikaranai", "sholinganallur",
    "thoraipakkam", "perungudi", "nungambakkam", "mylapore", "ambattur",
    "medavakkam", "kodambakkam", "ramapuram", "mogappair", "navalur", "selaiyur",
  ],
  bangalore: [
    "koramangala", "indiranagar", "whitefield", "electronic-city", "marathahalli",
    "hsr-layout", "btm-layout", "jayanagar", "hebbal", "yelahanka", "bellandur",
    "sarjapur-road", "banashankari", "rajajinagar", "malleshwaram",
  ],
  hyderabad: [
    "gachibowli", "kondapur", "madhapur", "kukatpally", "miyapur", "banjara-hills",
    "jubilee-hills", "hitech-city", "manikonda", "uppal", "lb-nagar",
  ],
  pune: [
    "hinjewadi", "wakad", "baner", "kothrud", "hadapsar", "viman-nagar",
    "aundh", "kharadi", "magarpatta", "wagholi",
  ],
  mumbai: [
    "andheri-west", "powai", "bandra", "thane", "nerul", "malad", "borivali",
    "goregaon", "chembur", "vashi", "kharghar",
  ],
  delhi: [
    "dwarka", "rohini", "saket", "vasant-kunj", "janakpuri", "lajpat-nagar",
    "greater-kailash", "pitampura", "mayur-vihar",
  ],
};

const MAX_PAGES = 12;
const DELAY_MS = 200;

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
};

const LISTING_PATTERNS = [
  /apartments-flats-for-rent-only\/[a-z0-9-]+-\d+-ad/g,
  /independent-house-for-rent-only\/[a-z0-9-]+-\d+-ad/g,
  /houses-villas-for-rent-only\/[a-z0-9-]+-\d+-ad/g,
];

const paths = new Map();

if (fs.existsSync(OUT)) {
  for (const e of JSON.parse(fs.readFileSync(OUT, "utf-8"))) {
    if (e.id) paths.set(e.id, e);
  }
}

function addPath(p, cityHint) {
  const id = p.match(/-(\d+)-ad$/)?.[1];
  if (!id || paths.has(id)) return;
  paths.set(id, {
    path: p,
    url: `${BASE}/${p}`,
    id,
    city: cityHint,
  });
}

async function scan(url, cityHint) {
  try {
    const t = await fetch(url, { headers }).then((r) => (r.ok ? r.text() : ""));
    for (const re of LISTING_PATTERNS) {
      for (const m of t.matchAll(re)) addPath(m[0], cityHint);
    }
    const next = t.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (next) {
      for (const re of LISTING_PATTERNS) {
        for (const m of next[1].matchAll(re)) addPath(m[0], cityHint);
      }
    }
  } catch {
    /* skip */
  }
}

const urls = [];

for (const city of CITIES) {
  for (const page of CATEGORY_PAGES) {
    for (let p = 1; p <= MAX_PAGES; p++) {
      const base = `${BASE}/${page}/${city}`;
      urls.push({ url: p === 1 ? base : `${base}?page=${p}`, city });
    }
  }

  const locs = LOCALITIES[city] ?? [];
  for (const loc of locs) {
    for (const kind of [
      "apartments-flats-for-rent",
      "1-bhk-apartments-flats-for-rent",
      "2-bhk-apartments-flats-for-rent",
      "3-bhk-apartments-flats-for-rent",
    ]) {
      for (let p = 1; p <= 4; p++) {
        const base = `${BASE}/${kind}/${loc}-${city}`;
        urls.push({ url: p === 1 ? base : `${base}?page=${p}`, city });
      }
    }
  }
}

console.log(`Scanning ${urls.length} pages (existing ${paths.size} listings)...`);

let added = 0;
for (let i = 0; i < urls.length; i++) {
  const before = paths.size;
  await scan(urls[i].url, urls[i].city);
  added += paths.size - before;

  if ((i + 1) % 25 === 0 || i === urls.length - 1) {
    console.log(`${i + 1}/${urls.length} — ${paths.size} listings (+${added} this run)`);
    if ((i + 1) % 100 === 0) {
      fs.writeFileSync(OUT, JSON.stringify([...paths.values()], null, 2));
    }
  }
  await new Promise((r) => setTimeout(r, DELAY_MS));
}

const list = [...paths.values()];
fs.writeFileSync(OUT, JSON.stringify(list, null, 2));
console.log(`\nSaved ${list.length} unique listings to ${OUT}`);
