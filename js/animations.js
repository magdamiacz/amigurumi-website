/**
 * Szydełkomania_amigurumi — anime.js v4 animations
 * IntersectionObserver for reliable scroll triggers + anime.js for motion
 *
 * Note: anime.js 4.0.2 does not export splitText — word split is done manually.
 */

import {
  animate,
  stagger,
  onScroll,
  utils,
} from "./vendor/anime.esm.min.js";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
} else {
  initAnimations();
}

function initAnimations() {
  initScrollReveals();
  initHeroSplit();
  initMarquee();
  initCounters();
  initProcessLine();
  initMagneticButtons();
}

/** Manual word splitter (accessible) */
function splitWords(el) {
  const text = el.textContent || "";
  const words = text.trim().split(/(\s+)/);
  el.setAttribute("aria-label", text.trim());
  el.innerHTML = "";
  const spans = [];

  words.forEach((part) => {
    if (/^\s+$/.test(part)) {
      el.appendChild(document.createTextNode(part));
      return;
    }
    const span = document.createElement("span");
    span.className = "word";
    span.textContent = part;
    span.style.display = "inline-block";
    span.setAttribute("aria-hidden", "true");
    el.appendChild(span);
    spans.push(span);
  });

  return spans;
}

/* ---------- Scroll reveals ---------- */
function initScrollReveals() {
  const targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el);

        animate(el, {
          opacity: [0, 1],
          translateY: [24, 0],
          duration: 700,
          ease: "outExpo",
          onBegin: () => el.classList.add("is-visible"),
          onComplete: () => {
            el.style.opacity = "1";
            el.style.transform = "none";
          },
        });
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ---------- Hero word reveal ---------- */
function initHeroSplit() {
  const lines = utils.$(".hero__title [data-split]");
  if (!lines.length) return;

  lines.forEach((line, lineIndex) => {
    const words = splitWords(line);
    if (!words.length) return;

    animate(words, {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      delay: stagger(60, { start: 200 + lineIndex * 180 }),
      ease: "outExpo",
    });
  });

  const extras = utils.$(".hero__lead, .hero__actions, .hero .eyebrow");
  if (extras.length) {
    animate(extras, {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 700,
      delay: stagger(80, { start: 600 }),
      ease: "outQuart",
    });
  }

  const media = document.querySelector(".hero__media");
  if (media) {
    animate(media, {
      opacity: [0, 1],
      scale: [0.96, 1],
      duration: 900,
      delay: 400,
      ease: "outExpo",
    });
  }
}

/* ---------- Marquee infinite ---------- */
function initMarquee() {
  const track = document.querySelector("[data-marquee]");
  if (!track) return;

  animate(track, {
    translateX: ["0%", "-50%"],
    duration: 32000,
    ease: "linear",
    loop: true,
  });
}

/* ---------- Stats counters ---------- */
function initCounters() {
  const counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el);
        if (el.dataset.counted === "1") return;
        el.dataset.counted = "1";

        const target = Number(el.getAttribute("data-counter")) || 0;
        const obj = { val: 0 };

        animate(obj, {
          val: target,
          duration: 1600,
          ease: "outExpo",
          onUpdate: () => {
            el.textContent = String(Math.round(obj.val));
          },
          onComplete: () => {
            el.textContent = String(target);
          },
        });
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((el) => observer.observe(el));
}

/* ---------- Process line draw ---------- */
function initProcessLine() {
  const line = document.querySelector("[data-process-line]");
  const layout = document.querySelector(".process__layout");
  if (!line || !layout) return;

  const length = 600;
  line.setAttribute("stroke-dasharray", String(length));
  line.setAttribute("stroke-dashoffset", String(length));

  try {
    animate(line, {
      strokeDashoffset: [length, 0],
      ease: "linear",
      autoplay: onScroll({
        target: layout,
        enter: "top bottom",
        leave: "bottom top",
        sync: true,
      }),
    });
  } catch {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        animate(line, {
          strokeDashoffset: [length, 0],
          duration: 1400,
          ease: "outQuart",
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(layout);
  }
}

/* ---------- Magnetic CTA buttons ---------- */
function initMagneticButtons() {
  const buttons = utils.$(".magnetic");
  if (!buttons.length) return;
  if (window.matchMedia("(hover: none)").matches) return;

  buttons.forEach((btn) => {
    const strength = 18;

    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      animate(btn, {
        translateX: (x / rect.width) * strength,
        translateY: (y / rect.height) * strength,
        duration: 400,
        ease: "outElastic(1, .6)",
      });
    });

    btn.addEventListener("mouseleave", () => {
      animate(btn, {
        translateX: 0,
        translateY: 0,
        duration: 500,
        ease: "outExpo",
      });
    });
  });
}
