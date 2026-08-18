export interface NavItem {
  name: string;
  href: string;
}

export const mainNavigation: NavItem[] = [
  { name: "PRODUK", href: "/#produk" },
  { name: "PIAGAM", href: "/#piagam" },
  { name: "FORMULIR", href: "/#formulir" },
  { name: "LAYANAN ATK", href: "/#layanan-atk" },
];

export const footerNavigation: NavItem[] = [
  { name: "Produk", href: "/#produk" },
  { name: "Piagam", href: "/#piagam" },
  { name: "Formulir", href: "/#formulir" },
  { name: "Layanan ATK", href: "/#layanan-atk" },
];
