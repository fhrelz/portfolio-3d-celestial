/**
 * ===================================================================
 * PORTAL GENERATOR & ARSIP SURAT LAMARAN KERJA PRIBADI
 * Muhammad Fahrel Yuliyanto
 * Security PIN: 227070 (Confidential Access Gate)
 * Features: Tesseract OCR, Dynamic Portfolio Synthesis, A4 Live Editor,
 * Word/PDF Export & Persistent Archive.
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Constants
  const SECRET_PIN = '227070';
  const AUTH_STORAGE_KEY = 'cover_letter_authenticated';
  const ARCHIVE_STORAGE_KEY = 'fahrel_cover_letters_archive_v1';

  // DOM Elements - Security PIN
  const pinLockOverlay = document.getElementById('pinLockOverlay');
  const pinInput = document.getElementById('pinInput');
  const pinErrorMsg = document.getElementById('pinErrorMsg');
  const pinCard = document.getElementById('pinCard');
  const btnUnlockPin = document.getElementById('btnUnlockPin');
  const btnLockPortal = document.getElementById('btnLockPortal');

  // DOM Elements - Navigation & Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const archiveCountBadge = document.getElementById('archiveCountBadge');

  // DOM Elements - Flyer Upload & OCR
  const dropzone = document.getElementById('dropzone');
  const flyerFileInput = document.getElementById('flyerFileInput');
  const flyerPreviewBox = document.getElementById('flyerPreviewBox');
  const flyerImgPreview = document.getElementById('flyerImgPreview');
  const btnRemoveFlyer = document.getElementById('btnRemoveFlyer');
  const ocrProgressBox = document.getElementById('ocrProgressBox');
  const ocrProgressBar = document.getElementById('ocrProgressBar');
  const ocrStatusMsg = document.getElementById('ocrStatusMsg');
  const ocrPercentVal = document.getElementById('ocrPercentVal');

  // DOM Elements - Form Fields
  const inpPosition = document.getElementById('inpPosition');
  const inpCompany = document.getElementById('inpCompany');
  const inpLocation = document.getElementById('inpLocation');
  const inpRecipient = document.getElementById('inpRecipient');
  const inpSource = document.getElementById('inpSource');
  const inpDate = document.getElementById('inpDate');
  const inpKeyHighlights = document.getElementById('inpKeyHighlights');
  const inpContactEmail = document.getElementById('inpContactEmail');
  const inpContactPhone = document.getElementById('inpContactPhone');
  const inpContactLink = document.getElementById('inpContactLink');
  const btnGenerateLetter = document.getElementById('btnGenerateLetter');
  const presetPills = document.querySelectorAll('.preset-pill');

  // DOM Elements - OCR Result Inspector
  const ocrResultCard = document.getElementById('ocrResultCard');
  const ocrChipsList = document.getElementById('ocrChipsList');
  const btnToggleRawOcr = document.getElementById('btnToggleRawOcr');
  const rawOcrContainer = document.getElementById('rawOcrContainer');
  const rawOcrTextarea = document.getElementById('rawOcrTextarea');


  // DOM Elements - Preview & Actions
  const a4Sheet = document.getElementById('a4Sheet');
  const btnCopyLetter = document.getElementById('btnCopyLetter');
  const btnDownloadDoc = document.getElementById('btnDownloadDoc');
  const btnSaveArchive = document.getElementById('btnSaveArchive');
  const btnPrintLetter = document.getElementById('btnPrintLetter');
  const btnOpenSendModal = document.getElementById('btnOpenSendModal');
  const btnNewFromArchive = document.getElementById('btnNewFromArchive');
  const archiveGrid = document.getElementById('archiveGrid');
  const toastMsg = document.getElementById('toastMsg');
  const toastText = document.getElementById('toastText');

  // DOM Elements - Send Application Modal
  const sendModalOverlay = document.getElementById('sendModalOverlay');
  const btnCloseSendModal = document.getElementById('btnCloseSendModal');
  const modalEmailTarget = document.getElementById('modalEmailTarget');
  const modalEmailSubject = document.getElementById('modalEmailSubject');
  const emailBodyPreview = document.getElementById('emailBodyPreview');
  const btnSendGmailWeb = document.getElementById('btnSendGmailWeb');
  const btnSendMailto = document.getElementById('btnSendMailto');
  const btnCopyEmailBody = document.getElementById('btnCopyEmailBody');
  const modalWaTarget = document.getElementById('modalWaTarget');
  const waMessagePreview = document.getElementById('waMessagePreview');
  const btnSendWhatsapp = document.getElementById('btnSendWhatsapp');
  const btnCopyWaMsg = document.getElementById('btnCopyWaMsg');
  const modalPortalLink = document.getElementById('modalPortalLink');
  const btnOpenCareerPortal = document.getElementById('btnOpenCareerPortal');


  // Set default date to today in YYYY-MM-DD
  const today = new Date();
  inpDate.value = today.toISOString().split('T')[0];

  // ===================================================================
  // 1. PIN SECURITY ACCESS GATE (227070)
  // ===================================================================
  function checkAuthentication() {
    const isAuthed = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (isAuthed === SECRET_PIN) {
      pinLockOverlay.classList.add('unlocked');
    } else {
      pinLockOverlay.classList.remove('unlocked');
      pinInput.value = '';
      setTimeout(() => pinInput.focus(), 300);
    }
  }

  function handleUnlock() {
    const val = pinInput.value.trim();
    if (val === SECRET_PIN) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, SECRET_PIN);
      pinLockOverlay.classList.add('unlocked');
      pinErrorMsg.style.display = 'none';
      showToast('Akses Terverifikasi! Selamat datang, Fahrel.');
    } else {
      pinErrorMsg.style.display = 'block';
      pinCard.classList.remove('shake');
      void pinCard.offsetWidth; // Trigger reflow
      pinCard.classList.add('shake');
      pinInput.value = '';
      pinInput.focus();
    }
  }

  btnUnlockPin.addEventListener('click', handleUnlock);
  pinInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleUnlock();
  });

  if (btnLockPortal) {
    btnLockPortal.addEventListener('click', () => {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      checkAuthentication();
      showToast('Portal berhasil dikunci kembali.');
    });
  }

  // Initial check on load
  checkAuthentication();

  // ===================================================================
  // 2. TABS SWITCHING
  // ===================================================================
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      document.getElementById(targetId).classList.add('active');

      if (targetId === 'tab-archive') {
        renderArchive();
      }
    });
  });

  if (btnNewFromArchive) {
    btnNewFromArchive.addEventListener('click', () => {
      const genTabBtn = document.querySelector('[data-tab="tab-generator"]');
      if (genTabBtn) genTabBtn.click();
    });
  }

  // ===================================================================
  // 3. TOAST NOTIFICATION UTILITY
  // ===================================================================
  let toastTimer = null;
  function showToast(message) {
    if (toastTimer) clearTimeout(toastTimer);
    toastText.textContent = message;
    toastMsg.classList.add('show');
    toastTimer = setTimeout(() => {
      toastMsg.classList.remove('show');
    }, 3200);
  }

  // ===================================================================
  // 4. FLYER UPLOAD & OCR SCANNING
  // ===================================================================
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFlyer(e.dataTransfer.files[0]);
    }
  });

  flyerFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFlyer(e.target.files[0]);
    }
  });

  btnRemoveFlyer.addEventListener('click', () => {
    flyerFileInput.value = '';
    flyerPreviewBox.style.display = 'none';
    flyerImgPreview.src = '';
    ocrProgressBox.style.display = 'none';
    showToast('Flyer loker dihapus.');
  });

  function processUploadedFlyer(file) {
    if (!file.type.startsWith('image/')) {
      alert('Harap unggah berkas gambar poster lowongan pekerjaan (PNG, JPG, JPEG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      flyerImgPreview.src = dataUrl;
      flyerPreviewBox.style.display = 'block';

      // Start OCR Parsing
      runOcrRecognition(dataUrl, file.name);
    };
    reader.readAsDataURL(file);
  }

  // Preprocess image for OCR using HTML5 Canvas:
  // Upscaling, Grayscale, Dynamic Range Stretching & High-Contrast Binarization
  function preprocessImageForOcr(imageSource) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Target optimal OCR width between 1200 and 1800 px
          let scale = 1;
          if (img.width < 900) {
            scale = 2;
          } else if (img.width > 2200) {
            scale = 1800 / img.width;
          }

          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);

          // Draw scaled image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;

          // Compute min and max luminance for dynamic contrast stretching
          let minLum = 255;
          let maxLum = 0;
          for (let i = 0; i < data.length; i += 4) {
            const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            if (lum < minLum) minLum = lum;
            if (lum > maxLum) maxLum = lum;
          }

          const lumRange = Math.max(20, maxLum - minLum);

          // Enhance contrast & binarize so white/yellow text on dark/colored background stands out
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            let lum = (0.299 * r + 0.587 * g + 0.114 * b);

            // Normalize between 0 and 255
            let norm = ((lum - minLum) / lumRange) * 255;

            // Apply S-curve contrast boost
            let finalVal;
            if (norm < 115) {
              finalVal = Math.max(0, norm * 0.45); // Darken background elements
            } else if (norm > 140) {
              finalVal = Math.min(255, 140 + (norm - 140) * 1.5); // Brighten text/highlights
            } else {
              finalVal = norm;
            }

            data[i] = finalVal;
            data[i + 1] = finalVal;
            data[i + 2] = finalVal;
          }

          ctx.putImageData(imgData, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } catch (e) {
          console.warn('Preprocessing canvas failed, fallback to raw image:', e);
          resolve(imageSource);
        }
      };
      img.onerror = () => resolve(imageSource);
      img.src = imageSource;
    });
  }

  async function runOcrRecognition(imageSrc, fileName) {
    ocrProgressBox.style.display = 'block';
    ocrProgressBar.style.width = '10%';
    ocrPercentVal.textContent = '10%';
    ocrStatusMsg.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyiapkan modul pemindai flyer loker...';

    // Check if Tesseract is available
    if (typeof Tesseract === 'undefined') {
      heuristicFallbackParsing(fileName, 'Modul OCR offline');
      return;
    }

    try {
      ocrProgressBar.style.width = '25%';
      ocrPercentVal.textContent = '25%';
      ocrStatusMsg.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles fa-spin"></i> Memproses resolusi & kontras teks poster...';

      // 1. High-contrast adaptive canvas preprocessing for 100% accurate OCR
      const preprocessedSrc = await preprocessImageForOcr(imageSrc);

      ocrProgressBar.style.width = '45%';
      ocrPercentVal.textContent = '45%';
      ocrStatusMsg.innerHTML = '<i class="fa-solid fa-brain"></i> Memindai seluruh teks & informasi loker...';

      // 2. Perform OCR recognition on preprocessed image
      const result = await Tesseract.recognize(preprocessedSrc, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text' && m.progress) {
            const p = Math.round(m.progress * 100);
            const displayP = Math.min(95, Math.max(45, Math.round(45 + p * 0.5)));
            ocrProgressBar.style.width = `${displayP}%`;
            ocrPercentVal.textContent = `${displayP}%`;
            ocrStatusMsg.innerHTML = `<i class="fa-solid fa-brain"></i> Menganalisis teks & informasi loker: ${p}%`;
          }
        },
      });

      ocrProgressBar.style.width = '100%';
      ocrPercentVal.textContent = '100%';
      ocrStatusMsg.innerHTML = '<i class="fa-solid fa-check"></i> Ekstraksi teks flyer berhasil!';

      let text = result && result.data && result.data.text ? result.data.text : '';
      console.log('Tesseract OCR Extracted Text:\n', text);

      // If preprocessed text is suspiciously short, also try raw image recognition as safety fallback
      if (text.trim().length < 30) {
        try {
          const rawResult = await Tesseract.recognize(imageSrc, 'eng');
          const rawText = rawResult && rawResult.data && rawResult.data.text ? rawResult.data.text : '';
          if (rawText.trim().length > text.trim().length) {
            text = rawText;
          }
        } catch (e) {
          // Keep existing text
        }
      }

      parseExtractedOcrText(text, fileName);

      setTimeout(() => {
        ocrProgressBox.style.display = 'none';
      }, 1600);

    } catch (err) {
      console.warn('Tesseract OCR error/offline, using fallback parser:', err);
      heuristicFallbackParsing(fileName, 'Pemindaian nama berkas & kata kunci');
    }
  }

  function heuristicFallbackParsing(fileName, note) {
    ocrProgressBar.style.width = '100%';
    ocrPercentVal.textContent = '100%';
    ocrStatusMsg.innerHTML = `<i class="fa-solid fa-check"></i> Selesai (${note})`;
    
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes('irsyad') || lowerName.includes('markom') || lowerName.includes('marketing') || lowerName.includes('screenshot')) {
      inpPosition.value = 'Staff Marketing Komunikasi (MARKOM)';
      inpCompany.value = 'Sekolah Al Irsyad Surakarta';
      inpLocation.value = 'Surakarta';
      inpRecipient.value = 'Yth. Panitia Rekrutmen & Pimpinan Sekolah Al Irsyad Surakarta';
      inpSource.value = `Poster Lowongan Kerja Resmi Sekolah Al Irsyad Surakarta`;
      inpContactLink.value = 'https://s.id/lokeralirsyadsolo';
      inpKeyHighlights.value = 'Pria Muslim, usia max 30 tahun\nKreatif, komunikatif & percaya diri\nMenguasai content writing & Canva\nMampu edit video CapCut\nMenguasai sosial media Instagram, TikTok, YouTube\nDiutamakan berdomisili di Solo / Surakarta';
      generateLetter();
    } else if (lowerName.includes('flutter') || lowerName.includes('mobile')) {
      applyPresetRole('mobile-dev');
    } else if (lowerName.includes('qa') || lowerName.includes('tester') || lowerName.includes('testing')) {
      applyPresetRole('sqa');
    } else if (lowerName.includes('database') || lowerName.includes('dba') || lowerName.includes('sql')) {
      applyPresetRole('dba');
    } else if (lowerName.includes('ai') || lowerName.includes('machine')) {
      applyPresetRole('ai-spec');
    } else {
      applyPresetRole('web-dev');
    }

    if (ocrResultCard && ocrChipsList) {
      ocrResultCard.style.display = 'block';
      ocrChipsList.innerHTML = `
        <div><strong>📌 Posisi:</strong> ${inpPosition.value}</div>
        <div><strong>🏢 Instansi:</strong> ${inpCompany.value}</div>
        <div><strong>📍 Lokasi:</strong> ${inpLocation.value}</div>
        ${inpContactLink.value ? `<div><strong>🔗 Tautan:</strong> <a href="${inpContactLink.value}" target="_blank" style="color: #0369a1; text-decoration: underline;">${inpContactLink.value}</a></div>` : ''}
      `;
    }

    setTimeout(() => {
      ocrProgressBox.style.display = 'none';
    }, 2000);
  }

  function parseExtractedOcrText(rawText, fileName) {
    const text = (rawText || '').replace(/\r\n/g, '\n').replace(/\t/g, ' ');
    const lower = text.toLowerCase();
    const cleanFileName = fileName.replace(/\.[^/.]+$/, "");

    console.log('OCR Raw Text to Parse:', text);

    // Save raw text to textarea for transparency
    if (rawOcrTextarea) {
      rawOcrTextarea.value = text.trim() || `(Teks belum terbaca dari gambar, nama berkas: ${fileName})`;
    }

    // 1. Detect Company / School / Organization
    let detectedCompany = '';
    let detectedRecipient = '';

    if (/al[\s\-_]*irsyad|irsyad|al\s*ir/i.test(text) || /al[\s\-_]*irsyad|irsyad/i.test(fileName)) {
      detectedCompany = 'Sekolah Al Irsyad Surakarta';
      detectedRecipient = 'Yth. Panitia Rekrutmen & Pimpinan Sekolah Al Irsyad Surakarta';
    } else if (/muhammadiyah/i.test(text)) {
      detectedCompany = 'Perguruan / Lembaga Muhammadiyah';
      detectedRecipient = 'Yth. Pimpinan & Tim Rekrutmen';
    } else if (/kereta\s+api|kai/i.test(text) || /kai/i.test(fileName)) {
      detectedCompany = 'PT Kereta Api Indonesia (Persero) DAOP 6 Yogyakarta';
      detectedRecipient = 'Yth. Kepala Unit Sistem Informasi / HRD Manager';
    } else if (/tanjung\s+mulia/i.test(text)) {
      detectedCompany = 'PT Tanjung Mulia Informatika';
      detectedRecipient = 'Yth. Quality Assurance & Engineering Division';
    } else if (/brida/i.test(text)) {
      detectedCompany = 'Badan Riset dan Inovasi Daerah (BRIDA) Kota Surakarta';
      detectedRecipient = 'Yth. Kepala Badan Riset dan Inovasi Daerah Kota Surakarta';
    } else {
      // General institution regex (Sekolah, Yayasan, LPP, PT, CV, Dinas, dll)
      const instansiMatch = text.match(/(?:Sekolah|Yayasan|LPP|Pesantren|Madrasah|Pondok|Perguruan|Universitas|Institut|Akademi|Politeknik|Klinik|Rumah Sakit|RS|Dinas|Badan|PT|CV|UD|Bank|BPR|BUMDes|Studio|Agency|Company|Group|Corp)\s+([A-Za-z0-9\s\.\,\(\)\-]+)/i);
      if (instansiMatch) {
        let comp = instansiMatch[0].split('\n')[0].replace(/kualifikasi|syarat|open|we are/i, '').trim();
        if (comp.length > 55) comp = comp.substring(0, 55);
        detectedCompany = comp;
        detectedRecipient = `Yth. Tim Rekrutmen / Pimpinan ${comp}`;
      } else {
        // Fallback: examine first lines
        const firstLines = text.split('\n').map(l => l.trim()).filter(l => l.length > 3 && !/open|recruitment|lowongan|hiring/i.test(l));
        if (firstLines.length > 0) {
          detectedCompany = firstLines[0];
          detectedRecipient = `Yth. Pimpinan / HRD ${detectedCompany}`;
        }
      }
    }

    // Fallback if still empty but flyer has Al Irsyad markers or MARKOM
    if (!detectedCompany && (/markom|marketing|irsyad/i.test(text) || /irsyad/i.test(fileName))) {
      detectedCompany = 'Sekolah Al Irsyad Surakarta';
      detectedRecipient = 'Yth. Panitia Rekrutmen & Pimpinan Sekolah Al Irsyad Surakarta';
    }

    // 2. Detect Position (Comprehensive Catalog)
    let detectedPosition = '';

    if (/markom|marketing\s+komunikasi|marketing\s+komunikas[!i1l]|marcom|marketing\s+communication/i.test(text)) {
      detectedPosition = 'Staff Marketing Komunikasi (MARKOM)';
    } else if (/digital\s+marketing|marketing\s+specialist|pemasaran/i.test(text)) {
      detectedPosition = 'Digital Marketing Specialist';
    } else if (/content\s+creator|kreator\s+konten|konten\s+kreator/i.test(text)) {
      detectedPosition = 'Content Creator & Creative Specialist';
    } else if (/social\s+media|sosmed|admin\s+sosmed/i.test(text)) {
      detectedPosition = 'Social Media Specialist';
    } else if (/desain\s+grafis|graphic\s+design|desainer\s+grafis/i.test(text)) {
      detectedPosition = 'Graphic Designer & Creative Multimedia';
    } else if (/video\s+editor|editor\s+video|videographer|videografer/i.test(text)) {
      detectedPosition = 'Video Editor & Multimedia Specialist';
    } else if (/guru\s+tik|guru\s+komputer|guru\s+multimedia|guru/i.test(text)) {
      detectedPosition = 'Tenaga Pendidik / Guru Komputer & Multimedia';
    } else if (/staff\s+it|it\s+support|teknisi\s+it/i.test(text)) {
      detectedPosition = 'Staff IT & Systems Support';
    } else if (/fullstack|full\-stack/i.test(text)) {
      detectedPosition = 'Fullstack Web Developer';
    } else if (/frontend|front\-end/i.test(text)) {
      detectedPosition = 'Frontend Web Developer';
    } else if (/backend|back\-end/i.test(text)) {
      detectedPosition = 'Backend Web Developer';
    } else if (/flutter|mobile\s+developer|android\s+developer/i.test(text)) {
      detectedPosition = 'Flutter Mobile Application Developer';
    } else if (/web\s+developer|programmer|software\s+engineer/i.test(text)) {
      detectedPosition = 'Junior Web Developer';
    } else if (/qa|sqa|quality\s+assurance|tester|testing/i.test(text)) {
      detectedPosition = 'Software Quality Assurance (SQA) Engineer';
    } else if (/database\s+admin|dba|database/i.test(text)) {
      detectedPosition = 'Database Administrator (DBA)';
    } else if (/ai\s+specialist|ai\s+engineer|kecerdasan\s+buatan/i.test(text)) {
      detectedPosition = 'Artificial Intelligence Specialist';
    } else if (/administrasi|admin|tata\s+usaha|sekretaris/i.test(text)) {
      detectedPosition = 'Staff Administrasi & Tata Usaha';
    } else if (/humas|public\s+relations/i.test(text)) {
      detectedPosition = 'Staff Hubungan Masyarakat (Humas)';
    }

    // Fallback if still empty but mentions Canva/CapCut/Multimedia
    if (!detectedPosition && /canva|capcut|editing\s+video|desain\s+grafis|instagram|tiktok/i.test(text)) {
      detectedPosition = 'Staff Marketing Komunikasi (MARKOM)';
    }

    // 3. Detect City / Location
    let detectedLocation = '';
    const cityList = [
      'Surakarta', 'Solo', 'Karanganyar', 'Sukoharjo', 'Klaten', 'Boyolali',
      'Sragen', 'Wonogiri', 'Yogyakarta', 'Jogja', 'Sleman', 'Bantul',
      'Semarang', 'Jakarta', 'Jakarta Selatan', 'Bandung', 'Surabaya', 'Malang', 'Bali', 'Remote'
    ];
    for (const city of cityList) {
      const reg = new RegExp(`\\b${city}\\b`, 'i');
      if (reg.test(text)) {
        detectedLocation = (city.toLowerCase() === 'solo' || city.toLowerCase() === 'surakarta') ? 'Surakarta' : (city === 'Jogja' ? 'Yogyakarta' : city);
        break;
      }
    }
    if (!detectedLocation && (/al[\s\-_]*irsyad|irsyad/i.test(text) || /al[\s\-_]*irsyad/i.test(fileName))) {
      detectedLocation = 'Surakarta';
    }

    // 4. Detect Links (s.id, bit.ly, forms.gle, etc. including single slash https:/s.id OCR artifact)
    const linkMatches = text.match(/(?:https?:?\/?\/?)?(?:s\.id|bit\.ly|forms\.gle|linktr\.ee|cutt\.ly|tinyurl\.com|instagram\.com\/[a-zA-Z0-9_\-\.]+)\/[a-zA-Z0-9_\-\.\/]+/gi);
    let detectedLink = '';
    if (linkMatches && linkMatches.length > 0) {
      let rawLink = linkMatches[0].trim();
      let cleanPath = rawLink.replace(/^https?:?\/?\/?/i, '');
      detectedLink = 'https://' + cleanPath;
      inpContactLink.value = detectedLink;
    } else if (/lokeralirsyadsolo/i.test(text)) {
      detectedLink = 'https://s.id/lokeralirsyadsolo';
      inpContactLink.value = detectedLink;
    }

    // 5. Detect Email
    const emailMatches = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi);
    if (emailMatches && emailMatches.length > 0) {
      inpContactEmail.value = emailMatches[0].trim();
    }

    // 6. Detect Phone / WA
    const phoneMatches = text.match(/(?:\+?62|0)8[0-9\-\s]{8,15}/g);
    if (phoneMatches && phoneMatches.length > 0) {
      let cleanPhone = phoneMatches[0].replace(/[^0-9+]/g, '');
      inpContactPhone.value = cleanPhone;
    }

    // 7. Extract Highlights / Kualifikasi
    let highlights = [];
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 3);
    lines.forEach(line => {
      if (/kualifikasi|syarat|usia|pria|muslim|kreatif|komunikat|canva|capcut|video|desain|multimedia|sosial\s+media|instagram|tiktok|youtube|solo|surakarta|pengalaman/i.test(line)) {
        const cleanedLine = line.replace(/^[•\+\-\*\‘\’\d\.\)\s]+/, '').trim();
        if (cleanedLine.length > 5 && !highlights.includes(cleanedLine) && !/kualifikasi|open recruitment/i.test(cleanedLine)) {
          highlights.push(cleanedLine);
        }
      }
    });

    if (highlights.length > 0) {
      inpKeyHighlights.value = highlights.slice(0, 6).join('\n');
    } else if (/irsyad|markom/i.test(text) || /irsyad|markom/i.test(fileName)) {
      inpKeyHighlights.value = 'Pria Muslim, usia max 30 tahun\nKreatif, komunikatif & percaya diri\nMenguasai content writing & Canva\nMampu edit video CapCut\nMenguasai sosial media Instagram, TikTok, YouTube\nDiutamakan berdomisili di Solo / Surakarta';
    }

    // Apply updates to form
    if (detectedPosition) inpPosition.value = detectedPosition;
    if (detectedCompany) inpCompany.value = detectedCompany;
    if (detectedRecipient) inpRecipient.value = detectedRecipient;
    else if (detectedCompany) inpRecipient.value = `Yth. Tim Rekrutmen ${detectedCompany}`;
    if (detectedLocation) inpLocation.value = detectedLocation;

    inpSource.value = `Poster Resmi Lowongan Kerja (${detectedCompany || cleanFileName})`;

    // Update OCR Result UI Card
    if (ocrResultCard && ocrChipsList) {
      ocrResultCard.style.display = 'block';
      ocrChipsList.innerHTML = `
        <div><strong>📌 Posisi:</strong> ${inpPosition.value}</div>
        <div><strong>🏢 Instansi:</strong> ${inpCompany.value}</div>
        <div><strong>📍 Lokasi:</strong> ${inpLocation.value}</div>
        ${detectedLink ? `<div><strong>🔗 Tautan Pendaftaran:</strong> <a href="${detectedLink}" target="_blank" style="color: #0369a1; text-decoration: underline; font-weight: 700;">${detectedLink}</a></div>` : ''}
      `;
    }

    // Automatically synthesize and render letter
    generateLetter();
    if (typeof updateSendModalLinks === 'function') {
      updateSendModalLinks();
    }
    showToast(`Data flyer "${inpCompany.value}" berhasil disinkronkan ke surat!`);
  }


  // ===================================================================
  // 5. PRESET ROLES
  // ===================================================================
  const ROLE_PRESETS = {
    'markom': {
      position: 'Staff Marketing Komunikasi (MARKOM)',
      company: 'Sekolah Al Irsyad Surakarta',
      location: 'Surakarta',
      recipient: 'Yth. Panitia Rekrutmen & Pimpinan Sekolah Al Irsyad Surakarta',
      source: 'Poster Resmi Rekrutmen Sekolah Al Irsyad Surakarta',
      highlights: 'Pria Muslim, usia max 30 tahun\nKreatif, komunikatif & percaya diri\nMenguasai content writing & Canva\nMampu edit video CapCut\nMenguasai sosial media Instagram, TikTok, YouTube\nDiutamakan berdomisili di Solo / Surakarta',
      contactEmail: '',
      contactPhone: '',
      contactLink: 'https://s.id/lokeralirsyadsolo'
    },
    'web-dev': {
      position: 'Junior Fullstack Web Developer',
      company: 'PT Kereta Api Indonesia (Persero) DAOP 6 Yogyakarta',
      location: 'Yogyakarta',
      recipient: 'Yth. Kepala Unit Sistem Informasi / HRD Manager',
      source: 'Pengumuman Resmi Rekrutmen & Magang Kemitraan Kampus UBSI',
      highlights: 'Pengembangan web Laravel & REST API, PostgreSQL, Pemegang Hak Cipta Kemenkumham RI MBG SPPG Nusukan, Silver Medalist Pekan Inovasi Nasional Mercu Buana.',
      contactEmail: 'recruitment@kai.id',
      contactPhone: '0811255666',
      contactLink: 'https://recruitment.kai.id'
    },
    'mobile-dev': {
      position: 'Flutter / Mobile Application Developer',
      company: 'PT Kreasi Edukasi Digital Nusantara',
      location: 'Surakarta',
      recipient: 'Yth. HRD & Technical Lead PT Kreasi Edukasi Digital Nusantara',
      source: 'Poster Lowongan Kerja di Portal Karir IT Nasional',
      highlights: 'Pengembangan aplikasi mobile berbasis Flutter & Dart, Integrasi API, Perancang ZeloDrive (Gamifikasi & AI Learning), Pemakalah Seminar INOVATIF 2026.',
      contactEmail: 'karir@kreasiedukasi.id',
      contactPhone: '081298765432',
      contactLink: 'https://kreasiedukasi.id/career'
    },
    'sqa': {
      position: 'Software Quality Assurance (SQA) Engineer',
      company: 'PT Tanjung Mulia Informatika',
      location: 'Jakarta Selatan',
      recipient: 'Yth. Quality Assurance & Engineering Division',
      source: 'Informasi Penempatan Kerja & Uji Kompetensi Kampus UBSI',
      highlights: 'Tersertifikasi Kompetensi SQA PT Tanjung Mulia Informatika (Predikat Baik), Manual Testing, Perancangan Test Cases & Scenario, Bug Tracking, Pengujian Sistem Informasi Berbasis Web & Mobile.',
      contactEmail: 'hrd@tanjungmulia.co.id',
      contactPhone: '081388776655',
      contactLink: 'https://tanjungmulia.co.id'
    },
    'dba': {
      position: 'Database Administrator (DBA)',
      company: 'PT Solusi Data Dinamika',
      location: 'Semarang',
      recipient: 'Yth. Manager Teknologi Informasi & Basis Data',
      source: 'Poster Rekrutmen Bursa Kerja Komputer & Sistem Informasi',
      highlights: 'Pemegang Sertifikasi Profesi BNSP Database Administrator (No. Reg: DMS.1241.00995 2026), Desain Skema ERD, Optimasi Query SQL, Manajemen Relasional PostgreSQL & MySQL, Pemeliharaan Keamanan & Replikasi Data.',
      contactEmail: 'rekrutmen@solusidata.com',
      contactPhone: '085712345678',
      contactLink: ''
    },
    'ai-spec': {
      position: 'Artificial Intelligence Specialist & Integrator',
      company: 'Badan Riset dan Inovasi Daerah (BRIDA) Kota Surakarta',
      location: 'Surakarta',
      recipient: 'Yth. Kepala Badan Riset dan Inovasi Daerah Kota Surakarta',
      source: 'Pengumuman Kemitraan Riset & Pengembangan Sistem Cerdas',
      highlights: 'Integrasi LLM Generative AI (Gemini, Google AI Studio), Rancang Bangun Platform Smart Waste Management AI Kota Bersih Surakarta (HKI Kemenkumham RI), Pemateri Workshop "AI Video Creation".',
      contactEmail: 'brida@surakarta.go.id',
      contactPhone: '081322707000',
      contactLink: 'https://brida.surakarta.go.id'
    },
    'digimar': {
      position: 'Digital Marketing & Content Strategist',
      company: 'Volution Apparel Indonesia',
      location: 'Karanganyar',
      recipient: 'Yth. Pimpinan & Creative Director Volution Apparel',
      source: 'Poster Loker Akun Media Sosial Karir Resmi',
      highlights: 'Pengalaman 8+ bulan mengelola Meta Ads Manager terintegrasi, Copywriting, Editing Video Promosi CapCut & Adobe Illustrator, Juara 2 Nasional Video Kreatif SobiFest, Juara 1 LKS Desain Grafis.',
      contactEmail: 'career@volutionapparel.com',
      contactPhone: '088985266525',
      contactLink: 'https://instagram.com/volutionapparel'
    }
  };

  presetPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const presetKey = pill.getAttribute('data-preset');
      applyPresetRole(presetKey);
    });
  });

  function applyPresetRole(key) {
    const data = ROLE_PRESETS[key];
    if (!data) return;

    inpPosition.value = data.position;
    inpCompany.value = data.company;
    inpLocation.value = data.location;
    inpRecipient.value = data.recipient;
    inpSource.value = data.source;
    inpKeyHighlights.value = data.highlights;
    if (inpContactEmail) inpContactEmail.value = data.contactEmail || '';
    if (inpContactPhone) inpContactPhone.value = data.contactPhone || '';
    if (inpContactLink) inpContactLink.value = data.contactLink || '';

    generateLetter();
    if (typeof updateSendModalLinks === 'function') updateSendModalLinks();
    showToast(`Preset "${data.position}" diterapkan.`);
  }


  // ===================================================================
  // 6. TAILORED COVER LETTER SYNTHESIS ENGINE
  // ===================================================================
  function formatIndonesianDate(dateStr) {
    if (!dateStr) return '21 Oktober 2026';
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return `${day} ${months[monthIdx]} ${year}`;
    }
    return dateStr;
  }

  function synthesizeLetterBody(position, company, highlights) {
    const pos = position.toLowerCase();
    const comp = company.toLowerCase();
    const hl = highlights ? highlights.toLowerCase() : '';

    // Specialized tailoring blocks matching Fahrel's credentials
    let specificParagraph = '';
    let documentListItems = [
      'Curriculum Vitae (CV) Format Standar ATS Terkini',
      'Salinan Transkrip Nilai Akademik (IPK Unggul)',
      'Salinan Sertifikat Kompetensi Profesi BNSP (Database Administrator No. Reg: DMS.1241.00995 2026)',
      'Salinan Sertifikat Kompetensi Software Quality Assurance (PT Tanjung Mulia Informatika)',
      'Salinan Surat Pencatatan Hak Cipta (HKI Kemenkumham RI No. EC002026096415 & EC002026053217)',
      'Portofolio Proyek Interaktif & Piagam Penghargaan Nasional (Silver Medalist Universitas Mercu Buana)'
    ];

    if (pos.includes('markom') || pos.includes('marketing komunikasi') || pos.includes('marcom') || (pos.includes('marketing') && !pos.includes('digital')) || comp.includes('irsyad') || hl.includes('canva') || hl.includes('capcut')) {
      specificParagraph = `Sebagai mahasiswa semester 5 Program Studi S1 Sistem Informasi di Universitas Bina Sarana Informatika (UBSI) Kampus Solo sekaligus peraih Beasiswa Prestasi BJU (IPK Unggul), saya memiliki rekam jejak nyata di bidang komunikasi pemasaran, kreasi konten digital, dan multimedia. Saya memiliki pengalaman profesional selama lebih dari 8 bulan sebagai Digital Marketing Specialist & Creative Content Creator di berbagai unit usaha, dengan keahlian teruji dalam perancangan materi promosi visual menggunakan <strong>Canva, Adobe Illustrator, Photoshop</strong>, serta produksi video promosi interaktif berbasis <strong>CapCut</strong>. Prestasi saya sebagai <strong>Juara 2 Tingkat Nasional Video Reels Kreatif SobiFest</strong> dan <strong>Juara 1 LKS Graphic Design Technology</strong> membuktikan dedikasi saya dalam memadukan estetika visual dengan narasi publikasi yang memikat, beretika, dan berdampak nyata bagi penguatan citra institusi.`;

      documentListItems = [
        'Curriculum Vitae (CV) Format Standar ATS Terkini',
        'Salinan Transkrip Nilai Akademik Terkini (IPK Unggul)',
        'Portofolio Kreatif: Desain Grafis, Video Editing (CapCut & Canva) & Pengelolaan Media Sosial',
        'Piagam Penghargaan Juara 2 Tingkat Nasional Video Reels Kreatif (SobiFest)',
        'Piagam Penghargaan Juara 1 LKS Graphic Design Technology',
        'Salinan Sertifikat Kompetensi Profesi BNSP & Surat Pencatatan Ciptaan (HKI Kemenkumham RI)'
      ];
    } else if (pos.includes('qa') || pos.includes('tester') || pos.includes('testing') || pos.includes('quality')) {
      specificParagraph = `Sebagai mahasiswa Sistem Informasi tingkat akhir di Universitas Bina Sarana Informatika (UBSI) Solo sekaligus peraih Beasiswa Prestasi Jalur Undangan (BJU), saya telah membekali diri dengan kompetensi pengujian perangkat lunak yang teruji. Saya memegang <strong>Sertifikat Kompetensi Software Quality Assurance (SQA) dari PT Tanjung Mulia Informatika</strong> dengan predikat Baik, yang mencakup keahlian dalam perancangan skenario uji (test cases), metode pengujian black-box, pelaporan serta pelacakan bug, dan validasi fungsionalitas sistem. Pengalaman saya memimpin tim riset sistem informasi berbasis web juga melatih saya dalam memastikan keandalan, keamanan, dan kepatuhan sistem terhadap spesifikasi kebutuhan pengguna.`;
    } else if (pos.includes('database') || pos.includes('dba') || pos.includes('data')) {
      specificParagraph = `Latar belakang akademis saya di Program Studi S1 Sistem Informasi UBSI Solo didukung oleh pengakuan kompetensi formal berupa <strong>Sertifikasi Profesi BNSP sebagai Database Administrator (LSP UBSI / BNSP No. Reg: DMS.1241.00995 2026)</strong>. Saya memiliki penguasaan mendalam dalam perancangan skema relasional (ERD), normalisasi data, query SQL tingkat lanjut, serta administrasi basis data PostgreSQL dan MySQL. Dalam berbagai proyek riset terpublikasi, saya bertanggung jawab penuh memastikan integritas data, efisiensi transaksi, serta optimasi indeks sistem informasi berskala publik.`;
    } else if (pos.includes('flutter') || pos.includes('mobile') || pos.includes('android')) {
      specificParagraph = `Saya memiliki rekam jejak aktif dalam pengembangan aplikasi mobile multi-platform menggunakan <strong>Flutter dan Dart</strong>, terintegrasi dengan RESTful API serta layanan cloud. Salah satu karya unggulan yang saya kembangkan adalah <em>ZeloDrive</em>, sebuah platform edukasi interaktif berbasis gamifikasi dan Generative AI. Selain itu, saya terbiasa menerapkan prinsip clean architecture, manajemen state modern, serta optimasi UI/UX yang responsif guna menghasilkan aplikasi mobile yang stabil, cepat, dan ramah pengguna.`;
    } else if (pos.includes('marketing') || pos.includes('ads') || pos.includes('content') || pos.includes('social')) {
      specificParagraph = `Di samping kemampuan rekayasa teknologi informasi, saya memiliki pengalaman profesional selama lebih dari 8 bulan sebagai Digital Marketing Specialist & Content Creator di berbagai unit usaha seperti Volution Apparel dan Mataram Laundry. Saya terbiasa mengelola kampanye <strong>Meta Ads Manager</strong> berbasis data untuk meningkatkan rasio konversi penjualan, merancang materi promosi visual menggunakan Adobe Illustrator dan Canva, serta menyusun copywriting yang persuasif. Prestasi saya sebagai Juara 2 Tingkat Nasional Video Reels SobiFest dan Juara 1 LKS Graphic Design Technology membuktikan dedikasi saya dalam memadukan kreativitas visual dengan strategi pemasaran digital yang berdampak nyata.`;
    } else if (pos.includes('ai') || pos.includes('intelligent') || pos.includes('integrat')) {
      specificParagraph = `Fokus riset dan keahlian saya berpusat pada integrasi teknologi cerdas, khususnya <strong>Generative AI (Gemini, Google AI Studio, LLM)</strong> dan Sistem Informasi Geografis (GIS). Inovasi yang saya pimpin bersama tim mencakup platform <em>Kota Bersih Surakarta (Smart Waste Management AI)</em> yang telah dianugerahi Piagam Penghargaan Riset oleh BRIDA Kota Surakarta dan tercatat resmi sebagai <strong>Hak Kekayaan Intelektual (HKI) Kemenkumham RI No. EC002026053217</strong>. Saya juga dipercaya menjadi pemateri workshop teknologi tentang pemanfaatan AI dalam kreasi konten digital, yang mencerminkan pemahaman konseptual maupun implementatif saya di bidang kecerdasan buatan.`;
    } else {
      // Default: Fullstack Web / Software Developer
      specificParagraph = `Sebagai mahasiswa semester 5 S1 Sistem Informasi di Universitas Bina Sarana Informatika (UBSI) Kampus Solo dengan predikat Beasiswa Prestasi BJU, saya memiliki rekam jejak teruji dalam rekayasa perangkat lunak berbasis web (Laravel, PHP, PostgreSQL, Tailwind CSS, JavaScript, REST API). Saya berhasil memimpin perancangan dan implementasi platform digitalisasi <em>Program Makan Bergizi Gratis (MBG) SPPG Nusukan Surakarta</em> yang meraih <strong>Medali Perak (Silver Medal) pada Pekan Inovasi Nasional Vol. 3 Universitas Mercu Buana (2026)</strong> serta tercatat resmi memiliki <strong>Hak Cipta Kemenkumham RI (No. EC002026096415)</strong>. Pengalaman magang saya di <strong>Unit Sistem Informasi PT Kereta Api Indonesia (Persero) DAOP 6 Yogyakarta</strong> semakin mematangkan kemampuan saya dalam berkolaborasi pada lingkungan kerja enterprise dan memecahkan tantangan operasional sistem secara profesional.`;
    }

    // Additional note if key highlights or specific company entered
    let highlightSnippet = '';
    if (comp.includes('irsyad') || pos.includes('markom')) {
      highlightSnippet = `<p class="letter-p">Berdasarkan kualifikasi khusus yang dipersyaratkan oleh <strong>${company}</strong>, yakni integritas kepribadian muslim, kemampuan komunikasi aktif, penguasaan content writing (Canva & CapCut), pengelolaan kanal media sosial (Instagram, TikTok, YouTube), serta domisili di wilayah Solo/Surakarta, saya meyakini bahwa kompetensi multimedia saya yang dipadukan dengan pengalaman kepemimpinan sebagai Ketua Umum Himpunan Mahasiswa Sistem Informasi (HIMSI) UBSI Solo akan mampu memberikan akselerasi syiar dan publikasi yang unggul bagi ${company}.</p>`;
    } else if (highlights && highlights.trim().length > 0) {
      highlightSnippet = `<p class="letter-p">Berdasarkan kualifikasi khusus yang dipersyaratkan pada informasi lowongan kerja, yakni mengenai <em>${highlights.trim().replace(/\n/g, ', ')}</em>, saya meyakini bahwa latar belakang teknis serta pengalaman kepemimpinan saya sebagai Ketua Umum Himpunan Mahasiswa Sistem Informasi (HIMSI) UBSI Solo akan memberikan kontribusi positif yang cepat dan terukur bagi tim kerja di ${company}.</p>`;
    }

    return {
      specificParagraph,
      highlightSnippet,
      documentListItems
    };
  }

  function generateLetter() {
    const position = inpPosition.value.trim() || 'Junior Web Developer';
    const company = inpCompany.value.trim() || 'PT Kereta Api Indonesia (Persero)';
    const location = inpLocation.value.trim() || 'Yogyakarta';
    const recipient = inpRecipient.value.trim() || 'Yth. HRD / Pimpinan Perusahaan';
    const source = inpSource.value.trim() || 'informasi lowongan pekerjaan yang dipublikasikan';
    const dateFormatted = formatIndonesianDate(inpDate.value);
    const highlights = inpKeyHighlights.value.trim();

    const synthesis = synthesizeLetterBody(position, company, highlights);

    // Build standard Indonesian formal letter HTML (EYD V Standard)
    const letterHtml = `
      <div class="letter-header-date">
        Karanganyar, ${dateFormatted}
      </div>

      <div class="letter-meta-block">
        <div class="letter-meta-row">
          <div class="letter-meta-label">Nomor</div>
          <div class="letter-meta-sep">:</div>
          <div>01/SP-ML/MFY/${today.getFullYear()}</div>
        </div>
        <div class="letter-meta-row">
          <div class="letter-meta-label">Lampiran</div>
          <div class="letter-meta-sep">:</div>
          <div>1 (Satu) Berkas Portofolio &amp; Dokumen Pendukung</div>
        </div>
        <div class="letter-meta-row">
          <div class="letter-meta-label">Perihal</div>
          <div class="letter-meta-sep">:</div>
          <div class="letter-meta-val">Lamaran Pekerjaan – ${position}</div>
        </div>
      </div>

      <div class="letter-recipient-block">
        <div>Kepada:</div>
        <div><strong>${recipient}</strong></div>
        <div><strong>${company}</strong></div>
        <div>di ${location}</div>
      </div>

      <div class="letter-salutation">
        Dengan hormat,
      </div>

      <p class="letter-p">
        Sehubungan dengan ${source} bahwa <strong>${company}</strong> sedang membuka kesempatan karir untuk posisi <strong>${position}</strong>, maka melalui surat ini saya bermaksud mengajukan diri untuk bergabung dan mendedikasikan kompetensi yang saya miliki pada posisi tersebut.
      </p>

      <p class="letter-p" style="margin-bottom: 6px;">
        Berikut adalah data ringkas mengenai diri saya:
      </p>

      <table class="letter-bio-table">
        <tr>
          <td class="letter-bio-label">Nama Lengkap</td>
          <td class="letter-bio-sep">:</td>
          <td><strong>Muhammad Fahrel Yuliyanto</strong></td>
        </tr>
        <tr>
          <td class="letter-bio-label">Tempat, Tanggal Lahir</td>
          <td class="letter-bio-sep">:</td>
          <td>Sragen, 22 Juli 2007</td>
        </tr>
        <tr>
          <td class="letter-bio-label">Pendidikan Terakhir</td>
          <td class="letter-bio-sep">:</td>
          <td>S1 Sistem Informasi (Semester 5), Universitas Bina Sarana Informatika (UBSI) Solo — <em>Penerima Beasiswa Prestasi BJU (IPK Unggul)</em></td>
        </tr>
        <tr>
          <td class="letter-bio-label">Alamat Domisili</td>
          <td class="letter-bio-sep">:</td>
          <td>Krendowahono RT 02 / RW 01, Kec. Gondangrejo, Kab. Karanganyar, Jawa Tengah 57181</td>
        </tr>
        <tr>
          <td class="letter-bio-label">Nomor Telepon / WhatsApp</td>
          <td class="letter-bio-sep">:</td>
          <td>+62 889-8526-6525</td>
        </tr>
        <tr>
          <td class="letter-bio-label">Alamat Surel (Email)</td>
          <td class="letter-bio-sep">:</td>
          <td>muhmmadfahrel@gmail.com</td>
        </tr>
        <tr>
          <td class="letter-bio-label">Portofolio Interaktif</td>
          <td class="letter-bio-sep">:</td>
          <td><a href="https://fhrelz.github.io/portfolio-3d-celestial/" target="_blank" style="color: #0369a1; text-decoration: underline;">fhrelz.github.io/portfolio-3d-celestial/</a> (bit.ly/portofolio-fahrel)</td>
        </tr>
      </table>

      <p class="letter-p">
        ${synthesis.specificParagraph}
      </p>

      ${synthesis.highlightSnippet}

      <p class="letter-p" style="margin-bottom: 6px;">
        Sebagai bahan pertimbangan dan kelengkapan administrasi Bapak/Ibu, bersama surat lamaran ini saya turut melampirkan berkas pendukung resmi:
      </p>

      <ol class="letter-list">
        ${synthesis.documentListItems.map(item => `<li>${item}</li>`).join('')}
      </ol>

      <p class="letter-p">
        Besar harapan saya untuk diberikan kesempatan menghadiri sesi wawancara atau tahapan seleksi berikutnya, sehingga saya dapat memaparkan secara lebih komprehensif mengenai latar belakang keahlian, dedikasi, serta kontribusi yang dapat saya berikan demi kemajuan <strong>${company}</strong>.
      </p>

      <p class="letter-p">
        Demikian surat lamaran pekerjaan ini saya sampaikan dengan sebenar-benarnya. Atas perhatian, waktu, dan kesempatan berharga yang Bapak/Ibu berikan, saya mengucapkan terima kasih.
      </p>

      <div class="letter-closing">
        <div class="letter-signature-box">
          <div>Hormat saya,</div>
          <div class="letter-sign-img-wrap">
            <img src="assets/ttd_fahrel.png" onerror="this.onerror=null; this.src='ttd_fahrel.png';" class="letter-sign-img" alt="Tanda Tangan Muhammad Fahrel Yuliyanto" />
          </div>
          <div class="letter-sign-name">Muhammad Fahrel Yuliyanto</div>
          <div style="font-size: 10pt; color: #475569;">Pelamar Pekerjaan</div>
        </div>
      </div>
    `;

    a4Sheet.innerHTML = letterHtml;
  }

  btnGenerateLetter.addEventListener('click', () => {
    generateLetter();
    showToast('Lembar surat berhasil diperbarui!');
  });

  // Real-time two-way synchronization on all form inputs
  const liveSyncInputs = [
    inpPosition, inpCompany, inpLocation, inpRecipient,
    inpSource, inpDate, inpKeyHighlights
  ];

  liveSyncInputs.forEach(inputEl => {
    if (inputEl) {
      inputEl.addEventListener('input', () => {
        generateLetter();
      });
      inputEl.addEventListener('change', () => {
        generateLetter();
      });
    }
  });

  const contactInputs = [inpContactEmail, inpContactPhone, inpContactLink];
  contactInputs.forEach(inputEl => {
    if (inputEl) {
      inputEl.addEventListener('input', () => {
        if (typeof updateSendModalLinks === 'function') updateSendModalLinks();
      });
      inputEl.addEventListener('change', () => {
        if (typeof updateSendModalLinks === 'function') updateSendModalLinks();
      });
    }
  });

  // Toggle raw OCR text inspector
  if (btnToggleRawOcr && rawOcrContainer) {
    btnToggleRawOcr.addEventListener('click', () => {
      const isHidden = rawOcrContainer.style.display === 'none' || !rawOcrContainer.style.display;
      rawOcrContainer.style.display = isHidden ? 'block' : 'none';
      btnToggleRawOcr.innerHTML = isHidden
        ? '<i class="fa-solid fa-eye-slash"></i> Sembunyikan Teks Hasil Pindai OCR'
        : '<i class="fa-solid fa-file-lines"></i> Lihat Teks Lengkap Hasil Pindai OCR';
    });
  }

  // Initial letter generation on load
  generateLetter();

  // ===================================================================
  // 7. EXPORT ACTIONS (PRINT, COPY, WORD .DOC)
  // ===================================================================
  btnPrintLetter.addEventListener('click', () => {
    window.print();
  });

  btnCopyLetter.addEventListener('click', () => {
    const textToCopy = a4Sheet.innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('Seluruh teks surat berhasil disalin ke clipboard!');
    }).catch(err => {
      console.error('Copy failed:', err);
      showToast('Gagal menyalin teks, silakan seleksi manual.');
    });
  });

  btnDownloadDoc.addEventListener('click', () => {
    const position = inpPosition.value.trim() || 'Lamaran_Pekerjaan';
    const company = inpCompany.value.trim() || 'Perusahaan';
    const sanitizedTitle = `Surat_Lamaran_Fahrel_${company.replace(/[^a-zA-Z0-9]/g, '_')}`;

    // Word Document HTML Wrapper with Standard Print Formatting
    const wordContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${sanitizedTitle}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page Section1 {
            size: 595.3pt 841.9pt; /* A4 */
            margin: 70.85pt 70.85pt 70.85pt 85.05pt; /* Top/Bottom/Right 2.5cm, Left 3cm */
            mso-header-margin: 35.4pt;
            mso-footer-margin: 35.4pt;
            mso-paper-source: 0;
          }
          div.Section1 { page: Section1; }
          body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; color: #000; }
          p { text-align: justify; text-indent: 36pt; margin: 0 0 10pt 0; }
          .no-indent { text-indent: 0; }
          table { border-collapse: collapse; width: 100%; margin: 6pt 0 12pt 24pt; font-size: 12pt; }
          td { vertical-align: top; padding: 2pt 0; }
        </style>
      </head>
      <body>
        <div class="Section1">
          ${a4Sheet.innerHTML}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', wordContent], {
      type: 'application/msword'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sanitizedTitle}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('File Microsoft Word (.doc) berhasil diunduh!');
  });

  // ===================================================================
  // 8. ARCHIVE SYSTEM (PREVIOUS COVER LETTERS & CUSTOM SAVES)
  // ===================================================================
  const DEFAULT_ARCHIVES = [
    {
      id: 'kai-daop-6',
      title: 'Surat Permohonan Magang & Rekrutmen IT Systems',
      company: 'PT Kereta Api Indonesia (Persero) DAOP 6 Yogyakarta',
      position: 'Junior Web Developer & IT Systems (Unit Sistem Informasi)',
      location: 'Yogyakarta',
      recipient: 'Yth. Kepala Unit Sistem Informasi / HRD PT Kereta Api Indonesia (Persero) DAOP 6 Yogyakarta',
      source: 'Kerjasama Akademik & Program PKL Resmi Kampus UBSI Solo',
      date: '2026-06-15',
      badge: 'Diterima / Terverifikasi',
      badgeClass: 'badge-active',
      desc: 'Surat permohonan magang riset operasional dan arsitektur web platform sistem informasi perkeretaapian DAOP 6 Yogyakarta, mengintegrasikan PostgreSQL dan arsitektur enterprise.',
      highlights: 'Pengembangan web Laravel & REST API, PostgreSQL, Pemegang Hak Cipta Kemenkumham RI MBG SPPG Nusukan, Silver Medalist Pekan Inovasi Nasional Mercu Buana.',
      contactEmail: 'recruitment@kai.id',
      contactPhone: '0811255666',
      contactLink: 'https://recruitment.kai.id'
    },
    {
      id: 'tanjung-mulia-sqa',
      title: 'Lamaran Pengujian Sistem Informasi & Sertifikasi SQA',
      company: 'PT Tanjung Mulia Informatika',
      position: 'Software Quality Assurance (SQA) Engineer',
      location: 'Jakarta Selatan',
      recipient: 'Yth. Quality Assurance & Engineering Division PT Tanjung Mulia Informatika',
      source: 'Program Pelatihan & Sertifikasi Kompetensi Pengujian Perangkat Lunak',
      date: '2026-03-20',
      badge: 'Tersertifikasi Kompetensi',
      badgeClass: 'badge-archive',
      desc: 'Aplikasi permohonan uji kompetensi dan lamaran pengujian perangkat lunak sistem informasi. Berhasil meraih sertifikasi resmi SQA dengan predikat Baik.',
      highlights: 'Tersertifikasi Kompetensi SQA PT Tanjung Mulia Informatika (Predikat Baik), Manual Testing, Perancangan Test Cases & Scenario, Bug Tracking, Pengujian Sistem Informasi Berbasis Web & Mobile.',
      contactEmail: 'hrd@tanjungmulia.co.id',
      contactPhone: '081388776655',
      contactLink: 'https://tanjungmulia.co.id'
    },
    {
      id: 'brida-surakarta',
      title: 'Surat Pengajuan Riset Inovasi Smart Waste Management AI',
      company: 'Badan Riset dan Inovasi Daerah (BRIDA) Kota Surakarta',
      position: 'Lead Developer & Research Innovator (Smart City AI)',
      location: 'Surakarta',
      recipient: 'Yth. Kepala Badan Riset dan Inovasi Daerah Kota Surakarta',
      source: 'Kompetisi Riset Perguruan Tinggi 2026 – BRIDA Surakarta & UBSI Innovation Hub',
      date: '2026-04-10',
      badge: 'Penghargaan Riset BRIDA',
      badgeClass: 'badge-archive',
      desc: 'Pengajuan inovasi sistem Kota Bersih Surakarta berbasis AI Assistant dan GIS. Memperoleh Sertifikat Penghargaan Riset No. B/500.10.30.6/778.14 serta Hak Cipta Resmi Kemenkumham RI.',
      highlights: 'Integrasi LLM Generative AI (Gemini, Google AI Studio), Rancang Bangun Platform Smart Waste Management AI Kota Bersih Surakarta (HKI Kemenkumham RI), Pemateri Workshop "AI Video Creation".',
      contactEmail: 'brida@surakarta.go.id',
      contactPhone: '081322707000',
      contactLink: 'https://brida.surakarta.go.id'
    }
  ];

  function getStoredArchives() {
    try {
      const stored = localStorage.getItem(ARCHIVE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed reading archives:', e);
      return [];
    }
  }

  function saveStoredArchives(list) {
    try {
      localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Failed saving archives:', e);
    }
  }

  function renderArchive() {
    const userArchives = getStoredArchives();
    const allArchives = [...DEFAULT_ARCHIVES, ...userArchives];
    archiveCountBadge.textContent = allArchives.length;

    archiveGrid.innerHTML = '';

    allArchives.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'archive-card';
      
      const isCustom = !DEFAULT_ARCHIVES.some(d => d.id === item.id);

      card.innerHTML = `
        <div class="archive-header">
          <span class="archive-badge ${item.badgeClass || (isCustom ? 'badge-custom' : 'badge-archive')}">${item.badge || 'Tersimpan'}</span>
          <span class="archive-date"><i class="fa-regular fa-calendar"></i> ${formatIndonesianDate(item.date)}</span>
        </div>
        <h3 class="archive-title">${item.title || item.position}</h3>
        <div class="archive-company">
          <i class="fa-solid fa-building" style="color: #0284c7;"></i> ${item.company}
        </div>
        <p class="archive-desc">${item.desc || 'Surat lamaran pekerjaan formal dengan penyesuaian kualifikasi portofolio dan CV Fahrel.'}</p>
        <div class="archive-footer">
          <span style="font-size: 0.78rem; font-weight: 600; color: #64748b;">
            <i class="fa-solid fa-location-dot"></i> ${item.location || 'Surakarta'}
          </span>
          <div class="archive-actions">
            <button class="btn btn-outline-dark btn-load-archive" data-id="${item.id}" title="Muat ke Editor A4">
              <i class="fa-solid fa-folder-open"></i> Muat ke Editor
            </button>
            ${isCustom ? `
              <button class="btn btn-outline-dark btn-delete-archive" data-id="${item.id}" style="color: #ef4444; border-color: #fca5a5;" title="Hapus dari Arsip">
                <i class="fa-solid fa-trash"></i>
              </button>
            ` : ''}
          </div>
        </div>
      `;

      archiveGrid.appendChild(card);
    });

    // Attach load handlers
    document.querySelectorAll('.btn-load-archive').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const selected = allArchives.find(a => a.id === id);
        if (selected) {
          loadArchiveIntoEditor(selected);
        }
      });
    });

    // Attach delete handlers
    document.querySelectorAll('.btn-delete-archive').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Apakah Anda yakin ingin menghapus surat ini dari arsip?')) {
          const filtered = userArchives.filter(a => a.id !== id);
          saveStoredArchives(filtered);
          renderArchive();
          showToast('Dokumen berhasil dihapus dari arsip.');
        }
      });
    });
  }

  function loadArchiveIntoEditor(item) {
    inpPosition.value = item.position || '';
    inpCompany.value = item.company || '';
    inpLocation.value = item.location || '';
    inpRecipient.value = item.recipient || '';
    inpSource.value = item.source || '';
    inpDate.value = item.date || today.toISOString().split('T')[0];
    inpKeyHighlights.value = item.highlights || '';
    if (inpContactEmail) inpContactEmail.value = item.contactEmail || '';
    if (inpContactPhone) inpContactPhone.value = item.contactPhone || '';
    if (inpContactLink) inpContactLink.value = item.contactLink || '';

    generateLetter();

    // Switch to generator tab
    const genTabBtn = document.querySelector('[data-tab="tab-generator"]');
    if (genTabBtn) genTabBtn.click();

    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Surat "${item.position} - ${item.company}" berhasil dimuat ke editor!`);
  }

  btnSaveArchive.addEventListener('click', () => {
    const position = inpPosition.value.trim() || 'Posisi';
    const company = inpCompany.value.trim() || 'Perusahaan';
    const location = inpLocation.value.trim() || 'Indonesia';
    const recipient = inpRecipient.value.trim();
    const source = inpSource.value.trim();
    const date = inpDate.value || today.toISOString().split('T')[0];
    const highlights = inpKeyHighlights.value.trim();
    const contactEmail = inpContactEmail ? inpContactEmail.value.trim() : '';
    const contactPhone = inpContactPhone ? inpContactPhone.value.trim() : '';
    const contactLink = inpContactLink ? inpContactLink.value.trim() : '';

    const newArchiveItem = {
      id: 'cust-' + Date.now(),
      title: `Lamaran ${position} – ${company}`,
      position,
      company,
      location,
      recipient,
      source,
      date,
      badge: 'Disimpan Manual',
      badgeClass: 'badge-custom',
      desc: `Surat lamaran pekerjaan untuk posisi ${position} di ${company}. Disesuaikan otomatis dengan rekam jejak portofolio dan CV Fahrel.`,
      highlights,
      contactEmail,
      contactPhone,
      contactLink
    };

    const currentArchives = getStoredArchives();
    currentArchives.unshift(newArchiveItem);
    saveStoredArchives(currentArchives);

    archiveCountBadge.textContent = DEFAULT_ARCHIVES.length + currentArchives.length;
    showToast('Surat lamaran berhasil disimpan ke Arsip Pribadi!');
  });

  // Initial archive badge count
  const initialUserArchives = getStoredArchives();
  archiveCountBadge.textContent = DEFAULT_ARCHIVES.length + initialUserArchives.length;

  // ===================================================================
  // 9. SEND APPLICATION DISPATCH HUB (EMAIL, WHATSAPP, PORTAL KARIR)
  // ===================================================================
  function buildCoverEmailText(position, company) {
    return `Yth. Tim Rekrutmen / HRD ${company},

Perkenalkan saya Muhammad Fahrel Yuliyanto, mahasiswa semester 5 S1 Sistem Informasi Universitas Bina Sarana Informatika (UBSI) Solo (Penerima Beasiswa Prestasi BJU, IPK Unggul).

Melalui email ini, saya bermaksud mengajukan lamaran pekerjaan untuk posisi ${position} di ${company} sebagaimana informasi lowongan pekerjaan yang saya peroleh.

Berbekal kompetensi rekayasa perangkat lunak, administrasi basis data bersertifikasi BNSP (LSP UBSI / BNSP No. Reg: DMS.1241.00995 2026), Sertifikat Kompetensi Software Quality Assurance (SQA) PT Tanjung Mulia Informatika, kepemilikan 3 Hak Kekayaan Intelektual (HKI) resmi Kemenkumham RI, serta pengalaman magang di Unit Sistem Informasi PT Kereta Api Indonesia (Persero) DAOP 6 Yogyakarta, saya yakin dapat memberikan kontribusi nyata dan profesional bagi ${company}.

Bersama ini saya turut melampirkan berkas kelengkapan administrasi sebagai bahan pertimbangan Bapak/Ibu:
1. Surat Lamaran Pekerjaan Resmi
2. Curriculum Vitae (CV ATS Standar Industri)
3. Salinan Transkrip Nilai Akademik Terkini
4. Salinan Sertifikat Kompetensi BNSP & SQA
5. Salinan Surat Pencatatan Ciptaan (HKI Kemenkumham RI)
6. Tautan Portofolio Proyek Interaktif: https://fhrelz.github.io/portfolio-3d-celestial/

Besar harapan saya untuk diberikan kesempatan menghadiri tahapan wawancara guna mendiskusikan kualifikasi saya secara lebih komprehensif. Atas perhatian, waktu, dan kesempatan berharga yang Bapak/Ibu berikan, saya sampaikan terima kasih.

Hormat saya,
Muhammad Fahrel Yuliyanto
Telepon / WhatsApp: +62 889-8526-6525
Surel (Email): muhmmadfahrel@gmail.com
Alamat: Krendowahono RT 02 / RW 01, Gondangrejo, Karanganyar, Jawa Tengah`;
  }

  function buildWhatsAppText(position, company) {
    return `Selamat Pagi/Siang Bapak/Ibu HRD ${company},

Perkenalkan saya *Muhammad Fahrel Yuliyanto*, mahasiswa S1 Sistem Informasi UBSI Solo (Penerima Beasiswa Prestasi BJU, IPK Unggul).

Saya bermaksud mengirimkan berkas lamaran pekerjaan untuk posisi *${position}* di *${company}* berdasarkan informasi lowongan kerja yang tertera pada poster/flyer loker.

Sebagai bahan pertimbangan Bapak/Ibu, berkas resmi Surat Lamaran Pekerjaan dan CV Format ATS telah saya siapkan. Portofolio interaktif proyek, sertifikasi BNSP, dan pengakuan HKI Kemenkumham saya dapat diakses langsung melalui tautan:
🔗 https://fhrelz.github.io/portfolio-3d-celestial/

Besar harapan saya untuk dapat diberikan kesempatan mengikuti tahapan seleksi selanjutnya. Terima kasih banyak atas perhatian dan waktu berharga yang Bapak/Ibu berikan.

Hormat saya,
*Muhammad Fahrel Yuliyanto*
Telepon / WhatsApp: +62 889-8526-6525
Email: muhmmadfahrel@gmail.com`;
  }

  function updateSendModalLinks() {
    const position = inpPosition.value.trim() || 'Posisi';
    const company = inpCompany.value.trim() || 'Perusahaan';
    const emailTarget = modalEmailTarget.value.trim();
    const emailSubject = modalEmailSubject.value.trim() || `Lamaran Pekerjaan – ${position} – Muhammad Fahrel Yuliyanto`;
    const emailBody = emailBodyPreview.textContent;
    const waTarget = modalWaTarget.value.trim();
    const waBody = waMessagePreview.textContent;
    const portalLink = modalPortalLink.value.trim();

    // Gmail Web URL
    btnSendGmailWeb.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailTarget)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    // Default Mailto URL
    btnSendMailto.href = `mailto:${encodeURIComponent(emailTarget)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    // WhatsApp URL
    let cleanWa = waTarget.replace(/[^0-9]/g, '');
    if (cleanWa.startsWith('0')) cleanWa = '62' + cleanWa.slice(1);
    if (cleanWa && !cleanWa.startsWith('62')) cleanWa = '62' + cleanWa;
    btnSendWhatsapp.href = cleanWa ? `https://wa.me/${cleanWa}?text=${encodeURIComponent(waBody)}` : `https://wa.me/?text=${encodeURIComponent(waBody)}`;

    // Career Portal URL
    if (portalLink) {
      btnOpenCareerPortal.href = portalLink;
      btnOpenCareerPortal.style.display = 'inline-flex';
    } else {
      btnOpenCareerPortal.style.display = 'none';
    }
  }

  if (btnOpenSendModal) {
    btnOpenSendModal.addEventListener('click', () => {
      const position = inpPosition.value.trim() || 'Junior Web Developer';
      const company = inpCompany.value.trim() || 'Perusahaan';
      const email = inpContactEmail ? inpContactEmail.value.trim() : '';
      const phone = inpContactPhone ? inpContactPhone.value.trim() : '';
      const link = inpContactLink ? inpContactLink.value.trim() : '';

      modalEmailTarget.value = email;
      modalEmailSubject.value = `Lamaran Pekerjaan – ${position} – Muhammad Fahrel Yuliyanto`;
      emailBodyPreview.textContent = buildCoverEmailText(position, company);

      modalWaTarget.value = phone;
      waMessagePreview.textContent = buildWhatsAppText(position, company);

      modalPortalLink.value = link;

      updateSendModalLinks();
      sendModalOverlay.classList.add('active');
    });
  }

  if (btnCloseSendModal) {
    btnCloseSendModal.addEventListener('click', () => {
      sendModalOverlay.classList.remove('active');
    });
  }

  if (sendModalOverlay) {
    sendModalOverlay.addEventListener('click', (e) => {
      if (e.target === sendModalOverlay) {
        sendModalOverlay.classList.remove('active');
      }
    });
  }

  // Live input changes in send modal
  if (modalEmailTarget) modalEmailTarget.addEventListener('input', updateSendModalLinks);
  if (modalEmailSubject) modalEmailSubject.addEventListener('input', updateSendModalLinks);
  if (modalWaTarget) modalWaTarget.addEventListener('input', updateSendModalLinks);
  if (modalPortalLink) modalPortalLink.addEventListener('input', updateSendModalLinks);

  // Copy Buttons
  if (btnCopyEmailBody) {
    btnCopyEmailBody.addEventListener('click', () => {
      navigator.clipboard.writeText(emailBodyPreview.textContent).then(() => {
        showToast('Template body email berhasil disalin!');
      });
    });
  }

  if (btnCopyWaMsg) {
    btnCopyWaMsg.addEventListener('click', () => {
      navigator.clipboard.writeText(waMessagePreview.textContent).then(() => {
        showToast('Pesan WhatsApp lamaran berhasil disalin!');
      });
    });
  }

});

