/**
 * Cookie consent: accept / preferences / reject.
 * Choice is stored in localStorage. Optional categories are reserved for later.
 */

const STORAGE_KEY = "szydelkomania-cookie-consent";

const defaultPrefs = {
  necessary: true,
  analytics: false,
  marketing: false,
};

const legalHref = () =>
  location.pathname.includes("/oferta/")
    ? "../regulamin.html"
    : "regulamin.html";

export function initCookies() {
  const saved = loadConsent();
  if (saved) applyConsent(saved);
  injectMarkup();
  bindTriggers();
  if (!saved) showBanner();
}

function loadConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;
    return {
      necessary: true,
      analytics: Boolean(data.analytics),
      marketing: Boolean(data.marketing),
    };
  } catch {
    return null;
  }
}

function saveConsent(prefs) {
  const next = {
    necessary: true,
    analytics: Boolean(prefs.analytics),
    marketing: Boolean(prefs.marketing),
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* private mode — still hide the banner for this visit */
  }
  applyConsent(next);
  hideBanner();
  closePrefs();
}

function applyConsent(prefs) {
  document.documentElement.dataset.cookiesAnalytics = prefs.analytics ? "1" : "0";
  document.documentElement.dataset.cookiesMarketing = prefs.marketing ? "1" : "0";
}

function injectMarkup() {
  if (document.getElementById("cookie-banner")) return;

  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <div class="cookie-banner" id="cookie-banner" hidden role="dialog" aria-modal="false" aria-labelledby="cookie-banner-title" aria-describedby="cookie-banner-text">
      <div class="cookie-banner__inner">
        <div class="cookie-banner__copy">
          <p class="cookie-banner__title" id="cookie-banner-title">Pliki cookies</p>
          <p class="cookie-banner__text" id="cookie-banner-text">
            Używamy plików cookies, żeby strona działała poprawnie i zapamiętać Twój wybór.
            Możesz zaakceptować wszystkie, ustawić preferencje albo odrzucić opcjonalne.
            Szczegóły w <a href="${legalHref()}">Regulaminie i RODO</a>.
          </p>
        </div>
        <div class="cookie-banner__actions">
          <button type="button" class="btn btn--ghost-light" data-cookie-reject>Odrzuć</button>
          <button type="button" class="btn btn--ghost-light" data-cookie-prefs>Ustawienia</button>
          <button type="button" class="btn btn--primary" data-cookie-accept>Akceptuj wszystkie</button>
        </div>
      </div>
    </div>
    <div class="cookie-prefs" id="cookie-prefs" hidden>
      <div class="cookie-prefs__backdrop" data-cookie-prefs-close></div>
      <div class="cookie-prefs__dialog" role="dialog" aria-modal="true" aria-labelledby="cookie-prefs-title" tabindex="-1">
        <h2 class="cookie-prefs__title" id="cookie-prefs-title">Ustawienia cookies</h2>
        <p class="cookie-prefs__lead">
          Niezbędne cookies są zawsze włączone. Analityczne i marketingowe możesz wyłączyć — obecnie ich nie ładujemy, ale zapamiętamy Twój wybór.
        </p>
        <ul class="cookie-prefs__list">
          <li class="cookie-prefs__item">
            <div class="cookie-prefs__meta">
              <p class="cookie-prefs__name">Niezbędne</p>
              <p class="cookie-prefs__desc">Działanie strony, bezpieczeństwo i zapamiętanie tej zgody.</p>
            </div>
            <label class="cookie-switch cookie-switch--locked">
              <input type="checkbox" checked disabled />
              <span class="cookie-switch__ui" aria-hidden="true"></span>
              <span class="visually-hidden">Niezbędne, zawsze włączone</span>
            </label>
          </li>
          <li class="cookie-prefs__item">
            <div class="cookie-prefs__meta">
              <p class="cookie-prefs__name">Analityczne</p>
              <p class="cookie-prefs__desc">Pomagają zrozumieć, jak korzystasz ze strony. Teraz nieużywane.</p>
            </div>
            <label class="cookie-switch">
              <input type="checkbox" id="cookie-analytics" />
              <span class="cookie-switch__ui" aria-hidden="true"></span>
              <span class="visually-hidden">Analityczne cookies</span>
            </label>
          </li>
          <li class="cookie-prefs__item">
            <div class="cookie-prefs__meta">
              <p class="cookie-prefs__name">Marketingowe</p>
              <p class="cookie-prefs__desc">Służą dopasowaniu treści reklamowych. Teraz nieużywane.</p>
            </div>
            <label class="cookie-switch">
              <input type="checkbox" id="cookie-marketing" />
              <span class="cookie-switch__ui" aria-hidden="true"></span>
              <span class="visually-hidden">Marketingowe cookies</span>
            </label>
          </li>
        </ul>
        <div class="cookie-prefs__actions">
          <button type="button" class="btn btn--ghost-light" data-cookie-reject>Odrzuć opcjonalne</button>
          <button type="button" class="btn btn--ghost-light" data-cookie-prefs-close>Anuluj</button>
          <button type="button" class="btn btn--primary" data-cookie-save>Zapisz wybór</button>
        </div>
      </div>
    </div>
  `;
  while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
}

function bindTriggers() {
  document.addEventListener("click", (e) => {
    const accept = e.target.closest("[data-cookie-accept]");
    const reject = e.target.closest("[data-cookie-reject]");
    const prefs = e.target.closest("[data-cookie-prefs]");
    const save = e.target.closest("[data-cookie-save]");
    const close = e.target.closest("[data-cookie-prefs-close]");
    const reopen = e.target.closest("[data-cookie-settings]");

    if (accept) {
      saveConsent({ necessary: true, analytics: true, marketing: true });
      return;
    }
    if (reject) {
      saveConsent({ ...defaultPrefs });
      return;
    }
    if (save) {
      saveConsent({
        necessary: true,
        analytics: Boolean(document.getElementById("cookie-analytics")?.checked),
        marketing: Boolean(document.getElementById("cookie-marketing")?.checked),
      });
      return;
    }
    if (prefs || reopen) {
      openPrefs();
      return;
    }
    if (close) {
      closePrefs();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const panel = document.getElementById("cookie-prefs");
    if (panel && !panel.hidden) closePrefs();
  });

  addFooterLink();
}

function addFooterLink() {
  document.querySelectorAll(".footer").forEach((footer) => {
    if (footer.querySelector("[data-cookie-settings]")) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cookie-settings-link";
    btn.setAttribute("data-cookie-settings", "");
    btn.textContent = "Ustawienia cookies";
    const copy = footer.querySelector(".footer__copy");
    const made = footer.querySelector(".footer__made");
    const host = copy || made || footer;
    host.append(document.createTextNode(" · "), btn);
  });
}

function showBanner() {
  const banner = document.getElementById("cookie-banner");
  if (!banner) return;
  banner.hidden = false;
  document.body.classList.add("has-cookie-banner");
}

function hideBanner() {
  const banner = document.getElementById("cookie-banner");
  if (banner) banner.hidden = true;
  document.body.classList.remove("has-cookie-banner");
}

function openPrefs() {
  const panel = document.getElementById("cookie-prefs");
  const dialog = panel?.querySelector(".cookie-prefs__dialog");
  if (!panel || !dialog) return;
  const saved = loadConsent() || defaultPrefs;
  const analytics = document.getElementById("cookie-analytics");
  const marketing = document.getElementById("cookie-marketing");
  if (analytics) analytics.checked = saved.analytics;
  if (marketing) marketing.checked = saved.marketing;
  panel.hidden = false;
  document.body.classList.add("has-cookie-prefs");
  dialog.focus();
}

function closePrefs() {
  const panel = document.getElementById("cookie-prefs");
  if (panel) panel.hidden = true;
  document.body.classList.remove("has-cookie-prefs");
}
