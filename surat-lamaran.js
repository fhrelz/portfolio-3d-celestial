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
    if (lowerName.includes('honda') || lowerName.includes('ramayana') || lowerName.includes('rmy')) {
      applyPresetRole('honda-marketing');
    } else if (lowerName.includes('analis') || lowerName.includes('consula') || lowerName.includes('talent')) {
      applyPresetRole('analis-talent');
    } else if (lowerName.includes('kertabhumi') || lowerName.includes('kerta') || lowerName.includes('bwi')) {
      applyPresetRole('kerta-webdev');
    } else if (lowerName.includes('optimal') || lowerName.includes('sragen') || lowerName.includes('divisi')) {
      applyPresetRole('optimal-komputer');
    } else if (lowerName.includes('dewi') || lowerName.includes('sri') || lowerName.includes('colomadu')) {
      applyPresetRole('dewisri-creator');
    } else if (lowerName.includes('irsyad') || lowerName.includes('markom') || lowerName.includes('screenshot')) {
      applyPresetRole('markom');
    } else if (lowerName.includes('wijaya')) {
      applyPresetRole('wijaya-marketing');
    } else if (lowerName.includes('beauthinc')) {
      applyPresetRole('beauthinc-sosmed');
    } else if (lowerName.includes('seventh')) {
      applyPresetRole('seventh-tentor');
    } else if (lowerName.includes('googlasses')) {
      applyPresetRole('googlasses-creator');
    } else if (lowerName.includes('cilily')) {
      applyPresetRole('cilily-creator');
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
        ${inpContactEmail.value ? `<div><strong>✉️ Email:</strong> ${inpContactEmail.value}</div>` : ''}
        ${inpContactPhone.value ? `<div><strong>📱 WA:</strong> ${inpContactPhone.value}</div>` : ''}
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

    if (/honda|ramayana|mojosongo|rmygrup/i.test(text) || /honda|ramayana/i.test(fileName)) {
      detectedCompany = 'Dealer Honda Ramayana Mojosongo';
      detectedRecipient = 'Yth. Tim HRD & Manajemen Dealer Honda Ramayana Mojosongo';
    } else if (/analis\s*teknologi|consula/i.test(text) || /analis|consula/i.test(fileName)) {
      detectedCompany = 'PT. Analis Teknologi Consula';
      detectedRecipient = 'Yth. HR & Talent Acquisition Management PT. Analis Teknologi Consula';
    } else if (/kertabhumi|kerta\s*bhumi/i.test(text) || /kertabhumi/i.test(fileName)) {
      detectedCompany = 'PT. Kertabhumi';
      detectedRecipient = 'Yth. Tim Rekrutmen & Engineering PT. Kertabhumi';
    } else if (/optimal|optimalcopier|sukowati/i.test(text) || /optimal/i.test(fileName)) {
      detectedCompany = 'OPTIMAL Sragen';
      detectedRecipient = 'Yth. Pimpinan & Manajemen OPTIMAL Sragen';
    } else if (/dewi\s*sri|tohudan|colomadu/i.test(text) || /dewi\s*sri/i.test(fileName)) {
      detectedCompany = 'Dewi Sri Solo';
      detectedRecipient = 'Yth. Pimpinan & Tim Manajemen Dewi Sri Solo';
    } else if (/wijaya\s*kreativ/i.test(text) || /wijaya/i.test(fileName)) {
      detectedCompany = 'Wijaya Kreativ Group';
      detectedRecipient = 'Yth. Tim HRD & Manajemen Rekrutmen Wijaya Kreativ Group';
    } else if (/beauthinc/i.test(text) || /beauthinc/i.test(fileName)) {
      detectedCompany = 'beauthinc';
      detectedRecipient = 'Yth. Tim Rekrutmen & Manajemen beauthinc';
    } else if (/seventh\s*education|seventh/i.test(text) || /seventh/i.test(fileName)) {
      detectedCompany = 'Seventh Education';
      detectedRecipient = 'Yth. Tim HRD & Manajemen Seventh Education';
    } else if (/googlasses/i.test(text) || /googlasses/i.test(fileName)) {
      detectedCompany = 'googlasses Surakarta';
      detectedRecipient = 'Yth. Tim Rekrutmen & Manajemen googlasses Surakarta';
    } else if (/cilily/i.test(text) || /cilily/i.test(fileName)) {
      detectedCompany = 'Cilily Collection';
      detectedRecipient = 'Yth. Tim HRD & Manajemen Cilily Collection';
    } else if (/al[\s\-_]*irsyad|irsyad|al\s*ir/i.test(text) || /al[\s\-_]*irsyad|irsyad/i.test(fileName)) {
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

    if (/honda|ramayana|mojosongo|rmygrup/i.test(text) || /honda|ramayana/i.test(fileName)) {
      // User explicit note: di HONDA melamar dibagian MARKETING EXECUTIVE
      detectedPosition = 'Marketing Eksekutif';
    } else if (/talent\s*acquisiti?on|recruitment\s*data|talent\s*scouting/i.test(text) || /talent/i.test(fileName)) {
      detectedPosition = 'Talent Acquisition';
    } else if (/divisi\s*komputer|basic\s*komputer/i.test(text) || /divisi\s*komputer/i.test(fileName)) {
      detectedPosition = 'Divisi Komputer';
    } else if (/konten\s*kreator/i.test(text) || (/kreator/i.test(text) && /dewi/i.test(text))) {
      detectedPosition = 'Konten Kreator';
    } else if (/kertabhumi/i.test(text) || (/web\s*developer/i.test(text) && /react|laravel/i.test(text))) {
      detectedPosition = 'Web Developer';
    } else if (/markom|marketing\s+komunikasi|marketing\s+komunikas[!i1l]|marcom|marketing\s+communication/i.test(text)) {
      detectedPosition = 'Staff Marketing Komunikasi (MARKOM)';
    } else if (/digital\s+marketing|marketing\s+specialist|pemasaran/i.test(text)) {
      detectedPosition = 'Digital Marketing Specialist';
    } else if (/content\s+creator|kreator\s+konten/i.test(text)) {
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

    // 4. Detect Links (s.id, bit.ly, forms.gle, etc.)
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
      if (/kualifikasi|syarat|usia|pria|muslim|kreatif|komunikat|canva|capcut|video|desain|multimedia|sosial\s+media|instagram|tiktok|youtube|solo|surakarta|pengalaman|react|laravel/i.test(line)) {
        const cleanedLine = line.replace(/^[•\+\-\*\‘\’\d\.\)\s]+/, '').trim();
        if (cleanedLine.length > 5 && !highlights.includes(cleanedLine) && !/kualifikasi|open recruitment/i.test(cleanedLine)) {
          highlights.push(cleanedLine);
        }
      }
    });

    if (highlights.length > 0) {
      inpKeyHighlights.value = highlights.slice(0, 6).join('\n');
    }

    // 8. Specialized Overrides for Specific Employers
    if (detectedCompany.includes('Honda') || detectedCompany.includes('Ramayana')) {
      detectedPosition = 'Marketing Eksekutif';
      detectedRecipient = 'Yth. Tim HRD & Manajemen Dealer Honda Ramayana Mojosongo';
      detectedLocation = 'Mojosongo Jebres Solo / Gatot Subroto Jayengan Solo';
      inpContactEmail.value = 'hrd.rmygrup@gmail.com';
      inpKeyHighlights.value = 'Pria usia 19 tahun, berpenampilan rapi, sopan, komunikatif & persuasif\nMemiliki sepeda motor pribadi & SIM C aktif\nPengalaman 8+ bulan pemasaran & promosi digital di Solo Raya (Meta Ads, Instagram, TikTok)\nBerorientasi target penjualan, jujur, gigih, dan disiplin tinggi\nSiap penempatan Dealer Honda Ramayana Mojosongo / Gatot Subroto Solo';
    } else if (detectedCompany.includes('Analis Teknologi')) {
      detectedPosition = 'Talent Acquisition';
      detectedRecipient = 'Yth. HR & Talent Acquisition Management PT. Analis Teknologi Consula';
      detectedLocation = 'Jl. Raya Grogol No.2, Dusun II, Grogol, Sukoharjo, Jawa Tengah';
      inpContactEmail.value = 'hr@analisteknologiconsula.com';
      inpKeyHighlights.value = 'Pendidikan S1 Sistem Informasi UBSI Solo (IPK Unggul & Beasiswa BJU)\nRekam jejak kepemimpinan Ketua Umum HIMSI UBSI Solo (pengalaman talent scouting, screening CV & wawancara kandidat organisasi)\nKemampuan problem solving, multitasking, analytical thinking & komunikasi persuasif\nMahir administrasi & pengelolaan data kandidat menggunakan Google Suites & MS Office\nMemahami ekosistem industri teknologi & konsultan IT';
    } else if (detectedCompany.includes('Kertabhumi')) {
      detectedPosition = 'Web Developer';
      detectedRecipient = 'Yth. Tim Rekrutmen & Engineering PT. Kertabhumi';
      detectedLocation = 'Solo Raya';
      inpContactEmail.value = 'karir.bwi@gmail.com';
      inpKeyHighlights.value = 'Pendidikan S1 Sistem Informasi UBSI Solo (Semester 5, IPK Unggul & Beasiswa BJU)\nPengembangan frontend modern & pemahaman arsitektur React, HTML, CSS, JavaScript responsif\nPengembangan backend framework Laravel & CodeIgniter terintegrasi RESTful API\nKemampuan database administration (MySQL & PostgreSQL) bersertifikasi BNSP\nSilver Medalist Pekan Inovasi Nasional Mercu Buana & Pemegang Hak Cipta Kemenkumham RI\nDomisili Solo Raya, jujur, problem solver, dan siap kerja mandiri maupun tim';
    } else if (detectedCompany.includes('OPTIMAL')) {
      detectedPosition = 'Divisi Komputer';
      detectedRecipient = 'Yth. Pimpinan & Manajemen OPTIMAL Sragen';
      detectedLocation = 'Jl. Sukowati No. 171 Sragen Kulon, Sragen';
      inpContactEmail.value = 'Optimalcopierdigital@gmail.com';
      inpContactPhone.value = '085183124382';
      inpKeyHighlights.value = 'Putra Asli Daerah (Tempat & Tanggal Lahir: Sragen, 22 Juli 2007)\nPria Muslim taat (sholat 5 waktu), single, amanah, dan disiplin tinggi\nMahir operasional komputer & Microsoft Office lengkap (MS Word, Excel, PowerPoint)\nKeahlian desain grafis, editing dokumen, penjilidan & digital printing\nSiap bekerja cepat, teliti, dan memberikan pelayanan prima di Sragen Kulon';
    } else if (detectedCompany.includes('Dewi Sri')) {
      detectedPosition = 'Konten Kreator';
      detectedRecipient = 'Yth. Pimpinan & Tim Manajemen Dewi Sri Solo';
      detectedLocation = 'Tohudan, Colomadu, Karanganyar';
      inpContactPhone.value = '081333555997';
      inpKeyHighlights.value = 'Domisili dekat (Krendowahono, Gondangrejo, Karanganyar - siap mobilitas ke Tohudan, Colomadu)\nJuara 2 Tingkat Nasional Video Reels Kreatif (SobiFest) & Juara 1 LKS Desain Grafis\nPengalaman 8+ bulan produksi video promosi, ide konten kreatif, dan pengelolaan media sosial\nMahir editing video mobile (CapCut) & alat desain visual (Canva & Adobe Illustrator)\nMemahami algoritma platform medsos (TikTok, IG Reels) untuk optimasi engagement & konversi';
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
        ${inpContactEmail.value ? `<div><strong>✉️ Email:</strong> ${inpContactEmail.value}</div>` : ''}
        ${inpContactPhone.value ? `<div><strong>📱 WA:</strong> ${inpContactPhone.value}</div>` : ''}
        ${detectedLink ? `<div><strong>🔗 Tautan:</strong> <a href="${detectedLink}" target="_blank" style="color: #0369a1; text-decoration: underline; font-weight: 700;">${detectedLink}</a></div>` : ''}
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
    'honda-marketing': {
      position: 'Marketing Eksekutif',
      company: 'Dealer Honda Ramayana Mojosongo',
      location: 'Mojosongo Jebres Solo / Gatot Subroto Jayengan Solo',
      recipient: 'Yth. Tim HRD & Manajemen Dealer Honda Ramayana Mojosongo',
      source: 'Poster Rekrutmen Resmi Dealer Honda Ramayana Mojosongo (One HEART)',
      highlights: 'Pria usia 19 tahun, berpenampilan rapi, sopan, komunikatif & persuasif\nMemiliki sepeda motor pribadi & SIM C aktif\nPengalaman 8+ bulan pemasaran & promosi digital di Solo Raya (Meta Ads, Instagram, TikTok)\nBerorientasi target penjualan, jujur, gigih, dan disiplin tinggi\nSiap penempatan Dealer Honda Ramayana Mojosongo / Gatot Subroto Solo',
      contactEmail: 'hrd.rmygrup@gmail.com',
      contactPhone: '',
      contactLink: ''
    },
    'analis-talent': {
      position: 'Talent Acquisition',
      company: 'PT. Analis Teknologi Consula',
      location: 'Jl. Raya Grogol No.2, Dusun II, Grogol, Sukoharjo, Jawa Tengah',
      recipient: 'Yth. HR & Talent Acquisition Management PT. Analis Teknologi Consula',
      source: 'Poster Resmi We\'re Hiring Talent Acquisition PT. Analis Teknologi Consula',
      highlights: 'Pendidikan S1 Sistem Informasi UBSI Solo (IPK Unggul & Beasiswa BJU)\nRekam jejak kepemimpinan Ketua Umum HIMSI UBSI Solo (pengalaman talent scouting, screening CV & wawancara kandidat organisasi)\nKemampuan problem solving, multitasking, analytical thinking & komunikasi persuasif\nMahir administrasi & pengelolaan data kandidat menggunakan Google Suites & MS Office\nMemahami ekosistem industri teknologi & konsultan IT',
      contactEmail: 'hr@analisteknologiconsula.com',
      contactPhone: '',
      contactLink: ''
    },
    'kerta-webdev': {
      position: 'Web Developer',
      company: 'PT. Kertabhumi',
      location: 'Solo Raya',
      recipient: 'Yth. Tim Rekrutmen & Engineering PT. Kertabhumi',
      source: 'Poster Resmi Lowongan Kerja Web Developer PT. Kertabhumi (Batas: 31 Okt 2026)',
      highlights: 'Pendidikan S1 Sistem Informasi UBSI Solo (Semester 5, IPK Unggul & Beasiswa BJU)\nPengembangan frontend modern & pemahaman arsitektur React, HTML, CSS, JavaScript responsif\nPengembangan backend framework Laravel & CodeIgniter terintegrasi RESTful API\nKemampuan database administration (MySQL & PostgreSQL) bersertifikasi BNSP\nSilver Medalist Pekan Inovasi Nasional Mercu Buana & Pemegang Hak Cipta Kemenkumham RI\nDomisili Solo Raya, jujur, problem solver, dan siap kerja mandiri maupun tim',
      contactEmail: 'karir.bwi@gmail.com',
      contactPhone: '',
      contactLink: ''
    },
    'optimal-komputer': {
      position: 'Divisi Komputer',
      company: 'OPTIMAL Sragen',
      location: 'Jl. Sukowati No. 171 Sragen Kulon, Sragen',
      recipient: 'Yth. Pimpinan & Manajemen OPTIMAL Sragen',
      source: 'Poster Resmi We Are Hiring Divisi Komputer OPTIMAL Sragen',
      highlights: 'Putra Asli Daerah (Tempat & Tanggal Lahir: Sragen, 22 Juli 2007)\nPria Muslim taat (sholat 5 waktu), single, amanah, dan disiplin tinggi\nMahir operasional komputer & Microsoft Office lengkap (MS Word, Excel, PowerPoint)\nKeahlian desain grafis, editing dokumen, penjilidan & digital printing\nSiap bekerja cepat, teliti, dan memberikan pelayanan prima di Sragen Kulon',
      contactEmail: 'Optimalcopierdigital@gmail.com',
      contactPhone: '085183124382',
      contactLink: ''
    },
    'dewisri-creator': {
      position: 'Konten Kreator',
      company: 'Dewi Sri Solo',
      location: 'Tohudan, Colomadu, Karanganyar',
      recipient: 'Yth. Pimpinan & Tim Manajemen Dewi Sri Solo',
      source: 'Poster Lowongan Kerja Resmi Konten Kreator Dewi Sri Solo',
      highlights: 'Domisili dekat (Krendowahono, Gondangrejo, Karanganyar - siap mobilitas ke Tohudan, Colomadu)\nJuara 2 Tingkat Nasional Video Reels Kreatif (SobiFest) & Juara 1 LKS Desain Grafis\nPengalaman 8+ bulan produksi video promosi, ide konten kreatif, dan pengelolaan media sosial\nMahir editing video mobile (CapCut) & alat desain visual (Canva & Adobe Illustrator)\nMemahami algoritma platform medsos (TikTok, IG Reels) untuk optimasi engagement & konversi',
      contactEmail: '',
      contactPhone: '081333555997',
      contactLink: ''
    },
    'wijaya-marketing': {
      position: 'Marketing Komersil',
      company: 'Wijaya Kreativ Group',
      location: 'Solo Raya',
      recipient: 'Yth. Tim HRD & Manajemen Rekrutmen Wijaya Kreativ Group',
      source: 'Poster Resmi Rekrutmen Terbuka (Open Recruitment Join Our Team)',
      highlights: 'Pendidikan S1 Sistem Informasi (Semester 5, IPK Unggul)\nPengalaman 8+ bulan digital marketing & promosi komersil di Solo Raya\nKeahlian komunikasi, presentasi & negosiasi persuasif\nMenguasai media sosial untuk promosi (Instagram, TikTok, Facebook Ads)\nMemiliki kendaraan pribadi & SIM C aktif, berdomisili Solo Raya\nBerorientasi target, jujur, disiplin, dan mau belajar',
      contactEmail: 'hrd@wijayakreativ.com',
      contactPhone: '',
      contactLink: ''
    },
    'beauthinc-sosmed': {
      position: 'Sosial Media Spesialis',
      company: 'beauthinc',
      location: 'Surakarta / Solo Raya',
      recipient: 'Yth. Tim Rekrutmen & Manajemen beauthinc',
      source: 'Poster Pengumuman Lowongan Kerja Resmi (We Are Hiring)',
      highlights: 'Pria, usia 19 tahun, kreatif, komunikatif & up to date tren digital\nBerpengalaman mengelola akun media sosial Instagram & TikTok (Volution Apparel & brand lokal)\nMemahami content planning, copywriting persuasif & tren kecantikan/skincare\nKeahlian analisis insight, jangkauan (reach), dan engagement audiens\nJuara 2 Nasional Video Reels Kreatif (SobiFest) & Juara 1 LKS Desain Grafis',
      contactEmail: '',
      contactPhone: '082195667706',
      contactLink: ''
    },
    'seventh-tentor': {
      position: 'Tentor Tetap Saintek (SMP & SMA)',
      company: 'Seventh Education',
      location: 'Cabang Teras, Soloraya',
      recipient: 'Yth. Tim HRD & Manajemen Seventh Education (Cabang Teras, Soloraya)',
      source: 'Poster Resmi Rekrutmen Tentor (We Are Hiring Tentor Tetap Saintek Soloraya)',
      highlights: 'Pendidikan S1 Sistem Informasi UBSI Solo (IPK Unggul & Beasiswa BJU)\nKompetensi kuat dalam Matematika, Logika, IPA, dan Penalaran SNBT-UTBK\nPengalaman sebagai pemateri workshop teknologi & Ketua Umum HIMSI UBSI Solo\nKarakter edukatif, komunikatif, sabar, dan berperilaku baik\nBerdomisili di Soloraya (siap penempatan Cabang Teras)',
      contactEmail: '',
      contactPhone: '085641804150',
      contactLink: 'https://linkr.bio/seventheducation'
    },
    'googlasses-creator': {
      position: 'Content Creator (Full Time)',
      company: 'googlasses Surakarta',
      location: 'Jl. Melon Raya No.51, Karangasem, Laweyan, Surakarta',
      recipient: 'Yth. Tim Rekrutmen & Manajemen googlasses Surakarta',
      source: 'Pengumuman Lowongan Kerja Resmi (Requirements Content Creator Full Time)',
      highlights: 'Kreatif & sangat update terhadap tren media sosial & konten viral\nTerampil memproduksi foto & video produk eyewear/fashion kekinian\nMenguasai editing foto & video (CapCut, Photoshop, Canva, Lightroom)\nMemahami visual storytelling & estetika brand modern\nSiap bekerja secara mandiri maupun berkolaborasi tim di Surakarta\nMelampirkan CV ATS, Portofolio Kreatif, Foto Non Formal, KTP & Transkrip Akademik',
      contactEmail: 'googlassessoc@gmail.com',
      contactPhone: '',
      contactLink: ''
    },
    'cilily-creator': {
      position: 'Content Creator',
      company: 'Cilily Collection',
      location: 'Solo / Surakarta',
      recipient: 'Yth. Tim HRD & Manajemen Cilily Collection',
      source: 'Poster Rekrutmen Resmi (We\'re Hiring Content Creator)',
      highlights: 'Paham mendalam tren TikTok, IG Reels, & konten fashion viral\nMampu memproduksi konten foto & video harian (OOTD, try on, mix & match)\nMahir editing video mobile berbasis CapCut dengan ritme dinamis\nPunya sense fashion, visual storytelling, rapi, dan konsisten on-time upload\nPengalaman mengelola konten fashion & apparel (Volution Apparel)',
      contactEmail: 'adm.cililycollection@gmail.com',
      contactPhone: '085179979027',
      contactLink: ''
    },
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

    if (comp.includes('honda') || comp.includes('ramayana') || pos.includes('marketing eksekutif') || pos.includes('marketing executive')) {
      specificParagraph = `Sebagai profesional muda berusia 19 tahun yang berpenampilan rapi, sopan, dan memiliki keterampilan komunikasi interpersonal yang aktif dan persuasif, saya memiliki komitmen tinggi untuk berkarir di bidang pemasaran otomotif. Latar belakang saya sebagai mahasiswa S1 Sistem Informasi UBSI Solo diperkaya dengan pengalaman lebih dari 8 bulan di bidang promosi komersil dan Digital Marketing (<strong>Meta Ads Manager, Instagram, dan TikTok</strong>) di wilayah Solo Raya. Didukung kepemilikan <strong>sepeda motor pribadi serta SIM C aktif</strong>, saya memiliki kesiapan mobilitas harian yang prima untuk melakukan canvassing, pendekatan calon konsumen, presentasi keunggulan unit sepeda motor Honda, serta membangun relasi jangka panjang dengan konsumen. Dengan etos kerja disiplin, orientasi target penjualan yang kuat, dan integritas tinggi, saya siap berkontribusi aktif memajukan penjualan di Dealer Honda Ramayana Mojosongo.`;

      documentListItems = [
        'Curriculum Vitae (CV) Format Standar ATS Terkini',
        'Salinan Transkrip Nilai Akademik Terkini (IPK Unggul UBSI Solo)',
        'Salinan Surat Izin Mengemudi (SIM C Aktif)',
        'Salinan Kartu Tanda Penduduk (KTP)',
        'Portofolio Digital Marketing & Promosi Penjualan di Solo Raya',
        'Piagam Penghargaan Juara 2 Tingkat Nasional Video Reels Kreatif (SobiFest)'
      ];
    } else if (comp.includes('analis') || pos.includes('talent acquisition') || pos.includes('talent')) {
      specificParagraph = `Sebagai mahasiswa S1 Sistem Informasi di UBSI Kampus Solo yang memiliki pemahaman mendalam tentang lanskap teknologi informasi, saya membawa keunggulan unik dalam proses rekrutmen tenaga kerja bidang IT dan industri modern. Pengalaman saya memimpin organisasi sebagai <strong>Ketua Umum Himpunan Mahasiswa Sistem Informasi (HIMSI) UBSI Solo</strong> telah melatih kemampuan saya dalam melakukan talent scouting, skrining berkas kurikulum vitae, wawancara kandidat panitia dan pengurus, serta analisis kecocokan profil individu terhadap kebutuhan tugas organisasi. Didukung penguasaan piranti administrasi berbasis data (<strong>Google Suites, Microsoft Excel terstruktur, dan Google Forms</strong>), keterampilan analytical thinking, serta kemampuan negosiasi dan komunikasi persuasif, saya siap berkoordinasi secara efektif dengan user dan manajer guna memenuhi kebutuhan kandidat berkualitas di PT. Analis Teknologi Consula.`;

      documentListItems = [
        'Curriculum Vitae (CV) Format Standar ATS Terkini',
        'Salinan Transkrip Nilai Akademik Terkini (IPK Unggul & Beasiswa Prestasi BJU)',
        'Salinan Sertifikat Kompetensi Profesi BNSP (Database Administrator)',
        'Salinan Surat Keputusan & Sertifikat Ketua Umum HIMSI UBSI Solo',
        'Portofolio Kepemimpinan, Manajemen Organisasi & Rekrutmen',
        'Salinan Surat Pencatatan Ciptaan (HKI Kemenkumham RI) & Dokumen Pendukung'
      ];
    } else if (comp.includes('kertabhumi') || (pos.includes('web developer') && comp.includes('kerta'))) {
      specificParagraph = `Sebagai mahasiswa semester 5 Program Studi S1 Sistem Informasi di Universitas Bina Sarana Informatika (UBSI) Kampus Solo dengan predikat Beasiswa Prestasi BJU (IPK Unggul), saya memiliki rekam jejak teruji dalam rekayasa perangkat lunak web modern. Saya memiliki kompetensi dalam pengembangan antarmuka (frontend) menggunakan <strong>HTML, CSS, JavaScript, dan React</strong> dengan penerapan prinsip responsive design dan cross-browser compatibility, serta pengembangan backend menggunakan framework <strong>Laravel dan CodeIgniter</strong> yang terintegrasi <strong>RESTful API</strong>. Di samping itu, keahlian saya dalam mengelola basis data MySQL dan PostgreSQL didukung oleh <strong>Sertifikasi Profesi BNSP Database Administrator (No. Reg: DMS.1241.00995 2026)</strong>. Karya platform web yang saya pimpin juga telah meraih <strong>Medali Perak (Silver Medal) pada Pekan Inovasi Nasional Mercu Buana</strong> serta tercatat resmi memiliki <strong>Hak Cipta Kemenkumham RI (No. EC002026096415)</strong>. Berdomisili di Solo Raya, saya memiliki kesiapan untuk berkolaborasi secara mandiri maupun tim.`;

      documentListItems = [
        'Curriculum Vitae (CV) Format Standar ATS Terkini',
        'Salinan Transkrip Nilai Akademik Terkini (IPK Unggul & Beasiswa BJU)',
        'Salinan Sertifikat Profesi BNSP Database Administrator',
        'Salinan Surat Pencatatan Ciptaan Web Platform (HKI Kemenkumham RI)',
        'Piagam Penghargaan Silver Medalist Pekan Inovasi Nasional (Mercu Buana)',
        'Tautan Portofolio Proyek Web Interaktif: https://fhrelz.github.io/portfolio-3d-celestial/'
      ];
    } else if (comp.includes('optimal') || pos.includes('divisi komputer')) {
      specificParagraph = `Sebagai putra daerah asli Sragen yang lahir pada <strong>22 Juli 2007</strong> dan seorang muslim yang taat menjalankan sholat 5 waktu, saya memegang teguh nilai kejujuran, amanah, dan kedisiplinan kerja. Saya memiliki keahlian mendalam dalam pengoperasian komputer dan seluruh paket <strong>Microsoft Office (Word, Excel, PowerPoint)</strong>, pengolahan dokumen, administrasi data, pengetikan cepat, penjilidan, serta desain grafis dan digital printing. Karakter saya yang teliti, cekatan, dan ramah memudahkan saya memberikan pelayanan terbaik dan memuaskan bagi setiap pelanggan yang datang ke OPTIMAL Sragen di Jl. Sukowati No. 171 Sragen Kulon.`;

      documentListItems = [
        'Curriculum Vitae (CV) Format Standar ATS Terkini',
        'Salinan Ijazah Pendidikan Formal & Transkrip Nilai Akademik Terkini',
        'Salinan Kartu Tanda Penduduk (KTP Domisili Asli Sragen)',
        'Salinan Sertifikat Kompetensi Profesi BNSP Bidang Komputer & Basis Data',
        'Piagam Penghargaan Juara 1 LKS Graphic Design Technology & Juara 2 Nasional Video Reels',
        'Pas Foto Formal Terbaru'
      ];
    } else if (comp.includes('dewi sri') || (pos.includes('kreator') && comp.includes('dewi'))) {
      specificParagraph = `Dengan domisili tempat tinggal saya di Krendowahono, Gondangrejo, Karanganyar yang berjarak sangat dekat dan mudah menjangkau lokasi Dewi Sri Solo di Tohudan, Colomadu, saya memiliki mobilitas yang sangat fleksibel untuk memproduksi konten langsung di lokasi. Saya memiliki rekam jejak nyata selama lebih dari 8 bulan dalam produksi konten promosi media sosial, didukung prestasi prestisius sebagai <strong>Juara 2 Tingkat Nasional Video Reels Kreatif SobiFest</strong> dan <strong>Juara 1 LKS Graphic Design Technology</strong>. Saya terbiasa menyusun ide konten, menulis caption dan script video yang memikat, memproduksi serta mengedit video harian menggunakan <strong>CapCut</strong>, mendesain materi visual dengan <strong>Canva dan Illustrator</strong>, serta menganalisis algoritma dan insight engagement audiens di Instagram dan TikTok guna menjaga konsistensi brand Dewi Sri Solo.`;

      documentListItems = [
        'Curriculum Vitae (CV) Format Standar ATS Terkini',
        'Portofolio Video Kreatif, Desain Visual & Pengelolaan Media Sosial',
        'Salinan Transkrip Nilai Akademik Terkini (IPK Unggul UBSI Solo)',
        'Piagam Penghargaan Juara 2 Tingkat Nasional Video Reels Kreatif (SobiFest)',
        'Piagam Penghargaan Juara 1 LKS Graphic Design Technology',
        'Salinan Sertifikat Kompetensi Profesi BNSP & Tautan Portofolio Interaktif'
      ];
    } else if (pos.includes('tentor') || comp.includes('seventh') || pos.includes('saintek') || pos.includes('mengajar')) {
      specificParagraph = `Sebagai mahasiswa semester 5 Program Studi S1 Sistem Informasi di Universitas Bina Sarana Informatika (UBSI) Kampus Solo sekaligus penerima <strong>Beasiswa Prestasi Jalur Undangan (BJU) dengan Indeks Prestasi Kumulatif (IPK) Unggul</strong>, saya memiliki fondasi keilmuan yang kokoh dalam bidang Matematika, logika algoritma, statistika, serta sains analitis. Pengalaman saya memimpin organisasi sebagai <strong>Ketua Umum Himpunan Mahasiswa Sistem Informasi (HIMSI) UBSI Solo</strong> serta kerap dipercaya menjadi pemateri workshop teknologi membentuk karakter kepemimpinan, kesabaran dalam membimbing, dan keterampilan komunikasi edukatif yang persuasif. Saya terbiasa menyederhanakan materi penalaran kuantitatif dan konsep sains yang kompleks menjadi metode pemecahan masalah yang sistematis, menyenangkan, dan mudah dipahami oleh siswa SMP maupun SMA untuk persiapan ujian sekolah dan seleksi SNBT-UTBK.`;

      documentListItems = [
        'Curriculum Vitae (CV) Format Standar ATS Terkini',
        'Salinan Transkrip Nilai Akademik Terkini (IPK Unggul & Penerima Beasiswa BJU)',
        'Salinan Sertifikat Kompetensi Profesi BNSP (Database Administrator)',
        'Salinan Sertifikat Pemateri & Narasumber Workshop Teknologi Edukatif',
        'Salinan Surat Pencatatan Ciptaan (HKI Kemenkumham RI) & Portofolio Riset',
        'Salinan Kartu Tanda Penduduk (KTP) & Dokumen Kualifikasi Pendukung'
      ];
    } else if (comp.includes('wijaya') || (pos.includes('marketing') && pos.includes('komersil'))) {
      specificParagraph = `Latar belakang saya sebagai mahasiswa S1 Sistem Informasi UBSI Solo didukung oleh pengalaman profesional selama lebih dari 8 bulan di bidang Digital Marketing dan promosi komersil di wilayah Solo Raya. Saya terbiasa mengelola strategi periklanan berbasis data (<strong>Meta Ads Manager, Instagram, TikTok, dan Facebook</strong>) guna meningkatkan jangkauan pasar dan konversi penjualan produk komersial/properti. Didukung kemampuan negosiasi, presentasi produk, kepemilikan <strong>kendaraan pribadi dan SIM C aktif</strong>, serta domisili di Solo Raya, saya memiliki kesiapan mobilitas tinggi dan orientasi target yang kuat untuk berkontribusi aktif memajukan penjualan di Wijaya Kreativ Group.`;

      documentListItems = [
        'Curriculum Vitae (CV) Format Standar ATS Terkini',
        'Salinan Transkrip Nilai Akademik Terkini (IPK Unggul)',
        'Portofolio Digital Marketing: Kampanye Iklan Berbayar (Meta Ads) & Analisis Pasar',
        'Salinan Surat Izin Mengemudi (SIM C Aktif)',
        'Piagam Penghargaan Juara 2 Tingkat Nasional Video Reels Kreatif (SobiFest)',
        'Salinan Sertifikat Kompetensi Profesi BNSP & Surat Pencatatan Ciptaan HKI'
      ];
    } else if (comp.includes('googlasses') || (pos.includes('content') && pos.includes('creator') && comp.includes('googlasses'))) {
      specificParagraph = `Di samping rekam jejak teknologi informasi, saya memiliki passion dan keahlian mendalam dalam produksi konten kreatif visual, khususnya fotografi dan videografi produk fesyen dan aksesoris/eyewear kekinian. Saya mahir mengoperasikan perangkat kamera serta menguasai perangkat lunak editing standar industri seperti <strong>CapCut, Adobe Photoshop, Canva, dan Lightroom</strong> untuk menghasilkan visual produk yang tajam, estetik, dan bercerita (visual storytelling). Didukung prestasi sebagai <strong>Juara 2 Tingkat Nasional Video Reels Kreatif SobiFest</strong> dan <strong>Juara 1 LKS Graphic Design Technology</strong>, saya siap bekerja secara penuh waktu (full-time) baik secara mandiri maupun berkolaborasi dengan tim kreatif di googlasses Surakarta.`;

      documentListItems = [
        'Curriculum Vitae (CV) Format Standar ATS Terkini',
        'Portofolio Kreatif Fotografi & Videografi Produk (Eyewear / Fesyen)',
        'Foto Diri Non-Formal Terbaru (Sesuai Persyaratan Flyer)',
        'Salinan Kartu Tanda Penduduk (KTP)',
        'Salinan Transkrip Nilai Akademik Terkini (IPK Unggul UBSI Solo)',
        'Piagam Penghargaan Nasional Video Kreatif (Juara 2 SobiFest & Juara 1 LKS Desain)'
      ];
    } else if (comp.includes('cilily') || (pos.includes('content') && pos.includes('creator') && (hl.includes('ootd') || comp.includes('cilily')))) {
      specificParagraph = `Saya memiliki pemahaman mendalam mengenai dinamika tren busana wanita terkini di TikTok dan Instagram Reels, didukung pengalaman nyata dalam mengelola konten visual dan promosi busana (Volution Apparel). Saya terampil merancang konsep shooting harian, memproduksi video <em>Outfit of the Day (OOTD)</em>, <em>try-on</em>, serta <em>mix and match</em> dengan estetika visual yang anggun dan ritme editing dinamis menggunakan <strong>CapCut</strong>. Dengan ketelitian, konsistensi jadwal unggah harian (on-time upload), dan orientasi pada pertumbuhan engagement audiens, saya yakin dapat memperkuat citra dan penjualan brand Cilily Collection.`;

      documentListItems = [
        'Curriculum Vitae (CV) Format Standar ATS Terkini',
        'Portofolio Video Kreatif: Konten Fesyen, OOTD, Try-On & Editing CapCut',
        'Salinan Transkrip Nilai Akademik Terkini (IPK Unggul)',
        'Piagam Penghargaan Juara 2 Tingkat Nasional Video Reels Kreatif (SobiFest)',
        'Piagam Penghargaan Juara 1 LKS Graphic Design Technology',
        'Salinan Sertifikat Kompetensi Profesi BNSP & Portofolio Digital'
      ];
    } else if (comp.includes('beauthinc') || pos.includes('sosial media spesialis') || pos.includes('social media specialist')) {
      specificParagraph = `Sebagai profesional muda yang adaptif dan kreatif, saya memiliki pengalaman mengelola akun media sosial (Instagram dan TikTok) dengan pendekatan berbasis data dan estetika modern. Saya memahami alur kerja penyusunan kalender konten (content planning), riset tren kecantikan dan gaya hidup yang sedang viral, perancangan copywriting persuasif, serta analisis insight berkala (reach, impressions, dan engagement rate) untuk meningkatkan interaksi audiens. Prestasi saya sebagai <strong>Juara 2 Tingkat Nasional Video Reels Kreatif SobiFest</strong> dan <strong>Juara 1 LKS Graphic Design Technology</strong> menjadi bukti nyata dedikasi dan kepekaan visual yang saya miliki untuk memajukan kanal media sosial beauthinc.`;

      documentListItems = [
        'Curriculum Vitae (CV) Format Standar ATS Terkini',
        'Portofolio Pengelolaan Sosial Media (Instagram & TikTok), Content Planning & Copywriting',
        'Salinan Transkrip Nilai Akademik Terkini (IPK Unggul UBSI Solo)',
        'Piagam Penghargaan Juara 2 Tingkat Nasional Video Reels Kreatif (SobiFest)',
        'Piagam Penghargaan Juara 1 LKS Graphic Design Technology',
        'Salinan Sertifikat Kompetensi Profesi BNSP & Dokumen Pendukung'
      ];
    } else if (pos.includes('markom') || pos.includes('marketing komunikasi') || pos.includes('marcom') || (pos.includes('marketing') && !pos.includes('digital')) || comp.includes('irsyad') || hl.includes('canva') || hl.includes('capcut')) {
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
    if (comp.includes('honda') || comp.includes('ramayana')) {
      highlightSnippet = `<p class="letter-p">Menjawab kualifikasi pada poster rekrutmen <strong>${company}</strong> untuk posisi Marketing Eksekutif, yakni usia minimal 18 tahun, berpenampilan rapi dan komunikatif, kepemilikan sepeda motor dan SIM C aktif, serta kesiapan bekerja berorientasi target penjualan, saya menyatakan kesiapan penuh untuk langsung bertugas dan berdedikasi memajukan Dealer Honda Ramayana.</p>`;
    } else if (comp.includes('analis') || pos.includes('talent acquisition')) {
      highlightSnippet = `<p class="letter-p">Berdasarkan kualifikasi pada poster rekrutmen <strong>${company}</strong>, yakni kemampuan problem solving, analytical thinking, komunikasi prima, negosiasi, manajemen waktu, serta pengelolaan data candidate dengan MS Office & Google Suites, saya siap mendedikasikan ketelitian dan kemampuan koordinasi saya demi kelancaran proses hiring hingga onboarding kandidat.</p>`;
    } else if (comp.includes('kertabhumi')) {
      highlightSnippet = `<p class="letter-p">Menanggapi kualifikasi lowongan <strong>${company}</strong> dengan batas akhir 31 Oktober 2026, yang mempersyaratkan penguasaan React, Laravel, REST API, pengelolaan database MySQL, responsive design, pemecahan masalah (problem-solving), dan domisili Solo Raya, saya menyatakan kesiapan penuh untuk segera bergabung dan berkontribusi.</p>`;
    } else if (comp.includes('optimal') || pos.includes('divisi komputer')) {
      highlightSnippet = `<p class="letter-p">Berdasarkan persyaratan yang tercantum pada poster rekrutmen <strong>${company}</strong>, yakni muslim (sholat 5 waktu), berstatus single, minimal SLTA/sederajat, berkarakter amanah dan disiplin, serta terampil dalam pengoperasian aplikasi dasar komputer (Word, Excel, PPT), saya menyatakan kesiapan dan kesungguhan penuh untuk mendedikasikan tenaga dan kemampuan saya di OPTIMAL Sragen.</p>`;
    } else if (comp.includes('dewi sri')) {
      highlightSnippet = `<p class="letter-p">Menjawab kualifikasi <strong>${company}</strong> di Tohudan, Colomadu, Karanganyar untuk posisi Konten Kreator, yakni keahlian mengembangkan ide konten menarik, penulisan skrip & caption, editing video, alat desain sederhana, pemahaman algoritma media sosial, dan kemampuan bekerja tepat waktu di bawah tenggat waktu (deadline), saya siap memberikan hasil karya terbaik dan terukur.</p>`;
    } else if (comp.includes('seventh') || pos.includes('tentor')) {
      highlightSnippet = `<p class="letter-p">Berdasarkan kualifikasi khusus yang dipersyaratkan oleh <strong>${company}</strong>, yakni kemampuan pengajaran Saintek (Matematika/IPA/IPS/SNBT-UTBK), batas usia maksimal 32 tahun, pengalaman mengajar, dan kesiapan penempatan di <strong>Cabang Teras (Soloraya)</strong>, saya menyatakan kesiapan penuh dan komitmen tinggi untuk mendedikasikan waktu, integritas moral, serta keilmuan saya demi kemajuan dan prestasi siswa-siswi Seventh Education.</p>`;
    } else if (comp.includes('wijaya') || (pos.includes('marketing') && pos.includes('komersil'))) {
      highlightSnippet = `<p class="letter-p">Berdasarkan persyaratan yang tercantum pada poster rekrutmen <strong>${company}</strong>, yakni kemampuan negosiasi, penguasaan promosi media sosial, kepemilikan kendaraan pribadi & SIM C aktif, domisili di Solo Raya, serta sikap berorientasi target dan jujur, saya siap langsung terjun ke lapangan untuk menjalankan strategi pemasaran terpadu.</p>`;
    } else if (comp.includes('googlasses')) {
      highlightSnippet = `<p class="letter-p">Sesuai dengan lampiran wajib yang dipersyaratkan oleh <strong>${company}</strong> di Jl. Melon Raya No. 51 Laweyan Surakarta, bersama surat ini telah saya sertakan kelengkapan berkas yang mencakup CV ATS & Portofolio Kreatif, Foto Diri Non Formal, KTP, serta Transkrip Nilai Akademik terakhir sebagai bukti komitmen dan kesiapan kerja penuh waktu saya.</p>`;
    } else if (comp.includes('cilily')) {
      highlightSnippet = `<p class="letter-p">Menanggapi kebutuhan <strong>${company}</strong> akan Content Creator yang memahami tren viral TikTok/Reels, produksi video OOTD, dan disiplin waktu upload, saya siap mendedikasikan kreativitas visual dan konsistensi kerja saya demi menghadirkan konten harian yang segar, menarik, dan meningkatkan konversi penjualan produk fesyen Cilily Collection.</p>`;
    } else if (comp.includes('beauthinc')) {
      highlightSnippet = `<p class="letter-p">Menjawab kualifikasi <strong>${company}</strong> untuk posisi Sosial Media Spesialis, saya siap berkolaborasi erat dengan tim desain, konten, dan pemasaran guna mengeksekusi kalender konten yang konsisten serta memproduksi narasi visual yang relevan dengan tren kecantikan saat ini.</p>`;
    } else if (comp.includes('irsyad') || pos.includes('markom')) {
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
      id: 'honda-ramayana-marketing',
      title: 'Lamaran Marketing Eksekutif Dealer Honda',
      company: 'Dealer Honda Ramayana Mojosongo',
      position: 'Marketing Eksekutif',
      location: 'Mojosongo Jebres Solo / Gatot Subroto Jayengan Solo',
      recipient: 'Yth. Tim HRD & Manajemen Dealer Honda Ramayana Mojosongo',
      source: 'Poster Rekrutmen Resmi Dealer Honda Ramayana Mojosongo (One HEART)',
      date: '2026-10-27',
      badge: 'Brosur Baru (Belum Dilamar)',
      badgeClass: 'badge-active',
      desc: 'Pengajuan lamaran posisi Marketing Eksekutif mengoptimalkan keahlian negosiasi, kepemilikan motor & SIM C aktif, serta strategi digital marketing (Meta Ads, IG, TikTok) untuk akselerasi penjualan unit Honda.',
      highlights: 'Pria usia 19 tahun, berpenampilan rapi, sopan, komunikatif & persuasif\nMemiliki sepeda motor pribadi & SIM C aktif\nPengalaman 8+ bulan pemasaran & promosi digital di Solo Raya (Meta Ads, Instagram, TikTok)\nBerorientasi target penjualan, jujur, gigih, dan disiplin tinggi\nSiap penempatan Dealer Honda Ramayana Mojosongo / Gatot Subroto Solo',
      contactEmail: 'hrd.rmygrup@gmail.com',
      contactPhone: '',
      contactLink: ''
    },
    {
      id: 'analis-teknologi-talent',
      title: 'Lamaran Talent Acquisition & IT Recruitment',
      company: 'PT. Analis Teknologi Consula',
      position: 'Talent Acquisition',
      location: 'Jl. Raya Grogol No.2, Dusun II, Grogol, Sukoharjo, Jawa Tengah',
      recipient: 'Yth. HR & Talent Acquisition Management PT. Analis Teknologi Consula',
      source: 'Poster Resmi We\'re Hiring Talent Acquisition PT. Analis Teknologi Consula',
      date: '2026-10-27',
      badge: 'Brosur Baru (Belum Dilamar)',
      badgeClass: 'badge-active',
      desc: 'Aplikasi Talent Acquisition memadukan pemahaman teknologi informasi (S1 Sistem Informasi UBSI), rekam jejak rekrutmen organisasi (Ketua Umum HIMSI Solo), kemampuan interview, analisis data kandidat, dan Google Suites/MS Office.',
      highlights: 'Pendidikan S1 Sistem Informasi UBSI Solo (IPK Unggul & Beasiswa BJU)\nRekam jejak kepemimpinan Ketua Umum HIMSI UBSI Solo (pengalaman talent scouting, screening CV & wawancara kandidat organisasi)\nKemampuan problem solving, multitasking, analytical thinking & komunikasi persuasif\nMahir administrasi & pengelolaan data kandidat menggunakan Google Suites & MS Office\nMemahami ekosistem industri teknologi & konsultan IT',
      contactEmail: 'hr@analisteknologiconsula.com',
      contactPhone: '',
      contactLink: ''
    },
    {
      id: 'kertabhumi-web-developer',
      title: 'Lamaran Web Developer (React, Laravel & REST API)',
      company: 'PT. Kertabhumi',
      position: 'Web Developer',
      location: 'Solo Raya',
      recipient: 'Yth. Tim Rekrutmen & Engineering PT. Kertabhumi',
      source: 'Poster Resmi Lowongan Kerja Web Developer PT. Kertabhumi (Batas: 31 Okt 2026)',
      date: '2026-10-27',
      badge: 'Batas: 31 Okt 2026',
      badgeClass: 'badge-active',
      desc: 'Lamaran Web Developer berbasis rekam jejak fullstack: Laravel, React, REST API, MySQL/PostgreSQL, Hak Cipta Kemenkumham RI MBG SPPG Nusukan, Silver Medalist Pekan Inovasi Nasional Mercu Buana, dan Sertifikasi Profesi BNSP Database Administrator.',
      highlights: 'Pendidikan S1 Sistem Informasi UBSI Solo (Semester 5, IPK Unggul & Beasiswa BJU)\nPengembangan frontend modern & pemahaman arsitektur React, HTML, CSS, JavaScript responsif\nPengembangan backend framework Laravel & CodeIgniter terintegrasi RESTful API\nKemampuan database administration (MySQL & PostgreSQL) bersertifikasi BNSP\nSilver Medalist Pekan Inovasi Nasional Mercu Buana & Pemegang Hak Cipta Kemenkumham RI\nDomisili Solo Raya, jujur, problem solver, dan siap kerja mandiri maupun tim',
      contactEmail: 'karir.bwi@gmail.com',
      contactPhone: '',
      contactLink: ''
    },
    {
      id: 'optimal-sragen-komputer',
      title: 'Lamaran Divisi Komputer & Pelayanan Digital',
      company: 'OPTIMAL Sragen',
      position: 'Divisi Komputer',
      location: 'Jl. Sukowati No. 171 Sragen Kulon, Sragen',
      recipient: 'Yth. Pimpinan & Manajemen OPTIMAL Sragen',
      source: 'Poster Resmi We Are Hiring Divisi Komputer OPTIMAL Sragen',
      date: '2026-10-27',
      badge: 'Brosur Baru (Belum Dilamar)',
      badgeClass: 'badge-active',
      desc: 'Lamaran Divisi Komputer dari putra daerah asli Sragen (lahir Sragen, 22 Juli 2007), pria muslim yang taat (sholat 5 waktu), amanah, disiplin, menguasai operasional MS Office (Word, Excel, PowerPoint) dan digital printing.',
      highlights: 'Putra Asli Daerah (Tempat & Tanggal Lahir: Sragen, 22 Juli 2007)\nPria Muslim taat (sholat 5 waktu), single, amanah, dan disiplin tinggi\nMahir operasional komputer & Microsoft Office lengkap (MS Word, Excel, PowerPoint)\nKeahlian desain grafis, editing dokumen, penjilidan & digital printing\nSiap bekerja cepat, teliti, dan memberikan pelayanan prima di Sragen Kulon',
      contactEmail: 'Optimalcopierdigital@gmail.com',
      contactPhone: '085183124382',
      contactLink: ''
    },
    {
      id: 'dewisri-konten-kreator',
      title: 'Lamaran Konten Kreator & Social Media Growth',
      company: 'Dewi Sri Solo',
      position: 'Konten Kreator',
      location: 'Tohudan, Colomadu, Karanganyar',
      recipient: 'Yth. Pimpinan & Tim Manajemen Dewi Sri Solo',
      source: 'Poster Lowongan Kerja Resmi Konten Kreator Dewi Sri Solo',
      date: '2026-10-27',
      badge: 'Brosur Baru (Belum Dilamar)',
      badgeClass: 'badge-active',
      desc: 'Lamaran Konten Kreator berdomisili sangat dekat (Karanganyar), Juara 2 Nasional Video Reels SobiFest, Juara 1 LKS Desain Grafis, penguasaan CapCut, Canva, penulisan script, serta strategi algoritma media sosial.',
      highlights: 'Domisili dekat (Krendowahono, Gondangrejo, Karanganyar - siap mobilitas ke Tohudan, Colomadu)\nJuara 2 Tingkat Nasional Video Reels Kreatif (SobiFest) & Juara 1 LKS Desain Grafis\nPengalaman 8+ bulan produksi video promosi, ide konten kreatif, dan pengelolaan media sosial\nMahir editing video mobile (CapCut) & alat desain visual (Canva & Adobe Illustrator)\nMemahami algoritma platform medsos (TikTok, IG Reels) untuk optimasi engagement & konversi',
      contactEmail: '',
      contactPhone: '081333555997',
      contactLink: ''
    },
    {
      id: 'wijaya-kreativ-marketing',
      title: 'Lamaran Marketing Komersil & Promosi Digital',
      company: 'Wijaya Kreativ Group',
      position: 'Marketing Komersil',
      location: 'Solo Raya',
      recipient: 'Yth. Tim HRD & Manajemen Rekrutmen Wijaya Kreativ Group',
      source: 'Poster Resmi Rekrutmen Terbuka (Open Recruitment Join Our Team)',
      date: '2026-10-26',
      badge: 'Siap Dikirim / Tersinkronisasi',
      badgeClass: 'badge-active',
      desc: 'Pengajuan lamaran posisi Marketing Komersil berbasis kompetensi sales & promosi digital media sosial (Meta Ads & TikTok), kepemilikan SIM C & kendaraan pribadi, dan domisili Solo Raya.',
      highlights: 'Pendidikan S1 Sistem Informasi (Semester 5, IPK Unggul), Pengalaman 8+ bulan digital marketing & promosi komersil di Solo Raya, keahlian komunikasi & negosiasi persuasif, menguasai media sosial (Instagram, TikTok, Facebook Ads), memiliki kendaraan pribadi & SIM C aktif, berdomisili Solo Raya, berorientasi target.',
      contactEmail: 'hrd@wijayakreativ.com',
      contactPhone: '',
      contactLink: ''
    },
    {
      id: 'beauthinc-sosial-media',
      title: 'Lamaran Sosial Media Spesialis & Content Strategy',
      company: 'beauthinc',
      position: 'Sosial Media Spesialis',
      location: 'Surakarta / Solo Raya',
      recipient: 'Yth. Tim Rekrutmen & Manajemen beauthinc',
      source: 'Poster Pengumuman Lowongan Kerja Resmi (We Are Hiring)',
      date: '2026-10-26',
      badge: 'Siap Dikirim / Tersinkronisasi',
      badgeClass: 'badge-active',
      desc: 'Lamaran Sosial Media Spesialis berfokus pada content planning, copywriting tren kecantikan & skincare, editing video promosi (CapCut), serta analisis metrik engagement audiens.',
      highlights: 'Pria, usia 19 tahun, kreatif & up to date tren digital, berpengalaman mengelola media sosial Instagram & TikTok, memahami content planning, copywriting persuasif & tren kecantikan/skincare, keahlian analisis insight & engagement, Juara 2 Nasional Video Reels Kreatif (SobiFest) & Juara 1 LKS Desain Grafis.',
      contactEmail: '',
      contactPhone: '082195667706',
      contactLink: ''
    },
    {
      id: 'seventh-education-saintek',
      title: 'Lamaran Tentor Tetap Saintek (SMP & SMA)',
      company: 'Seventh Education',
      position: 'Tentor Tetap Saintek (SMP & SMA)',
      location: 'Cabang Teras, Soloraya',
      recipient: 'Yth. Tim HRD & Manajemen Seventh Education (Cabang Teras, Soloraya)',
      source: 'Poster Resmi Rekrutmen Tentor (We Are Hiring Tentor Tetap Saintek Soloraya)',
      date: '2026-10-26',
      badge: 'Batas Pendaftaran: 26 Okt 2026',
      badgeClass: 'badge-active',
      desc: 'Pengajuan posisi Tentor Tetap Saintek (Matematika, IPA & SNBT-UTBK) dengan keunggulan penalaran logika, integritas akademis IPK unggul, dan rekam jejak kepemimpinan mahasiswa.',
      highlights: 'Pendidikan S1 Sistem Informasi UBSI Solo (IPK Unggul & Beasiswa BJU), kompetensi kuat Matematika, Logika, IPA, dan Penalaran SNBT-UTBK, pengalaman narasumber workshop teknologi & Ketua Umum HIMSI UBSI Solo, komunikatif, sabar, berjiwa pendidik, siap penempatan Cabang Teras.',
      contactEmail: '',
      contactPhone: '085641804150',
      contactLink: 'https://linkr.bio/seventheducation'
    },
    {
      id: 'googlasses-content-creator',
      title: 'Lamaran Content Creator Full Time (Eyewear Brand)',
      company: 'googlasses Surakarta',
      position: 'Content Creator (Full Time)',
      location: 'Jl. Melon Raya No.51, Karangasem, Laweyan, Surakarta',
      recipient: 'Yth. Tim Rekrutmen & Manajemen googlasses Surakarta',
      source: 'Pengumuman Lowongan Kerja Resmi (Requirements Content Creator Full Time)',
      date: '2026-10-26',
      badge: 'Siap Dikirim / Tersinkronisasi',
      badgeClass: 'badge-active',
      desc: 'Lamaran Content Creator full-time untuk produksi foto/video produk kacamata, storytelling visual, editing CapCut & Photoshop, serta kolaborasi tim di Laweyan Surakarta.',
      highlights: 'Kreatif & update tren medsos, terampil produksi foto & video produk eyewear/fashion, menguasai editing CapCut, Photoshop, Canva, memahami visual storytelling, siap kerja full-time mandiri/tim, berkas lengkap (CV ATS, Portofolio, Foto Non Formal, KTP, Transkrip Akademik).',
      contactEmail: 'googlassessoc@gmail.com',
      contactPhone: '',
      contactLink: ''
    },
    {
      id: 'cilily-collection-creator',
      title: 'Lamaran Content Creator Fashion & OOTD',
      company: 'Cilily Collection',
      position: 'Content Creator',
      location: 'Solo / Surakarta',
      recipient: 'Yth. Tim HRD & Manajemen Cilily Collection',
      source: 'Poster Rekrutmen Resmi (We\'re Hiring Content Creator)',
      date: '2026-10-26',
      badge: 'Siap Dikirim / Tersinkronisasi',
      badgeClass: 'badge-active',
      desc: 'Aplikasi Content Creator busana wanita berfokus pada konten harian OOTD, try-on, mix & match, daily video shooting & CapCut editing, dan manajemen viral reels/TikTok.',
      highlights: 'Paham tren TikTok & IG Reels viral, produksi foto/video OOTD harian, shooting & editing CapCut dinamis, sense fashion & storytelling kuat, rapi, konsisten on-time upload, pengalaman fashion branding (Volution Apparel).',
      contactEmail: 'adm.cililycollection@gmail.com',
      contactPhone: '085179979027',
      contactLink: ''
    },
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

  // Archive Applied Status Management (localStorage)
  const APPLIED_STORAGE_KEY = 'fahrel_applied_archive_ids_v1';
  let currentArchiveFilter = 'all';

  // Default applied items: all previous 8 applications are marked as applied
  const DEFAULT_APPLIED_IDS = [
    'wijaya-kreativ-marketing',
    'beauthinc-sosial-media',
    'seventh-education-saintek',
    'googlasses-content-creator',
    'cilily-collection-creator',
    'kai-daop-6',
    'tanjung-mulia-sqa',
    'brida-surakarta'
  ];

  function getAppliedArchiveIds() {
    try {
      const saved = localStorage.getItem(APPLIED_STORAGE_KEY);
      if (saved !== null) {
        return JSON.parse(saved);
      }
      // First run: save default applied IDs
      localStorage.setItem(APPLIED_STORAGE_KEY, JSON.stringify(DEFAULT_APPLIED_IDS));
      return [...DEFAULT_APPLIED_IDS];
    } catch (e) {
      console.warn('Failed reading applied archive IDs:', e);
      return [...DEFAULT_APPLIED_IDS];
    }
  }

  function setAppliedArchiveIds(ids) {
    try {
      localStorage.setItem(APPLIED_STORAGE_KEY, JSON.stringify(ids));
    } catch (e) {
      console.warn('Failed saving applied archive IDs:', e);
    }
  }

  function toggleAppliedStatus(archiveId) {
    const appliedIds = getAppliedArchiveIds();
    const index = appliedIds.indexOf(archiveId);
    let isNowApplied = false;

    if (index > -1) {
      appliedIds.splice(index, 1);
      isNowApplied = false;
    } else {
      appliedIds.push(archiveId);
      isNowApplied = true;
    }

    setAppliedArchiveIds(appliedIds);
    renderArchive();
    showToast(isNowApplied ? 'Status diubah: Sudah Dilamar! (Tersimpan)' : 'Status diubah: Belum Dilamar (Draft)');
  }

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
    const appliedIds = getAppliedArchiveIds();

    const pendingCount = allArchives.filter(a => !appliedIds.includes(a.id)).length;
    const appliedCount = allArchives.filter(a => appliedIds.includes(a.id)).length;

    // Update badge counters
    if (archiveCountBadge) archiveCountBadge.textContent = allArchives.length;
    const countAllEl = document.getElementById('countAll');
    const countPendingEl = document.getElementById('countPending');
    const countAppliedEl = document.getElementById('countApplied');
    if (countAllEl) countAllEl.textContent = allArchives.length;
    if (countPendingEl) countPendingEl.textContent = pendingCount;
    if (countAppliedEl) countAppliedEl.textContent = appliedCount;

    // Filter cards based on currentArchiveFilter
    const filteredArchives = allArchives.filter(item => {
      const isApplied = appliedIds.includes(item.id);
      if (currentArchiveFilter === 'pending') return !isApplied;
      if (currentArchiveFilter === 'applied') return isApplied;
      return true; // 'all'
    });

    archiveGrid.innerHTML = '';

    if (filteredArchives.length === 0) {
      archiveGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: #fff; border-radius: 12px; border: 1px dashed #cbd5e1;">
          <i class="fa-solid fa-inbox" style="font-size: 2.5rem; color: #94a3b8; margin-bottom: 12px;"></i>
          <h3 style="color: #475569; font-size: 1.1rem; font-weight: 700;">Tidak ada lamaran pada kategori ini</h3>
          <p style="color: #64748b; font-size: 0.85rem;">Gunakan filter lain atau buat lamaran baru.</p>
        </div>
      `;
      return;
    }

    filteredArchives.forEach((item) => {
      const isApplied = appliedIds.includes(item.id);
      const isCustom = !DEFAULT_ARCHIVES.some(d => d.id === item.id);

      const card = document.createElement('div');
      card.className = `archive-card ${isApplied ? 'card-applied' : 'card-pending'}`;
      card.setAttribute('data-id', item.id);

      card.innerHTML = `
        <div class="archive-header">
          <div class="archive-status-toggle" data-id="${item.id}" title="Klik untuk mengubah status: Sudah Dilamar / Belum Dilamar">
            <input type="checkbox" class="archive-checkbox" id="chk-${item.id}" ${isApplied ? 'checked' : ''} />
            <label for="chk-${item.id}" class="archive-status-label ${isApplied ? 'status-applied' : 'status-pending'}">
              <i class="fa-solid ${isApplied ? 'fa-circle-check' : 'fa-hourglass-half'}"></i>
              <span>${isApplied ? 'Sudah Dilamar' : 'Belum Dilamar'}</span>
            </label>
          </div>
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
            <button class="btn btn-outline-dark btn-load-archive" data-id="${item.id}" title="Muat ke Editor A4 & Kirim">
              <i class="fa-solid fa-folder-open"></i> Buka Surat
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

    // Attach checklist status toggle handlers
    document.querySelectorAll('.archive-status-toggle').forEach(toggleEl => {
      toggleEl.addEventListener('click', (e) => {
        e.preventDefault();
        const id = toggleEl.getAttribute('data-id');
        toggleAppliedStatus(id);
      });
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

  // Filter Buttons Binding
  const archiveFilterBtns = document.querySelectorAll('.archive-filter-btn');
  archiveFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      archiveFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentArchiveFilter = btn.getAttribute('data-filter') || 'all';
      renderArchive();
    });
  });

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

    renderArchive();
    showToast('Surat lamaran berhasil disimpan ke Arsip Pribadi!');
  });

  // Initial archive render & badge count
  renderArchive();

  // ===================================================================
  // 9. SEND APPLICATION DISPATCH HUB (EMAIL, WHATSAPP, PORTAL KARIR)
  // ===================================================================
  function buildCoverEmailText(position, company) {
    const pos = position.toLowerCase();
    const comp = company.toLowerCase();

    if (comp.includes('honda') || comp.includes('ramayana')) {
      return `Yth. Tim HRD & Manajemen Dealer Honda Ramayana Mojosongo,
Jl. Mayor Achmadi No. 8, Mojosongo, Jebres, Surakarta

Perkenalkan saya Muhammad Fahrel Yuliyanto, pelamar untuk posisi Marketing Eksekutif di Dealer Honda Ramayana Mojosongo.

Sesuai informasi lowongan kerja resmi Dealer Honda Ramayana Mojosongo (One HEART), melalui email ini saya bermaksud mengajukan lamaran pekerjaan untuk posisi Marketing Eksekutif. Saya adalah profesional muda berusia 19 tahun, berpenampilan rapi, sopan, serta memiliki kemampuan komunikasi interpersonal yang persuasif. Saya memiliki pengalaman lebih dari 8 bulan dalam promosi komersial dan digital marketing di Solo Raya (Meta Ads, Instagram, TikTok), serta memiliki kendaraan pribadi dan SIM C aktif untuk mendukung mobilitas tinggi dalam menjangkau calon konsumen dan mencapai target penjualan unit Honda.

Sebagai bahan pertimbangan Bapak/Ibu, bersama email ini saya lampirkan:
1. Surat Lamaran Pekerjaan Resmi
2. Curriculum Vitae (CV ATS Standar Industri)
3. Salinan Transkrip Nilai Akademik Terkini (IPK Unggul UBSI Solo)
4. Salinan Surat Izin Mengemudi (SIM C Aktif) & KTP
5. Portofolio Digital Marketing & Promosi Komersial di Solo Raya
6. Tautan Portofolio Proyek Interaktif: https://fhrelz.github.io/portfolio-3d-celestial/

Besar harapan saya untuk diberikan kesempatan menghadiri sesi wawancara langsung guna mendiskusikan rencana kontribusi penjualan yang dapat saya berikan demi memajukan Dealer Honda Ramayana. Atas perhatian dan kesempatan yang diberikan, saya mengucapkan terima kasih.

Hormat saya,
Muhammad Fahrel Yuliyanto
Telepon / WhatsApp: +62 889-8526-6525
Surel (Email): muhmmadfahrel@gmail.com
Alamat: Krendowahono RT 02 / RW 01, Gondangrejo, Karanganyar, Jawa Tengah`;
    }

    if (comp.includes('analis') || pos.includes('talent acquisition')) {
      return `Yth. HR & Talent Acquisition Management PT. Analis Teknologi Consula,
Jl. Raya Grogol No.2, Dusun II, Grogol, Sukoharjo, Jawa Tengah

Perkenalkan saya Muhammad Fahrel Yuliyanto, mahasiswa S1 Sistem Informasi Universitas Bina Sarana Informatika (UBSI) Solo (Penerima Beasiswa Prestasi BJU, IPK Unggul).

Menindaklanjuti informasi lowongan pekerjaan resmi (We're Hiring Talent Acquisition), melalui email ini saya bermaksud mengajukan lamaran pekerjaan untuk posisi Talent Acquisition di PT. Analis Teknologi Consula. Memiliki pemahaman teknis dalam dunia IT serta pengalaman kepemimpinan sebagai Ketua Umum Himpunan Mahasiswa Sistem Informasi (HIMSI) UBSI Solo dalam mengoordinasikan talent scouting, skrining profil, serta wawancara kandidat, saya memiliki keunggulan kompetitif dalam merekrut talenta teknologi berkualitas. Saya juga mahir dalam administrasi pengelolaan data kandidat menggunakan Google Suites dan MS Office secara rapi dan terstruktur.

Bersama email ini saya lampirkan kelengkapan berkas resmi:
1. Surat Lamaran Pekerjaan Resmi
2. Curriculum Vitae (CV Format ATS Standar Industri)
3. Salinan Transkrip Nilai Akademik Terkini (IPK Unggul & Beasiswa BJU)
4. Salinan Sertifikat Kompetensi Profesi BNSP (Database Administrator)
5. Salinan SK & Sertifikat Kepengurusan Ketua Umum HIMSI Solo
6. Tautan Portofolio Interaktif: https://fhrelz.github.io/portfolio-3d-celestial/

Besar harapan saya untuk diberikan kesempatan mengikuti tahapan seleksi dan wawancara di PT. Analis Teknologi Consula. Terima kasih atas perhatian dan kesempatan berharga yang Bapak/Ibu berikan.

Hormat saya,
Muhammad Fahrel Yuliyanto
Telepon / WhatsApp: +62 889-8526-6525
Surel (Email): muhmmadfahrel@gmail.com`;
    }

    if (comp.includes('kertabhumi')) {
      return `Yth. Tim Rekrutmen & Engineering PT. Kertabhumi,

Perkenalkan saya Muhammad Fahrel Yuliyanto, mahasiswa semester 5 S1 Sistem Informasi UBSI Solo (Penerima Beasiswa Prestasi BJU, IPK Unggul).

Berdasarkan pengumuman lowongan kerja resmi (Web Developer PT. Kertabhumi dengan batas akhir 31 Oktober 2026), melalui email ini saya mengajukan diri untuk posisi Web Developer. Saya memiliki kompetensi dalam pengembangan frontend modern menggunakan React, HTML, CSS, JavaScript, pengembangan backend dengan framework Laravel dan CodeIgniter terintegrasi RESTful API, serta administrasi basis data MySQL bersertifikasi BNSP (No. Reg: DMS.1241.00995 2026). Platform web yang saya rancang telah meraih Medali Perak pada Pekan Inovasi Nasional Mercu Buana dan tercatat memiliki Hak Cipta resmi Kemenkumham RI. Berdomisili di Solo Raya, saya siap bekerja secara mandiri maupun berkolaborasi tim.

Bersama email ini saya lampirkan dokumen pendukung resmi:
1. Surat Lamaran Pekerjaan Resmi
2. Curriculum Vitae (CV ATS Standar Rekayasa Web)
3. Salinan Transkrip Nilai Akademik Terkini (IPK Unggul)
4. Salinan Sertifikasi Profesi BNSP Database Administrator
5. Salinan Surat Pencatatan Hak Cipta Platform Web (HKI Kemenkumham RI)
6. Tautan Portofolio Proyek Interaktif: https://fhrelz.github.io/portfolio-3d-celestial/

Besar harapan saya untuk diberikan kesempatan menghadiri tahapan wawancara teknis. Terima kasih atas waktu dan perhatian Bapak/Ibu.

Hormat saya,
Muhammad Fahrel Yuliyanto
Telepon / WhatsApp: +62 889-8526-6525
Surel (Email): muhmmadfahrel@gmail.com`;
    }

    if (comp.includes('optimal') || pos.includes('divisi komputer')) {
      return `Yth. Pimpinan & Manajemen OPTIMAL Sragen,
Jl. Sukowati No. 171 Sragen Kulon, Sragen

Perkenalkan saya Muhammad Fahrel Yuliyanto, putra daerah asli Sragen (lahir Sragen, 22 Juli 2007), pria muslim yang taat menjalankan sholat 5 waktu, amanah, dan berdisiplin tinggi.

Melalui email ini, saya bermaksud mengajukan lamaran pekerjaan untuk posisi Divisi Komputer di OPTIMAL Sragen sesuai pengumuman lowongan kerja resmi. Saya memiliki penguasaan mahir dalam pengoperasian komputer dan paket Microsoft Office (Word, Excel, PowerPoint), aplikasi desain grafis, pengetikan dokumen cepat, penjilidan, serta operasional digital printing dan fotokopi. Karakter saya yang teliti, cekatan, dan ramah memastikan pelayanan optimal dan prima bagi pelanggan di Sragen Kulon.

Sebagai bahan pertimbangan, bersama ini saya lampirkan:
1. Surat Lamaran Pekerjaan Resmi
2. Curriculum Vitae (CV Format ATS Standar)
3. Salinan Ijazah Formal & Transkrip Akademik Terkini
4. Salinan Kartu Tanda Penduduk (KTP Asli Domisili Sragen)
5. Salinan Sertifikat Kompetensi Profesi BNSP Komputer & Basis Data
6. Pas Foto Formal Terbaru

Besar harapan saya untuk diberikan kesempatan wawancara dan bergabung di OPTIMAL Sragen. Terima kasih atas perhatian Bapak/Ibu.

Hormat saya,
Muhammad Fahrel Yuliyanto
Telepon / WhatsApp: +62 889-8526-6525
Surel (Email): muhmmadfahrel@gmail.com`;
    }

    if (comp.includes('googlasses')) {
      return `Yth. Tim Rekrutmen & Manajemen googlasses Surakarta,
Jl. Melon Raya No. 51, Karangasem, Laweyan, Surakarta

Perkenalkan saya Muhammad Fahrel Yuliyanto, pelamar posisi Content Creator (Full Time) di googlasses Surakarta.

Menindaklanjuti pengumuman lowongan kerja resmi (Requirements Content Creator Full Time), melalui email ini saya bermaksud mengajukan lamaran pekerjaan untuk posisi Content Creator (Full Time). Saya memiliki keahlian mendalam dalam fotografi dan videografi produk, storytelling visual, serta penguasaan perangkat lunak editing CapCut, Adobe Photoshop, Lightroom, dan Canva. Saya juga merupakan Juara 2 Tingkat Nasional Video Reels Kreatif (SobiFest) dan siap bekerja secara penuh waktu baik secara mandiri maupun berkolaborasi tim di Surakarta.

Sesuai dengan ketentuan lampiran berkas yang dipersyaratkan pada poster, bersama email ini saya lampirkan:
1. Surat Lamaran Pekerjaan Resmi
2. Curriculum Vitae (CV Format ATS Standar Industri)
3. Portofolio Kreatif (Fotografi & Videografi Produk Eyewear)
4. Foto Diri Non Formal Terbaru
5. Salinan Kartu Tanda Penduduk (KTP)
6. Salinan Transkrip Nilai Akademik Terkini (IPK Unggul UBSI Solo)
7. Tautan Portofolio Proyek Interaktif: https://fhrelz.github.io/portfolio-3d-celestial/

Besar harapan saya untuk diberikan kesempatan menghadiri sesi wawancara guna memaparkan portofolio serta ide kreasi konten yang dapat saya sumbangkan demi pertumbuhan brand googlasses. Atas perhatian dan kesempatan yang diberikan, saya sampaikan terima kasih.

Hormat saya,
Muhammad Fahrel Yuliyanto
Telepon / WhatsApp: +62 889-8526-6525
Surel (Email): muhmmadfahrel@gmail.com
Alamat: Krendowahono RT 02 / RW 01, Gondangrejo, Karanganyar, Jawa Tengah`;
    }

    if (comp.includes('cilily')) {
      return `Yth. Tim HRD & Manajemen Cilily Collection,

Perkenalkan saya Muhammad Fahrel Yuliyanto, pelamar untuk posisi Content Creator di Cilily Collection.

Berdasarkan informasi rekrutmen resmi (We're Hiring Content Creator) yang saya dapatkan, saya bermaksud mengajukan diri untuk bergabung sebagai Content Creator busana wanita di Cilily Collection. Saya memiliki pemahaman kuat tentang tren video TikTok dan Instagram Reels yang sedang viral, terampil memproduksi konten Outfit of the Day (OOTD), try-on, serta mix and match dengan editing CapCut yang dinamis, konsisten, dan berorientasi pada peningkatan engagement audiens.

Bersama email ini saya turut melampirkan berkas kelengkapan administrasi:
1. Surat Lamaran Pekerjaan Resmi
2. Curriculum Vitae (CV Format Standar ATS)
3. Portofolio Video Kreatif Fesyen & Editing CapCut
4. Salinan Transkrip Nilai Akademik Terkini
5. Piagam Penghargaan Juara 2 Nasional Video Reels Kreatif (SobiFest) & Juara 1 LKS Desain
6. Tautan Portofolio Proyek Interaktif: https://fhrelz.github.io/portfolio-3d-celestial/

Besar harapan saya untuk diberikan kesempatan mengikuti tahapan seleksi berikutnya. Atas perhatian Bapak/Ibu, saya mengucapkan terima kasih.

Hormat saya,
MUHAMMAD FAHREL YULIYANTO
Telepon / WhatsApp: +62 889-8526-6525
Surel (Email): muhmmadfahrel@gmail.com`;
    }

    if (comp.includes('wijaya') || (pos.includes('marketing') && pos.includes('komersil'))) {
      return `Yth. Tim HRD & Manajemen Rekrutmen Wijaya Kreativ Group,

Perkenalkan saya Muhammad Fahrel Yuliyanto, mahasiswa S1 Sistem Informasi UBSI Solo (IPK Unggul & Beasiswa BJU).

Melalui email ini, saya mengajukan lamaran pekerjaan untuk posisi Marketing Komersil di Wijaya Kreativ Group sesuai informasi lowongan kerja resmi (Open Recruitment Marketing Komersil Solo Raya). Berbekal pengalaman lebih dari 8 bulan di bidang digital marketing dan promosi berbayar (Meta Ads - Facebook & Instagram), kemampuan komunikasi dan negosiasi persuasif, kepemilikan kendaraan pribadi dan SIM C aktif, domisili di Solo Raya, serta sikap berorientasi target dan jujur, saya siap berkontribusi aktif dalam akselerasi penjualan di Wijaya Kreativ Group.

Sebagai bahan pertimbangan Bapak/Ibu, saya lampirkan:
1. Surat Lamaran Pekerjaan Resmi
2. Curriculum Vitae (CV Format ATS Standar Industri)
3. Portofolio Digital Marketing & Promosi Media Sosial
4. Salinan Surat Izin Mengemudi (SIM C Aktif)
5. Salinan Transkrip Nilai Akademik (IPK Unggul)
6. Tautan Portofolio Proyek Interaktif: https://fhrelz.github.io/portfolio-3d-celestial/

Besar harapan saya untuk diberikan kesempatan mengikuti sesi wawancara. Terima kasih banyak atas waktu dan perhatian Bapak/Ibu.

Hormat saya,
Muhammad Fahrel Yuliyanto
Telepon / WhatsApp: +62 889-8526-6525
Surel (Email): muhmmadfahrel@gmail.com`;
    }

    if (comp.includes('seventh') || pos.includes('tentor')) {
      return `Yth. Tim HRD & Manajemen Seventh Education,

Perkenalkan saya Muhammad Fahrel Yuliyanto, mahasiswa S1 Sistem Informasi Universitas Bina Sarana Informatika (UBSI) Solo (Penerima Beasiswa Prestasi BJU, IPK Unggul).

Melalui email ini, saya bermaksud mengajukan lamaran pekerjaan untuk posisi Tentor Tetap Saintek (SMP & SMA) di Seventh Education penempatan Cabang Teras, Soloraya. Didukung penguasaan kuat dalam bidang Matematika, logika analitis, dan sains untuk pembekalan ujian sekolah serta persiapan SNBT-UTBK, serta pengalaman memimpin organisasi sebagai Ketua Umum HIMSI UBSI Solo, saya memiliki dedikasi, kesabaran mengajar, dan keterampilan komunikasi edukatif yang ramah bagi siswa.

Bersama ini saya lampirkan berkas pendukung resmi:
1. Surat Lamaran Pekerjaan Resmi
2. Curriculum Vitae (CV ATS Standar Akademik & Industri)
3. Salinan Transkrip Nilai Akademik (IPK Unggul & Penerima Beasiswa BJU)
4. Salinan Sertifikat Kompetensi Profesi BNSP
5. Salinan KTP & Dokumen Kualifikasi Pendukung
6. Tautan Portofolio Interaktif: https://fhrelz.github.io/portfolio-3d-celestial/

Besar harapan saya untuk diberikan kesempatan mengikuti tahapan seleksi dan wawancara di Seventh Education. Terima kasih atas perhatian dan kesempatan berharga Bapak/Ibu.

Hormat saya,
Muhammad Fahrel Yuliyanto
Telepon / WhatsApp: +62 889-8526-6525
Surel (Email): muhmmadfahrel@gmail.com`;
    }

    // Default Email text
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
    const pos = position.toLowerCase();
    const comp = company.toLowerCase();

    if (comp.includes('dewi sri') || (pos.includes('kreator') && comp.includes('dewi'))) {
      return `*Muhammad Fahrel Yuliyanto_Konten Kreator*

Selamat Pagi/Siang Pimpinan & Tim HRD Dewi Sri Solo,

Perkenalkan saya *Muhammad Fahrel Yuliyanto*, pelamar posisi Konten Kreator di Dewi Sri Solo (penempatan Tohudan, Colomadu, Karanganyar).

Menindaklanjuti poster lowongan kerja resmi Konten Kreator Dewi Sri Solo, melalui WhatsApp ini saya bermaksud mengajukan lamaran pekerjaan. Bertempat tinggal dekat di Karanganyar, saya memiliki rekam jejak aktif dalam produksi konten video kreatif promosi (CapCut & Canva), didukung prestasi sebagai *Juara 2 Tingkat Nasional Video Reels Kreatif (SobiFest)* dan *Juara 1 LKS Desain Grafis*. Saya terbiasa menyusun ide konten, copywriting, produksi video harian, serta memahami algoritma engagement media sosial (Instagram & TikTok).

Sebagai bahan pertimbangan, berkas CV ATS dan Portofolio interaktif saya dapat diakses langsung pada:
🔗 Portofolio: https://fhrelz.github.io/portfolio-3d-celestial/
📄 CV Format ATS: https://fhrelz.github.io/portfolio-3d-celestial/cv-ats.html

Besar harapan saya untuk diberikan kesempatan wawancara dan berdiskusi lebih lanjut. Terima kasih atas perhatian dan waktu Bapak/Ibu.

Hormat saya,
*Muhammad Fahrel Yuliyanto*
Telepon / WA: +62 889-8526-6525
Email: muhmmadfahrel@gmail.com`;
    }

    if (comp.includes('optimal') || pos.includes('divisi komputer')) {
      return `*Muhammad Fahrel Yuliyanto_Divisi Komputer*

Selamat Pagi/Siang Pimpinan & Tim Manajemen OPTIMAL Sragen,

Perkenalkan saya *Muhammad Fahrel Yuliyanto*, putra daerah asli Sragen (lahir di Sragen, 22 Juli 2007), pria muslim (sholat 5 waktu), amanah, dan berdisiplin tinggi.

Menanggapi informasi lowongan kerja resmi (We Are Hiring Divisi Komputer) di OPTIMAL Sragen Jl. Sukowati No. 171 Sragen Kulon, melalui WhatsApp ini saya bermaksud mengirimkan berkas lamaran pekerjaan. Saya memiliki kemahiran dalam operasional komputer, Microsoft Office (Word, Excel, PowerPoint), pengetikan cepat, desain dokumen, serta layanan digital printing dan fotokopi.

Tautan portofolio dan profil lengkap saya dapat diakses melalui:
🔗 Portofolio: https://fhrelz.github.io/portfolio-3d-celestial/
📄 CV Format ATS: https://fhrelz.github.io/portfolio-3d-celestial/cv-ats.html

Besar harapan saya untuk dapat bergabung dan melayani pelanggan di OPTIMAL Sragen. Terima kasih banyak atas waktu dan perhatian Bapak/Ibu.

Hormat saya,
*Muhammad Fahrel Yuliyanto*
Telepon / WA: +62 889-8526-6525
Email: muhmmadfahrel@gmail.com`;
    }

    if (comp.includes('beauthinc') || pos.includes('sosial media spesialis')) {
      return `*Muhammad Fahrel Yuliyanto_Sosial Media Spesialis*

Selamat Pagi/Siang Tim HRD & Rekrutmen beauthinc,

Perkenalkan saya *Muhammad Fahrel Yuliyanto*, mahasiswa S1 Sistem Informasi UBSI Solo (Penerima Beasiswa Prestasi BJU, IPK Unggul).

Sesuai informasi rekrutmen resmi (We Are Hiring Sosial Media Spesialis), melalui pesan WhatsApp ini saya bermaksud mengirimkan berkas lamaran pekerjaan untuk posisi *Sosial Media Spesialis* di *beauthinc*.

Saya memiliki pengalaman nyata dalam content planning, copywriting persuasif tren kecantikan/skincare, editing video promosi (CapCut & Canva), serta analisis insight dan engagement audiens di Instagram dan TikTok.

Sebagai bahan pertimbangan Bapak/Ibu, berkas Curriculum Vitae (CV ATS) dan Portofolio Kreatif telah saya siapkan. Portofolio interaktif proyek dan karya saya dapat diakses langsung melalui:
🔗 https://fhrelz.github.io/portfolio-3d-celestial/
📄 CV Online ATS: https://fhrelz.github.io/portfolio-3d-celestial/cv-ats.html

Besar harapan saya untuk dapat berdiskusi lebih lanjut pada tahapan seleksi berikutnya. Terima kasih banyak atas perhatian dan waktu berharga yang Bapak/Ibu berikan.

Hormat saya,
*Muhammad Fahrel Yuliyanto*
Telepon / WhatsApp: +62 889-8526-6525
Email: muhmmadfahrel@gmail.com`;
    }

    if (comp.includes('cilily')) {
      return `*MUHAMMAD FAHREL YULIYANTO_CONTENT CREATOR*

Selamat Pagi/Siang Tim HRD Cilily Collection,

Perkenalkan saya *Muhammad Fahrel Yuliyanto*, pelamar posisi Content Creator di Cilily Collection.

Melalui pesan ini, saya bermaksud mengirimkan berkas lamaran pekerjaan untuk posisi *Content Creator* sesuai poster rekrutmen resmi Cilily Collection. Saya memiliki pemahaman tren TikTok & IG Reels viral, terampil memproduksi video fashion OOTD, try-on, mix & match harian, mahir editing video CapCut dinamis, rapi, serta konsisten on-time upload.

Sebagai bahan pertimbangan, berkas CV ATS dan Portofolio Kreatif saya dapat diakses langsung pada:
🔗 https://fhrelz.github.io/portfolio-3d-celestial/
📄 Format CV ATS: https://fhrelz.github.io/portfolio-3d-celestial/cv-ats.html

Besar harapan saya untuk diberikan kesempatan wawancara. Terima kasih banyak atas perhatian Bapak/Ibu.

Hormat saya,
*MUHAMMAD FAHREL YULIYANTO*
Telepon / WA: +62 889-8526-6525
Email: muhmmadfahrel@gmail.com`;
    }

    if (comp.includes('seventh') || pos.includes('tentor')) {
      return `Selamat Pagi/Siang Kak Indi / Kak Vidi & Tim HRD Seventh Education,

Perkenalkan saya *Muhammad Fahrel Yuliyanto*, mahasiswa S1 Sistem Informasi UBSI Solo (Penerima Beasiswa Prestasi BJU, IPK Unggul).

Sehubungan dengan dibukanya lowongan *Tentor Tetap Saintek (SMP & SMA)* penempatan Soloraya (Cabang Teras) dengan batas akhir 26 Oktober 2026, melalui pesan ini saya bermaksud mengonfirmasi pengajuan lamaran pekerjaan dan pengisian data diri saya.

Saya memiliki kompetensi kuat dalam bidang Matematika, logika, dan sains analitis untuk pembekalan ujian serta persiapan SNBT-UTBK siswa SMP & SMA. Pengalaman kepemimpinan saya sebagai Ketua Umum HIMSI UBSI Solo dan pemateri workshop melatih kesabaran, integritas moral, serta komunikasi edukatif yang mudah dipahami siswa.

Tautan portofolio dan profil lengkap saya dapat diakses melalui:
🔗 https://fhrelz.github.io/portfolio-3d-celestial/
📄 CV Format ATS: https://fhrelz.github.io/portfolio-3d-celestial/cv-ats.html

Besar harapan saya untuk dapat bergabung dan berkontribusi sebagai Tentor Tetap Saintek di Seventh Education Cabang Teras. Terima kasih atas perhatian dan kesempatan berharga yang diberikan.

Hormat saya,
*Muhammad Fahrel Yuliyanto*
Telepon / WhatsApp: +62 889-8526-6525
Email: muhmmadfahrel@gmail.com`;
    }

    return `Selamat Pagi/Siang Bapak/Ibu HRD ${company},

Perkenalkan saya *Muhammad Fahrel Yuliyanto*, mahasiswa S1 Sistem Informasi UBSI Solo (Penerima Beasiswa Prestasi BJU, IPK Unggul).

Saya bermaksud mengirimkan berkas lamaran pekerjaan untuk posisi *${position}* di *${company}* berdasarkan informasi lowongan kerja yang tertera pada poster/flyer loker.

Sebagai bahan pertimbangan Bapak/Ibu, berkas resmi Surat Lamaran Pekerjaan dan CV Format ATS telah saya siapkan. Portofolio interaktif proyek, sertifikasi BNSP, dan pengakuan HKI Kemenkumham saya dapat diakses langsung melalui tautan:
🔗 https://fhrelz.github.io/portfolio-3d-celestial/
📄 Format CV ATS: https://fhrelz.github.io/portfolio-3d-celestial/cv-ats.html

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
      const comp = company.toLowerCase();
      const pos = position.toLowerCase();
      const email = inpContactEmail ? inpContactEmail.value.trim() : '';
      const phone = inpContactPhone ? inpContactPhone.value.trim() : '';
      const link = inpContactLink ? inpContactLink.value.trim() : '';

      modalEmailTarget.value = email;

      // Subject rules per employer requirements
      if (comp.includes('honda') || comp.includes('ramayana')) {
        modalEmailSubject.value = 'Marketing Eksekutif-Muhammad Fahrel Yuliyanto';
      } else if (comp.includes('analis') || comp.includes('consula')) {
        modalEmailSubject.value = 'Muhammad Fahrel Yuliyanto_Talent Acquisition';
      } else if (comp.includes('kertabhumi')) {
        modalEmailSubject.value = 'Lamaran Web Developer – Muhammad Fahrel Yuliyanto';
      } else if (comp.includes('optimal') || pos.includes('divisi komputer')) {
        modalEmailSubject.value = 'Lamaran Pekerjaan – Divisi Komputer – Muhammad Fahrel Yuliyanto';
      } else {
        modalEmailSubject.value = `Lamaran Pekerjaan – ${position} – Muhammad Fahrel Yuliyanto`;
      }
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

