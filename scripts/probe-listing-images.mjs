const LISTING =
  "https://property.sulekha.com/1-bhk-apartments-flats-for-rent/chennai";

const t = await fetch(LISTING, {
  headers: { "User-Agent": "Mozilla/5.0 Chrome/120" },
}).then((r) => r.text());

const paths = [
  ...new Set(
    [...t.matchAll(/apartments-flats-for-rent-only\/[a-z0-9-]+-\d+-ad/g)].map((m) => m[0])
  ),
];

for (const p of paths.slice(0, 8)) {
  const id = p.match(/-(\d+)-ad$/)?.[1];
  const idx = t.indexOf(id);
  const chunk = t.slice(Math.max(0, idx - 3000), idx + 3000);
  const imgs = [
    ...new Set(
      [...chunk.matchAll(/https:\/\/lscdn\.blob\.core\.windows\.net\/property\/rentalad\/[^"'\s]+/g)].map(
        (m) => m[0].split("?")[0]
      )
    ),
  ];
  console.log("\n", p.slice(-50), "imgs:", imgs.length);
  imgs.forEach((i) => console.log(" ", i));
}
