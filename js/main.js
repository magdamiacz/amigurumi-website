/**
 * Szydełkomania_amigurumi — main interactions
 * Nav, mobile menu, form validation, lightbox, FAQ, year
 */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (prefersReducedMotion) {
  document.documentElement.classList.add("reduce-motion");
}

/* Safety net: if animations.js fails to load, show reveals after 1.5s */
window.setTimeout(() => {
  document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
    el.classList.add("is-visible");
    el.style.opacity = "1";
    el.style.transform = "none";
  });
}, 1500);

/* Fallback counters (if anime.js module fails) */
const runFallbackCounters = () => {
  document.querySelectorAll("[data-counter]").forEach((el) => {
    if (el.dataset.counted === "1") return;
    const target = Number(el.getAttribute("data-counter")) || 0;
    if (Number(el.textContent) >= target && target > 0) {
      el.dataset.counted = "1";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        if (el.dataset.counted === "1") return;
        el.dataset.counted = "1";

        const start = performance.now();
        const duration = 1400;
        const tick = (now) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = String(Math.round(target * eased));
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = String(target);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
  });
};

// Run fallback after a short delay; anime.js will mark data-counted if it succeeds first
window.setTimeout(runFallbackCounters, 800);

/* ---------- Year ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* ---------- Sticky nav ---------- */
const header = document.querySelector(".site-header");
const forceSolidNav =
  Boolean(header?.classList.contains("site-header--solid")) ||
  document.body.classList.contains("page-category");
const onScrollNav = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", forceSolidNav || window.scrollY > 80);
};
onScrollNav();
window.addEventListener("scroll", onScrollNav, { passive: true });

/* ---------- Mobile menu ---------- */
const toggle = document.querySelector(".nav__toggle");
const menu = document.getElementById("nav-menu");

const closeMenu = () => {
  if (!toggle || !menu) return;
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Otwórz menu");
  menu.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  document.body.style.overflow = "";
};

const openMenu = () => {
  if (!toggle || !menu) return;
  toggle.setAttribute("aria-expanded", "true");
  toggle.setAttribute("aria-label", "Zamknij menu");
  document.body.classList.add("nav-open");
  menu.classList.add("is-open");
  document.body.style.overflow = "hidden";
};

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    if (expanded) closeMenu();
    else openMenu();
  });

  menu.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

/* ---------- Lightbox (single + product gallery) ---------- */
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox?.querySelector(".lightbox__img");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxCounter = document.getElementById("lightbox-counter");
const lightboxPrev = lightbox?.querySelector("[data-lightbox-prev]");
const lightboxNext = lightbox?.querySelector("[data-lightbox-next]");
const lightboxThumbs = document.getElementById("lightbox-thumbs");
const lightboxInfo = document.getElementById("lightbox-info");
const lightboxTitleEl = document.getElementById("lightbox-title");
const lightboxPriceEl = document.getElementById("lightbox-price");
const lightboxDescEl = document.getElementById("lightbox-desc");
const lightboxMaterialEl = document.getElementById("lightbox-material");
const lightboxSafetyEl = document.getElementById("lightbox-safety");
const lightboxCareEl = document.getElementById("lightbox-care");
const lightboxLeadEl = document.getElementById("lightbox-lead");
const lightboxInquire = document.getElementById("lightbox-inquire");
const IMAGE_EXTS = ["jpg", "jpeg", "webp", "png"];

let lastFocus = null;
let galleryItems = [];
let galleryIndex = 0;
let galleryTitle = "";
let galleryMode = "simple";

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

const collectGalleryImages = async (baseDir, max = 24) => {
  const found = [];
  let misses = 0;
  for (let i = 1; i <= max; i++) {
    const url = await resolveNumberedUrl(baseDir, i);
    if (url) {
      found.push(url);
      misses = 0;
    } else {
      misses += 1;
      if (found.length === 0 && i >= 4) break;
      if (found.length > 0 && misses >= 2) break;
    }
  }
  return found;
};

const setText = (el, value) => {
  if (!el) return;
  el.textContent = value || "";
};

const renderThumbs = () => {
  if (!lightboxThumbs) return;
  if (galleryMode !== "product" || galleryItems.length < 2) {
    lightboxThumbs.hidden = true;
    lightboxThumbs.innerHTML = "";
    return;
  }
  lightboxThumbs.hidden = false;
  lightboxThumbs.innerHTML = galleryItems
    .map(
      (src, i) =>
        `<button type="button" class="lightbox__thumb${i === galleryIndex ? " is-active" : ""}" data-thumb-index="${i}" aria-label="Zdjęcie ${i + 1}" aria-current="${i === galleryIndex ? "true" : "false"}"><img src="${src}" alt="" width="64" height="64" /></button>`
    )
    .join("");
};

const fillProductInfo = (meta) => {
  if (!lightboxInfo) return;
  if (!meta) {
    lightboxInfo.hidden = true;
    return;
  }
  lightboxInfo.hidden = false;
  setText(lightboxTitleEl, meta.title);
  setText(lightboxPriceEl, meta.price);
  setText(lightboxDescEl, meta.desc);
  setText(lightboxMaterialEl, meta.material);
  setText(lightboxSafetyEl, meta.safety);
  setText(lightboxCareEl, meta.care);
  setText(lightboxLeadEl, meta.lead);
  if (lightboxInquire && meta.inquire) {
    lightboxInquire.href = meta.inquire;
  }
};

const renderLightboxSlide = () => {
  if (!lightboxImg || !galleryItems.length) return;
  const src = galleryItems[galleryIndex];
  lightboxImg.src = src;
  lightboxImg.alt = galleryTitle
    ? `${galleryTitle} — zdjęcie ${galleryIndex + 1}`
    : `Zdjęcie ${galleryIndex + 1}`;
  if (lightboxCaption) {
    if (galleryMode === "product") {
      lightboxCaption.hidden = true;
    } else {
      lightboxCaption.hidden = false;
      lightboxCaption.textContent = galleryTitle
        ? `${galleryTitle}`
        : lightboxImg.alt;
    }
  }
  if (lightboxCounter) {
    if (galleryMode !== "product" && galleryItems.length > 1) {
      lightboxCounter.hidden = false;
      lightboxCounter.textContent = `${galleryIndex + 1} / ${galleryItems.length}`;
    } else {
      lightboxCounter.hidden = true;
    }
  }
  const multi = galleryItems.length > 1;
  if (lightboxPrev) lightboxPrev.hidden = !multi;
  if (lightboxNext) lightboxNext.hidden = !multi;
  if (lightboxThumbs) {
    lightboxThumbs.querySelectorAll(".lightbox__thumb").forEach((btn, i) => {
      btn.classList.toggle("is-active", i === galleryIndex);
      btn.setAttribute("aria-current", i === galleryIndex ? "true" : "false");
    });
  }
};

const openLightboxGallery = (items, title = "", startIndex = 0, meta = null) => {
  if (!lightbox || !lightboxImg || !items.length) return;
  lastFocus = document.activeElement;
  galleryItems = items;
  galleryIndex = Math.max(0, Math.min(startIndex, items.length - 1));
  galleryTitle = title || "";
  galleryMode = meta ? "product" : "simple";
  lightbox.classList.toggle("lightbox--product", galleryMode === "product");
  fillProductInfo(meta);
  renderThumbs();
  renderLightboxSlide();
  lightbox.hidden = false;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lightbox.querySelector(".lightbox__close")?.focus();
};

const openLightbox = (src, alt, caption) => {
  openLightboxGallery(src ? [src] : [], caption || alt || "");
};

const closeLightbox = () => {
  if (!lightbox || !lightboxImg) return;
  lightbox.hidden = true;
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.classList.remove("lightbox--product");
  lightboxImg.removeAttribute("src");
  galleryItems = [];
  galleryIndex = 0;
  galleryTitle = "";
  galleryMode = "simple";
  if (lightboxCounter) lightboxCounter.hidden = true;
  if (lightboxPrev) lightboxPrev.hidden = true;
  if (lightboxNext) lightboxNext.hidden = true;
  if (lightboxThumbs) {
    lightboxThumbs.hidden = true;
    lightboxThumbs.innerHTML = "";
  }
  if (lightboxInfo) lightboxInfo.hidden = true;
  document.body.style.overflow = "";
  if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
};

const stepLightbox = (delta) => {
  if (galleryItems.length < 2) return;
  galleryIndex = (galleryIndex + delta + galleryItems.length) % galleryItems.length;
  renderLightboxSlide();
};

document.querySelectorAll("[data-gallery] .gallery__item").forEach((btn) => {
  btn.addEventListener("click", () => {
    const src = btn.getAttribute("data-lightbox-src") || "";
    const alt = btn.getAttribute("data-lightbox-alt") || "";
    const title = btn.getAttribute("data-title") || "";
    const year = btn.getAttribute("data-year") || "";
    const caption = [title, year].filter(Boolean).join(" · ");
    openLightbox(src, alt, caption || alt);
  });
});

const openProductGallery = async (trigger) => {
  const title =
    trigger.getAttribute("data-gallery-title") ||
    trigger.querySelector(".product-card__title")?.textContent?.trim() ||
    "Produkt";
  const base = trigger.getAttribute("data-gallery-base") || "";
  const fallback =
    trigger.getAttribute("data-gallery-fallback") ||
    trigger.querySelector(".product-card__media img")?.getAttribute("src") ||
    "";

  const extras = (trigger.getAttribute("data-gallery-extras") || "")
    .split("|")
    .map((src) => src.trim())
    .filter(Boolean);

  let items = [];
  if (base) items = await collectGalleryImages(base);
  if (!items.length && fallback) items = [fallback];
  if (extras.length) {
    items = items.length ? [...items, ...extras] : extras;
  }
  if (!items.length) return;

  const meta = {
    title,
    price: trigger.getAttribute("data-gallery-price") || "",
    desc: trigger.getAttribute("data-gallery-desc") || "",
    material: trigger.getAttribute("data-gallery-material") || "",
    safety: trigger.getAttribute("data-gallery-safety") || "",
    care: trigger.getAttribute("data-gallery-care") || "",
    lead: trigger.getAttribute("data-gallery-lead") || "",
    inquire:
      trigger.getAttribute("data-gallery-inquire") ||
      `../index.html?produkt=${encodeURIComponent(title)}#kontakt`,
  };
  openLightboxGallery(items, title, 0, meta);
};

lightboxThumbs?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-thumb-index]");
  if (!btn) return;
  const index = Number(btn.getAttribute("data-thumb-index"));
  if (Number.isNaN(index)) return;
  galleryIndex = index;
  renderLightboxSlide();
});

document.addEventListener("click", (e) => {
  const trigger = e.target.closest("[data-product-gallery]");
  if (!trigger) return;
  if (e.target.closest("a[href]")) return;
  e.preventDefault();
  openProductGallery(trigger);
});

lightbox?.querySelectorAll("[data-lightbox-close]").forEach((el) => {
  el.addEventListener("click", closeLightbox);
});
lightboxPrev?.addEventListener("click", () => stepLightbox(-1));
lightboxNext?.addEventListener("click", () => stepLightbox(1));

document.addEventListener("keydown", (e) => {
  if (!lightbox || lightbox.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") stepLightbox(-1);
  if (e.key === "ArrowRight") stepLightbox(1);
});

/* ---------- Contact form ---------- */
const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");

const productParam = new URLSearchParams(window.location.search).get("produkt");
if (productParam && form) {
  const message = document.getElementById("message");
  if (message && !message.value.trim()) {
    message.value = `Chciałabym/chciałbym zapytać o produkt: ${productParam}.`;
  }
}

const validators = {
  name: (v) => v.trim().length >= 2,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  message: (v) => v.trim().length >= 10,
  consent: (_v, input) => Boolean(input?.checked),
};

const showFieldError = (id, show) => {
  const input = document.getElementById(id);
  const err = document.getElementById(`${id}-error`);
  if (!input) return;
  input.classList.toggle("is-invalid", show);
  input.setAttribute("aria-invalid", show ? "true" : "false");
  if (err) err.hidden = !show;
};

const validateField = (id) => {
  const input = document.getElementById(id);
  if (!input || !validators[id]) return true;
  const ok = validators[id](input.value, input);
  showFieldError(id, !ok);
  return ok;
};

if (form) {
  ["name", "email", "message"].forEach((id) => {
    const input = document.getElementById(id);
    input?.addEventListener("blur", () => validateField(id));
    input?.addEventListener("input", () => {
      if (input.classList.contains("is-invalid")) validateField(id);
    });
  });

  const consentInput = document.getElementById("consent");
  consentInput?.addEventListener("change", () => validateField("consent"));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const results = ["name", "email", "message", "consent"].map(validateField);
    if (results.includes(false)) {
      const firstInvalid = form.querySelector(".is-invalid");
      firstInvalid?.focus();
      if (statusEl) {
        statusEl.textContent = "Popraw zaznaczone pola.";
        statusEl.className = "form-status is-error";
      }
      return;
    }

    const submitBtn = document.getElementById("form-submit");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Wysyłanie…";
    }

    // Placeholder handler — replace with Formspree fetch when action is set
    const action = form.getAttribute("action");
    const isPlaceholder = !action || action === "#" || action === "";

    try {
      if (isPlaceholder) {
        // Demo mode
        await new Promise((r) => setTimeout(r, 600));
        console.log("Form data (placeholder):", Object.fromEntries(new FormData(form)));
        if (statusEl) {
          statusEl.textContent = "Dzięki za zapytanie! Odezwę się z propozycją w 24h. (tryb demo — podmień action formularza)";
          statusEl.className = "form-status is-success";
        }
        form.reset();
      } else {
        const res = await fetch(action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Network error");
        if (statusEl) {
          statusEl.textContent = "Dzięki za zapytanie! Odezwę się z propozycją w 24h.";
          statusEl.className = "form-status is-success";
        }
        form.reset();
      }
    } catch {
      if (statusEl) {
        statusEl.textContent = "Coś poszło nie tak. Napisz proszę przez Facebook lub Instagram.";
        statusEl.className = "form-status is-error";
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Wyślij zapytanie";
      }
    }
  });
}

/* ---------- Category product gallery ---------- */
document.querySelectorAll("[data-pdp-gallery]").forEach((gallery) => {
  const main = gallery.querySelector(".pdp__main");
  const thumbs = [...gallery.querySelectorAll("[data-pdp-thumb]")];
  if (!main || !thumbs.length) return;

  const sources = thumbs.map((btn) => btn.getAttribute("data-src")).filter(Boolean);
  let index = Math.max(
    0,
    thumbs.findIndex((btn) => btn.classList.contains("is-active"))
  );

  const show = (next) => {
    if (!sources.length) return;
    index = (next + sources.length) % sources.length;
    main.src = sources[index];
    main.classList.toggle("pdp__main--contain", sources[index].includes("/kolory/"));
    thumbs.forEach((btn, i) => {
      btn.classList.toggle("is-active", i === index);
      btn.setAttribute("aria-current", i === index ? "true" : "false");
    });
  };

  thumbs.forEach((btn, i) => {
    btn.addEventListener("click", () => show(i));
  });
  gallery.querySelector("[data-pdp-prev]")?.addEventListener("click", () => show(index - 1));
  gallery.querySelector("[data-pdp-next]")?.addEventListener("click", () => show(index + 1));
  main.style.cursor = "zoom-in";
  main.addEventListener("click", () => {
    openLightboxGallery(sources, main.getAttribute("alt") || "", index);
  });
});

document.querySelectorAll("[data-pdp-variants]").forEach((root) => {
  const priceEl = document.querySelector("[data-pdp-price]");
  const inquire = document.querySelector("[data-pdp-inquire]");
  const buttons = [...root.querySelectorAll("[data-variant-name]")];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((other) => {
        const on = other === btn;
        other.classList.toggle("is-selected", on);
        other.setAttribute("aria-pressed", on ? "true" : "false");
      });
      if (priceEl) priceEl.textContent = btn.getAttribute("data-variant-price") || "";
      const name = btn.getAttribute("data-variant-name") || "";
      if (inquire && name) {
        inquire.href = `../index.html?produkt=${encodeURIComponent(name)}#kontakt`;
      }
    });
  });
});

/* ---------- FAQ smooth open (progressive enhancement) ---------- */
document.querySelectorAll(".faq__item").forEach((details) => {
  const summary = details.querySelector("summary");
  if (!summary || prefersReducedMotion) return;

  summary.addEventListener("click", (e) => {
    // Let native toggle happen; we only add a tiny class for CSS if needed
    // Height animation via grid is CSS-only with [open] — keep simple
    void e;
  });
});
