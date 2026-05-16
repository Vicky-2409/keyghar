const url = "https://property.sulekha.com/1-bhk-apartments-flats-for-rent/chennai";
const t = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } }).then((r) => r.text());

const ids = [...new Set([...t.matchAll(/1001\d{6}/g)].map((m) => m[0]))];
console.log("ids in page", ids.length);

const apiMatches = [...t.matchAll(/api[^"'\s]{0,80}/gi)].map((m) => m[0]).slice(0, 15);
console.log("api refs", apiMatches);

const next = t.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
if (next) {
  const s = next[1];
  const adIds = [...new Set([...s.matchAll(/1001\d{6}/g)].map((m) => m[0]))];
  console.log("next data ids", adIds.length);
}

// try search API pattern
const rentalPaths = [...new Set([...t.matchAll(/rentalad\/\/[^"'\s]+/g)].map((m) => m[0]))];
console.log("rentalad refs", rentalPaths.length);
