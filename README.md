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

## Jak dodać zdjęcia

Zdjęcia pojawiają się automatycznie po wrzuceniu plików — bez edycji HTML.

1. **Kategorie oferty:** `assets/images/oferta/{kategoria}/01.jpg`, `02.jpg`…
2. **Karty na stronie głównej / galeria:** nazwy z [`assets/images/README.md`](assets/images/README.md) (np. `cat-zestawy.jpg`, `gallery-01.jpg`).
3. Odśwież stronę w przeglądarce.

Opcjonalnie: `node scripts/generate-oferta.js` — przebuduje strony kategorii i wczyta zdjęcia z folderów.

---

## Kontakty

Facebook i Instagram są już podpięte w sekcji kontakt, stopce i na stronach kategorii.
E-mail i telefon nie są publikowane — zamówienia przez formularz lub social media.

| Co | Status |
|----|--------|
| Facebook | `https://www.facebook.com/szydelkomania.amigurumi/` |
| Instagram | `https://www.instagram.com/szydelkomania_amigurumi/` |
| Formularz | `form action="#"` → Formspree / Getform (patrz niżej) |
| Canonical / OG URL | podmień domenę przy deployu |

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
| Font logo | Poppins | logo |
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
