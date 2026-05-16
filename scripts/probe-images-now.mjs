import fs from "fs";

const url =
  "https://property.sulekha.com/apartments-flats-for-rent-only/200-sqft-1-bhk-flat-for-rent-only-in-ramapuram-chennai-1001649931-ad";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-IN,en;q=0.9",
  Referer: "https://property.sulekha.com/1-bhk-apartments-flats-for-rent/chennai",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "same-origin",
};

const html = await fetch(url, { headers: HEADERS }).then((r) => r.text());
console.log("status ok len", html.length);

function extract(html) {
  const patterns = [
    /https:\/\/lscdn\.blob\.core\.windows\.net\/property\/rentalad\/[^"'\s\\]+/g,
    /lscdn\.blob\.core\.windows\.net\/property\/rentalad\/[^"'\s\\]+/g,
  ];
  const raw = [];
  for (const re of patterns) {
    for (const m of html.matchAll(re)) raw.push(...m[0].split("~|"));
  }
  return [...new Set(raw.map((u) => (u.startsWith("http") ? u : `https://${u}`).replace(/\\/g, "")))].filter(
    (u) => /\.(jpg|jpeg|png|webp)$/i.test(u.split("?")[0])
  );
}

const imgs = extract(html);
console.log("images", imgs.length);
console.log(imgs.slice(0, 3));
