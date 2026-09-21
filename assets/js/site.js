/* ==========================================================================
   Jadawel — site behaviour
   Language/direction switching, mobile navigation, scroll reveal,
   and the static contact form acknowledgement.
   No third-party dependencies, no network requests.
   ========================================================================== */
(function () {
  "use strict";

  var STORAGE_KEY = "jadawel-lang";
  var DICT = window.JADWEL_I18N || {};
  var root = document.documentElement;

  /* --- Bilingual rendering ------------------------------------------------ */
  function t(lang, key) {
    var pack = DICT[lang] || DICT.ar || {};
    return Object.prototype.hasOwnProperty.call(pack, key) ? pack[key] : null;
  }

  function applyLanguage(lang) {
    if (!DICT[lang]) lang = "ar";
    var isAr = lang === "ar";

    root.setAttribute("lang", lang);
    root.setAttribute("dir", isAr ? "rtl" : "ltr");

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var value = t(lang, el.getAttribute("data-i18n"));
      if (value !== null) el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var parts = pair.split(":");
        if (parts.length !== 2) return;
        var value = t(lang, parts[1].trim());
        if (value !== null) el.setAttribute(parts[0].trim(), value);
      });
    });

    // Pages may name their own title key; the 404 uses this so it does not
    // inherit the home page title.
    var title = t(lang, root.getAttribute("data-title-key") || "meta.title");
    if (title) document.title = title;
    // A page may name its own description key too, the way it names its title,
    // so a document page does not inherit the home page's description.
    var desc = document.querySelector('meta[name="description"]');
    var descValue = t(lang, root.getAttribute("data-desc-key") || "meta.description");
    if (desc && descValue) desc.setAttribute("content", descValue);

    document.querySelectorAll("[data-lang-set]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang-set") === lang));
    });

    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode */ }
  }

  function initialLanguage() {
    // An explicit ?lang= wins over the stored choice: it is what a shared link
    // carries, and a link that names a language should open in that language.
    var qs = new URLSearchParams(window.location.search).get("lang");
    if (qs && DICT[qs]) return qs;
    var stored = null;
    try { stored = window.localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }
    if (stored && DICT[stored]) return stored;
    var nav = (navigator.language || "ar").toLowerCase();
    return nav.indexOf("ar") === 0 ? "ar" : "ar";
  }

  /* --- Mobile navigation -------------------------------------------------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* --- Scroll reveal ------------------------------------------------------ */
  function initReveal() {
    var targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.06 });

    targets.forEach(function (el, index) {
      el.style.transitionDelay = Math.min(index % 6, 5) * 45 + "ms";
      observer.observe(el);
    });
  }

  /* --- Contact form (static demo, no transmission) ------------------------ */
  function initForm() {
    var form = document.querySelector("[data-jadawel-form]");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var status = form.querySelector(".form-status");
      if (status) {
        status.classList.add("is-visible");
        status.focus();
      }
    });
  }

  /* --- Boot --------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    root.classList.add("js");
    applyLanguage(initialLanguage());
    initNav();
    initReveal();
    initForm();

    document.querySelectorAll("[data-lang-set]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLanguage(btn.getAttribute("data-lang-set"));
      });
    });
  });
})();
