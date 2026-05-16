const urls = [
  "https://property.sulekha.com/apartments-flats-for-rent-only/920-sqft-2-bhk-apartment-for-rent-only-in-kazhipathur-chennai-1001649430-ad",
  "https://property.sulekha.com/apartments-flats-for-rent-only/654-sqft-1-bhk-apartment-for-rent-only-at-radiance-mandarin-in-thoraipakkam-chennai-1001649826-ad",
  "https://property.sulekha.com/apartments-flats-for-rent-only/600-sqft-1-bhk-flat-for-rent-only-in-adambakkam-chennai-1001649773-ad",
];

for (const url of urls) {
  const t = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } }).then((r) =>
    r.text()
  );
  const imgs = [
    ...new Set(
      [...t.matchAll(/https:\/\/lscdn\.blob\.core\.windows\.net\/property\/rentalad\/[^"'\s\\]+/g)].map(
        (m) => m[0].replace(/\\/g, "")
      )
    ),
  ];
  console.log("\n", url.split("/").pop(), imgs.length);
  imgs.forEach((i) => console.log(i));
}
