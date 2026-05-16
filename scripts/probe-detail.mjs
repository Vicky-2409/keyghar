const DETAIL =
  "https://property.sulekha.com/apartments-flats-for-rent-only/200-sqft-1-bhk-flat-for-rent-only-in-ramapuram-chennai-1001649931-ad";

const t = await fetch(DETAIL, {
  headers: { "User-Agent": "Mozilla/5.0 Chrome/120" },
}).then((r) => r.text());

const patterns = [
  /lscdn\.blob\.core\.windows\.net[^"'\s]+/gi,
  /slkimgs\.com[^"'\s]+/gi,
  /rentalad[^"'\s]+/gi,
  /"ImageUrl[^"]*"[^"]*"([^"]+)"/gi,
  /gallery[^]{0,200}/gi,
];

for (const p of patterns) {
  const m = [...t.matchAll(p)].map((x) => (x[1] || x[0]).slice(0, 120));
  if (m.length) console.log(p.source.slice(0, 40), m.slice(0, 8));
}

// __NEXT_DATA__ or similar
const next = t.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
if (next) {
  const data = JSON.parse(next[1]);
  const str = JSON.stringify(data);
  const imgs = [...str.matchAll(/lscdn\.blob\.core\.windows\.net[^"\\]+/g)].map((x) => x[0]);
  console.log("next imgs", [...new Set(imgs)]);
}

// search PropertyImage
const idx = t.indexOf("PropertyImage");
if (idx > -1) console.log("snippet", t.slice(idx, idx + 500));
