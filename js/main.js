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
const IMAGE_EXTS = ["jpg", "jpeg", "webp", "png"];

let lastFocus = null;
let galleryItems = [];
let galleryIndex = 0;
let galleryTitle = "";

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

const renderLightboxSlide = () => {
  if (!lightboxImg || !galleryItems.length) return;
  const src = galleryItems[galleryIndex];
  lightboxImg.src = src;
  lightboxImg.alt = galleryTitle
    ? `${galleryTitle} — zdjęcie ${galleryIndex + 1}`
    : `Zdjęcie ${galleryIndex + 1}`;
  if (lightboxCaption) {
    lightboxCaption.textContent = galleryTitle
      ? `${galleryTitle}`
      : lightboxImg.alt;
  }
  if (lightboxCounter) {
    if (galleryItems.length > 1) {
      lightboxCounter.hidden = false;
      lightboxCounter.textContent = `${galleryIndex + 1} / ${galleryItems.length}`;
    } else {
      lightboxCounter.hidden = true;
    }
  }
  const multi = galleryItems.length > 1;
  if (lightboxPrev) lightboxPrev.hidden = !multi;
  if (lightboxNext) lightboxNext.hidden = !multi;
};

const openLightboxGallery = (items, title = "", startIndex = 0) => {
  if (!lightbox || !lightboxImg || !items.length) return;
  lastFocus = document.activeElement;
  galleryItems = items;
  galleryIndex = Math.max(0, Math.min(startIndex, items.length - 1));
  galleryTitle = title || "";
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
  lightboxImg.removeAttribute("src");
  galleryItems = [];
  galleryIndex = 0;
  galleryTitle = "";
  if (lightboxCounter) lightboxCounter.hidden = true;
  if (lightboxPrev) lightboxPrev.hidden = true;
  if (lightboxNext) lightboxNext.hidden = true;
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

  let items = [];
  if (base) items = await collectGalleryImages(base);
  if (!items.length && fallback) items = [fallback];
  if (!items.length) return;
  openLightboxGallery(items, title);
};

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
