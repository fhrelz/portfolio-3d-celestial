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

  // ===================================================================
  // Cover Letter Private Modal Handler (PIN: 227070)
  // ===================================================================
  const btnOpenCoverLetterModal = document.getElementById('btnOpenCoverLetterModal');
  const cvPinModal = document.getElementById('cvPinModal');
  const btnClosePinModal = document.getElementById('btnClosePinModal');
  const btnSubmitCvPin = document.getElementById('btnSubmitCvPin');
  const cvPinInput = document.getElementById('cvPinInput');
  const cvPinError = document.getElementById('cvPinError');
  const cvPinCard = document.getElementById('cvPinCard');
  const SECRET_PIN = '227070';

  if (btnOpenCoverLetterModal && cvPinModal) {
    btnOpenCoverLetterModal.addEventListener('click', () => {
      // Check if already authenticated in this session
      if (sessionStorage.getItem('cover_letter_authenticated') === SECRET_PIN) {
        window.location.href = 'surat-lamaran.html';
        return;
      }
      cvPinModal.style.display = 'flex';
      cvPinInput.value = '';
      if (cvPinError) cvPinError.style.display = 'none';
      setTimeout(() => cvPinInput.focus(), 200);
    });

    function verifyCvPin() {
      const val = cvPinInput.value.trim();
      if (val === SECRET_PIN) {
        sessionStorage.setItem('cover_letter_authenticated', SECRET_PIN);
        cvPinModal.style.display = 'none';
        window.location.href = 'surat-lamaran.html';
      } else {
        if (cvPinError) cvPinError.style.display = 'block';
        if (cvPinCard) {
          cvPinCard.style.animation = 'none';
          void cvPinCard.offsetWidth;
          cvPinCard.style.animation = 'shake-anim 0.4s ease';
        }
        cvPinInput.value = '';
        cvPinInput.focus();
      }
    }

    if (btnSubmitCvPin) {
      btnSubmitCvPin.addEventListener('click', verifyCvPin);
    }

    if (cvPinInput) {
      cvPinInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') verifyCvPin();
      });
    }

    if (btnClosePinModal) {
      btnClosePinModal.addEventListener('click', () => {
        cvPinModal.style.display = 'none';
      });
    }

    cvPinModal.addEventListener('click', (e) => {
      if (e.target === cvPinModal) {
        cvPinModal.style.display = 'none';
      }
    });
  }
});

