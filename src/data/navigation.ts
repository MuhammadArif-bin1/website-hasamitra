export interface NavItem {
  name: string;
  href: string;
}

export const mainNavigation: NavItem[] = [
  { name: "HASAMITRA", href: "/" },
];

export const footerNavigation: NavItem[] = [
  { name: "HASAMITRA", href: "/" },
  { name: "Produk & Layanan", href: "/#produk" },
  { name: "Piagam & Legalitas", href: "/#piagam" },
  { name: "Pusat Unduhan Formulir", href: "/#unduh" },
  { name: "Pusat Informasi Publik", href: "/informasi" },
  { name: "Karir & Lowongan", href: "/informasi/karir" },
  { name: "Laporan Keuangan Triwulan", href: "/informasi/laporan-triwulan" },
];
