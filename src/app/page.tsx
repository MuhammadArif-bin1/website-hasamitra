"use client";

import React, { useState, useEffect } from "react";
import TabunganFormModal from "@/components/forms/TabunganFormModal";
import {
  HeroSection,
  TrustMetricsSection,
  ProductsSection,
  PiagamSection,
  DownloadHubSection,
  ComplianceNoticeSection,
  PiagamPreviewModal,
  ProductItem,
  fallbackProducts,
} from "@/components/landingpage";

export default function Home() {
  const [products, setProducts] = useState<ProductItem[]>(fallbackProducts);
  const [, setLoadingProducts] = useState(true);

  const [tabunganModalOpen, setTabunganModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("New Tabungan Sabar");
  const [piagamPreviewOpen, setPiagamPreviewOpen] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/produk", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setProducts(json.data);
        }
      } catch (err) {
        console.error("Gagal memuat produk dari database:", err);
      } finally {
        setLoadingProducts(false);
      }
    }

    loadProducts();

    // 1. Polling check every 6 seconds
    const interval = setInterval(loadProducts, 6000);

    // 2. BroadcastChannel trigger when admin updates product in real time
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        bc = new BroadcastChannel("hasamitra_sync_channel");
        bc.onmessage = (event) => {
          if (event.data?.type === "PRODUCTS_UPDATED") {
            loadProducts();
          }
        };
      }
    } catch {}

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "hasamitra_last_product_update") {
        loadProducts();
      }
    };
    const handleFocus = () => loadProducts();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      if (bc) bc.close();
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const openProductForm = (productName: string) => {
    setSelectedProduct(productName);
    setTabunganModalOpen(true);
  };

  return (
    <div className="bg-slate-50/60 text-slate-900 font-sans selection:bg-orange-500 selection:text-white scroll-smooth">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Trust & Regulatory Metrics Strip */}
      <TrustMetricsSection />

      {/* 3. Layanan & Produk Unggulan */}
      <ProductsSection products={products} onOpenForm={openProductForm} />

      {/* 4. Piagam & Penghargaan Resmi */}
      <PiagamSection onOpenPreview={() => setPiagamPreviewOpen(true)} />

      {/* 5. Pusat Unduhan Berkas & Formulir Pengajuan */}
      <DownloadHubSection onOpenForm={openProductForm} />

      {/* 6. Compliance & Legal Notices */}
      <ComplianceNoticeSection />

      {/* Modal: Pendaftaran Produk Terpadu (Tabungan, Deposito, Cicil Emas) */}
      <TabunganFormModal
        isOpen={tabunganModalOpen}
        onClose={() => setTabunganModalOpen(false)}
        productName={selectedProduct}
      />

      {/* Modal: Full View Piagam & Penghargaan Preview */}
      <PiagamPreviewModal
        isOpen={piagamPreviewOpen}
        onClose={() => setPiagamPreviewOpen(false)}
      />
    </div>
  );
}