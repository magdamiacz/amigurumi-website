/**
 * Auto-load images when files exist in expected folders/paths.
 *
 * Category photos: assets/images/oferta/{slug}/01.jpg (also .jpeg .webp .png)
 * Homepage cards:  data-auto-img="assets/images/cat-….jpg"
 * Gallery:         data-lightbox-src — shows img when file exists
 */

const IMAGE_EXTS = ["jpg", "jpeg", "webp", "png"];

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
    } else {
      misses += 1;
      if (found.length === 0 && i >= 8) break;
      if (found.length > 0 && misses >= 2) break;
    }
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
    const contactHref = grid.getAttribute("data-contact-href") || "../index.html#kontakt";

    found.forEach(({ index, url }, i) => {
      const card = cards[i];
      if (card) {
        const media = card.querySelector(".product-card__media");
        const title = card.querySelector(".product-card__title")?.textContent?.trim() || `Realizacja ${String(index).padStart(2, "0")}`;
        if (media) setMediaImage(media, url, title);
        return;
      }

      const n = String(index).padStart(2, "0");
      const article = document.createElement("article");
      article.className = "product-card";
      article.innerHTML = `
        <a class="product-card__link" href="${contactHref}" aria-label="Realizacja ${n} — zamów podobną">
          <figure class="product-card__media media-slot">
            <img src="${url}" alt="${slug} — realizacja ${n}" width="600" height="600" loading="lazy" />
          </figure>
          <div class="product-card__body">
            <h3 class="product-card__title">Realizacja ${n}</h3>
            <span class="product-card__cta">Zamów podobną <span aria-hidden="true">→</span></span>
          </div>
        </a>`;
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
