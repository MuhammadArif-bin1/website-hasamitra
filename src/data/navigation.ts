export interface NavItem {
  name: string;
  href: string;
}

export const mainNavigation: NavItem[] = [
  { name: "Beranda", href: "/" },
  { name: "Produk", href: "/#produk" },
  { name: "Piagam & Legalitas", href: "/#piagam" },
  { name: "Unduh Formulir", href: "/#unduh" },
  { name: "Pusat Informasi", href: "/informasi" },
];

export const footerNavigation: NavItem[] = [
  { name: "Beranda Utama", href: "/" },
  { name: "Produk & Layanan", href: "/#produk" },
  { name: "Piagam & Legalitas", href: "/#piagam" },
  { name: "Pusat Unduhan Formulir", href: "/#unduh" },
  { name: "Pusat Informasi Publik", href: "/informasi" },
  { name: "Karir & Lowongan", href: "/informasi/karir" },
  { name: "Laporan Keuangan Triwulan", href: "/informasi/laporan-triwulan" },
];
