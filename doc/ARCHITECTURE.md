# Dokumentasi Struktur Proyek — PT BPR Hasamitra Jawa Barat

Dokumen ini menjelaskan arsitektur folder dan organisasi kode aplikasi Next.js PT BPR Hasamitra Jawa Barat setelah rekonstruksi struktur `src/`.

---

## 📁 Pohon Direktori Utama

```
landing-page/
├── doc/                                    ← 📑 Dokumentasi Struktur Proyek
│   └── ARCHITECTURE.md
│
├── src/                                    ← 💻 Seluruh Kode Aplikasi Frontend & Backend
│   ├── app/                                ← Next.js App Router (Halaman & API Routes)
│   │   ├── api/                            ← Endpoint API Backend
│   │   │   ├── admin/export/route.ts       ← Ekspor data nasabah CSV
│   │   │   ├── contact/route.ts            ← Form kontak & pengaduan
│   │   │   └── pendaftaran/route.ts        ← Form pendaftaran produk
│   │   ├── contact/                        ← Halaman Kontak Us
│   │   ├── informasi/                      ← Halaman Informasi (Laporan, Karir, GCG, dll)
│   │   │   ├── hasa-mitra-news/
│   │   │   ├── karir/
│   │   │   ├── laporan-gcg/
│   │   │   ├── laporan-tahunan/
│   │   │   ├── laporan-triwulan/
│   │   │   └── piagam-audit-internal/
│   │   ├── produk/                         ← Halaman Katalog Produk
│   │   ├── tentang-kami/                   ← Halaman Profil & Perusahaan
│   │   │   ├── logo-makna/
│   │   │   ├── penghargaan/
│   │   │   ├── pengurus/
│   │   │   ├── profil-perusahaan/
│   │   │   └── struktur-organisasi/
│   │   ├── globals.css                     ← Styling global (Tailwind CSS)
│   │   ├── layout.tsx                      ← Root layout (Navbar & Footer wrapper)
│   │   └── page.tsx                        ← Halaman Utama (Hasamitra Hero)
│   │
│   ├── components/                         ← 🎨 Komponen UI React
│   │   ├── common/                         ← Komponen bersama / reusable
│   │   │   ├── OjkLpsNotice.tsx            ← Banner legalitas OJK & LPS
│   │   │   ├── PageHeader.tsx              ← Header halaman
│   │   │   ├── SectionTitle.tsx            ← Judul section
│   │   │   ├── WhatsAppBanner.tsx          ← Banner hubungi WhatsApp
│   │   │   └── WhatsAppButton.tsx          ← Tombol WhatsApp
│   │   ├── forms/                          ← Form & Modal Pengajuan
│   │   │   ├── CicilEmasModal.tsx          ← Modal Cicil Emas (Google Form)
│   │   │   ├── ContactForm.tsx             ← Form Kontak & Recaptcha
│   │   │   └── TabunganFormModal.tsx       ← Form Pengajuan Produk
│   │   ├── informasi/                      ← Komponen halaman Informasi
│   │   │   └── InformasiTabs.tsx
│   │   ├── layout/                         ← Komponen Layout Utama
│   │   │   ├── Footer.tsx                  ← Footer situs & link navigasi
│   │   │   └── Navbar.tsx                  ← Navigation bar utama & mobile menu
│   │   ├── pengurus/                       ← Komponen Halaman Pengurus
│   │   │   ├── ManagementCard.tsx
│   │   │   ├── PengurusClient.tsx
│   │   │   └── ProfileModal.tsx
│   │   ├── produk/                         ← Komponen Halaman Produk
│   │   │   └── ProductSection.tsx
│   │   └── tentang-kami/                   ← Komponen Halaman Tentang Kami
│   │       └── TentangKamiTabs.tsx
│   │
│   ├── data/                               ← 🗃️ Data Statis & Data Navigasi
│   │   ├── company.ts                      ← Data profil & legalitas perusahaan
│   │   ├── contact.ts                      ← Data kontak, telepon, alamat
│   │   ├── management.ts                   ← Data direksi & komisaris
│   │   ├── navigation.ts                   ← Data menu & navigasi
│   │   ├── products.ts                     ← Data produk perbankan
│   │   └── csv/                            ← Berkas CSV data
│   │       └── pendaftaran-hasamitra.csv
│   │
│   └── lib/                                ← ⚙️ Utility Backend & Database Client
│       ├── db.ts                           ← Inisialisasi Prisma DB Client (Neon)
│       ├── utils.ts                        ← Helper functions (cn, formatters)
│       └── generated/                      ← Generated Prisma Client
│           └── prisma/
│
├── public/                                 ← 🖼️ Aset Statis Publik
│   └── images/
│       ├── company-profile/                ← Foto Profil Lengkap Pengurus (4 file)
│       ├── dokumen/                        ← Gambar Dokumen & Karir (4 file)
│       ├── laporan/                        ← Gambar Laporan Keuangan & Publikasi (2 file)
│       ├── logo/                           ← Logo Perusahaan (logo-hasamitra & logo-bulat)
│       └── profil/                         ← Foto Profil Pengurus & Gedung Kantor (6 file)
│
├── prisma/                                 ← 🗄️ Database ORM Schema & Migrations
│   ├── schema.prisma                       ← Skema Tabel Database PostgreSQL (Neon)
│   └── migrations/
│
├── scripts/                                ← 🛠️ Script Helper Admin
│   ├── clear-registrations.ts              ← Reset data pendaftaran
│   └── export-data.ts                      ← Ekspor data ke CSV
│
├── .env                                    ← Environment Variables
├── next.config.ts                          ← Konfigurasi Next.js
├── package.json                            ← Dependency & Script npm
└── tsconfig.json                           ← Konfigurasi TypeScript (`@/*` -> `./src/*`)
```

---

## 🎯 Manfaat Rekonstruksi Ini

1. **Struktur Standar Next.js Modern**: Menggunakan folder `src/` memisahkan secara tegas antara kode aplikasi dan file konfigurasi proyek.
2. **Kategorisasi Komponen Jelas**:
   - `components/layout/`: Komponen pembungkus seperti Navbar & Footer.
   - `components/forms/`: Seluruh formulir & modal interaktif.
   - `components/common/`: Komponen reusable seperti tombol WhatsApp & notice OJK/LPS.
   - `components/[feature]/`: Komponen khusus spesifik fitur.
3. **Pengorganisasian Gambar Publik**: Seluruh aset gambar `public/` kini berada di sub-folder kategoris (`images/logo/`, `images/profil/`, `images/dokumen/`, dll.) dengan penamaan bebas spasi (*URL-safe*).
4. **Maintenance Jangka Panjang**: Pengembang baru dapat langsung mengetahui lokasi file tanpa harus mencari di root folder.
