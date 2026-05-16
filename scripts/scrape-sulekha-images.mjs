/**
 * Scrape Sulekha rental homes with multi-photo sets into public/images/properties/
 * Target: 400+ homes by default (set TARGET_HOMES env to override)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "images", "properties");
const DISCOVERED = path.join(__dirname, "discovered-urls.json");
const PROGRESS = path.join(__dirname, "scrape-progress.json");

const TARGET_HOMES = parseInt(process.env.TARGET_HOMES || "450", 10);
const MIN_PHOTOS = 2;
const MAX_PHOTOS_PER_HOME = 15;
const DELAY_MS = parseInt(process.env.SCRAPE_DELAY_MS || "280", 10);
const BATCH_LOG = 10;

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-IN,en;q=0.9",
  Referer: "https://property.sulekha.com/1-bhk-apartments-flats-for-rent/chennai",
};

async function fetchHtml(url, retries = 4) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (res.status === 403) {
        await sleep(800 + attempt * 600);
        continue;
      }
      if (!res.ok) return "";
      return await res.text();
    } catch {
      await sleep(500);
    }
  }
  return "";
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function slugifyFolder(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 58);
}

function extractRentalImages(html) {
  const patterns = [
    /https?:\/\/lscdn\.blob\.core\.windows\.net\/property\/rentalad\/[^"'\s\\]+/gi,
    /lscdn\.blob\.core\.windows\.net\/property\/rentalad\/[^"'\s\\]+/gi,
    /https?:\/\/lscdn\.blob\.core\.windows\.net\/property\/[^"'\s\\]+\.(?:jpg|jpeg|png|webp)/gi,
  ];
  const raw = [];
  for (const re of patterns) {
    for (const m of html.matchAll(re)) raw.push(...m[0].split("~|"));
  }
  const urls = new Set();
  for (let u of raw) {
    u = u.replace(/\\/g, "").split("?")[0].trim();
    if (!u.startsWith("http")) u = `https://${u}`;
    u = u.replace(/(rentalad)\/\//, "$1/");
    if (/\.(jpg|jpeg|png|webp)$/i.test(u) && !/logo|icon|avatar|banner/i.test(u)) {
      urls.add(u);
    }
  }
  return [...urls];
}

function parsePathMeta(relativePath, url) {
  const pathPart = relativePath.replace(/-ad$/, "");
  const id = pathPart.match(/-(\d+)$/)?.[1] ?? "0";

  const cityMatch =
    pathPart.match(/-in-[a-z0-9-]+-([a-z]+)-\d+$/i) ||
    pathPart.match(/-in-([a-z]+)-\d+$/i);
  const citySlug = cityMatch?.[1] ?? "chennai";
  const city = citySlug.charAt(0).toUpperCase() + citySlug.slice(1);

  const localitySlug = pathPart.match(/-in-([a-z0-9-]+)-[a-z]+-\d+$/i)?.[1];
  const locality = localitySlug
    ? localitySlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : city;

  const bhk = parseInt(pathPart.match(/(\d+)-bhk/i)?.[1] || "1", 10);
  const sqft = parseInt(pathPart.match(/^(\d+)-sqft/i)?.[1] || "600", 10);

  return {
    id,
    title: `${bhk} BHK for Rent in ${locality}`,
    locality,
    city,
    bedrooms: bhk,
    sqft,
    price: bhk === 1 ? 9000 + (parseInt(id, 10) % 25) * 700 : 15000 + (parseInt(id, 10) % 30) * 900,
    furnishing: "semi-furnished",
    sourceUrl: url,
  };
}

async function downloadImage(url, destPath) {
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 3500) return false;
    fs.writeFileSync(destPath, buf);
    return true;
  } catch {
    return false;
  }
}

function countCompletedHomes() {
  if (!fs.existsSync(OUT_DIR)) return 0;
  return fs.readdirSync(OUT_DIR, { withFileTypes: true }).filter((d) => {
    if (!d.isDirectory()) return false;
    return (
      fs.readdirSync(path.join(OUT_DIR, d.name)).filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .length >= MIN_PHOTOS
    );
  }).length;
}

function folderForId(id) {
  if (!fs.existsSync(OUT_DIR)) return null;
  return fs.readdirSync(OUT_DIR).find((name) => name.endsWith(id) || name.includes(`-${id}`));
}

async function scrapeOne(item) {
  const { path: relativePath, url } = item;
  const meta = parsePathMeta(relativePath, url);

  if (folderForId(meta.id)) return { skipped: true, reason: "exists" };

  const html = await fetchHtml(url);
  const imageUrls = extractRentalImages(html);
  if (imageUrls.length < MIN_PHOTOS) return { skipped: true, reason: "no-photos" };

  const folderName = slugifyFolder(`${meta.locality}-${meta.bedrooms}bhk-${meta.city}-${meta.id}`);
  const folderPath = path.join(OUT_DIR, folderName);
  fs.mkdirSync(folderPath, { recursive: true });

  const localImages = [];
  for (let i = 0; i < imageUrls.length && localImages.length < MAX_PHOTOS_PER_HOME; i++) {
    const fileName = `${String(localImages.length + 1).padStart(2, "0")}.jpg`;
    if (await downloadImage(imageUrls[i], path.join(folderPath, fileName))) {
      localImages.push(`/images/properties/${folderName}/${fileName}`);
    }
    await sleep(50);
  }

  if (localImages.length < MIN_PHOTOS) {
    fs.rmSync(folderPath, { recursive: true, force: true });
    return { skipped: true, reason: "download-failed" };
  }

  return { ok: true, folder: folderName, photos: localImages.length, meta };
}

function loadProgress() {
  if (!fs.existsSync(PROGRESS)) return { lastIndex: 0 };
  try {
    return JSON.parse(fs.readFileSync(PROGRESS, "utf-8"));
  } catch {
    return { lastIndex: 0 };
  }
}

function saveProgress(lastIndex, completed) {
  fs.writeFileSync(
    PROGRESS,
    JSON.stringify({ lastIndex, completed, updatedAt: new Date().toISOString() }, null, 2)
  );
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  if (!fs.existsSync(DISCOVERED)) {
    console.log("Run: npm run discover:listings");
    process.exit(1);
  }

  const listings = JSON.parse(fs.readFileSync(DISCOVERED, "utf-8"));
  let completed = countCompletedHomes();
  const { lastIndex } = loadProgress();

  console.log(`Target: ${TARGET_HOMES} homes | Have: ${completed} | Pool: ${listings.length} URLs`);
  console.log(`Resuming from index ${lastIndex}\n`);

  if (completed >= TARGET_HOMES) {
    console.log("Target already met. Rebuilding manifest...");
    runManifest();
    return;
  }

  let processed = 0;
  let ok = 0;
  let skip = 0;

  for (let i = lastIndex; i < listings.length; i++) {
    if (completed >= TARGET_HOMES) break;

    const item = listings[i];
    process.stdout.write(`[${completed}/${TARGET_HOMES}] #${i} ${item.id} `);

    try {
      const result = await scrapeOne(item);
      if (result.ok) {
        completed++;
        ok++;
        console.log(`✓ ${result.photos} photos → ${result.folder}`);
      } else {
        skip++;
        console.log(`skip (${result.reason})`);
      }
    } catch (e) {
      skip++;
      console.log(`err ${e.message}`);
    }

    processed++;
    if (processed % BATCH_LOG === 0) saveProgress(i + 1, completed);
    await sleep(DELAY_MS);
  }

  saveProgress(listings.length, completed);
  console.log(`\nDone: ${completed} homes (${ok} new, ${skip} skipped).`);
  runManifest();
}

function runManifest() {
  spawn("node", ["scripts/build-manifest-from-disk.mjs"], { cwd: ROOT, stdio: "inherit", shell: true });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
