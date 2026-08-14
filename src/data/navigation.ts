export interface NavItem {
  name: string;
  href: string;
}

export interface NavItemWithSubmenu extends NavItem {
  submenu?: NavItem[];
}

export const hasamitraSubmenu: NavItem[] = [
  { name: "Beranda", href: "/" },
  { name: "Produk & Layanan", href: "/produk" },
  { name: "Piagam & Penghargaan", href: "/penghargaan" },
];

export const mainNavigation: NavItemWithSubmenu[] = [
  {
    name: "HASAMITRA",
    href: "/",
    submenu: hasamitraSubmenu,
  },
];

export const footerNavigation: NavItem[] = [
  { name: "HASAMITRA", href: "/" },
  { name: "PRODUK & LAYANAN", href: "/produk" },
  { name: "PIAGAM & PENGHARGAAN", href: "/penghargaan" },
];
