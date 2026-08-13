/**
 * Auto-load images when files exist in expected folders/paths.
 *
 * Category photos: assets/images/oferta/{slug}/01.jpg (also .jpeg .webp .png)
 * Homepage cards:  data-auto-img="assets/images/cat-….jpg"
 * Gallery:         data-lightbox-src — shows img when file exists
 */

const IMAGE_EXTS = ["jpg", "webp", "png"];

const probeImage = (url) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });

const resolveNumberedUrl = async (baseDir, index) => {
  const n = String(index).padStart(2, "0");
  for (const ext of IMAGE_EXTS) {
    const url = `${baseDir}/${n}.${ext}`;
    if (await probeImage(url)) return url;
  }
  return null;
};

const collectNumberedImages = async (baseDir, max = 48) => {
  const found = [];
  let misses = 0;
  for (let i = 1; i <= max; i++) {
    const url = await resolveNumberedUrl(baseDir, i);
    if (url) {
      found.push({ index: i, url });
      misses = 0;
      continue;
    }
    // Folder empty or gap — stop immediately so the console is not flooded with 404s.
    if (found.length === 0 || misses >= 1) break;
    misses += 1;
  }
  return found;
};

const setMediaImage = (mediaEl, url, alt) => {
  const badge = mediaEl.querySelector(".product-card__price-badge");
  mediaEl.innerHTML = "";
  const img = document.createElement("img");
  img.src = url;
  img.alt = alt || "";
  img.width = 600;
  img.height = 600;
  img.loading = "lazy";
  img.decoding = "async";
  mediaEl.appendChild(img);
  if (badge) mediaEl.appendChild(badge);
};

/** Replace placeholder nodes that have data-auto-img when the file loads */
const hydrateAutoImgs = async () => {
  const nodes = document.querySelectorAll("[data-auto-img]");
  await Promise.all(
    [...nodes].map(async (el) => {
      const src = el.getAttribute("data-auto-img");
      if (!src) return;
      const ok = await probeImage(src);
      if (!ok) return;

      const alt = el.getAttribute("data-auto-alt") || el.getAttribute("aria-label") || "";
      const img = document.createElement("img");
      img.src = src;
      img.alt = alt;
      img.width = Number(el.getAttribute("data-auto-width")) || 800;
      img.height = Number(el.getAttribute("data-auto-height")) || 600;
      img.loading = "lazy";
      img.decoding = "async";

      if (el.matches("figure, .media-slot, .category-card__media")) {
        el.innerHTML = "";
        el.appendChild(img);
      } else if (el.classList.contains("media-slot__placeholder")) {
        el.replaceWith(img);
      } else {
        el.innerHTML = "";
        el.appendChild(img);
      }
    })
  );
};

/** Gallery items: swap placeholder for real img when data-lightbox-src exists */
const hydrateGalleryItems = async () => {
  const items = document.querySelectorAll("[data-gallery] .gallery__item[data-lightbox-src]");
  await Promise.all(
    [...items].map(async (btn) => {
      if (btn.querySelector("img")) return;
      const src = btn.getAttribute("data-lightbox-src");
      if (!src || src === "#") return;
      const ok = await probeImage(src);
      if (!ok) return;

      const alt = btn.getAttribute("data-lightbox-alt") || "";
      const placeholder = btn.querySelector(".media-slot__placeholder, .gallery__placeholder");
      const img = document.createElement("img");
      img.src = src;
      img.alt = alt;
      img.loading = "lazy";
      img.decoding = "async";
      if (placeholder) placeholder.replaceWith(img);
      else if (!btn.querySelector("img")) btn.insertBefore(img, btn.firstChild);
    })
  );
};

/**
 * Category grids: bind numbered folder images to product cards;
 * append extra photos beyond the catalog.
 * data-auto-gallery + data-gallery-base="../assets/images/oferta/{slug}"
 */
const hydrateAutoGalleries = async () => {
  const grids = document.querySelectorAll("[data-auto-gallery][data-gallery-base]");

  for (const grid of grids) {
    const base = grid.getAttribute("data-gallery-base");
    const slug = grid.getAttribute("data-auto-gallery") || "";
    if (!base) continue;

    const found = await collectNumberedImages(base);
    if (!found.length) continue;

    const cards = [...grid.querySelectorAll(".product-card")];
    const sample = cards[0]?.querySelector("[data-product-gallery]");
    const inherit = (name) => sample?.getAttribute(name) || "";

    found.forEach(({ index, url }, i) => {
      const card = cards[i];
      if (card) {
        const media = card.querySelector(".product-card__media");
        const title = card.querySelector(".product-card__title")?.textContent?.trim() || `Realizacja ${String(index).padStart(2, "0")}`;
        if (media) setMediaImage(media, url, title);
        return;
      }

      const n = String(index).padStart(2, "0");
      const title = `Realizacja ${n}`;
      const inquire = `../index.html?produkt=${encodeURIComponent(title)}#kontakt`;
      const article = document.createElement("article");
      article.className = "product-card";
      article.innerHTML = `
        <button
          type="button"
          class="product-card__link"
          data-product-gallery
          data-gallery-base="${base}/${n}"
          data-gallery-fallback="${url}"
          data-gallery-title="${title}"
          data-gallery-price="wycena indywidualna"
          data-gallery-desc="${inherit("data-gallery-desc")}"
          data-gallery-material="${inherit("data-gallery-material")}"
          data-gallery-safety="${inherit("data-gallery-safety")}"
          data-gallery-care="${inherit("data-gallery-care")}"
          data-gallery-lead="${inherit("data-gallery-lead")}"
          data-gallery-inquire="${inquire}"
          aria-label="${title} — zobacz galerię"
        >
          <figure class="product-card__media media-slot">
            <img src="${url}" alt="${slug} — ${title}" width="600" height="600" loading="lazy" />
          </figure>
          <div class="product-card__body">
            <h3 class="product-card__title">${title}</h3>
            <span class="product-card__cta">Zobacz galerię <span aria-hidden="true">→</span></span>
          </div>
        </button>
        <div class="product-card__footer">
          <a class="product-card__inquire" href="${inquire}">Zapytaj o produkt</a>
        </div>`;
      grid.appendChild(article);
    });
  }
};

const run = async () => {
  await Promise.all([hydrateAutoImgs(), hydrateGalleryItems()]);
  await hydrateAutoGalleries();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", run);
} else {
  run();
}
