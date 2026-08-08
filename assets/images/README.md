# Zdjęcia — Szydełkomania_amigurumi

## Kategorie oferty (automatycznie na stronie)

Wrzuć zdjęcia do folderu kategorii:

```
assets/images/oferta/{nazwa-kategorii}/01.jpg
assets/images/oferta/{nazwa-kategorii}/02.jpg
…
```

Foldery (już utworzone):

| Folder | Strona |
|--------|--------|
| `oferta/torebki/` | Torebki |
| `oferta/plecaki/` | Plecaki |
| `oferta/maskotki/` | Maskotki |
| `oferta/zestawy-dla-dzieci/` | Zestawy dla dzieci |
| `oferta/dodatki/` | Dodatki |
| `oferta/personalizowane-zwierzaki/` | Personalizowane zwierzaki |
| `oferta/zabawki-dla-zwierzat/` | Zabawki dla zwierząt |
| `oferta/dekoracje/` | Dekoracje |
| `oferta/kubeczki/` | Kubeczki |

**Nazwy:** `01.jpg`, `02.webp`, `03.png`… (kolejne numery).  
Po wrzuceniu plików odśwież stronę — zdjęcia pojawią się same (bez edycji HTML).

Opcjonalnie możesz przebudować HTML:

```bash
node scripts/generate-oferta.js
```

---

## Strona główna — karty oferty

| Plik | Kategoria |
|------|-----------|
| `cat-zestawy.jpg` | Zestawy dla dzieci |
| `cat-dodatki.jpg` | Dodatki |
| `cat-zwierzaki.jpg` | Personalizowane zwierzaki |
| `cat-zabawki.jpg` | Zabawki dla zwierząt |
| `cat-dekoracje.jpg` | Dekoracje |
| `cat-maskotki.jpg` | Maskotki *(już używane)* |
| `cat-plecaki.jpg` | Plecaki *(już używane)* |

## Galeria na stronie głównej

`gallery-01.jpg` … `gallery-12.jpg` — po wrzuceniu pojawią się automatycznie.

## Inne

| Plik | Gdzie |
|------|-------|
| `image-1.jpg` | Hero / torebki |
| `about-tworczyni.jpg` | O mnie |
| `og-hero.jpg` | Open Graph |

## Format

- JPEG / WebP / PNG, jakość ok. 80–85
- Nazwy bez polskich znaków
- Cel: poniżej 200 KB (below the fold), hero poniżej 350 KB
