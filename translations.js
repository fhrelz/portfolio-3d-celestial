const translations = {
  id: {
    // Toolbar & Brand
    toolbar_brand: "CV Studio (Format ATS Standard & Calibri Font)",
    brand_badge: "Calibri • ATS Compliant",
    theme_mono: "🖤 Classic ATS (Hitam Putih / Monochrome)",
    theme_light: "🎨 Soft Blue (Executive)",
    theme_emerald: "🌿 Executive Emerald",
    theme_dark: "🌙 Dark Mode",
    btn_print: "Cetak / Save PDF",

    // Sidebar Headings & Contact
    sidebar_contact: "KONTAK",
    sidebar_email: "EMAIL",
    sidebar_phone: "TELEPON",
    sidebar_location: "LOKASI",
    location_val: "Krendowahono, Gondangrejo, Karanganyar, Jawa Tengah",
    sidebar_linkedin: "LINKEDIN",
    sidebar_portfolio: "PORTOFOLIO",
    sidebar_social: "SOCIAL MEDIA",

    // Sidebar Education
    sidebar_education: "PENDIDIKAN",
    edu1_degree: "S1 Sistem Informasi",
    edu1_school: "Universitas Bina Sarana Informatika (UBSI)",
    edu1_period: "Sep 2024 – 2028 (Semester 5)",
    edu1_bullet1: "Penerima Beasiswa Jalur Undangan (BJU) UBSI",
    edu1_bullet2: "Ketua Umum HIMSI UBSI Solo",
    edu2_degree: "SMK Wihdatul Ummah",
    edu2_major: "Jurusan Multimedia",
    edu2_period: "2021 – 2024",
    edu2_bullet1: "Lulusan Terbaik Jurusan Multimedia",
    edu2_bullet2: "Juara 1 LKS Graphic Design Technology",

    // Sidebar Certifications
    sidebar_cert: "SERTIFIKASI & LISENSI",
    cert1_title: "Sertifikat BNSP — Database Administrator",
    cert1_sub: "LSP UBSI / BNSP",
    cert2_title: "Sertifikat Kompetensi SQA",
    cert2_sub: "PT Tanjung Mulia Informatika (2026)",
    cert2_pred: "Predikat: Pemula Baik",
    cert3_title: "Pemakalah Seminar INOVATIF 2026",
    cert3_sub: "UBSI & APTIKOM DKI Jakarta",

    // Sidebar Skills & Tools
    sidebar_skills: "SKILL TEKNIS",
    skill_cat_ai: "Keahlian AI & Generative AI:",
    skill_cat_web: "Mobile & Web Dev:",
    skill_cat_creative: "Digital Marketing & Creative:",
    sidebar_tools: "TOOLS & PLATFORM AI",
    sidebar_soft: "SOFT SKILL",
    soft_lead: "Kepemimpinan Organisasi",
    soft_public: "Public Speaking & Presentasi",
    soft_pm: "Project Management",
    soft_strat: "Strategic Planning",
    soft_prob: "Problem Solving",
    sidebar_lang: "BAHASA",
    lang_id_text: "Bahasa Indonesia: Aktif / Native",
    lang_en_text: "Bahasa Inggris: Pasif / Elementary",

    // Main Header
    main_name: "MUHAMMAD FAHREL YULIYANTO",
    main_tagline: "Mahasiswa Sistem Informasi • Fullstack Developer • Digital Marketing & Content Strategist",

    // Section Headers
    sec_profile: "PROFIL",
    profile_text: `Mahasiswa Sistem Informasi semester 5 di Universitas Bina Sarana Informatika (UBSI) dengan spesialisasi Mobile App & Web Development (Flutter, Dart, Laravel), Database Administration, Software Quality Assurance, Generative AI (Gemini, Google AI Studio, ChatGPT, Claude), dan Digital Marketing. Memiliki rekam jejak teruji dalam merancang ekosistem sistem informasi berbasis AI, Gamifikasi, dan Web, dibuktikan dengan pengakuan <strong>3 Hak Kekayaan Intelektual (HKI) resmi Kemenkumham</strong> (Platform MBG SPPG Surakarta, Smart Waste Management AI Kota Bersih Surakarta, & Web Official Desa Baran Klaten). Peraih Medal Silver (Silver Award) Pekan Inovasi Nasional Vol.3 2026 Universitas Mercu Buana, Diterima Magang di PT KAI (Persero) DAOP 6 Yogyakarta (Unit Sistem Informasi), dan Alumni BSI Explore 2026 (Lolos seleksi >2.000 peserta). Berpengalaman sebagai Pemateri Workshop AI/Content Creation, Narasumber Kampus, Ketua Umum HIMSI, serta praktisi Meta Ads dan kreator konten berprestasi tingkat nasional (Juara 2 SobiFest & Juara 1 LKS Desain Grafis).`,

    sec_projects: "RISET, INOVASI & PROYEK UNGGULAN",
    
    // Project 1: Desa Baran
    p1_title: "Lead Web Developer — Website Official Desa Baran Cawas Klaten",
    p1_sub: "Program BSI Explore 2026 — Pengabdian Masyarakat & Digitalisasi Desa",
    p1_period: "Agustus 2026",
    p1_b1: "Merancang dan merilis sistem informasi berbasis web untuk Website Official Desa Baran Klaten guna mendukung transparansi informasi publik, pelayanan digital warga, dan perwujudan visi-misi desa. <strong>Seluruh pemrograman sistem informasi web ini dikembangkan secara tunggal oleh Muhammad Fahrel Yuliyanto dalam kurun waktu 1 minggu</strong>, dengan penyusunan arsitektur basis data dibantu oleh Ilman Chairi & Zahra Salsabila Afifah.",
    p1_b2: "<strong>Pencapaian:</strong> Memperoleh Hak Cipta/HKI Resmi Kemenkumham RI (No. 001442180 / EC002026153831 - Agustus 2026).",
    p1_b3: "<strong>Akses Web Desa:</strong>",

    // Project 2: MBG
    p2_title: "Ketua Tim & Fullstack Developer — Web Platform Manajemen MBG SPPG",
    p2_sub: "Pekan Inovasi Nasional Vol.3 2026 (Universitas Mercu Buana) & SPPG Nusukan Surakarta",
    p2_period: "Mei 2026 – Juli 2026",
    p2_b1: "Merancang platform digitalisasi Program Makan Bergizi Gratis (MBG) berbasis GIS, integrasi data stok bahan baku real-time, monitoring gizi AKG, dan transparansi laporan anggaran publik.",
    p2_b2: "<strong>Pencapaian:</strong> Memperoleh Medal Silver (Silver Award) Tingkat Nasional pada Pekan Inovasi Nasional Vol.3 2026 di Universitas Mercu Buana serta Hak Cipta/HKI Resmi Kemenkumham RI (No. EC002026096415).",
    p2_b3: "<strong>Akses Web MBG:</strong>",

    // Project 3: Kota Bersih
    p3_title: "Ketua Tim & Fullstack Developer — Kota Bersih Surakarta (Smart Waste Management AI)",
    p3_sub: "Kompetensi Riset Perguruan Tinggi 2026 — BRIDA Surakarta & UBSI Innovation Hub",
    p3_period: "Februari 2026 – Juni 2026",
    p3_b1: "Memimpin pembuatan platform pengolahan sampah cerdas berbasis AI Assistant (Google Gemini/AI Studio) dan pemetaan operasional real-time untuk transparansi pelayanan publik Surakarta.",
    p3_b2: "<strong>Pencapaian:</strong> Memperoleh Hak Cipta/HKI Resmi Kemenkumham (No. EC002026053217), Sertifikat Penghargaan BRIDA Kota Surakarta (No. B/500.10.30.6/778.14), serta diliput pada UBSI Solo News.",
    p3_b3: "<strong>Akses Web:</strong>",

    // Project 4: ZeloDrive
    p4_title: "Developer & Founder — ZeloDrive (Aplikasi Gamifikasi & AI Learning)",
    p4_sub: "Proyek Mandiri & Ekosistem Edukasi Cerdas",
    p4_period: "2025 – 2026",
    p4_b1: "Merancang dan merilis aplikasi Android/Web interaktif berbasis gamifikasi dan Generative AI (Gemini/ChatGPT API) untuk membantu siswa sekolah, persiapan SNBT, dan Ujian Mandiri Perguruan Tinggi.",
    p4_b2: "<strong>Pencapaian:</strong> Berhasil mengintegrasikan pendekatan psikologi gamifikasi dengan asisten AI interaktif untuk pembelajaran mandiri yang variatif dan menyenangkan.",

    // Project 5: Rumah IT
    p5_title: "Ketua Tim & Developer — Rumah IT (Game-Based Learning)",
    p5_sub: "Universitas Bina Sarana Informatika",
    p5_period: "2025 – 2026",
    p5_b1: "Mengembangkan ekosistem edukasi interaktif berbasis Game-Based Learning (GBL) dan Generative AI untuk pembelajaran coding pemula.",
    p5_b2: "<strong>Pencapaian:</strong> Dipublikasikan sebagai Pemakalah Seminar Nasional INOVATIF 2026 dan didemonstrasikan langsung saat Kunjungan Studi SMP Insan Cendekia Al-Mujtaba Boarding School (21 April 2026).",
    p5_b3: "<strong>Akses Web:</strong>",

    // Experience Section
    sec_experience: "PENGALAMAN KERJA & FREELANCE",
    
    // Exp 1: PT KAI
    exp1_title: "Junior Web Developer & IT Systems Intern",
    exp1_sub: "PT Kereta Api Indonesia (Persero) DAOP 6 Yogyakarta — Unit Sistem Informasi",
    exp1_period: "13 September 2026 – 13 November 2026",
    exp1_b1: "<strong>Kontribusi & Output:</strong> Diterima melalui seleksi pendaftaran InternHub KAI untuk penempatan pada Unit Sistem Informasi. Berkontribusi dalam membantu analisis kebutuhan sistem, pengembangan modul aplikasi web/mobile, pemeliharaan basis data (PostgreSQL/SQL), pengujian perangkat lunak (SQA Testing), serta penyusunan dokumentasi teknis sistem informasi operasional DAOP 6 Yogyakarta.",
    exp1_b2: "<strong>Tools Digunakan:</strong> Laravel, Flutter, Dart, PostgreSQL, REST API, SQA Testing, Figma.",

    // Exp 2: Volution
    exp2_title: "Digital Marketing Specialist & Content Creator",
    exp2_sub: "Volution Apparel",
    exp2_period: "Mei 2024 – Oktober 2024 (6 Bulan)",
    exp2_b1: "<strong>Kontribusi & Output:</strong> Merancang strategi materi promosi visual (Instagram & TikTok) untuk brand fashion, mengoptimalkan tata letak katalog produk, serta mengelola campaign Meta Ads yang meningkatkan brand awareness dan angka keterlibatan audiens (engagement rate).",
    exp2_b2: "<strong>Tools Digunakan:</strong> Meta Ads Manager, Adobe Illustrator, Canva, CapCut.",

    // Exp 3: Mataram Laundry
    exp3_title: "Digital Marketing Specialist & Content Creator",
    exp3_sub: "Mataram Laundry",
    exp3_period: "November 2024 – Juni 2025 (8 Bulan)",
    exp3_b1: "<strong>Kontribusi & Output:</strong> Mengelola pemasaran digital layanan laundry profesional, merancang iklan lokal Meta Ads terintegrasi, dan memproduksi video promosi kreatif yang berhasil menaikkan rasio konversi pemesanan dan jangkauan pelanggan UMKM.",
    exp3_b2: "<strong>Tools Digunakan:</strong> Meta Ads Manager, CapCut, Copywriting.",

    // Exp 4: PT Tanur
    exp4_title: "Digital Marketing Specialist & Content Creator",
    exp4_sub: "PT Tanur Muthmainnah Tour",
    exp4_period: "Juli 2025 – September 2025 (3 Bulan)",
    exp4_b1: "<strong>Kontribusi & Output:</strong> Memformulasi materi edukasi dan promosi paket travel/umrah, mengoptimalkan penulisan copywriting penawaran, serta mengelola publikasi konten promosi harian untuk meningkatkan kepercayaan dan calon jamaah.",
    exp4_b2: "<strong>Tools Digunakan:</strong> Adobe Illustrator, Copywriting, Social Media Analytics.",

    // Exp 5: BUMDes
    exp5_title: "Staff Produksi & Kreatif (Magang)",
    exp5_sub: "BUMDes Selomukti Digital Printing",
    exp5_period: "Januari 2023 – April 2023 (4 Bulan)",
    exp5_b1: "<strong>Kontribusi & Output:</strong> Mengoperasikan mesin cetak digital dan pemrosesan finishing dengan akurasi presisi tinggi, serta mendokumentasikan produk dan mengelola konten promosi harian media sosial BUMDes.",

    // Section Organization
    sec_org: "ORGANISASI & KEPEMIMPINAN",
    org1_title: "Ketua Umum (President)",
    org1_sub: "Himpunan Mahasiswa Sistem Informasi (HIMSI) UBSI Kampus Solo",
    org1_period: "Januari 2026 – Sekarang",
    org1_b1: "Memimpin arah strategis organisasi, mengawasi seluruh program kerja, dan mengelola hubungan dengan pimpinan universitas serta mitra eksternal.",
    org1_b2: "Mengelola koordinasi tim internal dan menjalin kemitraan dengan pihak universitas serta mitra eksternal untuk penyelenggaraan kegiatan kemahasiswaan.",

    org2_title: "Ketua Divisi Komunikasi & Informasi (Kominfo)",
    org2_sub: "Himpunan Mahasiswa Sistem Informasi (HIMSI) UBSI Kampus Solo",
    org2_period: "Januari 2025 – Desember 2025",
    org2_b1: "Mengomandoi tim media publikasi, mengelola branding media sosial himpunan, dan meningkatkan pertumbuhan reach konten harian.",
    org2_b2: "Meningkatkan visibilitas kegiatan himpunan melalui strategi konten yang konsisten dan informatif.",

    // Section Speaker & Service
    sec_speaker: "PEMATERI, NARASUMBER & PENGABDIAN",
    spk1_title: "Ketua Kelompok (Team Leader) & Tim Pengabdi — Program BSI Explore 2026 (05 – 21 Agustus 2026):",
    spk1_desc: `Lolos seleksi ketat nasional (>2.000 peserta, 200+ mahasiswa terpilih). Memimpin tim 6 mahasiswa dalam kegiatan pengabdian masyarakat & sekolah selama 21 hari di Desa Baran (9 Dukuh) & SDN 2 Baran, Kec. Cawas, Kab. Klaten:
    <br>• <strong>Edukasi Sekolah (SDN 2 Baran):</strong> Mengajar interaktif berbasis Game-Based Learning & Smart TV, memfasilitasi Pojok Baca, menggelar Lomba 17-an, serta sosialisasi web pembuat game interaktif bagi guru.
    <br>• <strong>Digitalisasi UMKM Desa:</strong> Memimpin digitalisasi UMKM gratis (desain banner usaha, pendaftaran QRIS digital, pembuatan lokasi Google Maps, dan produksi konten promosi media sosial).
    <br>• <strong>Inovasi Website Desa:</strong> Dikembangkan sepenuhnya oleh <strong>Muhammad Fahrel Yuliyanto</strong> dalam kurun waktu 1 minggu (pemrograman web tunggal) untuk Website Official Desa Baran Klaten (<a href="https://desabaranklaten.site.je" target="_blank" style="color: var(--primary)">desabaranklaten.site.je</a>) yang telah memperoleh Sertifikat Hak Cipta (HKI) Kemenkumham RI.`,

    spk2_title: `Pemateri / Speaker — Workshop Digital Kreatif "AI Video Creation":`,
    spk2_desc: `DICO & SMK Wihdatul Ummah Surakarta (22 Juli 2026). Membawakan materi "Menciptakan Konten Berkualitas dengan Cepat Menggunakan AI (Gemini & CapCut AI)" di hadapan para siswa dan tenaga pendidik.`,

    spk3_title: `Narasumber — Seminar Parenting: "Strategi Cerdas Meraih Beasiswa Kampus":`,
    spk3_desc: `UBSI Kampus Solo (Online via Zoom - 29 April 2026). Memberikan sharing session dan testimoni motivasi penerima Beasiswa Jalur Undangan (BJU).`,

    spk4_title: `Narasumber & Mentor — Bootcamp Ramadhan 2026: "Storytelling untuk Gen-Z":`,
    spk4_desc: `Indonesia Cerdas Fest 2026 — UBSI Solo (05 Maret 2026). Mengisi sesi personal branding dan pengembangan karakter berbasis content creation.`,

    spk5_title: `Narasumber & Speaker Testimoni Beasiswa BJU:`,
    spk5_desc: `Indonesia Cerdas Fest 2025 (23 Oktober 2025) & Open House Kampus BSI Surakarta Live (28 Mei 2025).`,

    spk6_title: `Narasumber — Webinar Parent's Insight Day: Cara Tembus Beasiswa PTN & PTS:`,
    spk6_desc: `UBSI Kampus Solo (Online via Zoom - 06 Mei 2025).`,

    // Section Achievements & Patents
    sec_awards: "PRESTASI & HAK CIPTA (HKI)",
    awd1: "<strong>Hak Cipta (HKI) Resmi Kemenkumham RI:</strong> Website Official Pusat Pelayanan Masyarakat & Digitalisasi Desa Baran Cawas Klaten (No: 001442180 / EC002026153831 - Agustus 2026).",
    awd2: "<strong>Hak Cipta (HKI) Resmi Kemenkumham RI:</strong> Web System Terintegrasi Program Makan Bergizi Gratis (MBG) SPPG Nusukan (No: 001300932 / EC002026096415 - Juni 2026).",
    awd3: "<strong>Medal Silver (Perak) Tingkat Nasional — Pekan Inovasi Nasional Vol.3 2026:</strong> Universitas Mercu Buana (Karya: Web Platform Terintegrasi Program Makan Bergizi Gratis / MBG SPPG Nusukan - 2026).",
    awd4: "<strong>Lolos Seleksi Peserta Program BSI Explore 2026:</strong> Terpilih dalam seleksi pengabdian masyarakat tingkat nasional (>2.000 pendaftar, 200+ mahasiswa lolos seleksi) — Universitas BSI (Agustus 2026).",
    awd5: "<strong>Hak Cipta (HKI) Resmi Kemenkumham RI:</strong> Kota Bersih Surakarta - Platform Smart Waste Management AI (No: 001205115 / EC002026053217 - April 2026).",
    awd6: "<strong>Sertifikat Penghargaan Riset Perguruan Tinggi 2026:</strong> BRIDA Kota Surakarta (Tim Fresh Tech - April 2026).",
    awd7: "<strong>Juara 2 Tingkat Nasional Video Reels Edukasi (SobiFest 2025):</strong> Universitas BSI Jakarta.",
    awd8: "<strong>Partisipasi Lomba Video Kreatif:</strong> Fakultas Ilmu Komputer Universitas Brawijaya (2025).",
    awd9: "<strong>Juara 1 LKS Graphic Design Technology 2024:</strong> Tingkat Kabupaten Karanganyar.",
    awd10: "<strong>Penerima Beasiswa Jalur Undangan (BJU) UBSI 2024:</strong> Jalur Prestasi Akademik & Non-Akademik.",

    // Section Seminars
    sec_seminars: "PELATIHAN, WEBINAR & PENGEMBANGAN DIRI",
    sem1: `Webinar "Membangun & Mengelola Website Profesional dengan Domain & Webhosting" — UBSI Solo (26 Juni 2026).`,
    sem2: `Webinar IndoCEISS Jateng "Speak with Confidence, Influence with Impact" — IndoCEISS (22 Mei 2026).`,
    sem3: `Seminar Karir "Personal Branding & Portofolio Menuju Dunia Profesional" — HIMSI UBSI Yogyakarta (18 Nov 2025).`,
    sem4: `Pemasaran Digital dengan AI & Chat Apps untuk Wirausaha — Digital Entrepreneurship Academy (DTS Kominfo 2025).`,
    sem5: `Seminar Entrepreneurship "Wiramuda Bangkit, Merubah Peluang Menjadi Uang" — BEC UBSI (29 Okt 2024).`,
    sem6: `Seminar Acceleration of Information Technology for IT Career (2024).`
  },

  en: {
    // Toolbar & Brand
    toolbar_brand: "CV Studio (Standard ATS & Calibri Typography)",
    brand_badge: "Calibri • ATS Global Standard",
    theme_mono: "🖤 Classic ATS (Monochrome / Black & White)",
    theme_light: "🎨 Soft Blue (Executive)",
    theme_emerald: "🌿 Executive Emerald",
    theme_dark: "🌙 Dark Mode",
    btn_print: "Print / Save PDF",

    // Sidebar Headings & Contact
    sidebar_contact: "CONTACT",
    sidebar_email: "EMAIL",
    sidebar_phone: "PHONE",
    sidebar_location: "LOCATION",
    location_val: "Karanganyar, Central Java, Indonesia",
    sidebar_linkedin: "LINKEDIN",
    sidebar_portfolio: "PORTFOLIO",
    sidebar_social: "SOCIAL MEDIA",

    // Sidebar Education
    sidebar_education: "EDUCATION",
    edu1_degree: "B.S. in Information Systems",
    edu1_school: "Bina Sarana Informatika University (UBSI)",
    edu1_period: "Sep 2024 – 2028 (5th Semester)",
    edu1_bullet1: "Recipient of UBSI Academic Merit Scholarship (BJU)",
    edu1_bullet2: "President of HIMSI UBSI Solo Student Association",
    edu2_degree: "Vocational High School Wihdatul Ummah",
    edu2_major: "Multimedia Major",
    edu2_period: "2021 – 2024",
    edu2_bullet1: "Valedictorian / Best Graduate in Multimedia Major",
    edu2_bullet2: "1st Place Student Competency Competition (LKS) Graphic Design Technology",

    // Sidebar Certifications
    sidebar_cert: "CERTIFICATIONS & LICENSES",
    cert1_title: "BNSP Certified Database Administrator",
    cert1_sub: "LSP UBSI / National Professional Certification Board (BNSP)",
    cert2_title: "Software Quality Assurance (SQA) Certification",
    cert2_sub: "PT Tanjung Mulia Informatika (2026)",
    cert2_pred: "Grade: Proficient Practitioner",
    cert3_title: "National Seminar Speaker / Author INOVATIF 2026",
    cert3_sub: "UBSI & APTIKOM Jakarta",

    // Sidebar Skills & Tools
    sidebar_skills: "TECHNICAL SKILLS",
    skill_cat_ai: "AI & Generative AI Expertise:",
    skill_cat_web: "Mobile & Web Dev:",
    skill_cat_creative: "Digital Marketing & Creative:",
    sidebar_tools: "TOOLS & AI PLATFORMS",
    sidebar_soft: "SOFT SKILLS",
    soft_lead: "Organizational Leadership",
    soft_public: "Public Speaking & Presentation",
    soft_pm: "Project Management",
    soft_strat: "Strategic Planning",
    soft_prob: "Problem Solving",
    sidebar_lang: "LANGUAGES",
    lang_id_text: "Indonesian: Native / Fluent",
    lang_en_text: "English: Professional Working / Intermediate",

    // Main Header
    main_name: "MUHAMMAD FAHREL YULIYANTO",
    main_tagline: "Information Systems Student • Fullstack & Mobile Developer • AI & Digital Marketing Specialist",

    // Section Headers
    sec_profile: "PROFILE SUMMARY",
    profile_text: `5th-semester Information Systems undergraduate at Bina Sarana Informatika University (UBSI) specializing in Mobile App & Web Development (Flutter, Dart, Laravel), Database Administration, Software Quality Assurance (SQA), Generative AI (Gemini, Google AI Studio, ChatGPT, Claude), and Digital Marketing. Holds a proven track record in engineering AI-driven, gamified, and web information system ecosystems, backed by <strong>3 Official Copyrights (HKI) from the Ministry of Law and Human Rights RI</strong> (MBG SPPG Platform, Kota Bersih AI Waste Management, & Desa Baran Official Website). National Silver Medalist at Pekan Inovasi Nasional Vol.3 2026 (Mercu Buana University), accepted IT Systems Intern at PT Kereta Api Indonesia (Persero) DAOP 6 Yogyakarta, and BSI Explore 2026 Team Leader (Selected among top 200 out of 2,000+ national applicants). Experienced Workshop Speaker, HIMSI President, Meta Ads practitioner, and National Award-Winning Content Creator.`,

    sec_projects: "FEATURED RESEARCH, INNOVATION & PROJECTS",
    
    // Project 1: Desa Baran
    p1_title: "Lead Fullstack Developer — Desa Baran Official Website (Cawas, Klaten)",
    p1_sub: "BSI Explore 2026 Program — Community Service & Village Digitalization",
    p1_period: "August 2026",
    p1_b1: "Architected and deployed the official web information system for Desa Baran Klaten to support public transparency, digital citizen services, and village governance. <strong>The entire web software application was solely programmed by Muhammad Fahrel Yuliyanto within a 1-week timeline</strong>, with relational database architecture assisted by Ilman Chairi & Zahra Salsabila Afifah.",
    p1_b2: "<strong>Achievement:</strong> Granted Official Copyright (HKI) by the Ministry of Law and Human Rights RI (No. 001442180 / EC002026153831 - August 2026).",
    p1_b3: "<strong>Live Website Access:</strong>",

    // Project 2: MBG
    p2_title: "Team Lead & Fullstack Developer — MBG SPPG Management Web Platform",
    p2_sub: "Pekan Inovasi Nasional Vol.3 2026 (Mercu Buana University) & SPPG Nusukan Surakarta",
    p2_period: "May 2026 – July 2026",
    p2_b1: "Engineered a GIS-based digital web platform for the National Free Nutritious Meal Program (MBG) featuring real-time inventory tracking, nutritional RDA monitoring, and public budget transparency.",
    p2_b2: "<strong>Achievement:</strong> Won National Silver Medal at Pekan Inovasi Nasional Vol.3 2026 (Mercu Buana University) & Granted Official Copyright HKI (No. EC002026096415).",
    p2_b3: "<strong>Live Website Access:</strong>",

    // Project 3: Kota Bersih
    p3_title: "Team Lead & Fullstack Developer — Kota Bersih Surakarta (Smart Waste Management AI)",
    p3_sub: "University Research Competition 2026 — BRIDA Surakarta & UBSI Innovation Hub",
    p3_period: "February 2026 – June 2026",
    p3_b1: "Led the development of an AI-assisted smart waste management platform (Google Gemini API) with real-time operational mapping for Surakarta city public service transparency.",
    p3_b2: "<strong>Achievement:</strong> Granted Official Copyright HKI (No. EC002026053217), BRIDA Surakarta Award Certificate (No. B/500.10.30.6/778.14), and featured on UBSI News.",
    p3_b3: "<strong>Live Website Access:</strong>",

    // Project 4: ZeloDrive
    p4_title: "Developer & Founder — ZeloDrive (Gamified & AI Learning App)",
    p4_sub: "Independent Project & Smart Educational Ecosystem",
    p4_period: "2025 – 2026",
    p4_b1: "Designed and launched an interactive Android/Web application using gamification psychology and Generative AI (Gemini/ChatGPT API) to assist high school students in university entrance exam preparation.",
    p4_b2: "<strong>Achievement:</strong> Successfully integrated gamified learning mechanics with an interactive AI tutor for adaptive self-study.",

    // Project 5: Rumah IT
    p5_title: "Team Lead & Developer — Rumah IT (Game-Based Learning Platform)",
    p5_sub: "Bina Sarana Informatika University",
    p5_period: "2025 – 2026",
    p5_b1: "Developed an interactive Game-Based Learning (GBL) educational ecosystem integrated with Generative AI for novice coding education.",
    p5_b2: "<strong>Achievement:</strong> Published as Speaker/Author at National Seminar INOVATIF 2026 and demonstrated live during Insan Cendekia Boarding School study visit (April 21, 2026).",
    p5_b3: "<strong>Live Website Access:</strong>",

    // Experience Section
    sec_experience: "WORK & INTERNSHIP EXPERIENCE",
    
    // Exp 1: PT KAI
    exp1_title: "Junior Web Developer & IT Systems Intern",
    exp1_sub: "PT Kereta Api Indonesia (Persero) DAOP 6 Yogyakarta — Information Systems Unit",
    exp1_period: "Sept 13, 2026 – Nov 13, 2026",
    exp1_b1: "<strong>Contributions & Impact:</strong> Selected via KAI InternHub to serve in the Information Systems Unit. Contributes to system requirements analysis, web/mobile application module development, database maintenance (PostgreSQL/SQL), Software Quality Assurance (SQA Testing), and technical documentation for railway operational information systems.",
    exp1_b2: "<strong>Tools Used:</strong> Laravel, Flutter, Dart, PostgreSQL, REST API, SQA Testing, Figma.",

    // Exp 2: Volution
    exp2_title: "Digital Marketing Specialist & Content Creator",
    exp2_sub: "Volution Apparel",
    exp2_period: "May 2024 – Oct 2024 (6 Mos)",
    exp2_b1: "<strong>Contributions & Impact:</strong> Formulated visual promotional strategies (Instagram & TikTok) for a fashion brand, optimized product catalog layouts, and managed Meta Ads campaigns that significantly boosted brand engagement rate.",
    exp2_b2: "<strong>Tools Used:</strong> Meta Ads Manager, Adobe Illustrator, Canva, CapCut.",

    // Exp 3: Mataram Laundry
    exp3_title: "Digital Marketing Specialist & Content Creator",
    exp3_sub: "Mataram Laundry",
    exp3_period: "Nov 2024 – June 2025 (8 Mos)",
    exp3_b1: "<strong>Contributions & Impact:</strong> Directed digital marketing campaigns for a commercial laundry service, designed hyper-local Meta Ads, and produced video commercials that expanded MSME market reach and booking conversion rates.",
    exp3_b2: "<strong>Tools Used:</strong> Meta Ads Manager, CapCut, Copywriting.",

    // Exp 4: PT Tanur
    exp4_title: "Digital Marketing Specialist & Content Creator",
    exp4_sub: "PT Tanur Muthmainnah Tour",
    exp4_period: "July 2025 – Sept 2025 (3 Mos)",
    exp4_b1: "<strong>Contributions & Impact:</strong> Structured marketing copy and promo assets for travel/umrah packages, optimized sales copywriting, and scheduled daily promo media publishing to build client trust and lead generation.",
    exp4_b2: "<strong>Tools Used:</strong> Adobe Illustrator, Copywriting, Social Media Analytics.",

    // Exp 5: BUMDes
    exp5_title: "Production & Creative Staff (Intern)",
    exp5_sub: "BUMDes Selomukti Digital Printing",
    exp5_period: "Jan 2023 – April 2023 (4 Mos)",
    exp5_b1: "<strong>Contributions & Impact:</strong> Operated commercial digital printing machinery with high precision accuracy, documented finished products, and managed BUMDes daily social media promotional content.",

    // Section Organization
    sec_org: "LEADERSHIP & ORGANIZATIONAL EXPERIENCE",
    org1_title: "President / General Chairman",
    org1_sub: "Information Systems Student Association (HIMSI) UBSI Solo",
    org1_period: "Jan 2026 – Present",
    org1_b1: "Leads organizational strategic vision, supervises executive work programs, and manages relationships with university executive leadership and external industry partners.",
    org1_b2: "Directs internal committee execution and fosters strategic campus-industry partnerships for major student events.",

    org2_title: "Head of Communications & Information Division",
    org2_sub: "Information Systems Student Association (HIMSI) UBSI Solo",
    org2_period: "Jan 2025 – Dec 2025",
    org2_b1: "Spearheaded digital publication teams, managed brand identity on social media channels, and increased daily media organic reach.",
    org2_b2: "Enhanced organizational public visibility through consistent branding and strategic tech content creation.",

    // Section Speaker & Service
    sec_speaker: "PUBLIC SPEAKING, WORKSHOPS & COMMUNITY SERVICE",
    spk1_title: "Team Leader & Educator — BSI Explore 2026 Community Service Program (Aug 05 – 21, 2026):",
    spk1_desc: `Selected among top 200 out of 2,000+ national applicants. Led a team of 6 students in a 21-day community & school service program in Baran Village & SDN 2 Baran, Klaten:
    <br>• <strong>School Education (SDN 2 Baran):</strong> Delivered interactive lessons using Game-Based Learning & Smart TV, established a Reading Corner, hosted 17th August competitions, and conducted game-maker web workshops for teachers.
    <br>• <strong>MSME Digitalization:</strong> Directed free digital transformation services for local MSMEs (business banners, QRIS digital payments, Google Maps business registration, and social media content).
    <br>• <strong>Village Website Innovation:</strong> Solely programmed by <strong>Muhammad Fahrel Yuliyanto</strong> within a 1-week timeline for the Desa Baran Official Website (<a href="https://desabaranklaten.site.je" target="_blank" style="color: var(--primary)">desabaranklaten.site.je</a>), which was awarded an Official Copyright (HKI) by the Ministry of Law and Human Rights RI.`,

    spk2_title: `Keynote Speaker — Creative Digital Workshop "AI Video Creation":`,
    spk2_desc: `DICO & SMK Wihdatul Ummah Surakarta (July 22, 2026). Delivered a workshop on "Generating High-Quality Content Rapidly Using AI (Gemini & CapCut AI)" for students and faculty educators.`,

    spk3_title: `Speaker — Parenting Seminar: "Smart Strategies for College Scholarships":`,
    spk3_desc: `UBSI Kampus Solo (Online via Zoom - April 29, 2026). Shared insights and motivation as a recipient of the UBSI Merit Scholarship (BJU).`,

    spk4_title: `Speaker & Mentor — Ramadhan Bootcamp 2026: "Storytelling for Gen-Z":`,
    spk4_desc: `Indonesia Cerdas Fest 2026 — UBSI Solo (March 05, 2026). Led sessions on personal branding and digital character development.`,

    spk5_title: `Scholarship Alumni Speaker:`,
    spk5_desc: `Indonesia Cerdas Fest 2025 (Oct 23, 2025) & Open House Campus BSI Surakarta Live (May 28, 2025).`,

    spk6_title: `Speaker — Webinar Parent's Insight Day: Cracking College Scholarships:`,
    spk6_desc: `UBSI Kampus Solo (Online via Zoom - May 06, 2025).`,

    // Section Achievements & Patents
    sec_awards: "HONORS, AWARDS & OFFICIAL COPYRIGHTS (HKI)",
    awd1: "<strong>Official Copyright (HKI) Ministry of Law & Human Rights RI:</strong> Desa Baran Official Website & Digital Services Platform (No: 001442180 / EC002026153831 - August 2026).",
    awd2: "<strong>Official Copyright (HKI) Ministry of Law & Human Rights RI:</strong> Free Nutritious Meal Program (MBG) Web System (No: 001300932 / EC002026096415 - June 2026).",
    awd3: "<strong>National Silver Medalist — Pekan Inovasi Nasional Vol.3 2026:</strong> Mercu Buana University (Project: MBG SPPG GIS Web Platform - 2026).",
    awd4: "<strong>National BSI Explore 2026 Selected Participant:</strong> Selected in competitive national screening (>2,000 applicants, top 200+ selected) — BSI University (August 2026).",
    awd5: "<strong>Official Copyright (HKI) Ministry of Law & Human Rights RI:</strong> Kota Bersih Surakarta - Smart Waste Management AI Platform (No: 001205115 / EC002026053217 - April 2026).",
    awd6: "<strong>University Research Award Certificate 2026:</strong> BRIDA Surakarta City (Fresh Tech Team - April 2026).",
    awd7: "<strong>2nd Place National Educational Reels Competition (SobiFest 2025):</strong> BSI University Jakarta.",
    awd8: "<strong>National Video Competition Finalist:</strong> Faculty of Computer Science, Brawijaya University (2025).",
    awd9: "<strong>1st Place Student Competency Competition (LKS) Graphic Design Technology 2024:</strong> Karanganyar Regency.",
    awd10: "<strong>UBSI Academic Merit Scholarship Recipient (BJU) 2024:</strong> Academic & Non-Academic Achievements.",

    // Section Seminars
    sec_seminars: "TRAINING, SEMINARS & CERTIFICATIONS",
    sem1: `Webinar "Building & Managing Professional Websites with Domain & Webhosting" — UBSI Solo (June 26, 2026).`,
    sem2: `Webinar IndoCEISS "Speak with Confidence, Influence with Impact" — IndoCEISS (May 22, 2026).`,
    sem3: `Career Seminar "Personal Branding & Portfolio for Tech Professionals" — HIMSI UBSI (Nov 18, 2025).`,
    sem4: `Digital Marketing with AI & Chat Apps — Digital Entrepreneurship Academy (Kominfo DTS 2025).`,
    sem5: `Entrepreneurship Seminar "Wiramuda Bangkit, Turning Opportunities into Revenue" — BEC UBSI (Oct 29, 2024).`,
    sem6: `Seminar Acceleration of Information Technology for IT Career (2024).`
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = translations;
}
