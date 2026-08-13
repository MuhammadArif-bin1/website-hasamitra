import React from "react";
import ProductSection from "@/components/produk/ProductSection";

export const metadata = {
  title: "Produk",
  description:
    "Produk resmi PT BPR Hasamitra Jawa Barat: New Tabungan Sabar, Deposito Si Deka, dan Cicil Emas.",
};

export default function ProdukPage() {
  return (
    <div className="py-6">
      <ProductSection />
    </div>
  );
}
