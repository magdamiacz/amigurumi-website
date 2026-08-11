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

const cats = [
  {
    slug: "torebki",
    title: "Torebki",
    short:
      "Handmade torebki z polskiej przędzy bawełnianej — kolory do wyboru z palety 45+, rozmiar i detal na Twoją propozycję.",
    safety: SAFETY_BAG,
    products: [
      { name: "Torebka mini", price: "od 140 zł" },
      { name: "Torebka miejska", price: "od 180 zł" },
      { name: "Torebka z łańcuszkiem", price: "od 200 zł" },
      { name: "Torebka round", price: "od 160 zł" },
      { name: "Torebka shopper", price: "od 220 zł" },
      { name: "Torebka na zamówienie", price: "wycena" },
    ],
  },
  {
    slug: "plecaki",
    title: "Plecaki",
    short: "Szydełkowe plecaki z polskiej przędzy bawełnianej — wygodne, miękkie i personalizowane.",
    safety: SAFETY_BAG,
    products: [
      { name: "Plecak do pokoju dziecięcego", price: "od 190 zł" },
      { name: "Plecak miejski", price: "od 240 zł" },
      { name: "Mini plecaczek", price: "od 160 zł" },
      { name: "Plecak z kieszenią", price: "od 260 zł" },
      { name: "Plecak pastelowy", price: "od 220 zł" },
      { name: "Plecak na zamówienie", price: "wycena" },
    ],
  },
  {
    slug: "maskotki",
    title: "Maskotki dekoracyjne",
    short:
      "Maskotki dekoracyjne do pokoju dziecięcego — unikatowe amigurumi z polskiej bawełny, na Twoją propozycję.",
    safety: SAFETY_DECOR_MASCOT,
    products: [
      { name: "Miś dekoracyjny", price: "od 120 zł" },
      { name: "Królik w ubranku", price: "od 140 zł" },
      { name: "Laleczka dekoracyjna", price: "od 150 zł" },
      { name: "Słonik", price: "od 130 zł" },
      { name: "Wilczek", price: "od 145 zł" },
      { name: "Maskotka dekoracyjna na zamówienie", price: "wycena" },
    ],
  },
  {
    slug: "zestawy-dla-dzieci",
    title: "Zestawy do pokoju dziecięcego",
    short:
      "Kompletne zestawy dekoracyjne do pokoju dziecięcego — spójne kolorystycznie, z polskiej przędzy bawełnianej.",
    safety: SAFETY_DECOR_MASCOT,
    products: [
      { name: "Zestaw roczek (dekoracyjny)", price: "od 220 zł" },
      { name: "Zestaw chrzest (dekoracyjny)", price: "od 240 zł" },
      { name: "Zestaw urodzinowy", price: "od 200 zł" },
      { name: "Zestaw baby shower", price: "od 210 zł" },
      { name: "Zestaw pastelowy", price: "od 230 zł" },
      { name: "Zestaw na zamówienie", price: "wycena" },
    ],
  },
  {
    slug: "dodatki",
    title: "Dodatki",
    short: "Szydełkowe dodatki: opaski, breloczki, zawieszki — z polskiej przędzy bawełnianej.",
    safety: SAFETY_GENERAL,
    products: [
      { name: "Opaska warkocz", price: "od 55 zł" },
      { name: "Breloczek mini", price: "od 35 zł" },
      { name: "Zawieszka dekoracyjna", price: "od 45 zł" },
      { name: "Opaska cienka", price: "od 50 zł" },
      { name: "Breloczek zwierzątko", price: "od 40 zł" },
      { name: "Dodatek na zamówienie", price: "wycena" },
    ],
  },
  {
    slug: "personalizowane-zwierzaki",
    title: "Personalizowane zwierzaki",
    short:
      "Dekoracyjne amigurumi pupila ze zdjęcia — pamiątka z charakterem, z polskiej bawełny.",
    safety: SAFETY_DECOR_MASCOT,
    products: [
      { name: "Piesek ze zdjęcia", price: "od 180 zł" },
      { name: "Kotek ze zdjęcia", price: "od 180 zł" },
      { name: "Królik ze zdjęcia", price: "od 170 zł" },
      { name: "Mini portret pupila", price: "od 150 zł" },
      { name: "Duży portret pupila", price: "od 240 zł" },
      { name: "Własny projekt", price: "wycena" },
    ],
  },
  {
    slug: "zabawki-dla-zwierzat",
    title: "Zabawki dla zwierząt",
    short: "Szydełkowe zabawki dla psów i kotów — handmade z polskiej przędzy bawełnianej.",
    safety: SAFETY_PET,
    products: [
      { name: "Piłka dla kota", price: "od 40 zł" },
      { name: "Myszka szydełkowa", price: "od 45 zł" },
      { name: "Szarpak dla psa", price: "od 60 zł" },
      { name: "Pierścień gryzak", price: "od 55 zł" },
      { name: "Zestaw 3 zabawek", price: "od 110 zł" },
      { name: "Zabawka na zamówienie", price: "wycena" },
    ],
  },
  {
    slug: "dekoracje",
    title: "Dekoracje",
    short: "Szydełkowe dekoracje do domu — unikatowe ozdoby z polskiej przędzy bawełnianej.",
    safety: SAFETY_GENERAL,
    products: [
      { name: "Girlanda kwiatowa", price: "od 90 zł" },
      { name: "Zawieszka sezonowa", price: "od 45 zł" },
      { name: "Ozdoba stołu", price: "od 70 zł" },
      { name: "Makrama mini", price: "od 80 zł" },
      { name: "Zestaw dekoracji", price: "od 150 zł" },
      { name: "Dekoracja na zamówienie", price: "wycena" },
    ],
  },
  {
    slug: "kubeczki",
    title: "Kubeczki",
    short: "Szydełkowe ocieplacze i akcesoria do kubków — z polskiej przędzy bawełnianej.",
    safety: SAFETY_GENERAL,
    products: [
      { name: "Ocieplacz klasyczny", price: "od 45 zł" },
      { name: "Ocieplacz z uszami", price: "od 55 zł" },
      { name: "Osłonka latte", price: "od 40 zł" },
      { name: "Para ocieplaczy", price: "od 80 zł" },
      { name: "Ocieplacz personalizowany", price: "od 60 zł" },
      { name: "Na zamówienie", price: "wycena" },
    ],
  },
];

const root = path.join(__dirname, "..");
const imagesRoot = path.join(root, "assets", "images", "oferta");

function ensureCategoryFolders() {
  fs.mkdirSync(imagesRoot, { recursive: true });
  for (const c of cats) {
    const catDir = path.join(imagesRoot, c.slug);
    fs.mkdirSync(catDir, { recursive: true });
    c.products.forEach((_, i) => {
      const n = String(i + 1).padStart(2, "0");
      fs.mkdirSync(path.join(catDir, n), { recursive: true });
    });
  }
}

/** List numbered images 01.*, 02.* … in category folder */
function listCategoryImages(slug) {
  const dir = path.join(imagesRoot, slug);
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
    .map(([index, file]) => ({
      index,
      file,
      src: `../assets/images/oferta/${slug}/${file}`,
    }));
}

function mediaForProduct(c, p, i, folderImages) {
  const n = String(i + 1).padStart(2, "0");
  const fromFolder = folderImages.find((img) => img.index === i + 1);
  if (fromFolder) {
    return `<img src="${fromFolder.src}" alt="${p.name}" width="600" height="600" loading="lazy" />`;
  }

  if (c.slug === "torebki" && i === 0) {
    return `<img src="../assets/images/image-1.jpg" alt="${p.name}" width="600" height="600" loading="lazy" />`;
  }
  if (c.slug === "plecaki" && i === 0) {
    return `<img src="../assets/images/cat-plecaki.jpg" alt="${p.name}" width="600" height="600" loading="lazy" />`;
  }
  if (c.slug === "maskotki" && i === 0) {
    return `<img src="../assets/images/cat-maskotki.jpg" alt="${p.name}" width="600" height="600" loading="lazy" />`;
  }
  if (c.slug === "kubeczki" && i === 0) {
    return `<img src="../assets/images/about-tworczyni.jpg" alt="${p.name}" width="600" height="600" loading="lazy" />`;
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
      const n = String(i + 1).padStart(2, "0");
      const priceLabel = p.price === "wycena" ? "wycena" : p.price;
      const priceFull = p.price === "wycena" ? "wycena indywidualna" : p.price;
      const media = mediaForProduct(c, p, i, folderImages);
      const fallbackMatch = media.match(/src="([^"]+)"/);
      const fallback = fallbackMatch ? fallbackMatch[1] : "";
      const galleryBase = `../assets/images/oferta/${c.slug}/${n}`;
      return `
          <article class="product-card">
            <button
              type="button"
              class="product-card__link"
              data-product-gallery
              data-gallery-base="${galleryBase}"
              data-gallery-fallback="${fallback}"
              data-gallery-title="${p.name}"
              aria-label="${p.name} — zobacz galerię"
            >
              <figure class="product-card__media media-slot" data-image-base="../assets/images/oferta/${c.slug}" data-image-index="${i + 1}" data-image-alt="${p.name}">
                ${media}
                <span class="product-card__price-badge">${priceLabel}</span>
              </figure>
              <div class="product-card__body">
                <h3 class="product-card__title">${p.name}</h3>
                <p class="product-card__price">${priceFull}</p>
                <span class="product-card__cta">Zobacz galerię <span aria-hidden="true">→</span></span>
              </div>
            </button>
            <div class="product-card__footer">
              <a class="product-card__inquire" href="../index.html#kontakt">Wyślij zapytanie</a>
              <p class="product-card__safety">${c.safety}</p>
            </div>
          </article>`;
    })
    .join("");
}

function extraImageCards(c, folderImages) {
  const extras = folderImages.filter((img) => img.index > c.products.length);
  return extras
    .map((img) => {
      const n = String(img.index).padStart(2, "0");
      const galleryBase = `../assets/images/oferta/${c.slug}/${n}`;
      return `
          <article class="product-card">
            <button
              type="button"
              class="product-card__link"
              data-product-gallery
              data-gallery-base="${galleryBase}"
              data-gallery-fallback="${img.src}"
              data-gallery-title="Realizacja ${n}"
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
              <a class="product-card__inquire" href="../index.html#kontakt">Wyślij zapytanie</a>
              <p class="product-card__safety">${c.safety}</p>
            </div>
          </article>`;
    })
    .join("");
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
          <li><a class="nav__link" href="${prefix}regulamin.html">Regulamin</a></li>`;
}

function lightboxMarkup() {
  return `
  <div class="lightbox" id="lightbox" hidden aria-hidden="true" role="dialog" aria-modal="true" aria-label="Galeria produktu">
    <div class="lightbox__backdrop" data-lightbox-close></div>
    <div class="lightbox__dialog">
      <button class="lightbox__close" type="button" data-lightbox-close aria-label="Zamknij">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <div class="lightbox__stage">
        <button class="lightbox__nav lightbox__nav--prev" type="button" data-lightbox-prev aria-label="Poprzednie zdjęcie" hidden>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <img class="lightbox__img" src="" alt="" width="1200" height="1500" />
        <button class="lightbox__nav lightbox__nav--next" type="button" data-lightbox-next aria-label="Następne zdjęcie" hidden>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
      <p class="lightbox__caption" id="lightbox-caption"></p>
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
  <link rel="stylesheet" href="../css/reset.css" />
  <link rel="stylesheet" href="../css/tokens.css" />
  <link rel="stylesheet" href="../css/styles.css" />
</head>
<body class="page-category">
  <a class="skip-link" href="#main">Przejdź do treści</a>

  <header class="site-header site-header--solid" id="top">
    <nav class="nav" aria-label="Główna nawigacja">
      <a class="nav__logo" href="../index.html">
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
    <section class="section product-gallery" aria-labelledby="page-title">
      <div class="container">
        <header class="section-header">
          <nav class="breadcrumbs" aria-label="Okruszki">
            <a href="../index.html">Strona główna</a>
            <span aria-hidden="true">/</span>
            <a href="../index.html#oferta">Oferta</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">${c.title}</span>
          </nav>
          <h1 id="page-title" class="section-title">${c.title}</h1>
        </header>
        <div class="product-grid" data-auto-gallery="${c.slug}" data-gallery-base="../assets/images/oferta/${c.slug}" data-contact-href="../index.html#kontakt">
${productCards(c, folderImages)}${extraImageCards(c, folderImages)}
        </div>
      </div>
    </section>

    <section class="order-cta" aria-labelledby="order-cta-title">
      <div class="container order-cta__inner">
        <p class="eyebrow">Zapytanie</p>
        <h2 id="order-cta-title" class="order-cta__title">Masz pomysł? Wyślij propozycję.</h2>
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
        <a href="../regulamin.html">Regulamin i RODO</a>
        ·
        <a href="../index.html#kontakt">Wyślij zapytanie</a>
      </p>
    </div>
  </footer>
${lightboxMarkup()}
  <script type="module" src="../js/main.js"></script>
  <script type="module" src="../js/media-loader.js"></script>
  <script type="module" src="../js/animations.js"></script>
</body>
</html>
`;
}

ensureCategoryFolders();
const dir = path.join(root, "oferta");
fs.mkdirSync(dir, { recursive: true });
for (const c of cats) {
  fs.writeFileSync(path.join(dir, `${c.slug}.html`), page(c), "utf8");
  const count = listCategoryImages(c.slug).length;
  console.log("wrote", c.slug, count ? `(${count} zdjęć)` : "(brak zdjęć w folderze)");
}
console.log("done", cats.length);
console.log("Miniatury produktów: assets/images/oferta/{kategoria}/01.jpg …");
console.log("Galeria produktu: assets/images/oferta/{kategoria}/01/01.jpg, 02.jpg …");
