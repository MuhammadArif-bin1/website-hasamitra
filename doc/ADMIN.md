# Admin Panel — Dokumentasi

## PT BPR Hasamitra Jawa Barat

Panduan lengkap penggunaan dan keamanan Admin Panel website Hasamitra Jawa Barat.

---

## 1. Akses Admin Panel

### URL Login

| Environment | URL |
|---|---|
| **Development** | `http://localhost:3000/admin/login` |
| **Production** | `https://hasamitrajabar.com/admin/login` |

### Halaman Admin yang Tersedia

| Halaman | URL | Fungsi |
|---|---|---|
| Login | `/admin/login` | Halaman login admin |
| Dashboard | `/admin` | Ringkasan statistik (pendaftaran, pesan, produk) |
| Kelola Produk | `/admin/produk` | CRUD produk yang tampil di landing page |
| Pendaftaran | `/admin/pendaftaran` | *(segera)* Kelola data pendaftaran nasabah |
| Pesan | `/admin/pesan` | *(segera)* Kelola pesan & pengaduan |
| Pengaturan | `/admin/pengaturan` | *(segera)* Edit profil perusahaan, visi/misi, kontak |

---

## 2. Kredensial Admin

### Default Login (Development)

| Field | Nilai |
|---|---|
| **Email** | `admin@hasamitrajabar.com` |
| **Password** | `HsmtrAdmin@2026!` |

> ⚠️ **PENTING**: Ganti password default ini sebelum deploy ke production!

### Konfigurasi di File `.env`

```env
# JWT Secret — kunci enkripsi token login
JWT_SECRET=hasamitra-admin-jwt-secret-2026-very-secure-key

# Kredensial default admin (digunakan saat seed)
ADMIN_EMAIL=admin@hasamitrajabar.com
ADMIN_PASSWORD=HsmtrAdmin@2026!

# Durasi sesi login (jam)
ADMIN_TOKEN_EXPIRY_HOURS=24
```

### Membuat Admin Pertama Kali

Jalankan perintah seed untuk membuat user admin dan data produk awal:

```bash
npx tsx scripts/seed.ts
```

---

## 3. Audit Keamanan

### 3.1 Autentikasi

| Komponen | Implementasi | Status |
|---|---|---|
| **Password Hashing** | `bcryptjs` dengan 12 rounds salt | ✅ Aman |
| **Token** | JWT (HS256) via library `jose` | ✅ Aman |
| **Token Storage** | Cookie `httpOnly`, `sameSite=lax`, `secure` (prod) | ✅ Aman |
| **Token Expiry** | 24 jam (konfigurabel via `.env`) | ✅ |
| **Secret Key** | Disimpan di `.env` (tidak hardcoded di source) | ✅ |

### 3.2 Rate Limiting

| Parameter | Nilai |
|---|---|
| Maksimal percobaan login | **5x gagal** per IP |
| Durasi lockout | **15 menit** |
| Pesan error | "Terlalu banyak percobaan login. Coba lagi dalam X menit." |
| HTTP Status | `429 Too Many Requests` |

> Jika admin salah password 5 kali berturut-turut, IP akan di-lockout selama 15 menit. Setelah login berhasil, counter direset.

### 3.3 Route Protection

| Mekanisme | Detail |
|---|---|
| **Middleware** | `src/middleware.ts` — intercept semua request ke `/admin/*` |
| **Pengecualian** | `/admin/login` — boleh diakses tanpa login |
| **Redirect** | Jika belum login → redirect ke `/admin/login` |
| **API Protection** | Setiap API admin route mengecek JWT via `getAdmin()` |

### 3.4 Audit Logging

Setiap aksi login dicatat dengan format:

```
[AUDIT] 2026-08-13T06:30:00Z | LOGIN_SUCCESS | admin=admin@hasamitrajabar.com | {"ip":"127.0.0.1","userId":1}
[AUDIT] 2026-08-13T06:30:00Z | LOGIN_FAILED_WRONG_PASSWORD | admin=admin@hasamitrajabar.com | {"ip":"127.0.0.1"}
[AUDIT] 2026-08-13T06:30:00Z | LOGIN_BLOCKED_RATE_LIMIT | admin=unknown | {"ip":"127.0.0.1","lockoutSeconds":890}
```

| Event | Deskripsi |
|---|---|
| `LOGIN_SUCCESS` | Login berhasil, token diterbitkan |
| `LOGIN_FAILED_USER_NOT_FOUND` | Email tidak ditemukan di database |
| `LOGIN_FAILED_WRONG_PASSWORD` | Password salah |
| `LOGIN_BLOCKED_RATE_LIMIT` | Percobaan ditolak karena rate limit |

### 3.5 Checklist Keamanan Production

| Item | Status | Aksi |
|---|---|---|
| Ganti `JWT_SECRET` ke random 64+ karakter | ❗ Wajib | Jalankan: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| Ganti password default admin | ❗ Wajib | Update di `.env` lalu jalankan ulang seed, atau ubah langsung di database |
| Pastikan `NODE_ENV=production` | ❗ Wajib | Agar cookie bersifat `secure` (hanya HTTPS) |
| Jangan commit file `.env` ke Git | ❗ Wajib | Pastikan `.gitignore` mencantumkan `.env` |
| Gunakan HTTPS | ❗ Wajib | Vercel otomatis menyediakan HTTPS |
| Batasi akses database | ⚠️ Rekomendasi | Gunakan IP whitelisting di Neon console |

---

## 4. Arsitektur Admin Panel

### Alur Login

```
Browser → POST /api/admin/auth/login
         ├─ Cek Rate Limit (IP)
         ├─ Validasi email & password (bcrypt.compare)
         ├─ Audit Log (sukses/gagal)
         ├─ Generate JWT Token
         └─ Set Cookie: admin_token (httpOnly, secure, 24h)

Browser → GET /admin/*
         ├─ Middleware intercept
         ├─ Baca cookie admin_token
         ├─ Verifikasi JWT (jose.jwtVerify)
         ├─ Valid → Next.js render halaman
         └─ Invalid → Redirect ke /admin/login
```

### Struktur File Admin

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx            ← Layout admin (sidebar)
│   │   ├── page.tsx              ← Dashboard
│   │   ├── login/page.tsx        ← Halaman login
│   │   └── produk/page.tsx       ← CRUD produk
│   │
│   └── api/admin/
│       ├── auth/login/route.ts   ← POST login, DELETE logout
│       ├── produk/route.ts       ← GET list, POST create
│       └── produk/[id]/route.ts  ← PUT update, DELETE hapus
│
├── components/admin/
│   └── AdminSidebar.tsx          ← Sidebar navigasi
│
├── lib/
│   └── auth.ts                   ← JWT, rate limiting, audit log
│
└── middleware.ts                 ← Proteksi route /admin/*
```

---

## 5. Panduan Pengembangan

### Menambah Halaman Admin Baru

1. Buat file `src/app/admin/[nama-halaman]/page.tsx`
2. Buat API route di `src/app/api/admin/[nama-halaman]/route.ts`
3. Tambahkan menu ke `src/components/admin/AdminSidebar.tsx`
4. Setiap API route **wajib** cek auth:
   ```typescript
   const admin = await getAdmin();
   if (!admin) {
     return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
   }
   ```

### Script Tersedia

```bash
# Jalankan seeder (buat admin + produk awal)
npx tsx scripts/seed.ts

# Development server
npm run dev

# Build production
npm run build
```

---

## 6. FAQ

**Q: Lupa password admin?**
A: Update langsung di database atau ubah `ADMIN_PASSWORD` di `.env` lalu hapus user lama & jalankan ulang `npx tsx scripts/seed.ts`.

**Q: Bagaimana menambah admin baru?**
A: Saat ini melalui script seed. Fitur manajemen user via admin panel akan ditambahkan di fase berikutnya.

**Q: Apakah landing page terpengaruh jika admin panel error?**
A: Tidak. Admin panel (`/admin/*`) dan landing page (`/`) berjalan independen. Keduanya hanya berbagi database.
