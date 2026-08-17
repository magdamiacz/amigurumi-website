const fs = require("fs");
const path = require("path");

const FB = "https://www.facebook.com/szydelkomania.amigurumi/";
const IG = "https://www.instagram.com/szydelkomania_amigurumi/";
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".webp", ".png"]);

const SAFETY_BAG =
  "Bezpieczeństwo: polska przędza bawełniana, solidne wykonanie handmade. Produkt użytkowy — sprawdzaj szwy i uchwyty przed każdym użyciem. Nie jest zabawką.";
const SAFETY_DECOR_MASCOT =
  "Bezpieczeństwo: maskotka dekoracyjna do pokoju dziecięcego (nie zabawka do intensywnej zabawy). Oczy i detale są trwale mocowane; poniżej 3. r.ż. tylko pod nadzorem dorosłych.";
const SAFETY_GENERAL =
  "Bezpieczeństwo: rękodzieło z polskiej przędzy bawełnianej. Sprawdzaj mocowanie detali. Nie jest zabawką przeznaczoną dla niemowląt bez nadzoru.";
const SAFETY_PET =
  "Bezpieczeństwo: zabawka dla zwierząt — używaj pod nadzorem. Usuń przy uszkodzeniu (ryzyko połknięcia włóczki). Nie dla dzieci.";

const MATERIAL_COTTON =
  "Polska przędza bawełniana premium. Kolor dobieram z palety 70+ odcieni — napisz, jaki efekt chcesz uzyskać.";
const MATERIAL_BAG =
  "Polska przędza bawełniana i poliestrowa. Kolor dobieram z palety 70+ odcieni — napisz, jaki efekt chcesz uzyskać.";
const CARE_GENERAL =
  "Pranie ręczne w letniej wodzie, bez wybielaczy. Suszyć na płasko, z dala od grzejnika. Nie prasować na wysokiej temperaturze.";
const CARE_PET =
  "Po zabawie sprawdź splot. Przy uszkodzeniu odłóż zabawkę — luźna włóczka nie powinna trafić do żołądka pupila. Czyść na sucho lub delikatnie ręcznie.";
const LEAD_TIME_GENERAL =
  "Zwykle 7–21 dni roboczych od potwierdzenia warunków. Termin i koszt wysyłki ustalamy indywidualnie w odpowiedzi na zapytanie.";

function copyFor(c) {
  return {
    material: c.material || MATERIAL_COTTON,
    care: c.care || (c.safety === SAFETY_PET ? CARE_PET : CARE_GENERAL),
    lead: c.lead || LEAD_TIME_GENERAL,
    safety: c.safety,
  };
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const CACHE = "20260817aa";

function productSlug(name) {
  return String(name)
    .toLowerCase()
    .replace(/ł/g, "l")
    .replace(/ą/g, "a")
    .replace(/ć/g, "c")
    .replace(/ę/g, "e")
    .replace(/ń/g, "n")
    .replace(/ó/g, "o")
    .replace(/ś/g, "s")
    .replace(/ź/g, "z")
    .replace(/ż/g, "z")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const BAG_COLOR_CHARTS = [
  {
    label: "Kolory torebki",
    src: "../assets/images/kolory/przedza.png",
    alt: "Kolory przędzy do wyboru",
  },
  {
    label: "Kolor skórki",
    src: "../assets/images/kolory/skorki.png",
    alt: "Kolory skórek do wyboru",
  },
  {
    label: "Kolory pasków",
    src: "../assets/images/kolory/paski.png",
    alt: "Kolory pasków do wyboru",
  },
  {
    label: "Kolory sznurka",
    src: "../assets/images/kolory/sznurka.png",
    alt: "Kolory sznurka do wyboru",
  },
  {
    label: "Przędza we wzory",
    src: "../assets/images/kolory/przedza-wzory.png",
    alt: "Kolory przędzy we wzory do wyboru",
  },
];

function galleryExtrasAttr(c) {
  if (!c.colorCharts?.length) return "";
  return `\n              data-gallery-extras="${esc(c.colorCharts.map((chart) => chart.src).join("|"))}"`;
}

function galleryDataAttrs(c, title, priceFull) {
  const copy = copyFor(c);
  const inquire = `../index.html?produkt=${encodeURIComponent(title)}#kontakt`;
  return [
    `data-gallery-title="${esc(title)}"`,
    `data-gallery-price="${esc(priceFull)}"`,
    `data-gallery-desc="${esc(c.short)}"`,
    `data-gallery-material="${esc(copy.material)}"`,
    `data-gallery-safety="${esc(copy.safety)}"`,
    `data-gallery-care="${esc(copy.care)}"`,
    `data-gallery-lead="${esc(copy.lead)}"`,
    `data-gallery-inquire="${esc(inquire)}"`,
  ].join("\n              ");
}

function withColorCharts(imgs, c) {
  if (!c.colorCharts?.length) return imgs;
  const charts = c.colorCharts.map((chart) => ({ src: chart.src, alt: chart.alt }));
  if (!imgs.length) return charts;
  return [...imgs, ...charts];
}

const cats = [
  {
    slug: "torebki",
    title: "Torebki",
    short:
      "Oryginalne formy, staranne wykonanie i 70+ kolorów do wyboru.",
    safety: SAFETY_BAG,
    material: MATERIAL_BAG,
    products: [
      { name: "Torebka Diana", price: "od 265 zł" },
      { name: "Torebka Concordia", price: "od 320 zł" },
      { name: "Torebka Flora", price: "od 240 zł" },
      { name: "Torebka Feronia", price: "od 395 zł" },
      { name: "Torebka Westa", price: "od 190 zł" },
      { name: "Torebka Wenus", price: "od 165 zł" },
      { name: "Torebka Mellona", price: "od 240 zł" },
      { name: "Torebka Luna", price: "od 265 zł" },
      { name: "Torebka Junona", price: "od 395 zł" },
      { name: "Torebka Febris", price: "od 180 zł" },
      { name: "Torebka Izyda", price: "od 235 zł" },
      { name: "Torebka Carmenta", price: "od 210 zł" },
      { name: "Torebka Ceres", price: "od 220 zł" },
      { name: "Torebka Bellona", price: "od 165 zł" },
      { name: "Torebka Aurora", price: "od 160 zł" },
    ],
    colorCharts: BAG_COLOR_CHARTS,
  },
  {
    slug: "plecaki",
    title: "Plecaki",
    short: "Ręcznie tworzone z polskiej przędzy bawełnianej i poliestrowej. 70+ kolorów do wyboru.",
    safety: SAFETY_BAG,
    material: MATERIAL_BAG,
    products: [
      { name: "Plecak króliczek", price: "od 190 zł" },
      { name: "Plecak maskotka", price: "od 180 zł" },
      { name: "Plecak rozmiar L", price: "od 280 zł" },
      { name: "Plecak rozmiar M", price: "od 220 zł" },
    ],
    colorCharts: BAG_COLOR_CHARTS.map((chart, i) =>
      i === 0 ? { ...chart, label: "Kolory plecaka" } : chart
    ),
  },
  {
    slug: "maskotki",
    title: "Maskotki dekoracyjne",
    short:
      "Ręcznie robione maskotki, które mogą stać się częścią wyjątkowego wnętrza.",
    safety: SAFETY_DECOR_MASCOT,
    products: [
      { name: "Bałwanki", price: "od 140 zł" },
      { name: "Dinozaur", price: "od 100 zł" },
      { name: "Jednorożec", price: "od 130 zł" },
      { name: "Kaczuszki", price: "od 90 zł" },
      { name: "Kolekcja leśna", price: "od 80 zł" },
      { name: "Królik", price: "od 120 zł" },
      { name: "Królik długouszny", price: "od 100 zł" },
      { name: "Królik w sukience", price: "od 120 zł" },
      { name: "Misie", price: "od 160 zł" },
      { name: "Myszki", price: "od 130 zł" },
      { name: "Myszki świąteczne", price: "od 80 zł" },
      { name: "Pszczółka", price: "od 80 zł" },
      { name: "Reniferki", price: "od 100 zł" },
      { name: "Zajączki w ogrodniczkach", price: "od 150 zł" },
      { name: "Świnka", price: "od 100 zł" },
      { name: "Żabka", price: "od 110 zł" },
    ],
  },
  {
    slug: "zestawy-dla-dzieci",
    title: "Zestawy prezentowe",
    short:
      "Przemyślane zestawy stworzone z myślą o wyjątkowych chwilach i bliskich osobach.",
    safety: SAFETY_DECOR_MASCOT,
    products: [
      { name: "Zestaw 01", price: "od 220 zł", folder: 1 },
      { name: "Zestaw 02", price: "od 220 zł", folder: 5 },
      { name: "Zestaw 03", price: "od 220 zł", folder: 8 },
      { name: "Zestaw 04", price: "od 220 zł", folder: 11 },
      { name: "Zestaw 05", price: "od 220 zł", folder: 14 },
      { name: "Zestaw 06", price: "od 220 zł", folder: 17 },
    ],
  },
  {
    slug: "dodatki",
    title: "Dodatki",
    short: "Szydełkowe dodatki: opaski, breloczki, zawieszki — z polskiej przędzy bawełnianej.",
    safety: SAFETY_GENERAL,
    products: [
      { name: "Kapcie", price: "od 160 zł" },
      { name: "Opaski", price: "od 40 zł" },
      { name: "Skarpetki", price: "od 80 zł" },
    ],
  },
  {
    slug: "personalizowane-zwierzaki",
    title: "Personalizowane zwierzaki",
    short:
      "Wyjątkowe maskotki i breloczki inspirowane Twoim ukochanym pupilem.",
    safety: SAFETY_DECOR_MASCOT,
    products: [
      { name: "Koniki", price: "od 50 zł" },
      { name: "Kotki", price: "od 50 zł" },
      { name: "Pieski", price: "od 50 zł" },
    ],
  },
  {
    slug: "zabawki-dla-zwierzat",
    title: "Zabawki dla zwierząt",
    short: "Ręcznie wykonane zabawki stworzone z myślą o małych i dużych pupilach.",
    safety: SAFETY_PET,
    products: [
      { name: "Zabawki dla kotów", price: "od 70 zł" },
      { name: "Zabawki dla piesków", price: "od 35 zł" },
    ],
  },
  {
    slug: "dekoracje",
    title: "Dekoracje",
    short: "Ręcznie tworzone dodatki do domu i wyjątkowe prezenty na każdą okazję.",
    safety: SAFETY_GENERAL,
    products: [
      { name: "Koszyczki", price: "od 85 zł" },
      { name: "Koszyczki zwierzaki", price: "od 90 zł" },
      { name: "Kwiaty", price: "od 50 zł" },
      { name: "Na choinkę", price: "od 40 zł" },
      { name: "Poduszki", price: "od 210 zł" },
      { name: "Prezent dla nowożeńców", price: "od 300 zł" },
    ],
  },
  {
    slug: "kubeczki",
    title: "Kubeczki",
    short: "Ceramiczne kubeczki w ręcznie wykonanych sweterkach. 70+ kolorów do wyboru.",
    safety: SAFETY_GENERAL,
    products: [
      { name: "Kubeczek 01", price: "od 60 zł", folder: 1 },
      { name: "Kubeczek 02", price: "od 60 zł", folder: 3 },
      { name: "Kubeczek 03", price: "od 60 zł", folder: 4 },
      { name: "Kubeczek 04", price: "od 60 zł", folder: 7 },
      { name: "Kubeczek 05", price: "od 60 zł", folder: 9 },
      { name: "Kubeczek 06", price: "od 60 zł", folder: 13 },
      { name: "Kubeczek 07", price: "od 60 zł", folder: 14 },
      { name: "Kubeczek 08", price: "od 60 zł", folder: 15 },
    ],
  },
  {
    slug: "dywany",
    title: "Dywany",
    short: "Dywany i taborety w kształcie zwierzątek.",
    safety: SAFETY_GENERAL,
    products: [
      { name: "Dywan krokodyl", price: "od 400 zł" },
      { name: "Dywan lisek", price: "od 400 zł" },
      { name: "Dywan piłka", price: "od 520 zł" },
    ],
  },
];

const root = path.join(__dirname, "..");
const imagesRoot = path.join(root, "assets", "images", "oferta");

function productFolder(product, index) {
  return product.folder || index + 1;
}

function ensureCategoryFolders() {
  fs.mkdirSync(imagesRoot, { recursive: true });
  for (const c of cats) {
    const catDir = path.join(imagesRoot, c.slug);
    fs.mkdirSync(catDir, { recursive: true });
    c.products.forEach((p, i) => {
      const n = String(productFolder(p, i)).padStart(2, "0");
      fs.mkdirSync(path.join(catDir, n), { recursive: true });
    });
  }
}

/** List numbered images 01.*, 02.* … in category folder */
function listNumberedFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const byIndex = new Map();
  for (const file of fs.readdirSync(dir)) {
    const ext = path.extname(file).toLowerCase();
    if (!IMAGE_EXTS.has(ext)) continue;
    const base = path.basename(file, ext);
    const m = /^(\d{1,2})$/.exec(base);
    if (!m) continue;
    const index = Number(m[1]);
    if (!byIndex.has(index)) byIndex.set(index, file);
  }
  return [...byIndex.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([index, file]) => ({ index, file }));
}

function listCategoryImages(slug) {
  return listNumberedFiles(path.join(imagesRoot, slug)).map(({ index, file }) => ({
    index,
    file,
    src: `../assets/images/oferta/${slug}/${file}`,
  }));
}

const CAT_FALLBACKS = {
  torebki: "../assets/images/cat-torebki.png",
  plecaki: "../assets/images/cat-plecaki.png",
  maskotki: "../assets/images/cat-maskotki.png",
  "zestawy-dla-dzieci": "../assets/images/cat-zestawy.png",
  "personalizowane-zwierzaki": "../assets/images/cat-zwierzaki.png",
  "zabawki-dla-zwierzat": "../assets/images/cat-zabawki.png",
  dekoracje: "../assets/images/cat-dekoracje.png",
  kubeczki: "../assets/images/cat-kubeczki.png",
  dywany: "../assets/images/cat-dywany.png",
};

function productGalleryImages(c, product, index) {
  const n = String(productFolder(product, index)).padStart(2, "0");
  const files = listNumberedFiles(path.join(imagesRoot, c.slug, n));
  let imgs = files.map(({ file }) => ({
    src: `../assets/images/oferta/${c.slug}/${n}/${file}`,
    alt: product.name,
  }));
  if (!imgs.length) {
    const thumb = listCategoryImages(c.slug).find((img) => img.index === productFolder(product, index));
    if (thumb) imgs = [{ src: thumb.src, alt: product.name }];
  }
  if (!imgs.length && index === 0 && CAT_FALLBACKS[c.slug]) {
    imgs = [{ src: CAT_FALLBACKS[c.slug], alt: product.name }];
  }
  return withColorCharts(imgs, c).map((img, i) =>
    i === 0 || img.alt ? img : { ...img, alt: product.name }
  );
}

function mediaForProduct(c, p, i, folderImages) {
  const n = String(productFolder(p, i)).padStart(2, "0");
  const fromFolder = folderImages.find((img) => img.index === productFolder(p, i));
  if (fromFolder) {
    return `<img src="${fromFolder.src}" alt="${p.name}" width="600" height="600" loading="lazy" />`;
  }

  if (c.slug === "torebki" && i === 0) {
    return `<img src="../assets/images/cat-torebki.png" alt="${p.name}" width="600" height="600" loading="lazy" />`;
  }
  if (c.slug === "plecaki" && i === 0) {
    return `<img src="../assets/images/cat-plecaki.png" alt="${p.name}" width="600" height="600" loading="lazy" />`;
  }
  if (c.slug === "maskotki" && i === 0) {
    return `<img src="../assets/images/cat-maskotki.png" alt="${p.name}" width="600" height="600" loading="lazy" />`;
  }
  if (c.slug === "kubeczki" && i === 0) {
    return `<img src="../assets/images/cat-kubeczki.png" alt="${p.name}" width="600" height="600" loading="lazy" />`;
  }
  if (c.slug === "zestawy-dla-dzieci" && i === 0) {
    return `<img src="../assets/images/cat-zestawy.png" alt="${p.name}" width="600" height="600" loading="lazy" />`;
  }
  if (c.slug === "personalizowane-zwierzaki" && i === 0) {
    return `<img src="../assets/images/cat-zwierzaki.png" alt="${p.name}" width="600" height="600" loading="lazy" />`;
  }
  if (c.slug === "zabawki-dla-zwierzat" && i === 0) {
    return `<img src="../assets/images/cat-zabawki.png" alt="${p.name}" width="600" height="600" loading="lazy" />`;
  }
  if (c.slug === "dekoracje" && i === 0) {
    return `<img src="../assets/images/cat-dekoracje.png" alt="${p.name}" width="600" height="600" loading="lazy" />`;
  }
  if (c.slug === "dywany" && i === 0) {
    return `<img src="../assets/images/cat-dywany.png" alt="${p.name}" width="600" height="600" loading="lazy" />`;
  }

  return `
                <div class="media-slot__placeholder" style="aspect-ratio: 1 / 1;" role="img" aria-label="${p.name}">
                  <svg viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="1" height="1" fill="#E4D9CB"/></svg>
                  <span class="media-slot__label">${c.slug}/${n}.jpg</span>
                </div>`;
}

function productCards(c, folderImages) {
  return c.products
    .map((p, i) => {
      const priceLabel = p.price === "wycena" ? "wycena" : p.price;
      const priceFull = p.price === "wycena" ? "wycena indywidualna" : p.price;
      const media = mediaForProduct(c, p, i, folderImages);
      const href = `${productSlug(p.name)}.html`;
      return `
          <article class="product-card">
            <a
              class="product-card__link"
              href="${href}"
              aria-label="${esc(p.name)} — zobacz produkt"
            >
              <figure class="product-card__media media-slot" data-image-base="../assets/images/oferta/${c.slug}" data-image-index="${productFolder(p, i)}" data-image-alt="${p.name}">
                ${media}
                <span class="product-card__price-badge">${priceLabel}</span>
              </figure>
              <div class="product-card__body">
                <h3 class="product-card__title">${p.name}</h3>
                <p class="product-card__price">${priceFull}</p>
                <span class="product-card__cta">Zobacz model <span aria-hidden="true">→</span></span>
              </div>
            </a>
            <div class="product-card__footer">
              <a class="product-card__inquire" href="../index.html?produkt=${encodeURIComponent(p.name)}#kontakt">Zapytaj o produkt</a>
            </div>
          </article>`;
    })
    .join("");
}

function extraImageCards(c, folderImages) {
  const used = new Set(c.products.map((p, i) => productFolder(p, i)));
  const extras = folderImages.filter((img) => !used.has(img.index));
  return extras
    .map((img) => {
      const n = String(img.index).padStart(2, "0");
      const galleryBase = `../assets/images/oferta/${c.slug}/${n}`;
      const dataAttrs = galleryDataAttrs(c, `Realizacja ${n}`, "wycena indywidualna");
      return `
          <article class="product-card">
            <button
              type="button"
              class="product-card__link"
              data-product-gallery
              data-gallery-base="${galleryBase}"
              data-gallery-fallback="${img.src}"
              ${dataAttrs}${galleryExtrasAttr(c)}
              aria-label="Realizacja ${n} — zobacz galerię"
            >
              <figure class="product-card__media media-slot">
                <img src="${img.src}" alt="${c.title} — realizacja ${n}" width="600" height="600" loading="lazy" />
              </figure>
              <div class="product-card__body">
                <h3 class="product-card__title">Realizacja ${n}</h3>
                <span class="product-card__cta">Zobacz galerię <span aria-hidden="true">→</span></span>
              </div>
            </button>
            <div class="product-card__footer">
              <a class="product-card__inquire" href="../index.html?produkt=${encodeURIComponent(`Realizacja ${n}`)}#kontakt">Zapytaj o produkt</a>
            </div>
          </article>`;
    })
    .join("");
}

function categoryGallery(c, folderImages) {
  const all = folderImages.map((img) => ({
    src: img.src,
    alt: `${c.title} — realizacja ${String(img.index).padStart(2, "0")}`,
  }));
  const fallbacks = CAT_FALLBACKS;
  const imgs = c.colorCharts?.length ? all.slice(0, 1) : all;
  if (!imgs.length && fallbacks[c.slug]) {
    imgs.push({ src: fallbacks[c.slug], alt: c.title });
  }
  return imgs;
}

function fromPrice(c) {
  const priced = c.products.find((p) => p.price && p.price !== "wycena");
  return priced ? priced.price : "wycena indywidualna";
}

function displayPrice(price) {
  return !price || price === "wycena" ? "wycena indywidualna" : price;
}

function variantsBlock(c) {
  if (!c.products?.length) return "";
  const buttons = c.products
    .map((p, i) => {
      const price = displayPrice(p.price);
      const selected = i === 0 ? " is-selected" : "";
      const aria = i === 0 ? ' aria-pressed="true"' : ' aria-pressed="false"';
      return `
            <button class="pdp__variant${selected}" type="button" data-variant-name="${esc(p.name)}" data-variant-price="${esc(price)}"${aria}>${esc(p.name)}</button>`;
    })
    .join("");
  return `
          <div class="pdp__variants" data-pdp-variants>
            <div class="pdp__variant-list" role="group" aria-label="Model">${buttons}
            </div>
          </div>`;
}

function pdpGalleryHtml(gallery) {
  const main = gallery[0];
  const thumbs = gallery
    .map(
      (img, i) => `
            <button type="button" class="pdp__thumb${i === 0 ? " is-active" : ""}" data-pdp-thumb data-src="${img.src}" aria-label="${esc(img.alt)}" ${i === 0 ? 'aria-current="true"' : ""}>
              <img src="${img.src}" alt="" width="72" height="72" />
            </button>`
    )
    .join("");
  const placeholder = `
            <div class="media-slot__placeholder pdp__placeholder" style="aspect-ratio: 1 / 1;" role="img" aria-label="${esc(main?.alt || "Produkt")}">
              <svg viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="1" height="1" fill="#E4D9CB"/></svg>
            </div>`;
  const stage = main
    ? `<img class="pdp__main" src="${main.src}" alt="${esc(main.alt)}" width="800" height="800" />`
    : placeholder;
  const nav =
    gallery.length > 1
      ? `<button class="pdp__nav pdp__nav--prev" type="button" data-pdp-prev aria-label="Poprzednie zdjęcie"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg></button>
            <button class="pdp__nav pdp__nav--next" type="button" data-pdp-next aria-label="Następne zdjęcie"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg></button>`
      : "";

  return `
        <div class="pdp__gallery" data-pdp-gallery>
          ${gallery.length > 1 ? `<div class="pdp__thumbs">${thumbs}</div>` : ""}
          <figure class="pdp__stage">
            ${stage}
            ${nav}
          </figure>
        </div>`;
}

function pdpInfoHtml({ crumbs, title, desc, variants, price, copy, inquireName }) {
  return `
        <div class="pdp__info">
          <nav class="breadcrumbs" aria-label="Okruszki">
            ${crumbs}
          </nav>
          <h1 id="page-title" class="pdp__title">${esc(title)}</h1>
          <p class="pdp__desc">${desc}</p>
          ${variants || ""}
          <p class="pdp__price" data-pdp-price>${esc(price)}</p>
          <div class="pdp__accordions">
            <details class="faq__item pdp__accordion" open>
              <summary class="faq__question">Skład</summary>
              <div class="faq__answer"><p>${esc(copy.material)}</p></div>
            </details>
            <details class="faq__item pdp__accordion">
              <summary class="faq__question">Bezpieczeństwo</summary>
              <div class="faq__answer"><p>${esc(copy.safety)}</p></div>
            </details>
          </div>
          <div class="pdp__actions">
            <a class="btn btn--primary" data-pdp-inquire href="../index.html?produkt=${encodeURIComponent(inquireName)}#kontakt">Zapytaj o produkt</a>
            <a class="btn btn--social" href="${FB}" target="_blank" rel="noopener noreferrer">
              <img src="../assets/icons/facebook.svg" alt="" width="18" height="18" />
              Facebook
            </a>
            <a class="btn btn--social" href="${IG}" target="_blank" rel="noopener noreferrer">
              <img src="../assets/icons/instagram.svg" alt="" width="18" height="18" />
              Instagram
            </a>
          </div>
        </div>`;
}

function pdpSection(c, folderImages) {
  const copy = copyFor(c);
  const gallery = withColorCharts(categoryGallery(c, folderImages), c);
  const crumbs = `<a href="../index.html">Strona główna</a>
            <span aria-hidden="true">/</span>
            <a href="../index.html#oferta">Oferta</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">${c.title}</span>`;

  return `
    <section class="pdp" aria-labelledby="page-title">
      <div class="container pdp__grid">
        ${pdpGalleryHtml(gallery)}
        ${pdpInfoHtml({
          crumbs,
          title: c.title,
          desc: c.short,
          variants: variantsBlock(c),
          price: displayPrice(c.products[0]?.price || fromPrice(c)),
          copy,
          inquireName: c.products[0]?.name || c.title,
        })}
      </div>
    </section>`;
}

function productPdpSection(c, product, index) {
  const copy = copyFor(c);
  const gallery = productGalleryImages(c, product, index);
  const crumbs = `<a href="../index.html">Strona główna</a>
            <span aria-hidden="true">/</span>
            <a href="../index.html#oferta">Oferta</a>
            <span aria-hidden="true">/</span>
            <a href="${c.slug}.html">${c.title}</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">${esc(product.name)}</span>`;

  return `
    <section class="pdp" aria-labelledby="page-title">
      <div class="container pdp__grid">
        ${pdpGalleryHtml(gallery)}
        ${pdpInfoHtml({
          crumbs,
          title: product.name,
          desc: product.desc || c.short,
          variants: "",
          price: displayPrice(product.price),
          copy,
          inquireName: product.name,
        })}
      </div>
    </section>`;
}

function socialBtns(className = "") {
  return `
          <div class="order-cta__social ${className}">
            <a class="btn btn--social" href="${FB}" target="_blank" rel="noopener noreferrer">
              <img src="../assets/icons/facebook.svg" alt="" width="18" height="18" />
              Facebook
            </a>
            <a class="btn btn--social" href="${IG}" target="_blank" rel="noopener noreferrer">
              <img src="../assets/icons/instagram.svg" alt="" width="18" height="18" />
              Instagram
            </a>
          </div>`;
}

function legalNavLinks(prefix = "../") {
  return `
          <li><a class="nav__link" href="${prefix}regulamin.html" target="_blank" rel="noopener noreferrer">Regulamin</a></li>`;
}

function lightboxMarkup() {
  return `
  <div class="lightbox lightbox--product" id="lightbox" hidden aria-hidden="true" role="dialog" aria-modal="true" aria-label="Podgląd produktu">
    <div class="lightbox__backdrop" data-lightbox-close></div>
    <div class="lightbox__dialog lightbox__dialog--product">
      <button class="lightbox__close" type="button" data-lightbox-close aria-label="Zamknij">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <div class="lightbox__layout">
        <div class="lightbox__gallery">
          <div class="lightbox__thumbs" id="lightbox-thumbs" hidden></div>
          <div class="lightbox__stage">
            <button class="lightbox__nav lightbox__nav--prev" type="button" data-lightbox-prev aria-label="Poprzednie zdjęcie" hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <img class="lightbox__img" src="" alt="" width="1200" height="1500" />
            <button class="lightbox__nav lightbox__nav--next" type="button" data-lightbox-next aria-label="Następne zdjęcie" hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
        <div class="lightbox__info" id="lightbox-info">
          <h2 class="lightbox__title" id="lightbox-title"></h2>
          <p class="lightbox__price" id="lightbox-price"></p>
          <p class="lightbox__desc" id="lightbox-desc"></p>
          <div class="lightbox__accordions">
            <details class="faq__item lightbox__accordion" open>
              <summary class="faq__question">Skład</summary>
              <div class="faq__answer" id="lightbox-material"></div>
            </details>
            <details class="faq__item lightbox__accordion">
              <summary class="faq__question">Bezpieczeństwo</summary>
              <div class="faq__answer" id="lightbox-safety"></div>
            </details>
          </div>
          <div class="lightbox__actions">
            <a class="btn btn--primary" id="lightbox-inquire" href="../index.html#kontakt">Zapytaj o produkt</a>
            <a class="btn btn--social" href="${FB}" target="_blank" rel="noopener noreferrer">
              <img src="../assets/icons/facebook.svg" alt="" width="18" height="18" />
              Facebook
            </a>
            <a class="btn btn--social" href="${IG}" target="_blank" rel="noopener noreferrer">
              <img src="../assets/icons/instagram.svg" alt="" width="18" height="18" />
              Instagram
            </a>
          </div>
        </div>
      </div>
      <p class="lightbox__caption" id="lightbox-caption" hidden></p>
      <p class="lightbox__counter" id="lightbox-counter" hidden></p>
    </div>
  </div>`;
}

function page(c) {
  const folderImages = listCategoryImages(c.slug);

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#50938B" />
  <title>${c.title} – Szydełkomania_amigurumi</title>
  <meta name="description" content="${c.short}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://szydelkomania-amigurumi.pl/oferta/${c.slug}.html" />
  <link rel="icon" href="../assets/logo.png" type="image/png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Inter:wght@400;500;600&family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../css/reset.css?v=${CACHE}" />
  <link rel="stylesheet" href="../css/tokens.css?v=${CACHE}" />
  <link rel="stylesheet" href="../css/styles.css?v=${CACHE}" />
</head>
<body class="page-category">
  <a class="skip-link" href="#main">Przejdź do treści</a>

  <header class="site-header site-header--solid" id="top">
    <nav class="nav" aria-label="Główna nawigacja">
      <a class="nav__logo" href="../index.html#hero">
        <img class="nav__logo-img" src="../assets/logo.png" alt="" width="44" height="44" />
        <span class="nav__logo-text">Szydełkomania<span class="nav__logo-accent">_amigurumi</span></span>
      </a>
      <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-menu" aria-label="Otwórz menu">
        <span class="nav__toggle-bar" aria-hidden="true"></span>
        <span class="nav__toggle-bar" aria-hidden="true"></span>
      </button>
      <div class="nav__menu" id="nav-menu">
        <ul class="nav__list">
          <li><a class="nav__link" href="../index.html">Strona główna</a></li>
          <li><a class="nav__link" href="../index.html#oferta">Oferta</a></li>
          <li><a class="nav__link" href="../index.html#galeria">Galeria</a></li>
          <li><a class="nav__link" href="../index.html#proces">Proces</a></li>
          <li><a class="nav__link" href="../index.html#faq">FAQ</a></li>
${legalNavLinks()}
          <li><a class="nav__link nav__link--cta" href="../index.html#kontakt">Wyślij zapytanie</a></li>
        </ul>
      </div>
    </nav>
  </header>

  <div class="category-bar" role="navigation" aria-label="Nawigacja kategorii">
    <div class="container category-bar__inner">
      <a class="category-bar__back" href="../index.html#oferta">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
        Wróć do oferty
      </a>
      <span class="category-bar__current">${c.title}</span>
      <a class="category-bar__home" href="../index.html#kontakt">Wyślij zapytanie</a>
    </div>
  </div>

  <main id="main">
    <section class="page-hero" aria-labelledby="page-title">
      <div class="container page-hero__inner">
        <nav class="breadcrumbs" aria-label="Okruszki">
          <a href="../index.html">Strona główna</a>
          <span aria-hidden="true">/</span>
          <a href="../index.html#oferta">Oferta</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">${c.title}</span>
        </nav>
        <h1 id="page-title" class="section-title">${c.title}</h1>
        <p class="section-intro">${c.short}</p>
      </div>
    </section>

    <section class="section product-gallery" aria-label="Modele: ${esc(c.title)}">
      <div class="container">
        <div class="product-grid">
${productCards(c, folderImages)}
        </div>
      </div>
    </section>

    <section class="order-cta" aria-labelledby="order-cta-title">
      <div class="container order-cta__inner">
        <p class="eyebrow">Zapytanie</p>
        <h2 id="order-cta-title" class="order-cta__title">Gotowa na swoją realizację?</h2>
        <p class="order-cta__text">To nie sklep z koszykiem — napisz przez formularz albo na Facebooku / Instagramie. Razem ustalimy kolor, rozmiar i wycenę.</p>
        <div class="order-cta__actions">
          <a class="btn btn--primary" href="../index.html#kontakt">Wyślij zapytanie</a>
${socialBtns()}
        </div>
        <p style="margin-top: 1.25rem;">
          <a class="text-link" href="../index.html#oferta">← Inne kategorie</a>
        </p>
      </div>
    </section>
  </main>

  <div class="category-mobile-cta" aria-label="Szybkie akcje">
    <a class="btn btn--ghost-light" href="../index.html#oferta">← Oferta</a>
    <a class="btn btn--primary" href="../index.html#kontakt">Wyślij zapytanie</a>
  </div>

  <footer class="footer footer--category">
    <div class="container footer__bottom">
      <p class="footer__copy">© <span id="year"></span> Szydełkomania_amigurumi</p>
      <p class="footer__made">
        <a href="${FB}" target="_blank" rel="noopener noreferrer">Facebook</a>
        ·
        <a href="${IG}" target="_blank" rel="noopener noreferrer">Instagram</a>
        ·
        <a href="../regulamin.html" target="_blank" rel="noopener noreferrer">Regulamin i RODO</a>
        ·
        <a href="../index.html#kontakt">Wyślij zapytanie</a>
      </p>
    </div>
  </footer>
${lightboxMarkup()}
  <script type="module" src="../js/main.js?v=${CACHE}"></script>
  <script type="module" src="../js/media-loader.js?v=${CACHE}"></script>
  <script type="module" src="../js/animations.js?v=${CACHE}"></script>
</body>
</html>
`;
}

function productPage(c, product, index) {
  const slug = productSlug(product.name);
  const back = `${c.slug}.html`;

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#50938B" />
  <title>${esc(product.name)} – Szydełkomania_amigurumi</title>
  <meta name="description" content="${esc(product.desc || c.short)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://szydelkomania-amigurumi.pl/oferta/${slug}.html" />
  <link rel="icon" href="../assets/logo.png" type="image/png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Inter:wght@400;500;600&family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../css/reset.css?v=${CACHE}" />
  <link rel="stylesheet" href="../css/tokens.css?v=${CACHE}" />
  <link rel="stylesheet" href="../css/styles.css?v=${CACHE}" />
</head>
<body class="page-category">
  <a class="skip-link" href="#main">Przejdź do treści</a>

  <header class="site-header site-header--solid" id="top">
    <nav class="nav" aria-label="Główna nawigacja">
      <a class="nav__logo" href="../index.html#hero">
        <img class="nav__logo-img" src="../assets/logo.png" alt="" width="44" height="44" />
        <span class="nav__logo-text">Szydełkomania<span class="nav__logo-accent">_amigurumi</span></span>
      </a>
      <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-menu" aria-label="Otwórz menu">
        <span class="nav__toggle-bar" aria-hidden="true"></span>
        <span class="nav__toggle-bar" aria-hidden="true"></span>
      </button>
      <div class="nav__menu" id="nav-menu">
        <ul class="nav__list">
          <li><a class="nav__link" href="../index.html">Strona główna</a></li>
          <li><a class="nav__link" href="../index.html#oferta">Oferta</a></li>
          <li><a class="nav__link" href="../index.html#galeria">Galeria</a></li>
          <li><a class="nav__link" href="../index.html#proces">Proces</a></li>
          <li><a class="nav__link" href="../index.html#faq">FAQ</a></li>
${legalNavLinks()}
          <li><a class="nav__link nav__link--cta" href="../index.html#kontakt">Wyślij zapytanie</a></li>
        </ul>
      </div>
    </nav>
  </header>

  <div class="category-bar" role="navigation" aria-label="Nawigacja kategorii">
    <div class="container category-bar__inner">
      <a class="category-bar__back" href="${back}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
        Wróć do kategorii
      </a>
      <span class="category-bar__current">${esc(product.name)}</span>
      <a class="category-bar__home" href="../index.html#kontakt">Wyślij zapytanie</a>
    </div>
  </div>

  <main id="main">
${productPdpSection(c, product, index)}

    <section class="order-cta" aria-labelledby="order-cta-title">
      <div class="container order-cta__inner">
        <p class="eyebrow">Zapytanie</p>
        <h2 id="order-cta-title" class="order-cta__title">Gotowa na swoją realizację?</h2>
        <p class="order-cta__text">To nie sklep z koszykiem — napisz przez formularz albo na Facebooku / Instagramie. Razem ustalimy kolor, rozmiar i wycenę.</p>
        <div class="order-cta__actions">
          <a class="btn btn--primary" href="../index.html?produkt=${encodeURIComponent(product.name)}#kontakt">Wyślij zapytanie</a>
${socialBtns()}
        </div>
        <p style="margin-top: 1.25rem;">
          <a class="text-link" href="${back}">← Wszystkie ${c.title.toLowerCase()}</a>
        </p>
      </div>
    </section>
  </main>

  <div class="category-mobile-cta" aria-label="Szybkie akcje">
    <a class="btn btn--ghost-light" href="${back}">← ${c.title}</a>
    <a class="btn btn--primary" href="../index.html?produkt=${encodeURIComponent(product.name)}#kontakt">Wyślij zapytanie</a>
  </div>

  <footer class="footer footer--category">
    <div class="container footer__bottom">
      <p class="footer__copy">© <span id="year"></span> Szydełkomania_amigurumi</p>
      <p class="footer__made">
        <a href="${FB}" target="_blank" rel="noopener noreferrer">Facebook</a>
        ·
        <a href="${IG}" target="_blank" rel="noopener noreferrer">Instagram</a>
        ·
        <a href="../regulamin.html" target="_blank" rel="noopener noreferrer">Regulamin i RODO</a>
        ·
        <a href="../index.html#kontakt">Wyślij zapytanie</a>
      </p>
    </div>
  </footer>
${lightboxMarkup()}
  <script type="module" src="../js/main.js?v=${CACHE}"></script>
  <script type="module" src="../js/media-loader.js?v=${CACHE}"></script>
  <script type="module" src="../js/animations.js?v=${CACHE}"></script>
</body>
</html>
`;
}

ensureCategoryFolders();
const dir = path.join(root, "oferta");
fs.mkdirSync(dir, { recursive: true });
const usedSlugs = new Set(cats.map((c) => c.slug));
for (const c of cats) {
  fs.writeFileSync(path.join(dir, `${c.slug}.html`), page(c), "utf8");
  const count = listCategoryImages(c.slug).length;
  console.log("wrote", c.slug, count ? `(${count} zdjęć)` : "(brak zdjęć w folderze)");
  for (const [i, product] of c.products.entries()) {
    const slug = productSlug(product.name);
    if (usedSlugs.has(slug)) {
      throw new Error(`Zduplikowany slug produktu: ${slug}`);
    }
    usedSlugs.add(slug);
    fs.writeFileSync(path.join(dir, `${slug}.html`), productPage(c, product, i), "utf8");
    console.log("  wrote", slug);
  }
}
for (const file of fs.readdirSync(dir)) {
  if (!file.endsWith(".html")) continue;
  const slug = file.replace(/\.html$/, "");
  if (!usedSlugs.has(slug)) {
    fs.unlinkSync(path.join(dir, file));
    console.log("removed stale", file);
  }
}
console.log("done", cats.length);
console.log("Miniatury produktów: assets/images/oferta/{kategoria}/01.jpg …");
console.log("Galeria produktu: assets/images/oferta/{kategoria}/01/01.jpg, 02.jpg …");
