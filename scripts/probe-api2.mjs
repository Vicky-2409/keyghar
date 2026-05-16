const url = "https://property.sulekha.com/1-bhk-apartments-flats-for-rent/chennai";
const t = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } }).then((r) => r.text());

const patterns = [
  /https?:\/\/[^"'\s]+property[^"'\s]*/gi,
  /https?:\/\/[^"'\s]+sulekha[^"'\s]*api[^"'\s]*/gi,
  /GetProperty[^"'\s]*/gi,
  /propertylist[^"'\s]*/gi,
  /SearchResult[^"'\s]*/gi,
];

for (const p of patterns) {
  const m = [...new Set([...t.matchAll(p)].map((x) => x[0].slice(0, 100)))];
  if (m.length) console.log(p.source.slice(0, 30), m.slice(0, 5));
}

// window.__ or initial state
const state = t.match(/window\.__[A-Z_]+__\s*=\s*(\{[\s\S]{0,500})/);
if (state) console.log("window state", state[0].slice(0, 200));
