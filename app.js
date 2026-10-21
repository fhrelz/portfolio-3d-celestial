document.addEventListener('DOMContentLoaded', () => {
  const btnPrint = document.getElementById('btnPrint');
  const themeSelect = document.getElementById('themeSelect');
  const langSelect = document.getElementById('langSelect');

  // Load saved language preference or default to 'id'
  let currentLang = localStorage.getItem('cv_lang') || 'id';

  function applyLanguage(lang) {
    if (typeof translations === 'undefined' || !translations[lang]) return;
    const t = translations[lang];

    // Update document lang attribute
    document.documentElement.setAttribute('lang', lang);

    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) {
        el.innerHTML = t[key];
      }
    });

    // Update langSelect dropdown value
    if (langSelect) {
      langSelect.value = lang;
    }

    localStorage.setItem('cv_lang', lang);
  }

  // Language switcher handler
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      applyLanguage(e.target.value);
    });
  }

  // Initial language application
  applyLanguage(currentLang);

  // Print / Save as PDF handler
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  // Theme switcher handler (Default to Mono / Hitam Putih ATS unless changed)
  if (themeSelect) {
    document.documentElement.setAttribute('data-theme', 'mono');

    themeSelect.addEventListener('change', (e) => {
      const selectedTheme = e.target.value;
      if (selectedTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', selectedTheme);
      }
    });
  }
});


