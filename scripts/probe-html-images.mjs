import fs from "fs";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-IN,en;q=0.9",
  Referer: "https://property.sulekha.com/1-bhk-apartments-flats-for-rent/chennai",
};

const url =
  "https://property.sulekha.com/apartments-flats-for-rent-only/200-sqft-1-bhk-flat-for-rent-only-in-ramapuram-chennai-1001649931-ad";

const html = await fetch(url, { headers: HEADERS }).then((r) => r.text());
fs.writeFileSync("scripts/probe-sample.html", html);

for (const k of ["lscdn", "rentalad", "blob.core", ".jpg", "ImageUrl", "photoGallery", "propertyImage"]) {
  console.log(k, (html.match(new RegExp(k, "gi")) || []).length);
}

const next = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
if (next) {
  const data = next[1];
  const urls = [...data.matchAll(/https?:\\?\/\\?\/[^"\\]+\.(?:jpg|jpeg|png|webp)/gi)].map((m) =>
    m[0].replace(/\\/g, "")
  );
  console.log("next_data image urls", urls.length);
  console.log(urls.slice(0, 5));
}
