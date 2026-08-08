# Szydełkomania_amigurumi

Profesjonalna, jednokartowa strona dla pracowni rękodzieła **Szydełkomania_amigurumi**.
Stack: HTML · CSS · JS · [anime.js v4](https://animejs.com).

Bez sklepu internetowego — zamówienia przez formularz i social media.

---

## Uruchomienie lokalne

Otwórz `index.html` przez lokalny serwer (moduły ES wymagają HTTP, nie `file://`):

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

Wejdź na http://localhost:8080

---

## Struktura

```
amigurumu-website/
├── index.html
├── css/
│   ├── reset.css
│   ├── tokens.css      ← paleta, typografia, spacing
│   └── styles.css
├── js/
│   ├── main.js         ← nav, formularz, lightbox, fallback counters
│   ├── animations.js   ← anime.js v4 (reveal, marquee, magnetic…)
│   └── vendor/
│       ├── anime.esm.min.js  ← anime.js 4.0.2 (self-hosted)
│       └── anime.esm.js      ← nie-minifikowana kopia (debug)
├── assets/
│   ├── favicon.svg
│   ├── icons/          ← SVG (Facebook, Instagram, mail, phone…)
│   └── images/         ← WRZUĆ TU ZDJĘCIA (patrz README wewnątrz)
├── robots.txt
├── sitemap.xml
└── README.md
```

---

## Jak podmienić zdjęcia

1. Wrzuć pliki do `assets/images/` według listy w [`assets/images/README.md`](assets/images/README.md).
2. W `index.html` zamień bloki `.media-slot__placeholder` na `<img src="assets/images/…">`.
3. Dla galerii: zostaw atrybuty `data-lightbox-src` / `data-lightbox-alt` i wstaw `<img>` wewnątrz `.gallery__item`.

**Wymagane pliki:** `hero-maskotka.jpg`, `about-tworczyni.jpg`, `cat-*.jpg` (4×), `gallery-01.jpg`…`gallery-12.jpg`, `og-hero.jpg` (1200×630).

---

## Jak podmienić kontakty

W `index.html` wyszukaj `TODO:` — wszystkie placeholdery są oznaczone.

| Co | Gdzie szukać | Przykład |
|----|--------------|----------|
| Facebook | `href="#"` + `aria-label="Facebook` | `https://www.facebook.com/szydelkomania.amigurumi/` |
| Instagram | `aria-label="Instagram` | Twój URL IG |
| E-mail | `mailto:#` | `mailto:kontakt@…` |
| Telefon | `tel:#` | `tel:+48…` |
| Adres | — | lokalizacja usunięta celowo |
| Formularz | `form action="#"` | Formspree / Getform (patrz niżej) |
| Canonical / OG URL | `<link rel="canonical">`, meta `og:url` | Twoja domena |
| Opinie | sekcja `#opinie` | wklej cytaty z FB |

**JSON-LD** (w `<head>`): zaktualizuj `sameAs`, telefon (`telephone`) jeśli dodasz, oraz `url` domeny.

---

## Formularz (Formspree) — opcjonalnie

1. Załóż konto na [formspree.io](https://formspree.io).
2. Utwórz formularz i skopiuj endpoint (`https://formspree.io/f/xxxxx`).
3. W `index.html` zmień:

```html
<form … action="https://formspree.io/f/xxxxx" method="POST">
```

`js/main.js` wykryje prawdziwy `action` i wyśle przez `fetch`. Upload pliku wymaga planu Formspree z obsługą plików — albo usuń pole `inspiration`.

---

## Deploy

Statyczny hosting — **zero buildu**.

### Netlify
- Drag & drop folderu albo podłącz repo.
- Publish directory: `.` (root).

### Vercel
```bash
npx vercel
```

### GitHub Pages
1. Wrzuć repo na GitHub.
2. Settings → Pages → Deploy from branch `main` / root.

Po deployu podmień `https://szydelkomania-amigurumi.pl` w:
- `index.html` (canonical, OG, JSON-LD)
- `robots.txt`
- `sitemap.xml`

---

## Design tokens (skrót)

| Token | Wartość | Rola |
|-------|---------|------|
| `--cream` | `#F7F0E5` | tło jasne |
| `--espresso` | `#3B2A20` | kontakt / dark sekcje |
| `--rose` | `#50938B` | hero + akcent CTA (`rgba(80, 147, 139, 1)`) |
| `--terracotta` | `#3A6F69` | hover / linki |
| `--sage` | `#7EB5AD` | drugi akcent |
| Font display | Fraunces | nagłówki |
| Font body | Inter | tekst |
| Font signature | Caveat | podpis |

---

## Animacje

anime.js v4 self-hosted w `js/vendor/anime.esm.min.js`.
Wyłączane automatycznie przy `prefers-reduced-motion: reduce`.

- Hero: word-by-word reveal (ręczny split — `splitText` nie jest w 4.0.2)
- Sekcje: fade + slide-up (IntersectionObserver + anime.js)
- Marquee: infinite loop
- Stats: counter (anime.js + fallback vanilla w `main.js`)
- Process: rysowana linia SVG (onScroll sync)
- CTA: magnetic hover (desktop)

---

## Checklist przed publikacją

- [ ] Zdjęcia wrzucone i podpięte
- [ ] Linki social / e-mail / telefon
- [ ] Formspree (lub inny endpoint)
- [ ] Prawdziwe opinie w `#opinie`
- [ ] Domeny w canonical / OG / sitemap / robots
- [ ] Test na telefonie (menu, formularz, lightbox)
