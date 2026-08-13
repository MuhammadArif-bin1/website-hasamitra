export interface NavItem {
  name: string;
  href: string;
}

export interface NavItemWithSubmenu extends NavItem {
  submenu?: NavItem[];
}

export const tentangKamiSubmenu: NavItem[] = [
  { name: "Profil Perusahaan", href: "/tentang-kami/profil-perusahaan" },
  { name: "Logo & Makna", href: "/tentang-kami/logo-makna" },
  { name: "Pengurus", href: "/tentang-kami/pengurus" },
  { name: "Struktur Organisasi", href: "/tentang-kami/struktur-organisasi" },
  { name: "Penghargaan", href: "/tentang-kami/penghargaan" },
];

export const informasiSubmenu: NavItem[] = [
  { name: "Karir", href: "/informasi/karir" },
  { name: "Laporan GCG", href: "/informasi/laporan-gcg" },
  { name: "Laporan Triwulan", href: "/informasi/laporan-triwulan" },
  { name: "Laporan Tahunan", href: "/informasi/laporan-tahunan" },
  { name: "Hasa Mitra News", href: "/informasi/hasa-mitra-news" },
  { name: "Piagam Audit Internal", href: "/informasi/piagam-audit-internal" },
];

export const mainNavigation: NavItemWithSubmenu[] = [
  { name: "HASAMITRA", href: "/" },
  {
    name: "TENTANG KAMI",
    href: "/tentang-kami/profil-perusahaan",
    submenu: tentangKamiSubmenu,
  },
  { name: "PRODUK", href: "/produk" },
  {
    name: "INFORMASI",
    href: "/informasi/karir",
    submenu: informasiSubmenu,
  },
  { name: "CONTACT", href: "/contact" },
];

export const footerNavigation: NavItem[] = [
  { name: "HASAMITRA", href: "/" },
  { name: "TENTANG KAMI", href: "/tentang-kami/profil-perusahaan" },
  { name: "PRODUK", href: "/produk" },
  { name: "INFORMASI", href: "/informasi" },
  { name: "CONTACT", href: "/contact" },
];
