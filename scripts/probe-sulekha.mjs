const LISTING =
  "https://property.sulekha.com/1-bhk-apartments-flats-for-rent/chennai";
const DETAIL =
  "https://property.sulekha.com/apartments-flats-for-rent-only/200-sqft-1-bhk-flat-for-rent-only-in-ramapuram-chennai-1001649931-ad";

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
};

for (const url of [LISTING, DETAIL]) {
  const t = await fetch(url, { headers }).then((r) => r.text());
  console.log("\n===", url, "len", t.length);
  const ids = [...new Set([...t.matchAll(/100164\d+/g)].map((m) => m[0]))];
  console.log("ids", ids.slice(0, 8));
  const paths = [
    ...new Set([...t.matchAll(/apartments-flats-for-rent-only\/[a-z0-9-]+-\d+-ad/g)].map((m) => m[0])),
  ];
  console.log("paths", paths.slice(0, 5));
  const imgs = [
    ...new Set(
      [...t.matchAll(/https?:\/\/[^"'\s]+\.(?:jpg|jpeg|png|webp)[^"'\s]*/gi)].map((m) =>
        m[0].split("?")[0]
      )
    ),
  ].filter((u) => !/logo|icon|favicon/i.test(u));
  console.log("imgs", imgs.slice(0, 6));
}
