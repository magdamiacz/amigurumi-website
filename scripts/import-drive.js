const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream/promises");
const { Readable } = require("stream");

const ROOT = path.join(__dirname, "..");
const ASSETS = path.join(ROOT, "assets", "images", "oferta");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const FOLDERS = {
  plecaki: "1tF2ejPUHsxoRft7sxDcDUC0DRZe1tZLO",
  maskotki: "1xV9ea-iCOyMTVNOn8TyZzqi2VWsos32z",
  "zestawy-dla-dzieci": "1xXSntL_p00VTp6vyRy2Q3Bir1p4XOoGB",
  dodatki: "1xcXGWP6flbgMpO-zR0QNK4awAKndqlsb",
  "personalizowane-zwierzaki": "1zwf8pVBR47SsNeIqWHMSdNUkxloc4Ntf",
  "zabawki-dla-zwierzat": "1xc-yDWpD5wBZnerD62E3npDg3ZYheQGP",
  dekoracje: "1xUn1uH1u6oObTUefQ_LraYP55ZYd2_VC",
  kubeczki: "1xTC_MNLiIEMfphGjsbl1QR-a30KuBVLB",
  dywany: "1xV2BZDSKs-CtWM6q76_QWCXMqSzhYBm5",
};

const MAX_GALLERY = 8;
const SKIP_FOLDER_NAMES = new Set(["zdjecia kroliczkow", "zdjęcia króliczków"]);

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function decodeHtml(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}

function titleCaseName(name) {
  const keep = String(name).replace(/\s+/g, " ").trim();
  if (!keep) return keep;
  const fixed = keep.replace(/nowożeństów/i, "nowożeńców");
  if (fixed === fixed.toUpperCase() && /[A-ZĄĆĘŁŃÓŚŹŻ]/.test(fixed)) {
    return fixed
      .toLowerCase()
      .replace(/(^|[\s-])(\S)/g, (_, a, b) => a + b.toLocaleUpperCase("pl-PL"));
  }
  return fixed.charAt(0).toLocaleUpperCase("pl-PL") + fixed.slice(1);
}

function extFromName(name) {
  const m = String(name).match(/\.(jpe?g|png|webp|gif)$/i);
  if (!m) return ".jpg";
  return m[0].toLowerCase() === ".jpeg" ? ".jpg" : m[0].toLowerCase();
}

function isImageName(name) {
  return /\.(jpe?g|png|webp|gif)$/i.test(name);
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

function parseEmbedded(html) {
  const folders = [];
  const files = [];
  const re =
    /<div class="flip-entry" id="entry-([^"]+)"[\s\S]*?href="(https:\/\/drive\.google\.com\/[^"]+)"[\s\S]*?<div class="flip-entry-title">([^<]*)<\/div>/g;
  let m;
  const seen = new Set();
  while ((m = re.exec(html))) {
    const id = m[1];
    if (seen.has(id)) continue;
    seen.add(id);
    const href = m[2];
    const name = decodeHtml(m[3]).trim();
    if (href.includes("/folders/")) folders.push({ id, name });
    else files.push({ id, name });
  }
  return { folders, files };
}

async function listFolder(id) {
  const html = await fetchText(`https://drive.google.com/embeddedfolderview?id=${id}#list`);
  return parseEmbedded(html);
}

async function downloadFile(id, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const tryOnce = async (url) => {
    const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
    if (!res.ok) throw new Error(`download ${id} ${res.status}`);
    const type = (res.headers.get("content-type") || "").toLowerCase();
    if (type.includes("text/html")) {
      const html = await res.text();
      const confirm = html.match(/confirm=([0-9A-Za-z_-]+)/);
      if (confirm) {
        return tryOnce(`https://drive.google.com/uc?export=download&id=${id}&confirm=${confirm[1]}`);
      }
      throw new Error(`html instead of file for ${id}`);
    }
    await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(dest));
    const stat = fs.statSync(dest);
    if (stat.size < 2000) throw new Error(`tiny file ${id} (${stat.size}b)`);
  };
  await tryOnce(`https://drive.google.com/uc?export=download&id=${id}`);
}

function emptyDirContents(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    if (name === ".gitkeep") continue;
    const p = path.join(dir, name);
    fs.rmSync(p, { recursive: true, force: true });
  }
}

async function collectCategory(slug, folderId) {
  const top = await listFolder(folderId);
  const products = [];

  if (top.folders.length) {
    for (const folder of top.folders) {
      const key = folder.name.trim().toLowerCase();
      if (SKIP_FOLDER_NAMES.has(key)) continue;
      const inner = await listFolder(folder.id);
      const images = inner.files.filter((f) => isImageName(f.name)).slice(0, MAX_GALLERY);
      if (!images.length) {
        console.warn("  skip empty", folder.name);
        continue;
      }
      products.push({
        name: titleCaseName(folder.name),
        images,
      });
      await delay(200);
    }
  } else {
    const images = top.files.filter((f) => isImageName(f.name));
    const noun = slug === "kubeczki" ? "Kubeczek" : slug === "zestawy-dla-dzieci" ? "Zestaw" : "Realizacja";
    images.forEach((img, i) => {
      products.push({
        name: `${noun} ${String(i + 1).padStart(2, "0")}`,
        images: [img],
      });
    });
  }

  return products;
}

async function saveProductImages(slug, products) {
  const catDir = path.join(ASSETS, slug);
  fs.mkdirSync(catDir, { recursive: true });
  emptyDirContents(catDir);

  for (let i = 0; i < products.length; i++) {
    const n = String(i + 1).padStart(2, "0");
    const galleryDir = path.join(catDir, n);
    fs.mkdirSync(galleryDir, { recursive: true });
    const product = products[i];
    for (let j = 0; j < product.images.length; j++) {
      const img = product.images[j];
      const ext = extFromName(img.name);
      const galleryName = `${String(j + 1).padStart(2, "0")}${ext}`;
      const dest = path.join(galleryDir, galleryName);
      process.stdout.write(`  ${slug}/${n}/${galleryName}  ${product.name}\n`);
      try {
        await downloadFile(img.id, dest);
      } catch (err) {
        console.warn("    FAIL", img.id, err.message);
        continue;
      }
      if (j === 0) {
        fs.copyFileSync(dest, path.join(catDir, `${n}${ext}`));
      }
      await delay(150);
    }
  }
}

async function main() {
  const catalog = {};
  for (const [slug, id] of Object.entries(FOLDERS)) {
    console.log("\n===", slug, "===");
    const products = await collectCategory(slug, id);
    catalog[slug] = products.map((p) => ({
      name: p.name,
      price: "wycena",
      photos: p.images.length,
    }));
    console.log("products", products.length);
    await saveProductImages(slug, products);
    await delay(300);
  }
  const out = path.join(__dirname, "drive-catalog.json");
  fs.writeFileSync(out, JSON.stringify(catalog, null, 2));
  console.log("\nwrote", out);
  const { spawnSync } = require("child_process");
  const conv = spawnSync("py", ["-3", path.join(__dirname, "convert-heif.py")], { stdio: "inherit" });
  if (conv.status) console.warn("HEIF convert exit", conv.status);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
