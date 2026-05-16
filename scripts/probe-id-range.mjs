const headers = { "User-Agent": "Mozilla/5.0" };

function extractImages(html) {
  const raw = [
    ...html.matchAll(
      /https:\/\/lscdn\.blob\.core\.windows\.net\/property\/rentalad\/[^"'\s\\]+/g
    ),
  ].flatMap((m) => m[0].split("~|"));
  return [...new Set(raw.map((u) => u.replace(/\\/g, "").split("?")[0]))].filter((u) =>
    /\.(jpg|jpeg|png)$/i.test(u)
  );
}

// probe ID range around known IDs
let withPhotos = 0;
let checked = 0;
for (let id = 1001648500; id < 1001650500; id += 7) {
  const url = `https://property.sulekha.com/apartments-flats-for-rent-only/1-bhk-flat-for-rent-only-in-chennai-chennai-${id}-ad`;
  checked++;
  try {
    const r = await fetch(url, { headers, redirect: "follow" });
    if (!r.ok) continue;
    const finalUrl = r.url;
    if (!finalUrl.includes("-ad")) continue;
    const html = await r.text();
    const imgs = extractImages(html);
    if (imgs.length >= 2) {
      withPhotos++;
      console.log(id, imgs.length, finalUrl.split("/").pop().slice(0, 60));
    }
  } catch {}
  if (checked % 50 === 0) console.log("checked", checked, "found", withPhotos);
}
console.log("done", withPhotos, "of", checked);
