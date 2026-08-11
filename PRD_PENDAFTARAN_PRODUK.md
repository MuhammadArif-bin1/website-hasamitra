# Product Requirements Document (PRD) & Technical Implementation Documentation
**Sistem Pendaftaran Nasabah - Penyimpanan Otomatis Server CSV (REVISI FINAL)**

---

## 📋 1. Metadata Dokumen

| Parameter | Keterangan |
| :--- | :--- |
| **Nama Proyek** | Website Official PT BPR Hasamitra Jawa Barat |
| **Modul / Fitur** | Fitur Pendaftaran 3 Produk Perbankan & Penyimpanan Server CSV |
| **Versi Dokumen** | 2.0.0 (REVISI FINAL) |
| **Tanggal** | 11 Agustus 2026 |
| **Target Produk** | 1. New Tabungan Sabar<br>2. Deposito Si Deka<br>3. Cicil Emas |
| **Lokasi Storage CSV** | `/data/pendaftaran/pendaftaran-hasamitra.csv` (Internal Server) |

---

## 🎯 2. Ringkasan Eksekutif (Executive Summary)

Fitur ini memfasilitasi nasabah untuk mendaftar secara mandiri pada 3 produk utama PT BPR Hasamitra Jawa Barat. Setelah nasabah menekan tombol **"Kirim Pendaftaran"**, data diproses dan disimpan secara otomatis di sisi server ke dalam file CSV internal di `/data/pendaftaran/pendaftaran-hasamitra.csv`. 

Demi keamanan data dan pengalaman pengguna yang privat:
- Data **TIDAK BOLEH** diunduh oleh nasabah.
- Nasabah **TIDAK** dapat melihat file, mengunduh file, atau mengetahui lokasi penyimpanan file.
- Nasabah hanya menerima pesan sukses: **"Pendaftaran berhasil dikirim."**

---

## 💡 3. Spesifikasi Formulir Per Produk

### 1. New Tabungan Sabar
- **Field**: Nama, Alamat, Email, Jangka Waktu
- **Pilihan Jangka Waktu**: `1 Bulan`, `3 Bulan`, `6 Bulan`, `12 Bulan` (Disimpan di CSV sebagai: `1`, `3`, `6`, `12`)
- **Berat Emas (Gram)**: Kosong (`""`)

### 2. Deposito Si Deka
- **Field**: Nama, Alamat, Email, Jangka Waktu
- **Pilihan Jangka Waktu**: `1 Bulan`, `3 Bulan`, `6 Bulan`, `12 Bulan` (Disimpan di CSV sebagai: `1`, `3`, `6`, `12`)
- **Berat Emas (Gram)**: Kosong (`""`)

### 3. Cicil Emas
- **Field**: Nama, Alamat, Email, Berat Emas (Gram)
- **Pilihan Berat Emas**: `1 Gram`, `2 Gram`, `5 Gram`, `10 Gram`, `25 Gram`, `50 Gram` (Disimpan di CSV sebagai: `1`, `2`, `5`, `10`, `25`, `50`)
- **Jangka Waktu**: Kosong (`""`) & **TIDAK ditampilkan** pada form Cicil Emas.

---

## 📊 4. Spesifikasi Skema Storage CSV

File CSV dibuat dan dikelola secara otomatis oleh server Next.js di path internal:
`/data/pendaftaran/pendaftaran-hasamitra.csv`

### Header CSV:
`id_pendaftaran,tanggal_pendaftaran,produk,nama,alamat,email,jangka_waktu,berat_emas_gram`

### Contoh Isi File CSV:
```csv
id_pendaftaran,tanggal_pendaftaran,produk,nama,alamat,email,jangka_waktu,berat_emas_gram
REG-0001,2026-08-11,New Tabungan Sabar,Budi Santoso,Depok,budi@email.com,6,
REG-0002,2026-08-11,Deposito Si Deka,Andi Saputra,Jakarta,andi@email.com,12,
REG-0003,2026-08-11,Cicil Emas,Siti Rahma,Bekasi,siti@email.com,,10
```

### Aturan Penyimpanan:
1. **Auto Directory Creation**: Jika folder `/data/pendaftaran/` belum ada, server akan membuatnya secara otomatis.
2. **Auto Header**: Jika file `pendaftaran-hasamitra.csv` belum ada, file akan dibuat otomatis dengan header standar.
3. **Append Mode**: Data pendaftaran baru selalu ditambahkan ke baris berikutnya tanpa menghapus data sebelumnya.
4. **Format ID**: `REG-0001`, `REG-0002`, `REG-0003`, dst., otomatis bertambah (*auto-increment*).
5. **Format Tanggal**: `YYYY-MM-DD` (contoh: `2026-08-11`).

---

## 🔒 5. Keamanan & Akses Terbatas

- **Akses Browser**: File CSV berada di luar folder `/public/` sehingga tidak dapat diakses secara publik melalui URL browser.
- **Tanpa Fitur Ekspor/Download**: Tidak ada tombol download CSV, preview CSV, link CSV, atau tombol "Lihat Data" untuk nasabah.
- **Server-Side File System**: Penulisan CSV dilakukan sepenuhnya di server via Next.js Route Handler (`app/api/pendaftaran/route.ts`) menggunakan Node.js `fs` module.

---

## 🧪 6. Pengujian & Validasi

1. **Validasi Input**:
   - Semua field wajib diisi sesuai jenis produk.
   - Format email harus valid.
   - Nilai Jangka Waktu hanya menerima `1`, `3`, `6`, `12`.
   - Nilai Berat Emas hanya menerima `1`, `2`, `5`, `10`, `25`, `50`.
   - Jika data tidak valid, data **TIDAK** disimpan ke CSV dan menampilkan pesan:
     `"Data belum lengkap atau tidak valid."`

2. **Respon Berhasil**:
   - Jika data valid dan penulisan ke CSV di server sukses, UI hanya menampilkan pesan:
     `"Pendaftaran berhasil dikirim."`

---

## 📌 7. Kesimpulan & Status

Seluruh ketentuan **REVISI FINAL** telah diimplementasikan 100% pada codebase Next.js.
