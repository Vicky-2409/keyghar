import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const list = JSON.parse(
  fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "discovered-urls.json"), "utf-8")
);

function extract(html) {
  const raw = [...html.matchAll(/lscdn\.blob\.core\.windows\.net\/property\/rentalad\/[^"'\s\\]+/g)].flatMap(
    (m) => m[0].split("~|")
  );
  return [...new Set(raw.map((u) => u.replace(/\\/g, "")))].filter((u) => /\.(jpg|jpeg|png)$/i.test(u));
}

let with2 = 0;
let with1 = 0;
let none = 0;
const sample = list.slice(0, 80);

for (const item of sample) {
  const html = await fetch(item.url, { headers: { "User-Agent": "Mozilla/5.0" } }).then((r) => r.text());
  const n = extract(html).length;
  if (n >= 2) with2++;
  else if (n === 1) with1++;
  else none++;
  await new Promise((r) => setTimeout(r, 300));
}

console.log("sample 80:", { with2, with1, none });
console.log("estimated 2+ from", list.length, ":", Math.round((with2 / 80) * list.length));
