/* ============================================================
   Vetro Connections — i18n engine (IT default, EN/ES/PT)
   Uso:
     - data-i18n="chiave"        -> imposta textContent
     - data-i18n-html="chiave"   -> imposta innerHTML (per markup interno, es. <strong>)
     - data-i18n-placeholder="chiave" -> imposta placeholder
     - data-i18n-title="chiave"  -> imposta title
     - data-i18n-aria="chiave"   -> imposta aria-label
   Le chiavi non trovate restituiscono l'italiano come fallback.
   ============================================================ */
(function () {
  const STORAGE_KEY = 'vc_lang';
  const LANGS = ['it', 'en', 'es', 'pt'];
  const FLAGS = { it: '🇮🇹', en: '🇬🇧', es: '🇪🇸', pt: '🇵🇹' };

  window.VC_I18N = window.VC_I18N || {};
  const dict = window.VC_I18N;

  function get(lang, key) {
    const table = dict[lang] || dict.it;
    if (table && Object.prototype.hasOwnProperty.call(table, key)) return table[key];
    if (dict.it && Object.prototype.hasOwnProperty.call(dict.it, key)) return dict.it[key];
    return null;
  }

  function currentLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return LANGS.includes(saved) ? saved : 'it';
  }

  function applyLanguage(lang) {
    if (!LANGS.includes(lang)) lang = 'it';
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = get(lang, el.getAttribute('data-i18n'));
      if (v !== null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const v = get(lang, el.getAttribute('data-i18n-html'));
      if (v !== null) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const v = get(lang, el.getAttribute('data-i18n-placeholder'));
      if (v !== null) el.setAttribute('placeholder', v);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const v = get(lang, el.getAttribute('data-i18n-title'));
      if (v !== null) el.setAttribute('title', v);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const v = get(lang, el.getAttribute('data-i18n-aria'));
      if (v !== null) el.setAttribute('aria-label', v);
    });

    document.querySelectorAll('.lang-current .lang-flag').forEach(el => el.textContent = FLAGS[lang]);
    document.querySelectorAll('.lang-current .lang-code').forEach(el => el.textContent = lang.toUpperCase());
    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    document.dispatchEvent(new CustomEvent('vc:langchange', { detail: { lang } }));
  }

  function setLanguage(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    applyLanguage(lang);
  }

  // Helper globale per stringhe usate dentro JS (validazioni, testi dinamici)
  window.vcT = function (key) { return get(currentLang(), key) || key; };
  window.vcLang = currentLang;
  window.vcSetLang = setLanguage;

  function wireSwitcher() {
    document.querySelectorAll('.lang-current').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = btn.parentElement.querySelector('.lang-dropdown');
        if (dropdown) dropdown.classList.toggle('open');
      });
    });
    document.querySelectorAll('.lang-option').forEach(opt => {
      opt.addEventListener('click', () => {
        setLanguage(opt.getAttribute('data-lang'));
        document.querySelectorAll('.lang-dropdown').forEach(d => d.classList.remove('open'));
      });
    });
    document.addEventListener('click', () => {
      document.querySelectorAll('.lang-dropdown').forEach(d => d.classList.remove('open'));
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    wireSwitcher();
    applyLanguage(currentLang());
  });
})();
