import { chromium } from "playwright";

const url =
  "https://property.sulekha.com/apartments-flats-for-rent-only/654-sqft-1-bhk-apartment-for-rent-only-at-radiance-mandarin-in-thoraipakkam-chennai-1001649826-ad";

const captured = new Set();
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.on("response", async (res) => {
  const u = res.url();
  if (/lscdn.*\.(jpg|jpeg|png|webp)/i.test(u)) captured.add(u.split("?")[0]);
});

await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(3000);

const dom = await page.evaluate(() => {
  const urls = new Set();
  document.querySelectorAll("img").forEach((img) => {
    [img.src, img.getAttribute("data-src"), img.getAttribute("data-original")].forEach((s) => {
      if (s) urls.add(s);
    });
  });
  return [...urls].filter((u) => /lscdn|rentalad|\.jpg/i.test(u));
});

const html = await page.content();
const fromHtml = [...html.matchAll(/lscdn\.blob\.core\.windows\.net[^"'\s\\]+/g)].map((m) => m[0]);

console.log("network", captured.size);
console.log("dom", dom.length, dom.slice(0, 3));
console.log("html", fromHtml.length, fromHtml.slice(0, 3));
await browser.close();
