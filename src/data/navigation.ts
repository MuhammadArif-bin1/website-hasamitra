export interface NavItem {
  name: string;
  href: string;
}

export const mainNavigation: NavItem[] = [
  { name: "PRODUK", href: "/#produk" },
  { name: "PIAGAM", href: "/#piagam" },
  { name: "FORMULIR", href: "/#formulir" },
];

export const footerNavigation: NavItem[] = [
  { name: "Produk", href: "/#produk" },
  { name: "Piagam", href: "/#piagam" },
  { name: "Formulir", href: "/#formulir" },
];
