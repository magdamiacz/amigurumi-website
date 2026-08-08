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

/* ---------- Lightbox ---------- */
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox?.querySelector(".lightbox__img");
const lightboxCaption = document.getElementById("lightbox-caption");
let lastFocus = null;

const openLightbox = (src, alt, caption) => {
  if (!lightbox || !lightboxImg) return;
  lastFocus = document.activeElement;
  lightboxImg.src = src;
  lightboxImg.alt = alt || "";
  if (lightboxCaption) lightboxCaption.textContent = caption || "";
  lightbox.hidden = false;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lightbox.querySelector(".lightbox__close")?.focus();
};

const closeLightbox = () => {
  if (!lightbox || !lightboxImg) return;
  lightbox.hidden = true;
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.removeAttribute("src");
  document.body.style.overflow = "";
  if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
};

document.querySelectorAll("[data-gallery] .gallery__item").forEach((btn) => {
  btn.addEventListener("click", () => {
    const src = btn.getAttribute("data-lightbox-src") || "";
    const alt = btn.getAttribute("data-lightbox-alt") || "";
    const title = btn.getAttribute("data-title") || "";
    const year = btn.getAttribute("data-year") || "";
    const caption = [title, year].filter(Boolean).join(" · ");
    // Placeholder mode: show caption even without real image
    openLightbox(src, alt, caption || alt);
  });
});

lightbox?.querySelectorAll("[data-lightbox-close]").forEach((el) => {
  el.addEventListener("click", closeLightbox);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox && !lightbox.hidden) closeLightbox();
});

/* ---------- Contact form ---------- */
const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");

const validators = {
  name: (v) => v.trim().length >= 2,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  message: (v) => v.trim().length >= 10,
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
  const ok = validators[id](input.value);
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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const results = ["name", "email", "message"].map(validateField);
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
          statusEl.textContent = "Dzięki! Odezwę się w 24h. (tryb demo — podmień action formularza)";
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
          statusEl.textContent = "Dzięki! Odezwę się w 24h.";
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
