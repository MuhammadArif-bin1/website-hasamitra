# Changelog Proyek Website PT BPR Hasamitra Jawa Barat

Semua catatan perubahan, pembaruan fitur, refaktorisasi arsitektur, dan perbaikan keamanan terdokumentasi di dalam file ini.

---

## [15 Agustus 2026] — Pembaruan Keamanan, Refaktorisasi Komponen, & Navigasi

**Pengubah / Pengembang:** Fadli  
**Tanggal:** 15 Agustus 2026  
**Status Build:** ✅ `npm run build` — 100% Pass (0 Error / 0 Warning)  
**Lingkup Pekerjaan:** Keamanan Web & Admin, Arsitektur Frontend, Navigasi Header, dan Dokumentasi.

---

### 🛡️ 1. Penguatan Keamanan Sistem (Strict Security Hardening)

Berdasarkan audit keamanan OWASP Top 10 dan standar CIS Web Application Security Benchmark:

- **Cryptographic Server-Side Math Captcha**:
  - Membuat endpoint baru `GET /api/admin/auth/captcha` yang menghasilkan soal matematika acak (`+`, `-`, `×`) dan ditandatangani menggunakan `HMAC-SHA256` oleh server.
  - Memverifikasi token captcha dan jawaban pengguna pada `POST /api/admin/auth/login` menggunakan `crypto.timingSafeEqual` dengan masa berlaku 5 menit.
  - Menutup celah bypass bot script otomatis pada form login admin.
- **CSRF & Same-Origin Header Verification**:
  - Menambahkan fungsi helper `isSameOrigin(request)` pada `src/lib/auth.ts` untuk memastikan mutasi data login dan admin hanya dapat dipanggil dari domain resmi.
- **Pencegahan CSV / Excel Formula Injection (CWE-1236)**:
  - Memperbaiki `src/app/api/admin/export/route.ts` dengan menyaring karakter pemicu formula spreadsheet (`=`, `+`, `-`, `@`, `\t`, `\r`) menggunakan prefix `'` agar tidak mengeksekusi script DDE/Macro saat dibuka di Microsoft Excel.
- **HTTP Security Headers Standar OWASP**:
  - Menambahkan konfigurasi security headers pada `next.config.ts`:
    - `X-Frame-Options: DENY` (Anti-Clickjacking).
    - `X-Content-Type-Options: nosniff` (Anti-MIME Sniffing).
    - `Referrer-Policy: strict-origin-when-cross-origin`.
    - `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
- **DoS & Payload Length Limit**:
  - Membatasi panjang string input login (`email` ≤ 150 karakter, `password` ≤ 200 karakter) untuk mencegah memory bloat dan ReDoS.
- **Dokumentasi Audit**:
  - Menyusun laporan audit keamanan lengkap di `doc/SECURITY_AUDIT.md`.

---

### 🏛️ 2. Refaktorisasi Landing Page ke Component-Based Architecture

Memecah file monolit `src/app/page.tsx` yang sebelumnya berukuran >560 baris kode menjadi modul komponen yang terstruktur, bersih, dan mudah dirawat:

- **Folder Baru:** `src/components/landingpage/`
  - `types.ts` — Interface `ProductItem` & fallback data katalog produk.
  - `HeroSection.tsx` — Section Hero dengan background ambient profil, headline, dan tombol aksi.
  - `TrustMetricsSection.tsx` — 4 kartu pilar kepercayaan (OJK, LPS Rp 2 Miliar, Kredit, Emas).
  - `ProductsSection.tsx` — Grid katalog produk perbankan dan modal trigger.
  - `PiagamSection.tsx` — Showcase piagam penghargaan resmi dengan efek zoom.
  - `DownloadHubSection.tsx` — Hub unduhan berkas PDF Kredit & formulir pendaftaran Cicil Emas.
  - `ComplianceNoticeSection.tsx` — Banner regulasi ketentuan batas penjaminan LPS & izin OJK.
  - `PiagamPreviewModal.tsx` — Modal pop-up preview dokumen piagam ukuran penuh.
  - `index.ts` — Barrel export untuk kemudahan import.
- **Hasil `src/app/page.tsx`**:
  - Ukuran kode menyusut menjadi **~115 baris**.
  - Berfokus pada state management, modal handling, dan sinkronisasi data produk real-time.
  - **100% konsisten visual**: Tidak ada perubahan layout, styling, font, maupun animasi.

---

### 🧭 3. Pembaruan Navigasi Header & Perbaikan Smooth Scrolling

- **Penambahan Menu Header**:
  - Memperbarui `src/data/navigation.ts` dan `src/components/layout/Navbar.tsx` dengan menambahkan menu:
    - **`PRODUK`** (`/#produk`)
    - **`PIAGAM`** (`/#piagam`)
    - **`FORMULIR`** (`/#formulir`)
- **Perbaikan Scrolling Form**:
  - Menyelaraskan anchor ID `id="formulir"` dan alias `id="unduh"` pada `src/components/landingpage/DownloadHubSection.tsx`.
  - Menambahkan event handler `handleNavClick` pada `Navbar.tsx` untuk memastikan animasi _smooth scrolling_ berjalan mulus dan instan pada perangkat desktop maupun mobile.

---

### 🧹 4. Pembersihan Codebase & Penghapusan Folder/File Tidak Terpakai

- **Audit & Penyelarasan Navigasi Navbar**:
  - Memastikan seluruh menu navbar (`PRODUK`, `PIAGAM`, `FORMULIR`) mengarah ke section aktif dan bersih dari tautan usang.
- **Pembersihan 14 File & Folder Tidak Terpakai**:
  - `src/components/news/` (`ArticleDetailView.tsx`, `ArticleGallery.tsx`).
  - `src/components/common/` (`PageHeader.tsx`, `SectionTitle.tsx`).
  - `src/components/forms/ContactForm.tsx` & `src/app/api/contact/route.ts`.
  - `src/data/company.ts`, `src/data/management.ts`, `src/data/csv/pendaftaran-hasamitra.csv`.
  - `scripts/seed.ts`.
  - `public/images/company-profile/` (4 aset foto manajemen lama).
- **Dokumentasi Terdedikasi**:
  - Menyusun laporan lengkap di `doc/PEMBERSIHAN_CODEBASE.md`.

---

### 📦 Ringkasan File yang Dibuat / Dimodifikasi Hari Ini

| File | Status | Keterangan |
| --- | --- | --- |
| `doc/PEMBERSIHAN_CODEBASE.md` | **Baru** | Laporan audit pembersihan navbar dan file/folder tidak terpakai. |
| `doc/CHANGELOG.md` | **Baru** | Catatan changelog resmi pengembangan per tanggal 15 Agustus 2026. |
| `doc/SECURITY_AUDIT.md` | **Baru** | Laporan audit dan mitigasi keamanan role admin dan web application. |
| `doc/AUDIT_PERUBAHAN.md` | **Baru** | Laporan audit komprehensif pembaruan arsitektur sistem. |
| `src/components/landingpage/*` | **Baru** | 9 file komponen modular untuk arsitektur halaman beranda. |
| `src/app/api/admin/auth/captcha/route.ts` | **Baru** | Endpoint generator cryptographic math captcha. |
| `src/app/page.tsx` | **Dimodifikasi** | Refaktorisasi modular ~115 baris kode. |
| `src/components/layout/Navbar.tsx` | **Dimodifikasi** | Penambahan navigasi PRODUK, PIAGAM, FORMULIR & smooth scroll. |
| `src/data/navigation.ts` | **Dimodifikasi** | Penyesuaian data array `mainNavigation`. |
| `src/lib/auth.ts` | **Dimodifikasi** | Penambahan fungsi cryptographic HMAC captcha & same-origin check. |
| `src/app/api/admin/auth/login/route.ts` | **Dimodifikasi** | Validasi captcha server-side & proteksi CSRF. |
| `src/app/api/admin/export/route.ts` | **Dimodifikasi** | Sanitasi anti CSV/Excel Formula Injection. |
| `src/app/admin/login/page.tsx` | **Dimodifikasi** | Integrasi captcha server-signed pada form login admin. |
| `next.config.ts` | **Dimodifikasi** | Pemasangan HTTP Security Headers OWASP. |
| `14 File / Folder Unused` | **Dihapus** | Pembersihan dead code & aset usang (lihat `doc/PEMBERSIHAN_CODEBASE.md`). |

