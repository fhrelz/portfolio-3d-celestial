"""
Script Otomatisasi Pengiriman Lamaran Pekerjaan via Gmail SMTP
Muhammad Fahrel Yuliyanto — Portfolio & Career Automation

Perhatian Keamanan Akun Google:
Google mewajibkan 'Sandi Aplikasi' (App Password 16 digit) untuk pengiriman via script SMTP,
bukan password utama akun Google Anda (demi keamanan 2FA).
Cara membuat Sandi Aplikasi:
1. Buka https://myaccount.google.com/security
2. Pastikan 'Verifikasi 2 Langkah' aktif.
3. Masuk ke menu 'Sandi Aplikasi' (App Passwords).
4. Buat sandi aplikasi baru (misal nama: 'Portal Lamaran').
5. Gunakan 16 karakter yang diberikan ke dalam variabel GMAIL_APP_PASSWORD di bawah ini.
"""

import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

GMAIL_USER = 'muhmmadfahrel@gmail.com'
# Masukkan 16 karakter Sandi Aplikasi (App Password) Google:
GMAIL_PASSWORD = os.environ.get('GMAIL_APP_PASSWORD', '')

ATTACHMENT_FILE = r'CV ATS Muhammad Fahrel Yuliyanto_2Mb.pdf'

APPLICATIONS = [
    {
        'company': 'Dealer Honda Ramayana Mojosongo',
        'position': 'Marketing Eksekutif',
        'recipient_email': 'hrd.rmygrup@gmail.com',
        'subject': 'Marketing Eksekutif-Muhammad Fahrel Yuliyanto',
        'body': """Yth. Tim HRD & Manajemen Dealer Honda Ramayana Mojosongo,
Jl. Mayor Achmadi No. 8, Mojosongo, Jebres, Surakarta

Perkenalkan saya Muhammad Fahrel Yuliyanto, pelamar untuk posisi Marketing Eksekutif di Dealer Honda Ramayana Mojosongo.

Sesuai informasi lowongan kerja resmi Dealer Honda Ramayana Mojosongo (One HEART), melalui email ini saya bermaksud mengajukan lamaran pekerjaan untuk posisi Marketing Eksekutif. Saya adalah profesional muda berusia 19 tahun, berpenampilan rapi, sopan, serta memiliki kemampuan komunikasi interpersonal yang persuasif. Saya memiliki pengalaman lebih dari 8 bulan dalam promosi komersial dan digital marketing di Solo Raya (Meta Ads, Instagram, TikTok), serta memiliki kendaraan pribadi dan SIM C aktif untuk mendukung mobilitas tinggi dalam menjangkau calon konsumen dan mencapai target penjualan unit Honda.

Sebagai bahan pertimbangan Bapak/Ibu, bersama email ini saya lampirkan:
1. Curriculum Vitae (CV ATS Standar Industri) - Terlampir dalam file PDF
2. Portofolio Proyek Interaktif: https://fhrelz.github.io/portfolio-3d-celestial/
3. Format CV ATS Online: https://fhrelz.github.io/portfolio-3d-celestial/cv-ats.html
4. Salinan Transkrip Nilai Akademik Terkini (IPK Unggul UBSI Solo)
5. Salinan Surat Izin Mengemudi (SIM C Aktif) & KTP
6. Portofolio Digital Marketing & Promosi Komersial di Solo Raya

Besar harapan saya untuk diberikan kesempatan menghadiri sesi wawancara langsung guna mendiskusikan rencana kontribusi penjualan yang dapat saya berikan demi memajukan Dealer Honda Ramayana. Atas perhatian dan kesempatan yang diberikan, saya mengucapkan terima kasih.

Hormat saya,
Muhammad Fahrel Yuliyanto
Telepon / WhatsApp: +62 889-8526-6525
Surel (Email): muhmmadfahrel@gmail.com
Alamat: Krendowahono RT 02 / RW 01, Gondangrejo, Karanganyar, Jawa Tengah"""
    },
    {
        'company': 'PT. Analis Teknologi Consula',
        'position': 'Talent Acquisition',
        'recipient_email': 'hr@analisteknologiconsula.com',
        'subject': 'Muhammad Fahrel Yuliyanto_Talent Acquisition',
        'body': """Yth. HR & Talent Acquisition Management PT. Analis Teknologi Consula,
Jl. Raya Grogol No.2, Dusun II, Grogol, Sukoharjo, Jawa Tengah

Perkenalkan saya Muhammad Fahrel Yuliyanto, mahasiswa S1 Sistem Informasi Universitas Bina Sarana Informatika (UBSI) Solo (Penerima Beasiswa Prestasi BJU, IPK Unggul).

Menindaklanjuti informasi lowongan pekerjaan resmi (We're Hiring Talent Acquisition), melalui email ini saya bermaksud mengajukan lamaran pekerjaan untuk posisi Talent Acquisition di PT. Analis Teknologi Consula. Memiliki pemahaman teknis dalam dunia IT serta pengalaman kepemimpinan sebagai Ketua Umum Himpunan Mahasiswa Sistem Informasi (HIMSI) UBSI Solo dalam mengoordinasikan talent scouting, skrining profil, serta wawancara kandidat, saya memiliki keunggulan kompetitif dalam merekrut talenta teknologi berkualitas. Saya juga mahir dalam administrasi pengelolaan data kandidat menggunakan Google Suites dan MS Office secara rapi dan terstruktur.

Bersama email ini saya lampirkan kelengkapan berkas resmi:
1. Curriculum Vitae (CV ATS Standar Industri) - Terlampir dalam file PDF
2. Portofolio Proyek Interaktif: https://fhrelz.github.io/portfolio-3d-celestial/
3. Format CV ATS Online: https://fhrelz.github.io/portfolio-3d-celestial/cv-ats.html
4. Salinan Transkrip Nilai Akademik Terkini (IPK Unggul & Beasiswa BJU)
5. Salinan Sertifikat Kompetensi Profesi BNSP (Database Administrator)
6. Salinan SK & Sertifikat Kepengurusan Ketua Umum HIMSI Solo

Besar harapan saya untuk diberikan kesempatan mengikuti tahapan seleksi dan wawancara di PT. Analis Teknologi Consula. Terima kasih atas perhatian dan kesempatan berharga yang Bapak/Ibu berikan.

Hormat saya,
Muhammad Fahrel Yuliyanto
Telepon / WhatsApp: +62 889-8526-6525
Surel (Email): muhmmadfahrel@gmail.com"""
    },
    {
        'company': 'PT. Kertabhumi',
        'position': 'Web Developer',
        'recipient_email': 'karir.bwi@gmail.com',
        'subject': 'Lamaran Web Developer – Muhammad Fahrel Yuliyanto',
        'body': """Yth. Tim Rekrutmen & Engineering PT. Kertabhumi,

Perkenalkan saya Muhammad Fahrel Yuliyanto, mahasiswa semester 5 S1 Sistem Informasi UBSI Solo (Penerima Beasiswa Prestasi BJU, IPK Unggul).

Berdasarkan pengumuman lowongan kerja resmi (Web Developer PT. Kertabhumi dengan batas akhir 31 Oktober 2026), melalui email ini saya mengajukan diri untuk posisi Web Developer. Saya memiliki kompetensi dalam pengembangan frontend modern menggunakan React, HTML, CSS, JavaScript, pengembangan backend dengan framework Laravel dan CodeIgniter terintegrasi RESTful API, serta administrasi basis data MySQL bersertifikasi BNSP (No. Reg: DMS.1241.00995 2026). Platform web yang saya rancang telah meraih Medali Perak pada Pekan Inovasi Nasional Mercu Buana dan tercatat memiliki Hak Cipta resmi Kemenkumham RI. Berdomisili di Solo Raya, saya siap bekerja secara mandiri maupun berkolaborasi tim.

Bersama email ini saya lampirkan dokumen pendukung resmi:
1. Curriculum Vitae (CV ATS Standar Rekayasa Web) - Terlampir dalam file PDF
2. Portofolio Proyek Interaktif: https://fhrelz.github.io/portfolio-3d-celestial/
3. Format CV ATS Online: https://fhrelz.github.io/portfolio-3d-celestial/cv-ats.html
4. Salinan Transkrip Nilai Akademik Terkini (IPK Unggul)
5. Salinan Sertifikasi Profesi BNSP Database Administrator
6. Salinan Surat Pencatatan Hak Cipta Platform Web (HKI Kemenkumham RI)

Besar harapan saya untuk diberikan kesempatan menghadiri tahapan wawancara teknis. Terima kasih atas waktu dan perhatian Bapak/Ibu.

Hormat saya,
Muhammad Fahrel Yuliyanto
Telepon / WhatsApp: +62 889-8526-6525
Surel (Email): muhmmadfahrel@gmail.com"""
    },
    {
        'company': 'OPTIMAL Sragen',
        'position': 'Divisi Komputer',
        'recipient_email': 'Optimalcopierdigital@gmail.com',
        'subject': 'Lamaran Pekerjaan – Divisi Komputer – Muhammad Fahrel Yuliyanto',
        'body': """Yth. Pimpinan & Manajemen OPTIMAL Sragen,
Jl. Sukowati No. 171 Sragen Kulon, Sragen

Perkenalkan saya Muhammad Fahrel Yuliyanto, putra daerah asli Sragen (lahir Sragen, 22 Juli 2007), pria muslim yang taat menjalankan sholat 5 waktu, amanah, dan berdisiplin tinggi.

Melalui email ini, saya bermaksud mengajukan lamaran pekerjaan untuk posisi Divisi Komputer di OPTIMAL Sragen sesuai pengumuman lowongan kerja resmi. Saya memiliki penguasaan mahir dalam pengoperasian komputer dan paket Microsoft Office (Word, Excel, PowerPoint), aplikasi desain grafis, pengetikan dokumen cepat, penjilidan, serta operasional digital printing dan fotokopi. Karakter saya yang teliti, cekatan, dan ramah memastikan pelayanan optimal dan prima bagi pelanggan di Sragen Kulon.

Sebagai bahan pertimbangan, bersama ini saya lampirkan:
1. Curriculum Vitae (CV Format ATS Standar) - Terlampir dalam file PDF
2. Portofolio Proyek Interaktif: https://fhrelz.github.io/portfolio-3d-celestial/
3. Format CV ATS Online: https://fhrelz.github.io/portfolio-3d-celestial/cv-ats.html
4. Salinan Ijazah Formal & Transkrip Akademik Terkini
5. Salinan Kartu Tanda Penduduk (KTP Asli Domisili Sragen)
6. Salinan Sertifikat Kompetensi Profesi BNSP Komputer & Basis Data

Besar harapan saya untuk diberikan kesempatan wawancara dan bergabung di OPTIMAL Sragen. Terima kasih atas perhatian Bapak/Ibu.

Hormat saya,
Muhammad Fahrel Yuliyanto
Telepon / WhatsApp: +62 889-8526-6525
Surel (Email): muhmmadfahrel@gmail.com"""
    },
    {
        'company': 'Wijaya Kreativ Group',
        'position': 'Marketing Komersil',
        'recipient_email': 'hrd@wijayakreativ.com',
        'subject': 'Lamaran Pekerjaan – Marketing Komersil – Muhammad Fahrel Yuliyanto',
        'body': """Yth. Tim HRD & Manajemen Rekrutmen Wijaya Kreativ Group,

Perkenalkan saya Muhammad Fahrel Yuliyanto, mahasiswa S1 Sistem Informasi Universitas Bina Sarana Informatika (UBSI) Solo (Penerima Beasiswa Prestasi BJU, IPK Unggul).

Melalui email ini, saya mengajukan lamaran pekerjaan untuk posisi Marketing Komersil di Wijaya Kreativ Group sesuai informasi lowongan kerja resmi (Open Recruitment Marketing Komersil Solo Raya). Berbekal pengalaman lebih dari 8 bulan di bidang digital marketing dan promosi berbayar (Meta Ads - Facebook & Instagram), kemampuan komunikasi dan negosiasi persuasif, kepemilikan kendaraan pribadi dan SIM C aktif, domisili di Solo Raya, serta sikap berorientasi target dan jujur, saya siap berkontribusi aktif dalam akselerasi penjualan di Wijaya Kreativ Group.

Sebagai bahan pertimbangan Bapak/Ibu, bersama email ini saya lampirkan:
1. Curriculum Vitae (CV Format ATS Standar Industri) - Terlampir dalam file PDF
2. Portofolio Proyek Interaktif 3D: https://fhrelz.github.io/portfolio-3d-celestial/
3. Format CV ATS Online: https://fhrelz.github.io/portfolio-3d-celestial/cv-ats.html
4. Salinan Transkrip Nilai Akademik (IPK Unggul)
5. Salinan Surat Izin Mengemudi (SIM C Aktif) & Berkas Pendukung

Besar harapan saya untuk diberikan kesempatan mengikuti sesi wawancara guna mendiskusikan kualifikasi saya secara lebih komprehensif. Terima kasih banyak atas waktu dan perhatian berharga Bapak/Ibu.

Hormat saya,
Muhammad Fahrel Yuliyanto
Telepon / WhatsApp: +62 889-8526-6525
Surel (Email): muhmmadfahrel@gmail.com
Alamat: Krendowahono RT 02 / RW 01, Gondangrejo, Karanganyar, Jawa Tengah"""
    },
    {
        'company': 'googlasses Surakarta',
        'position': 'Content Creator (Full Time)',
        'recipient_email': 'googlassessoc@gmail.com',
        'subject': 'Lamaran Pekerjaan – Content Creator (Full Time) – Muhammad Fahrel Yuliyanto',
        'body': """Yth. Tim Rekrutmen & Manajemen googlasses Surakarta,
Jl. Melon Raya No. 51, Karangasem, Laweyan, Surakarta

Perkenalkan saya Muhammad Fahrel Yuliyanto, pelamar posisi Content Creator (Full Time) di googlasses Surakarta.

Menindaklanjuti pengumuman lowongan kerja resmi (Requirements Content Creator Full Time), melalui email ini saya bermaksud mengajukan lamaran pekerjaan untuk posisi Content Creator (Full Time). Saya memiliki keahlian mendalam dalam fotografi dan videografi produk, visual storytelling, serta penguasaan perangkat lunak editing CapCut, Adobe Photoshop, Lightroom, dan Canva. Saya juga merupakan Juara 2 Tingkat Nasional Video Reels Kreatif (SobiFest) dan siap bekerja secara penuh waktu baik secara mandiri maupun berkolaborasi tim di Surakarta.

Sesuai dengan ketentuan lampiran berkas yang dipersyaratkan pada poster, bersama email ini saya lampirkan:
1. Curriculum Vitae (CV Format ATS Standar Industri) - Terlampir dalam file PDF
2. Portofolio Proyek Interaktif: https://fhrelz.github.io/portfolio-3d-celestial/
3. Format CV ATS Online: https://fhrelz.github.io/portfolio-3d-celestial/cv-ats.html
4. Portofolio Kreatif Fotografi & Videografi Produk Eyewear
5. Foto Diri Non Formal Terbaru
6. Salinan Kartu Tanda Penduduk (KTP) & Transkrip Akademik Terkini

Besar harapan saya untuk diberikan kesempatan menghadiri sesi wawancara guna memaparkan portofolio serta ide kreasi konten yang dapat saya sumbangkan demi pertumbuhan brand googlasses. Atas perhatian dan kesempatan yang diberikan, saya sampaikan terima kasih.

Hormat saya,
Muhammad Fahrel Yuliyanto
Telepon / WhatsApp: +62 889-8526-6525
Surel (Email): muhmmadfahrel@gmail.com
Alamat: Krendowahono RT 02 / RW 01, Gondangrejo, Karanganyar, Jawa Tengah"""
    },
    {
        'company': 'Cilily Collection',
        'position': 'Content Creator',
        'recipient_email': 'adm.cililycollection@gmail.com',
        'subject': 'MUHAMMAD FAHREL YULIYANTO_CONTENT CREATOR',
        'body': """Yth. Tim HRD & Manajemen Cilily Collection,

Perkenalkan saya Muhammad Fahrel Yuliyanto, pelamar untuk posisi Content Creator di Cilily Collection.

Berdasarkan informasi rekrutmen resmi (We're Hiring Content Creator) yang saya dapatkan, saya bermaksud mengajukan diri untuk bergabung sebagai Content Creator busana wanita di Cilily Collection. Saya memiliki pemahaman kuat tentang tren video TikTok dan Instagram Reels yang sedang viral, terampil memproduksi konten Outfit of the Day (OOTD), try-on, serta mix and match dengan editing CapCut yang dinamis, konsisten, dan berorientasi pada peningkatan engagement audiens.

Bersama email ini saya turut melampirkan berkas kelengkapan administrasi:
1. Curriculum Vitae (CV Format Standar ATS) - Terlampir dalam file PDF
2. Tautan Portofolio Proyek Interaktif: https://fhrelz.github.io/portfolio-3d-celestial/
3. Format CV ATS Online: https://fhrelz.github.io/portfolio-3d-celestial/cv-ats.html
4. Portofolio Video Kreatif Fesyen & Editing CapCut
5. Salinan Transkrip Nilai Akademik Terkini & Piagam Penghargaan Nasional

Besar harapan saya untuk diberikan kesempatan mengikuti tahapan seleksi berikutnya. Atas perhatian Bapak/Ibu, saya mengucapkan terima kasih.

Hormat saya,
MUHAMMAD FAHREL YULIYANTO
Telepon / WhatsApp: +62 889-8526-6525
Surel (Email): muhmmadfahrel@gmail.com"""
    }
]

def send_all_applications():
    print("=" * 60)
    print("DISPATCH HUB LAMARAN PEKERJAAN — MUHAMMAD FAHREL YULIYANTO")
    print(f"Akun Pengirim: {GMAIL_USER}")
    print("=" * 60)

    # Validasi attachment
    has_attachment = os.path.exists(ATTACHMENT_FILE)
    if has_attachment:
        print(f"[OK] File lampiran ditemukan: {ATTACHMENT_FILE}")
    else:
        print(f"[PERINGATAN] File {ATTACHMENT_FILE} tidak ditemukan, email akan dikirim tanpa lampiran PDF.")

    success_count = 0
    fail_count = 0

    try:
        print("\nMenghubungkan ke server Gmail SMTP...")
        # Coba port SSL 465
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465, timeout=15)
        server.login(GMAIL_USER, GMAIL_PASSWORD)
        print("[BERHASIL] Otentikasi Gmail berhasil!\n")

        for app in APPLICATIONS:
            print(f"Mengirim lamaran ke {app['company']} ({app['recipient_email']})...")
            
            msg = MIMEMultipart()
            msg['From'] = f"Muhammad Fahrel Yuliyanto <{GMAIL_USER}>"
            msg['To'] = app['recipient_email']
            msg['Subject'] = app['subject']
            
            msg.attach(MIMEText(app['body'], 'plain', 'utf-8'))
            
            if has_attachment:
                with open(ATTACHMENT_FILE, 'rb') as f:
                    part = MIMEBase('application', 'pdf')
                    part.set_payload(f.read())
                    encoders.encode_base64(part)
                    part.add_header('Content-Disposition', f'attachment; filename="{os.path.basename(ATTACHMENT_FILE)}"')
                    msg.attach(part)
            
            server.send_message(msg)
            print(f"  -> [SUKSES TERKIRIM] ke {app['recipient_email']}!")
            success_count += 1

        server.quit()

    except smtplib.SMTPAuthenticationError as e:
        print("\n[GAGAL OTENTIKASI GMAIL]")
        print("Google menolak login password utama demi keamanan (2FA aktif).")
        print("Silakan gunakan 'Sandi Aplikasi' (16 digit) dari Google Account Anda.")
        print(f"Pesan error: {e}")
        fail_count = len(APPLICATIONS)
    except Exception as e:
        print(f"\n[GAGAL KONEKSI]: {type(e).__name__} - {e}")
        fail_count = len(APPLICATIONS)

    print("\n" + "=" * 60)
    print(f"Hasil Pengiriman: {success_count} Sukses, {fail_count} Gagal")
    print("=" * 60)

if __name__ == '__main__':
    send_all_applications()
