# Sloty zdjęć — Szydełkomania_amigurumi

Wrzucaj pliki **o dokładnie tych nazwach** do tego folderu.
Po wrzuceniu podmień placeholdery w `index.html` na prawdziwe `<img>`.

## Jak podmienić placeholder na zdjęcie

Przykład (hero):

**Było:**
```html
<div class="media-slot__placeholder" style="aspect-ratio: 4 / 5;" …>
  <svg>…</svg>
  <span class="media-slot__label">…</span>
</div>
```

**Ma być:**
```html
<img
  src="assets/images/hero-maskotka.jpg"
  alt="Ręcznie robiona maskotka amigurumi — flagowa realizacja Szydełkomania"
  width="960"
  height="1200"
  decoding="async"
  fetchpriority="high"
/>
```

Dla galerii: zostaw `data-lightbox-src` i dodaj wewnątrz buttona prawdziwy `<img>` zamiast placeholdera.

---

## Lista plików

| Plik | Wymiary (px) | Gdzie | Uwagi |
|------|--------------|-------|-------|
| `hero-maskotka.jpg` | 960 × 1200 | Hero (prawa kolumna) | Portret, jasne tło lub studio |
| `about-tworczyni.jpg` | 800 × 1000 | O mnie | Zdjęcie twórczyni / pracowni |
| `cat-maskotki.jpg` | 800 × 600 | Oferta — Maskotki | |
| `cat-torebki.jpg` | 800 × 600 | Oferta — Torebki | |
| `cat-opaski.jpg` | 800 × 600 | Oferta — Opaski | |
| `cat-breloczki.jpg` | 800 × 600 | Oferta — Breloczki | |
| `gallery-01.jpg` … `gallery-12.jpg` | min. 800 px dł. bok | Galeria | Różne proporcje OK |
| `og-hero.jpg` | 1200 × 630 | Open Graph / social share | |

## Format

- Preferuj **WebP** lub **JPEG** (jakość 80–85).
- Nazwy bez polskich znaków.
- Optymalizuj (np. Squoosh / TinyPNG) — cel: < 200 KB na zdjęcie poniżej foldu, hero < 350 KB.
