const fs = require("fs");
const path = require("path");

const cats = [
  {
    slug: "torebki",
    title: "Torebki",
    desc: "Ręcznie szydełkowane torebki z bawełnianej przędzy — lekkie, wytrzymałe i dopasowane do Twojego stylu.",
    short: "Handmade torebki z polskiej bawełny — na zamówienie, w Twoim kolorze.",
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
    desc: "Szydełkowe plecaki na co dzień — miękkie, praktyczne i niepowtarzalne, także dla dzieci.",
    short: "Szydełkowe plecaki handmade — wygodne, miękkie i personalizowane.",
    products: [
      { name: "Plecak dziecięcy", price: "od 190 zł" },
      { name: "Plecak miejski", price: "od 240 zł" },
      { name: "Mini plecaczek", price: "od 160 zł" },
      { name: "Plecak z kieszenią", price: "od 260 zł" },
      { name: "Plecak pastelowy", price: "od 220 zł" },
      { name: "Plecak na zamówienie", price: "wycena" },
    ],
  },
  {
    slug: "maskotki",
    title: "Maskotki",
    desc: "Klasyczne maskotki amigurumi szydełkowane z sercem — misie, króliki, laleczki i inne postaci.",
    short: "Maskotki amigurumi na zamówienie — unikatowe historie z szydełka.",
    products: [
      { name: "Miś klasyczny", price: "od 120 zł" },
      { name: "Królik w ubranku", price: "od 140 zł" },
      { name: "Laleczka", price: "od 150 zł" },
      { name: "Słonik", price: "od 130 zł" },
      { name: "Wilczek", price: "od 145 zł" },
      { name: "Maskotka na zamówienie", price: "wycena" },
    ],
  },
  {
    slug: "zestawy-dla-dzieci",
    title: "Zestawy dla dzieci",
    desc: "Kompletne zestawy prezentowe: maskotka, zawieszka i drobne akcesoria — gotowe na wyjątkową okazję.",
    short: "Prezentowe zestawy szydełkowe dla dzieci — kompletne i spójne kolorystycznie.",
    products: [
      { name: "Zestaw roczek", price: "od 220 zł" },
      { name: "Zestaw chrzest", price: "od 240 zł" },
      { name: "Zestaw urodzinowy", price: "od 200 zł" },
      { name: "Zestaw baby shower", price: "od 210 zł" },
      { name: "Zestaw pastelowy", price: "od 230 zł" },
      { name: "Zestaw na zamówienie", price: "wycena" },
    ],
  },
  {
    slug: "dodatki",
    title: "Dodatki",
    desc: "Opaski, breloczki, zawieszki i inne drobne akcesoria na szydełku — małe rzeczy z dużym charakterem.",
    short: "Szydełkowe dodatki: opaski, breloczki, zawieszki i drobne akcesoria.",
    products: [
      { name: "Opaska warkocz", price: "od 55 zł" },
      { name: "Breloczek mini", price: "od 35 zł" },
      { name: "Zawieszka do smoczka", price: "od 45 zł" },
      { name: "Opaska cienka", price: "od 50 zł" },
      { name: "Breloczek zwierzątko", price: "od 40 zł" },
      { name: "Dodatek na zamówienie", price: "wycena" },
    ],
  },
  {
    slug: "personalizowane-zwierzaki",
    title: "Personalizowane zwierzaki",
    desc: "Maskotka na podstawie zdjęcia Twojego pupila — kolory, rasa i charakterystyczne detale.",
    short: "Amigurumi pupila ze zdjęcia — personalizowane zwierzaki na zamówienie.",
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
    desc: "Bezpieczne, szydełkowane zabawki dla psów i kotów — solidne sploty i sprawdzone materiały.",
    short: "Szydełkowe zabawki dla psów i kotów — handmade i na zamówienie.",
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
    desc: "Dekoracje do domu i okazji specjalnych: girlandy, zawieszki, sezonowe ozdoby.",
    short: "Szydełkowe dekoracje do domu i okazji — unikatowe ozdoby handmade.",
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
    desc: "Ocieplacze i osłonki na kubki — praktyczne, miękkie i w kolorach dopasowanych do Ciebie.",
    short: "Szydełkowe ocieplacze i akcesoria do kubków — handmade na zamówienie.",
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

function productCards(c) {
  return c.products
    .map((p, i) => {
      const n = String(i + 1).padStart(2, "0");
      const priceLabel = p.price === "wycena" ? "wycena" : p.price;
      const priceFull = p.price === "wycena" ? "wycena indywidualna" : p.price;
      // Real photos when available (hero bag as first tote sample)
      let media = `
                <div class="media-slot__placeholder" style="aspect-ratio: 1 / 1;" role="img" aria-label="${p.name}">
                  <svg viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="1" height="1" fill="#E4D9CB"/></svg>
                  <span class="media-slot__label">${c.slug}-${n}.jpg</span>
                </div>`;
      if (c.slug === "torebki" && i === 0) {
        media = `<img src="../assets/images/image-1.jpg" alt="${p.name}" width="600" height="600" loading="lazy" />`;
      } else if (c.slug === "plecaki" && i === 0) {
        media = `<img src="../assets/images/cat-plecaki.jpg" alt="${p.name}" width="600" height="600" loading="lazy" />`;
      } else if (c.slug === "maskotki" && i === 0) {
        media = `<img src="../assets/images/cat-maskotki.jpg" alt="${p.name}" width="600" height="600" loading="lazy" />`;
      } else if (c.slug === "kubeczki" && i === 0) {
        media = `<img src="../assets/images/about-tworczyni.jpg" alt="${p.name}" width="600" height="600" loading="lazy" />`;
      }
      return `
          <article class="product-card">
            <a class="product-card__link" href="../index.html#kontakt" aria-label="${p.name} — ${priceFull}. Zamów">
              <figure class="product-card__media media-slot">
                ${media}
                <span class="product-card__price-badge">${priceLabel}</span>
              </figure>
              <div class="product-card__body">
                <h3 class="product-card__title">${p.name}</h3>
                <p class="product-card__price">${priceFull}</p>
                <span class="product-card__cta">Zamów <span aria-hidden="true">→</span></span>
              </div>
            </a>
          </article>`;
    })
    .join("");
}

function page(c) {
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
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
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
          <li><a class="nav__link nav__link--cta" href="../index.html#kontakt">Zamów</a></li>
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
      <a class="category-bar__home" href="../index.html#kontakt">Zamów</a>
    </div>
  </div>

  <main id="main">
    <section class="page-hero" aria-labelledby="page-title">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Okruszki">
          <a href="../index.html">Strona główna</a>
          <span aria-hidden="true">/</span>
          <a href="../index.html#oferta">Oferta</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">${c.title}</span>
        </nav>
        <h1 id="page-title" class="section-title">${c.title}</h1>
        <p class="section-intro">${c.short}</p>
        <p class="page-hero__note">Ceny orientacyjne „od…” — ostateczna wycena po ustaleniu detali. Zamówienie przez formularz lub social media.</p>
      </div>
    </section>

    <section class="section product-gallery" aria-labelledby="gallery-title">
      <div class="container">
        <header class="section-header">
          <p class="eyebrow">Galeria</p>
          <h2 id="gallery-title" class="section-title">Przykładowe realizacje</h2>
          <p class="section-intro">Wybierz styl, który Ci odpowiada — każde zamówienie szydełkuję indywidualnie.</p>
        </header>
        <div class="product-grid">
${productCards(c)}
        </div>
      </div>
    </section>

    <section class="section category-page category-page--compact">
      <div class="container category-page__intro">
        <h2 class="section-title" style="font-size: clamp(1.35rem, 3vw, 1.75rem);">O kategorii</h2>
        <p>${c.desc}</p>
        <p>Nie prowadzę sklepu internetowego — każde zamówienie ustalimy indywidualnie: kolor, rozmiar i detale.</p>
      </div>
    </section>

    <section class="order-cta" aria-labelledby="order-cta-title">
      <div class="container order-cta__inner">
        <p class="eyebrow">Zamówienie</p>
        <h2 id="order-cta-title" class="order-cta__title">Gotowa na swoją realizację?</h2>
        <p class="order-cta__text">Napisz, co chcesz zamówić — odpowiem z wyceną i terminami. Bez koszyka, za to z pełną personalizacją.</p>
        <div class="hero__actions" style="justify-content: center;">
          <a class="btn btn--primary" href="../index.html#kontakt">Zamów</a>
          <a class="btn btn--ghost-dark" href="../index.html#oferta">Inne kategorie</a>
        </div>
      </div>
    </section>
  </main>

  <div class="category-mobile-cta" aria-label="Szybkie akcje">
    <a class="btn btn--ghost-light" href="../index.html#oferta">← Oferta</a>
    <a class="btn btn--primary" href="../index.html#kontakt">Zamów</a>
  </div>

  <footer class="footer footer--category">
    <div class="container footer__bottom">
      <p class="footer__copy">© <span id="year"></span> Szydełkomania_amigurumi</p>
      <p class="footer__made">
        <a href="../index.html#oferta">Oferta</a>
        ·
        <a href="../index.html#kontakt">Zamów</a>
      </p>
    </div>
  </footer>
  <script type="module" src="../js/main.js"></script>
  <script type="module" src="../js/animations.js"></script>
</body>
</html>
`;
}

const dir = path.join(__dirname, "..", "oferta");
fs.mkdirSync(dir, { recursive: true });
for (const c of cats) {
  fs.writeFileSync(path.join(dir, `${c.slug}.html`), page(c), "utf8");
  console.log("wrote", c.slug);
}
console.log("done", cats.length);
