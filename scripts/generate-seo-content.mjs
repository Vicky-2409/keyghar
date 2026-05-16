/**
 * Build SEO pages + locality guides from scraped property manifest (propertyImages.json).
 * Run: npm run generate:seo
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function slug(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const bundles = JSON.parse(
  readFileSync(join(ROOT, "src/data/propertyImages.json"), "utf8")
);
const localities = JSON.parse(
  readFileSync(join(ROOT, "src/data/localities.json"), "utf8")
);
const existingSeo = JSON.parse(
  readFileSync(join(ROOT, "src/data/seoPages.json"), "utf8")
);

const CITIES = ["Chennai", "Pune", "Bangalore", "Mumbai", "Hyderabad"];
const seoSet = new Set(existingSeo);

for (const city of CITIES) {
  const cs = slug(city);
  seoSet.add(`flats-for-rent-in-${cs}`);
  seoSet.add(`apartments-in-${cs}`);
  seoSet.add(`houses-for-rent-in-${cs}`);
  seoSet.add(`pg-in-${cs}`);
}

for (const city of Object.keys(localities)) {
  for (const loc of localities[city]) {
    const ls = slug(loc.name);
    seoSet.add(`flats-for-rent-in-${ls}`);
    seoSet.add(`1-bhk-flats-in-${ls}`);
    seoSet.add(`2-bhk-flats-in-${ls}`);
    seoSet.add(`3-bhk-flats-in-${ls}`);
    seoSet.add(`pg-in-${ls}`);
  }
}

for (const b of bundles) {
  const ls = slug(b.locality);
  const cs = slug(b.city);
  seoSet.add(`flats-for-rent-in-${ls}`);
  if (b.bedrooms >= 1 && b.bedrooms <= 3) {
    seoSet.add(`${b.bedrooms}-bhk-flats-in-${ls}`);
  }
  seoSet.add(`flats-for-rent-in-${cs}`);
}

const seoPages = [...seoSet].sort();

const byLocality = new Map();
for (const b of bundles) {
  const key = `${b.city}|${b.locality}`;
  if (!byLocality.has(key)) byLocality.set(key, []);
  byLocality.get(key).push(b);
}

const generatedPosts = [];

function fmtPrice(n) {
  return n >= 100000 ? `₹${(n / 100000).toFixed(1)} Lakh` : `₹${n.toLocaleString("en-IN")}`;
}

const sortedLocalities = [...byLocality.entries()].sort(
  (a, b) => b[1].length - a[1].length
);

for (const [key, list] of sortedLocalities) {
  if (generatedPosts.length >= 24) break;
  const [city, locality] = key.split("|");
  const postSlug = `rent-guide-${slug(locality)}-${slug(city)}`;

  const prices = list.map((b) => b.price).sort((a, b) => a - b);
  const minP = prices[0];
  const maxP = prices[prices.length - 1];
  const avgBhk =
    Math.round((list.reduce((s, b) => s + b.bedrooms, 0) / list.length) * 10) / 10;

  const ls = slug(locality);
  const seoSlug =
    seoPages.find((s) => s.includes(`-${ls}`) && s.includes("bhk")) ??
    seoPages.find((s) => s.includes(ls)) ??
    `flats-for-rent-in-${slug(city)}`;

  const relatedLinks = [
    { href: `/${seoSlug}`, label: `Browse rentals in ${locality}` },
    {
      href: `/search?city=${encodeURIComponent(city)}&q=${encodeURIComponent(locality)}`,
      label: `Search all ${locality} homes`,
    },
    {
      href: `/search?city=${encodeURIComponent(city)}`,
      label: `Explore all of ${city}`,
    },
    { href: "/blog", label: "More rental guides" },
  ];

  const published = new Date(2026, 4, 10 + (generatedPosts.length % 20));

  generatedPosts.push({
    slug: postSlug,
    title: `Rent in ${locality}, ${city}: Prices, BHK Options & Tips (2026)`,
    excerpt: `Based on ${list.length} listings on KeyGhar — typical rents ${fmtPrice(minP)}–${fmtPrice(maxP)}/month in ${locality}.`,
    publishedAt: published.toISOString().slice(0, 10),
    readMinutes: 6,
    city,
    locality,
    relatedLinks,
    content: `
${locality} in ${city} is a popular choice for renters balancing commute, schools, and monthly budget. On KeyGhar we surface ${list.length} homes in this area with photos, BHK details, and owner contact options.

Typical rents here range from ${fmtPrice(minP)} to ${fmtPrice(maxP)} per month depending on BHK, furnishing, and building age. Listings skew toward about ${avgBhk} BHK on average—use filters for furnished, PG, and immediate move-in on our search page.

When comparing flats, confirm maintenance, parking, water supply, and metro or IT park distance. Visit multiple homes in one trip to compare light and noise. Review our rental agreement guide before paying a deposit.

Use the links below to browse ${locality} SEO listings or run a live search on KeyGhar.`,
  });
}

writeFileSync(
  join(ROOT, "src/data/seoPages.json"),
  JSON.stringify(seoPages, null, 2) + "\n"
);
writeFileSync(
  join(ROOT, "src/data/blogPosts.generated.json"),
  JSON.stringify(generatedPosts, null, 2) + "\n"
);

console.log(`SEO pages: ${seoPages.length}`);
console.log(`Locality guides written: ${generatedPosts.length}`);
