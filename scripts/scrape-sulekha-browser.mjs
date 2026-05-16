/**
 * Browser-based Sulekha scraper — renders pages and downloads gallery images.
 * Usage: TARGET_HOMES=450 node scripts/scrape-sulekha-browser.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";
import { spawn } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "images", "properties");
const DISCOVERED = path.join(__dirname, "discovered-urls.json");
const PROGRESS = path.join(__dirname, "scrape-browser-progress.json");

const TARGET_HOMES = parseInt(process.env.TARGET_HOMES || "450", 10);
const MIN_PHOTOS = 2;
const MAX_PHOTOS = 15;
const DELAY_MS = 350;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function slugifyFolder(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 58);
}

function parsePathMeta(relativePath) {
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
  return { id, locality, city, bedrooms: bhk };
}

function normalizeImageUrl(u) {
  let url = u.replace(/\\/g, "").split("?")[0].trim();
  if (!url.startsWith("http")) url = `https://${url}`;
  url = url.replace(/(rentalad)\/\//, "$1/");
  return url;
}

function extractFromHtml(html) {
  const patterns = [
    /https?:\/\/lscdn\.blob\.core\.windows\.net\/property\/rentalad\/[^"'\s\\]+/gi,
    /lscdn\.blob\.core\.windows\.net\/property\/rentalad\/[^"'\s\\]+/gi,
  ];
  const raw = [];
  for (const re of patterns) {
    for (const m of html.matchAll(re)) raw.push(...m[0].split("~|"));
  }
  const urls = new Set();
  for (const part of raw) {
    const u = normalizeImageUrl(part);
    if (/\.(jpg|jpeg|png|webp)$/i.test(u) && !/logo|icon|avatar/i.test(u)) urls.add(u);
  }
  return urls;
}

function countCompletedHomes() {
  if (!fs.existsSync(OUT_DIR)) return 0;
  return fs.readdirSync(OUT_DIR, { withFileTypes: true }).filter((d) => {
    if (!d.isDirectory()) return false;
    return fs
      .readdirSync(path.join(OUT_DIR, d.name))
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f)).length >= MIN_PHOTOS;
  }).length;
}

function folderForId(id) {
  if (!fs.existsSync(OUT_DIR)) return null;
  return fs.readdirSync(OUT_DIR).find((name) => name.endsWith(id) || name.includes(`-${id}`));
}

async function downloadImage(url, destPath) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 Chrome/120", Referer: "https://property.sulekha.com/" },
    });
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 3000) return false;
    fs.writeFileSync(destPath, buf);
    return true;
  } catch {
    return false;
  }
}

async function scrapeOne(page, item, networkUrls) {
  const { path: relativePath, url } = item;
  const meta = parsePathMeta(relativePath);
  if (folderForId(meta.id)) return { skipped: true, reason: "exists" };

  networkUrls.clear();
  let html = "";
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 55000 });
    await page.waitForTimeout(2500);
    html = await page.content();
  } catch {
    return { skipped: true, reason: "load-failed" };
  }

  const domUrls = await page.evaluate(() => {
    const urls = new Set();
    const add = (src) => {
      if (!src || typeof src !== "string") return;
      if (/lscdn\.blob\.core\.windows\.net\/property/i.test(src)) urls.add(src.split("?")[0]);
    };
    document.querySelectorAll("img").forEach((img) => {
      add(img.src);
      add(img.getAttribute("data-src"));
      add(img.getAttribute("data-original"));
    });
    return [...urls];
  });

  const imageUrls = [
    ...new Set([
      ...networkUrls,
      ...domUrls.map(normalizeImageUrl),
      ...extractFromHtml(html),
    ]),
  ];

  if (imageUrls.length < MIN_PHOTOS) return { skipped: true, reason: "no-photos" };

  const folderName = slugifyFolder(`${meta.locality}-${meta.bedrooms}bhk-${meta.city}-${meta.id}`);
  const folderPath = path.join(OUT_DIR, folderName);
  fs.mkdirSync(folderPath, { recursive: true });

  const localImages = [];
  for (const src of imageUrls.slice(0, MAX_PHOTOS)) {
    const fileName = `${String(localImages.length + 1).padStart(2, "0")}.jpg`;
    if (await downloadImage(src, path.join(folderPath, fileName))) {
      localImages.push(`/images/properties/${folderName}/${fileName}`);
    }
  }

  if (localImages.length < MIN_PHOTOS) {
    fs.rmSync(folderPath, { recursive: true, force: true });
    return { skipped: true, reason: "download-failed" };
  }
  return { ok: true, folder: folderName, photos: localImages.length };
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

  let listings = JSON.parse(fs.readFileSync(DISCOVERED, "utf-8"));
  // Prefer listings not yet downloaded
  listings = [
    ...listings.filter((l) => !folderForId(l.id)),
    ...listings.filter((l) => folderForId(l.id)),
  ];

  let completed = countCompletedHomes();
  const { lastIndex } = loadProgress();

  console.log(`Browser scrape | Target: ${TARGET_HOMES} | Have: ${completed} | URLs: ${listings.length}`);
  console.log(`Resume index: ${lastIndex}\n`);

  if (completed >= TARGET_HOMES) {
    spawn("node", ["scripts/build-manifest-from-disk.mjs"], { cwd: ROOT, stdio: "inherit", shell: true });
    return;
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    locale: "en-IN",
  });
  const page = await context.newPage();
  const networkUrls = new Set();
  page.on("response", (res) => {
    const u = res.url();
    if (/lscdn\.blob\.core\.windows\.net\/property.*\.(jpg|jpeg|png|webp)/i.test(u)) {
      networkUrls.add(normalizeImageUrl(u));
    }
  });

  for (let i = lastIndex; i < listings.length; i++) {
    if (completed >= TARGET_HOMES) break;
    const item = listings[i];
    process.stdout.write(`[${completed}/${TARGET_HOMES}] #${i} ${item.id} `);
    try {
      const result = await scrapeOne(page, item, networkUrls);
      if (result.ok) {
        completed++;
        console.log(`✓ ${result.photos} photos → ${result.folder}`);
      } else {
        console.log(`skip (${result.reason})`);
      }
    } catch (e) {
      console.log(`err ${e.message}`);
    }
    if (i % 5 === 0) saveProgress(i + 1, completed);
    await sleep(DELAY_MS);
  }

  await browser.close();
  saveProgress(listings.length, completed);
  console.log(`\nDone: ${completed} homes.`);
  spawn("node", ["scripts/build-manifest-from-disk.mjs"], { cwd: ROOT, stdio: "inherit", shell: true });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
