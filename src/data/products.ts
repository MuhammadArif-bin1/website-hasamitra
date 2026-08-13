export interface Product {
  id: string;
  name: string;
  features: string[];
  buttonText: string;
}

export const products: Product[] = [
  {
    id: "tabungan-sabar",
    name: "New Tabungan Sabar",
    features: [
      "Nasabah dapat memilih hadiah sesuai yang diinginkan",
      "Bebas biaya administrasi",
      "Jangka waktu mulai 6 sampai 12 bulan",
    ],
    buttonText: "Isi datamu sekarang",
  },
  {
    id: "deposito-sideka",
    name: "Deposito Si Deka",
    features: [
      "Deposito berjangka yang sangat fleksibel dan sangat aman",
      "Suku bunga relatif tinggi",
      "Dijamin LPS",
    ],
    buttonText: "Isi datamu sekarang",
  },
  {
    id: "cicil-emas",
    name: "Cicil Emas",
    features: [
      "Angsuran Tetap",
      "Keamanan Terjamin",
      "Cocok Sebagai Investasi Jangka Panjang",
    ],
    buttonText: "Isi datamu sekarang",
  },
];
