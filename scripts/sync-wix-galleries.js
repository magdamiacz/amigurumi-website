const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream/promises");
const { Readable } = require("stream");
const {
  cats,
  productFolder,
  listNumberedFiles,
  imagesRoot,
  findWix,
  useWixProduct,
} = require("./generate-oferta");

const BASE = "https://szydelkoamigurumi.wixsite.com/oferta";
const UA = "Mozilla/5.0 (compatible; SzydelkomaniaBot/1.0)";

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function walk(node, pred, found = []) {
  if (!node || typeof node !== "object") return found;
  if (pred(node)) found.push(node);
  for (const value of Object.values(node)) {
    if (value && typeof value === "object") walk(value, pred, found);
  }
  return found;
}

function isVideo(item) {
  const type = String(item?.mediaType || "").toLowerCase();
  return Boolean(item?.videoType) || type.includes("video");
}

function originalMediaUrl(item) {
  if (!item || isVideo(item)) return "";
  const raw = String(item.url || item.fullUrl || "");
  const file = raw
    .replace(/^https?:\/\/static\.wixstatic\.com\/media\//i, "")
    .split("/v1/")[0]
    .split("?")[0];
  if (!file) return "";
  if (/^https?:\/\//i.test(file)) return file;
  return `https://static.wixstatic.com/media/${file}`;
}

async function fetchProductMedia(slug) {
  const res = await fetch(`${BASE}/product-page/${encodeURI(slug)}`, {
    headers: { "User-Agent": UA },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const match = html.match(/<script type="application\/json" id="wix-warmup-data">([\s\S]*?)<\/script>/);
  if (!match) throw new Error("no warmup");
  const data = JSON.parse(match[1]);
  const products = walk(
    data,
    (n) => n && typeof n.name === "string" && n.urlPart && Array.isArray(n.media)
  );
  const product = products[0];
  if (!product) throw new Error("no product json");
  return (product.media || []).map(originalMediaUrl).filter(Boolean);
}

async function downloadImage(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const type = (res.headers.get("content-type") || "").toLowerCase();
  if (!type.includes("image") && !type.includes("octet-stream")) {
    throw new Error(`not image (${type})`);
  }
  const tmp = `${dest}.part`;
  await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(tmp));
  const size = fs.statSync(tmp).size;
  if (size < 2000) {
    fs.unlinkSync(tmp);
    throw new Error(`tiny file ${size}b`);
  }
  fs.renameSync(tmp, dest);
}

async function main() {
  const report = [];
  for (const c of cats) {
    for (const [i, product] of c.products.entries()) {
      if (!useWixProduct(product.name)) continue;
      const wix = findWix(product.name);
      if (!wix?.slug) continue;
      const folder = String(productFolder(product, i)).padStart(2, "0");
      const galleryDir = path.join(imagesRoot, c.slug, folder);
      fs.mkdirSync(galleryDir, { recursive: true });
      const local = listNumberedFiles(galleryDir).length;
      let urls = [];
      try {
        urls = await fetchProductMedia(wix.slug);
      } catch (err) {
        console.warn("FAIL fetch", product.name, err.message);
        await delay(250);
        continue;
      }
      const row = {
        name: product.name,
        wix: urls.length,
        local,
        folder: `${c.slug}/${folder}`,
      };
      report.push(row);
      if (urls.length <= local) {
        console.log("ok   ", product.name, `${local} lokalnie / ${urls.length} Wix`);
        await delay(200);
        continue;
      }
      console.log("sync ", product.name, `${local} → ${urls.length}`);
      for (let j = 0; j < urls.length; j++) {
        const dest = path.join(galleryDir, `${String(j + 1).padStart(2, "0")}.jpg`);
        try {
          await downloadImage(urls[j], dest);
          process.stdout.write(`  ${folder}/${String(j + 1).padStart(2, "0")}.jpg\n`);
        } catch (err) {
          console.warn("    FAIL", j + 1, err.message);
        }
        await delay(120);
      }
      const thumb = path.join(imagesRoot, c.slug, `${folder}.jpg`);
      const first = path.join(galleryDir, "01.jpg");
      if (fs.existsSync(first)) fs.copyFileSync(first, thumb);
      await delay(200);
    }
  }
  console.log("\nPorównanie lokalne vs Wix:");
  for (const row of report) {
    const mark = row.wix > row.local ? "BRAK" : "OK";
    console.log(`  [${mark}] ${row.name}: lokalnie ${row.local}, Wix ${row.wix} (${row.folder})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
