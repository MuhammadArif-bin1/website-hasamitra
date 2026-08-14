# Admin Panel — Dokumentasi Arsitektur & Operasional

## PT BPR Hasamitra Jawa Barat

Panduan lengkap penggunaan, struktur direktori, endpoint API, dan standar keamanan Admin Panel website Hasamitra Jawa Barat.

---

## 1. Akses Admin Panel

### URL Login

| Environment | URL |
|---|---|
| **Development** | `http://localhost:3000/admin/login` |
| **Production** | `https://hasamitrajabar.com/admin/login` |

### Halaman Admin yang Tersedia

| Halaman | URL | Fungsi Utama |
|---|---|---|
| **Login Admin** | `/admin/login` | Autentikasi admin dengan verifikasi *Cryptographic Math Captcha* server-side dan rate limiting. |
| **Dashboard** | `/admin` | Agregasi metrik statistik real-time (total pendaftaran nasabah, status pendaftaran baru/proses/selesai, produk aktif). |
| **Pendaftaran Nasabah** | `/admin/pendaftaran` | Kelola seluruh permohonan simpanan/investasi (Tabungan, Deposito, Cicil Emas), filter status, ubah status, direct chat WhatsApp, **fitur hapus batch (multi-select delete)**, dan **Export CSV Aman (Anti-Formula Injection)**. |
| **Kelola Produk** | `/admin/produk` | Manajemen CRUD katalog produk perbankan dengan sinkronisasi real-time *BroadcastChannel* ke landing page. |

---

## 2. Kredensial Admin & Konfigurasi Lingkungan

### Default Login (Development)

| Field | Nilai |
|---|---|
| **Email** | `admin@hasamitrajabar.com` |
| **Password** | `HsmtrAdmin@2026!` |

> ⚠️ **PENTING**: Wajib mengganti password admin dan mengubah `JWT_SECRET` pada dashboard hosting (Vercel) sebelum dipublikasikan ke production!

### Konfigurasi File `.env`

```env
# Koneksi Database PostgreSQL (Neon Serverless)
DATABASE_URL="postgresql://user:password@ep-sample.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# JWT Secret — Kunci enkripsi token login & HMAC signing
JWT_SECRET=hasamitra-admin-jwt-secret-2026-very-secure-key

# Kredensial default admin (digunakan saat seed)
ADMIN_EMAIL=admin@hasamitrajabar.com
ADMIN_PASSWORD=HsmtrAdmin@2026!

# Durasi sesi login (jam)
ADMIN_TOKEN_EXPIRY_HOURS=24
```

### Inisialisasi Database & Seeder

Jalankan perintah seeder untuk membuat tabel dan admin awal:

```bash
# Generate Prisma Client
npx prisma generate

# Sinkronkan skema ke database
npx prisma db push

# Eksekusi seed akun admin & data produk default
npx tsx scripts/seed.ts
```

---

## 3. Standar & Audit Keamanan

### 3.1 Autentikasi & Verifikasi Captcha

| Komponen | Implementasi | Status |
|---|---|---|
| **Password Hashing** | `bcryptjs` dengan 12 rounds salt | ✅ Aman |
| **Token Sesi** | JWT (`HS256`) via library `jose` | ✅ Aman |
| **Token Storage** | Cookie `admin_token` (`httpOnly`, `sameSite=lax`, `secure` di prod) | ✅ Aman |
| **Math Captcha** | Token terenkripsi `HMAC-SHA256` dari `/api/admin/auth/captcha`, diverifikasi via `crypto.timingSafeEqual` (kedaluwarsa 5 menit) | ✅ Kebal Bot & Timing Attack |
| **CSRF / Origin Check** | Validasi `Origin` & `Referer` pada setiap request mutasi | ✅ Aman |

### 3.2 Rate Limiting & Proteksi DoS

| Parameter | Nilai | Keterangan |
|---|---|---|
| **Maksimal Percobaan Gagal** | **5x percobaan** per IP | Counter direset setelah berhasil login |
| **Durasi Lockout** | **15 menit** | Mencegah serangan brute-force berulang |
| **Status HTTP** | `429 Too Many Requests` | Mengembalikan waktu sisa blokir |
| **Batas Panjang Payload** | `email` ≤ 150 char, `password` ≤ 200 char | Mitigasi buffer/memory bloat & ReDoS |

### 3.3 Proteksi Ekspor Data (CSV Formula Injection)

| Parameter | Implementasi |
|---|---|
| **CWE-1236 Mitigation** | Setiap data string pada `/api/admin/export` yang diawali karakter `=`, `+`, `-`, `@`, `\t`, `\r` otomatis diprefiks tanda petik tunggal (`'`). |
| **Hasil** | File `.csv` yang dibuka di Microsoft Excel tidak dapat mengeksekusi perintah Macro atau Dynamic Data Exchange (DDE) berbahaya. |

### 3.4 HTTP Security Headers (OWASP)

Dikonfigurasi aktif di `next.config.ts`:
- `X-Frame-Options: DENY` (Anti-Clickjacking).
- `X-Content-Type-Options: nosniff` (Anti-MIME Sniffing).
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

---

## 4. Arsitektur & Alur Kerja Admin

### 4.1 Diagram Alur Autentikasi

```text
Browser                              Server / Backend
  │                                         │
  ├─── 1. GET /api/admin/auth/captcha ────>│ Generate soal & HMAC signature
  │<── 2. Kirim { num1, num2, token } ──────┤ (Token valid 5 menit)
  │                                         │
  ├─── 3. POST /api/admin/auth/login ──────>│
  │    (email, password, captchaAnswer)     ├─ Check Origin & Referer (CSRF)
  │                                         ├─ Verify Captcha via crypto.timingSafeEqual
  │                                         ├─ Check Rate Limit IP (5x limit)
  │                                         ├─ Verify Password (bcrypt.compare)
  │                                         ├─ Record Audit Log
  │                                         ├─ Generate JWT Token (jose HS256)
  │<── 4. Set-Cookie: admin_token ──────────┤
  │                                         │
  ├─── 5. Request ke /admin/* ─────────────>│ Intercept via src/proxy.ts
  │                                         ├─ Token valid → Render Admin UI
  │<── 6. Redirect /admin/login (jika invalid)
```

### 4.2 Struktur File Admin & API

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx                ← Layout pembungkus admin (Sidebar & State session)
│   │   ├── page.tsx                  ← Dashboard metrik & statistik ringkasan
│   │   ├── login/page.tsx            ← Form Login Admin (dengan Captcha Kriptografis)
│   │   ├── pendaftaran/page.tsx      ← Manajemen Pendaftaran (Filter, WhatsApp link, Batch Delete, Export CSV)
│   │   └── produk/page.tsx           ← CRUD Katalog Produk Perbankan
│   │
│   └── api/admin/
│       ├── auth/
│       │   ├── captcha/route.ts      ← GET tantangan Captcha bertanda tangan HMAC
│       │   └── login/route.ts        ← POST verifikasi login & DELETE logout
│       ├── dashboard/route.ts        ← GET data agregasi dashboard
│       ├── export/route.ts           ← GET download file CSV pendaftaran (Aman dari DDE Injection)
│       ├── pendaftaran/
│       │   ├── route.ts              ← GET daftar pendaftaran & DELETE batch records
│       │   └── [id]/route.ts         ← GET detail, PATCH status (BARU/DIPROSES/SELESAI), DELETE single
│       └── produk/
│           ├── route.ts              ← GET list produk & POST tambah produk baru
│           └── [id]/route.ts         ← PUT perbarui produk & DELETE hapus produk
│
├── components/admin/
│   └── AdminSidebar.tsx              ← Navigasi sidebar responsif & tombol keluar
│
├── lib/
│   ├── auth.ts                       ← Generator/Verifier JWT, HMAC Captcha, CSRF Origin Check, Rate Limiter, Audit Logger
│   └── prisma.ts                     ← Client ORM Prisma PostgreSQL
│
└── proxy.ts                          ← Interceptor rute /admin/* (Next.js Proxy Convention)
```

---

## 5. Panduan Pemeliharaan & Troubleshooting

### Mengganti Password Admin
Ubah nilai hash password langsung pada tabel `Admin` di database atau modifikasi `ADMIN_PASSWORD` di `.env` lalu jalankan kembali script seed:
```bash
npx tsx scripts/seed.ts
```

### Memeriksa Audit Log
Seluruh aktivitas otentikasi dicatat pada server console:
```text
[AUDIT] 2026-08-15T05:00:00.000Z | LOGIN_SUCCESS | admin=admin@hasamitrajabar.com | {"ip":"::1","userId":1}
[AUDIT] 2026-08-15T05:00:00.000Z | LOGIN_FAILED_WRONG_PASSWORD | admin=admin@hasamitrajabar.com | {"ip":"::1"}
[AUDIT] 2026-08-15T05:00:00.000Z | LOGIN_FAILED_CAPTCHA_INVALID | admin=admin@hasamitrajabar.com | {"ip":"::1"}
```
