import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductSection from "@/components/ProductSection";

export const metadata = {
  title: "Produk - Bank Hasamitra Jawa Barat",
  description: "Produk resmi PT BPR Hasamitra Jawa Barat: New Tabungan Sabar, Deposito Si Deka, dan Cicil Emas.",
};

export default function ProdukPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <main className="flex-1 py-6">
        <ProductSection />
      </main>

      <Footer />
    </div>
  );
}
