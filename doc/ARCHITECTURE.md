# Dokumentasi Arsitektur Proyek — PT BPR Hasamitra Jawa Barat

Dokumen ini menjelaskan arsitektur folder, organisasi kode, dan implementasi **Component-Based Architecture** pada aplikasi Next.js PT BPR Hasamitra Jawa Barat.

---

## 📁 1. Pohon Direktori Utama

```
website-hasamitra/
├── doc/                                    ← 📑 Dokumentasi Resmi Proyek
│   ├── ADMIN.md                            ← Panduan & Arsitektur Admin Panel
│   ├── ARCHITECTURE.md                     ← Arsitektur Aplikasi & Landing Page
│   ├── AUDIT_PERUBAHAN.md                  ← Laporan Audit Perubahan Tim
│   ├── CHANGELOG.md                        ← Riwayat Perubahan Proyek
│   └── SECURITY_AUDIT.md                   ← Laporan Audit & Hardening Keamanan
│
├── src/                                    ← 💻 Seluruh Source Code Frontend & Backend
│   ├── app/                                ← Next.js App Router (Pages & API Handlers)
│   │   ├── admin/                          ← Panel Administrasi
│   │   │   ├── layout.tsx                  ← Layout Admin & Sidebar Wrapper
│   │   │   ├── page.tsx                    ← Dashboard Statistik
│   │   │   ├── login/page.tsx              ← Form Login Admin (dengan HMAC Captcha)
│   │   │   ├── pendaftaran/page.tsx        ← Manajemen Pendaftaran Nasabah (Batch Delete & Export CSV)
│   │   │   └── produk/page.tsx             ← CRUD Katalog Produk Perbankan
│   │   │
│   │   ├── api/                            ← API Route Handlers Backend
│   │   │   ├── admin/                      ← Private API (Terproteksi JWT)
│   │   │   │   ├── auth/captcha/route.ts   ← GET Tantangan Captcha Kriptografis
│   │   │   │   ├── auth/login/route.ts     ← POST Login & DELETE Logout
│   │   │   │   ├── dashboard/route.ts      ← GET Agregasi Metrik Dashboard
│   │   │   │   ├── export/route.ts         ← GET Export CSV Aman (Anti-CWE-1236)
│   │   │   │   ├── pendaftaran/route.ts    ← GET List & DELETE Batch Pendaftaran
│   │   │   │   ├── pendaftaran/[id]/route.ts ← GET, PATCH, DELETE Pendaftaran
│   │   │   │   ├── produk/route.ts         ← GET List & POST Tambah Produk
│   │   │   │   └── produk/[id]/route.ts    ← PUT & DELETE Produk
│   │   │   ├── contact/route.ts            ← POST Pesan Kontak & Pengaduan
│   │   │   ├── pendaftaran/route.ts        ← POST Pendaftaran Nasabah Publik
│   │   │   └── produk/route.ts             ← GET Katalog Produk Publik
│   │   │
│   │   ├── informasi/                      ← Halaman Informasi Publik
│   │   │   ├── karir/page.tsx              ← Informasi Karir & Rekrutmen
│   │   │   ├── laporan-gcg/page.tsx        ← Tata Kelola Perusahaan (GCG)
│   │   │   ├── laporan-tahunan/page.tsx    ← Laporan Tahunan Perusahaan
│   │   │   ├── laporan-triwulan/page.tsx   ← Laporan Publikasi Keuangan Triwulanan
│   │   │   ├── piagam-audit-internal/page.tsx ← Piagam Komite Audit Internal
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx                    ← Hub Navigasi Informasi Publik
│   │   │
│   │   ├── globals.css                     ← Tailwind CSS v4 & Utilitas Global
│   │   ├── layout.tsx                      ← Root Layout (Navbar, Footer, Toast)
│   │   └── page.tsx                        ← Orchestrator Landing Page (~115 baris)
│   │
│   ├── components/                         ← 🎨 Komponen UI React (Modular)
│   │   ├── admin/                          ← Komponen Khusus Admin Panel
│   │   │   └── AdminSidebar.tsx            ← Navigasi Sidebar Responsif
│   │   ├── common/                         ← Komponen Reusable
│   │   │   ├── OjkLpsNotice.tsx            ← Notice Kepatuhan Regulasi
│   │   │   ├── PageHeader.tsx              ← Header Sub-Halaman
│   │   │   ├── SectionTitle.tsx            ← Tipografi Judul Section
│   │   │   ├── WhatsAppBanner.tsx          ← Call-to-Action WhatsApp
│   │   │   └── WhatsAppButton.tsx          ← Tombol Floating WhatsApp CS
│   │   ├── forms/                          ← Modal & Formulir Interaktif
│   │   │   ├── ContactForm.tsx             ← Form Pengaduan Nasabah
│   │   │   └── TabunganFormModal.tsx       ← Modal Pendaftaran Produk Terpadu
│   │   ├── landingpage/                    ← 🏛️ Modul Landing Page (Component-Based)
│   │   │   ├── types.ts                    ← Interface ProductItem & Fallback Data
│   │   │   ├── HeroSection.tsx             ← Section Hero (Fintech Glassmorphic)
│   │   │   ├── TrustMetricsSection.tsx     ← 4 Kartu Pilar Kepercayaan
│   │   │   ├── ProductsSection.tsx         ← Katalog Produk Perbankan Dinamis
│   │   │   ├── PiagamSection.tsx           ← Showcase Piagam & Sertifikat Resmi
│   │   │   ├── DownloadHubSection.tsx      ← Hub Unduh PDF Kredit & Form Emas
│   │   │   ├── ComplianceNoticeSection.tsx ← Banner Penjaminan LPS Rp 2 Miliar
│   │   │   ├── PiagamPreviewModal.tsx      ← Modal Zoom Sertifikat Beresolusi Tinggi
│   │   │   └── index.ts                    ← Barrel Export Komponen Beranda
│   │   └── layout/                         ← Struktur Layout Publik
│   │       ├── Footer.tsx                  ← Footer Resmi & Link Terkait
│   │       └── Navbar.tsx                  ← Navbar Sticky & Mobile Menu Responsif
│   │
│   ├── data/                               ← 🗃️ Data Statis & Konfigurasi Navigasi
│   │   ├── company.ts                      ← Data Legalitas & Profil Perusahaan
│   │   ├── contact.ts                      ← Nomor Kontak, CS WhatsApp, Alamat
│   │   ├── management.ts                   ← Susunan Direksi & Dewan Komisaris
│   │   ├── navigation.ts                   ← Data Array Navigasi Header & Footer
│   │   └── products.ts                     ← Data Produk Perbankan
│   │
│   ├── lib/                                ← ⚙️ Utility Backend, Auth & DB Client
│   │   ├── auth.ts                         ← JWT jose, HMAC Captcha, CSRF Origin Check
│   │   ├── prisma.ts                       ← Prisma Client Adapter (Neon PostgreSQL)
│   │   └── utils.ts                        ← Formatting Helpers & Class Merging
│   │
│   └── proxy.ts                            ← Proxy Interceptor Rute Admin (Middleware)
│
├── public/                                 ← 🖼️ Aset Statis Publik
│   └── images/
│       ├── dokumen/                        ← Piagam Penghargaan & Karir
│       ├── logo/                           ← Logo Hasamitra (Horisontal & Bulat)
│       └── profil/                         ← Background Hero, Gedung, & Piagam
│
├── prisma/                                 ← 🗄️ Database ORM Schema
│   └── schema.prisma                       ← Skema Database PostgreSQL (Neon)
│
├── next.config.ts                          ← Konfigurasi Next.js (Security Headers)
├── package.json                            ← Dependency Aplikasi (Next 16, React 19, Tailwind v4)
└── tsconfig.json                           ← Path Alias TypeScript (`@/*` -> `./src/*`)
```

---

## 🏛️ 2. Arsitektur Landing Page (Component-Based Architecture)

Halaman utama ([src/app/page.tsx](file:///d:/Project/Code/NextJs/website-hasamitra/src/app/page.tsx)) dibangun menggunakan prinsip **Single-Page Experience** dengan pembagian komponen modular di [src/components/landingpage/](file:///d:/Project/Code/NextJs/website-hasamitra/src/components/landingpage/):

```
┌─────────────────────────────────────────────────────────────┐
│                       src/app/page.tsx                      │
│                  (State & Sync Orchestrator)                │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼                       ▼                       ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ HeroSection  │       │ TrustMetrics │       │   Products   │
│ (Fintech CTA)│       │(4 Trust Card)│       │  (DB Catalog)│
└──────────────┘       └──────────────┘       └──────┬───────┘
                                                     │ onOpenForm
       ┌───────────────────────┬───────────────────────┘
       ▼                       ▼                       ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│PiagamSection │       │ DownloadHub  │       │  Compliance  │
│ (Showcase)   │       │(PDF & Form)  │       │(LPS 2 Miliar)│
└──────┬───────┘       └──────┬───────┘       └──────────────┘
       │ onOpenPreview        │ onOpenForm
       ▼                      ▼
┌──────────────────┐   ┌──────────────────┐
│PiagamPreviewModal│   │TabunganFormModal │
└──────────────────┘   └──────────────────┘
```

### 2.1 Modul-Modul Komponen:
1. **`HeroSection.tsx`**: Menampilkan background ambient profil Hasamitra, headline keuangan modern, tombol direct scroll ke `#produk`, unduh formulir kredit PDF, tombol WhatsApp CS, dan chip verifikasi OJK & LPS.
2. **`TrustMetricsSection.tsx`**: 4 kartu pilar kepercayaan mengambang (01. Izin OJK, 02. LPS Rp 2 Miliar, 03. Kredit Cepat, 04. Cicil Emas).
3. **`ProductsSection.tsx`**: Menampilkan katalog produk perbankan (*New Tabungan Sabar, Deposito Si Deka, Program Cicil Emas*) yang terhubung ke database.
4. **`PiagamSection.tsx`**: Showcase visual sertifikat piagam penghargaan dengan trigger perbesar gambar.
5. **`DownloadHubSection.tsx`**: Hub berkas formulir permohonan kredit (cetak PDF) dan form digital cicil emas online (`id="formulir"` / `id="unduh"`).
6. **`ComplianceNoticeSection.tsx`**: Banner pemberitahuan kepatuhan batas penjaminan simpanan LPS Rp 2 Miliar dan suku bunga penjaminan.
7. **`PiagamPreviewModal.tsx`**: Modal pop-up preview foto sertifikat piagam dalam resolusi penuh.
8. **`TabunganFormModal.tsx`**: Modal formulir pendaftaran terpadu nasabah baru.

---

## 🔄 3. Sinkronisasi Data Real-Time & Event Handling

1. **Sinkronisasi Katalog Produk**:
   - `page.tsx` menggunakan `BroadcastChannel("hasamitra_sync_channel")` dan storage event listener sehingga setiap perubahan produk yang dilakukan admin di dashboard akan langsung ter-update di landing page tanpa perlu refresh halaman.
2. **Smooth Scroll Hash Navigation**:
   - Navbar menggunakan event handler `handleNavClick` pada `src/components/layout/Navbar.tsx` untuk memastikan navigasi menu (`PRODUK`, `PIAGAM`, `FORMULIR`) berjalan halus (*smooth scrolling*) baik di desktop maupun mobile browser.

---

## 🛡️ 4. Standar Keamanan & Proteksi Aplikasi

- **Cryptographic Server Captcha**: Token `HMAC-SHA256` pada formulir login admin via `/api/admin/auth/captcha`.
- **CSRF Mitigation**: Pengecekan `Origin` & `Referer` di server-side (`src/lib/auth.ts`).
- **CSV Injection Prevention**: Penambahan prefix `'` pada ekspor data nasabah (`src/app/api/admin/export/route.ts`).
- **OWASP Security Headers**: Dikonfigurasi aktif di `next.config.ts` (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, dll).
