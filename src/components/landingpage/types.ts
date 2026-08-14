export interface ProductItem {
  id: number | string;
  slug: string;
  name: string;
  category?: string;
  description?: string;
  features: string[];
  buttonText: string;
}

export const fallbackProducts: ProductItem[] = [
  {
    id: 1,
    slug: "new-tabungan-sabar",
    name: "New Tabungan Sabar",
    category: "Tabungan",
    description: "Solusi simpanan fleksibel dengan kemudahan transaksi dan suku bunga yang menarik tanpa potongan memberatkan.",
    features: [
      "Bebas biaya administrasi bulanan",
      "Setoran awal terjangkau & fleksibel",
      "Dijamin oleh Lembaga Penjamin Simpanan (LPS)",
    ],
    buttonText: "Daftar Tabungan Online",
  },
  {
    id: 2,
    slug: "deposito-si-deka",
    name: "Deposito Si Deka",
    category: "Deposito",
    description: "Investasi simpanan berjangka dengan suku bunga optimal, kepastian hasil, serta keamanan penjaminan LPS penuh.",
    features: [
      "Pilihan jangka waktu 1, 3, 6, hingga 12 bulan",
      "Bunga kompetitif dapat ditransfer ke rekening",
      "Bisa dijadikan agunan kredit cepat",
    ],
    buttonText: "Buka Deposito Online",
  },
  {
    id: 3,
    slug: "cicil-emas",
    name: "Program Cicil Emas",
    category: "Investasi Emas",
    description: "Cara mudah dan aman memiliki emas batangan murni (Antam/Galeri 24) melalui skema angsuran tetap yang terjangkau.",
    features: [
      "Pilihan gramatur: 1 gr, 2 gr, 5 gr, s/d 50 gr",
      "Emas fisik asli bersertifikat resmi",
      "Pendaftaran cepat via formulir interaktif online",
    ],
    buttonText: "Formulir Cicil Emas Online",
  },
];
