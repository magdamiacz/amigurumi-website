const fs = require("fs");
const path = require("path");

const BASE = "https://szydelkoamigurumi.wixsite.com/oferta";
const CATEGORIES = [
  "torebki",
  "plecaki",
  "maskotki",
  "dekoracje",
  "dywany",
  "opaski",
  "kubeczki",
  "zestawy-dla-dzieci",
];

function stripHtml(html) {
  return String(html || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; SzydelkomaniaBot/1.0)" },
  });
  if (!res.ok) return { ok: false, status: res.status, text: "" };
  return { ok: true, status: res.status, text: await res.text() };
}

function parseWarmup(html) {
  const match = html.match(/<script type="application\/json" id="wix-warmup-data">([\s\S]*?)<\/script>/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function walk(node, pred, found = []) {
  if (!node || typeof node !== "object") return found;
  if (pred(node)) found.push(node);
  for (const value of Object.values(node)) {
    if (value && typeof value === "object") walk(value, pred, found);
  }
  return found;
}

function extractProduct(data) {
  const products = walk(
    data,
    (n) => n && typeof n.name === "string" && Array.isArray(n.productItems) && n.urlPart
  );
  const product = products[0];
  if (!product) return null;

  const options = (product.options || []).map((opt) => ({
    title: String(opt.title || "").trim(),
    selections: (opt.selections || []).map((sel) => ({
      id: sel.id,
      value: String(sel.value || sel.description || "").trim(),
    })),
  }));

  const items = (product.productItems || []).map((item) => ({
    price: item.price,
    selections: item.optionsSelections || [],
    surcharge: item.surcharge || 0,
  }));

  const prices = items.map((item) => item.price).filter((n) => typeof n === "number");
  const minPrice = prices.length ? Math.min(...prices) : product.price;
  const maxPrice = prices.length ? Math.max(...prices) : product.price;
  const hasOptions =
    options.some((opt) => opt.selections.length > 1) || (prices.length > 1 && minPrice !== maxPrice);

  return {
    name: product.name,
    slug: product.urlPart,
    price: product.price,
    minPrice,
    maxPrice,
    hasOptions,
    descriptionHtml: product.description || "",
    description: stripHtml(product.description || ""),
    options,
    items,
  };
}

async function main() {
  const slugs = new Set();
  for (const cat of CATEGORIES) {
    const { ok, text } = await fetchText(`${BASE}/${cat}`);
    if (!ok) continue;
    const data = parseWarmup(text);
    const parts = walk(data, (n) => typeof n?.urlPart === "string").map((n) => n.urlPart);
    for (const slug of parts) slugs.add(slug);
    console.log(`category ${cat}: ${parts.join(", ")}`);
  }

  const existingPath = path.join(__dirname, "wix-catalog.json");
  const existing = fs.existsSync(existingPath) ? JSON.parse(fs.readFileSync(existingPath, "utf8")) : [];
  const bySlug = new Map(existing.map((p) => [p.slug, p]));

  for (const slug of [...slugs]) {
    if (bySlug.has(slug)) continue;
    const { ok, status, text } = await fetchText(`${BASE}/product-page/${encodeURI(slug)}`);
    if (!ok) {
      console.log(`skip ${slug} ${status}`);
      continue;
    }
    const data = parseWarmup(text);
    const product = extractProduct(data);
    if (!product) {
      console.log(`no json ${slug}`);
      continue;
    }
    bySlug.set(product.slug, product);
    console.log(`${product.name} | ${product.minPrice}-${product.maxPrice} | ${product.slug}`);
  }

  const products = [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name, "pl"));
  fs.writeFileSync(existingPath, JSON.stringify(products, null, 2), "utf8");
  console.log(`wrote ${products.length} products`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
