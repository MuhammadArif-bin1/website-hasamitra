export interface NavItem {
  name: string;
  href: string;
}

export interface NavItemWithSubmenu extends NavItem {
  submenu?: NavItem[];
}

export const hasamitraSubmenu: NavItem[] = [
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
  {
    name: "HASAMITRA",
    href: "/",
    submenu: hasamitraSubmenu,
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
  { name: "PENGHARGAAN", href: "/tentang-kami/penghargaan" },
  { name: "PRODUK", href: "/produk" },
  { name: "INFORMASI", href: "/informasi" },
  { name: "CONTACT", href: "/contact" },
];
