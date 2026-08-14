export interface NavItem {
  name: string;
  href: string;
}

export interface NavItemWithSubmenu extends NavItem {
  submenu?: NavItem[];
}

export const hasamitraSubmenu: NavItem[] = [
  { name: "Piagam & Penghargaan", href: "/penghargaan" },
];

export const mainNavigation: NavItemWithSubmenu[] = [
  {
    name: "HASAMITRA",
    href: "/",
    submenu: hasamitraSubmenu,
  },
  { name: "PRODUK", href: "/produk" },
];

export const footerNavigation: NavItem[] = [
  { name: "HASAMITRA", href: "/" },
  { name: "PIAGAM & PENGHARGAAN", href: "/penghargaan" },
  { name: "PRODUK", href: "/produk" },
];
