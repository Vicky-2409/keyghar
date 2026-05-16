const pages = [
  "https://property.sulekha.com/1-bhk-apartments-flats-for-rent/chennai",
  "https://property.sulekha.com/2-bhk-apartments-flats-for-rent/chennai",
  "https://property.sulekha.com/3-bhk-apartments-flats-for-rent/chennai",
  "https://property.sulekha.com/apartments-flats-for-rent/chennai",
  "https://property.sulekha.com/1-bhk-apartments-flats-for-rent/chennai?page=2",
  "https://property.sulekha.com/2-bhk-apartments-flats-for-rent/chennai?page=2",
];

for (const url of pages) {
  const t = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } }).then((r) =>
    r.text()
  );
  const paths = [
    ...new Set(
      [...t.matchAll(/apartments-flats-for-rent-only\/[a-z0-9-]+-\d+-ad/g)].map((m) => m[0])
    ),
  ];
  console.log(url.split("/").slice(-2).join("/"), "->", paths.length, "listings");
}
