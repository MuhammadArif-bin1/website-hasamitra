"use client";

import React, { useState, useEffect } from "react";
import TabunganFormModal from "@/components/forms/TabunganFormModal";
import CicilEmasModal from "@/components/forms/CicilEmasModal";

interface ProductItem {
  id: number | string;
  slug: string;
  name: string;
  features: string[];
  buttonText: string;
}

export default function ProductSection() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [cicilEmasOpen, setCicilEmasOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("New Tabungan Sabar");

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/produk");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setProducts(json.data);
        }
      } catch (err) {
        console.error("Gagal memuat produk dari database:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const openFormForProduct = (productName: string) => {
    if (productName.toLowerCase().includes("emas")) {
      setCicilEmasOpen(true);
    } else {
      setSelectedProduct(productName);
      setModalOpen(true);
    }
  };

  return (
    <section id="produk" className="py-12 lg:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header (- Produk -) */}
        <div className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 rounded-xl py-4 shadow-sm text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            - Produk -
          </h2>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border border-slate-200 animate-pulse space-y-4 flex flex-col justify-between min-h-[300px]"
              >
                <div className="h-8 bg-slate-200 rounded-lg w-3/4 mx-auto"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6 mx-auto"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3 mx-auto"></div>
                </div>
                <div className="h-10 bg-slate-200 rounded-xl w-4/5 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            Belum ada produk aktif yang ditampilkan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-slate-200"
              >
                {/* Product Header Bar */}
                <div className="bg-orange-500 text-white py-4 px-6 text-center font-bold text-lg sm:text-xl shadow-inner">
                  {product.name}
                </div>

                {/* Product Features List */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center space-y-4 bg-slate-50/50 text-center">
                  {product.features.map((feature, idx) => (
                    <React.Fragment key={idx}>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium px-2 leading-relaxed">
                        {feature}
                      </p>
                      {idx < product.features.length - 1 && (
                        <div className="w-4/5 h-[1px] bg-slate-200 mx-auto"></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Product Card Action Button */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
                  <button
                    type="button"
                    onClick={() => openFormForProduct(product.name)}
                    className="w-4/5 py-2.5 px-4 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/20 transition-all duration-200 text-center cursor-pointer"
                  >
                    {product.buttonText || "Isi datamu sekarang"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Standard Form Modal */}
      <TabunganFormModal
        key={modalOpen ? selectedProduct : "closed"}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        productName={selectedProduct}
      />

      {/* Cicil Emas Google Form Modal */}
      <CicilEmasModal
        isOpen={cicilEmasOpen}
        onClose={() => setCicilEmasOpen(false)}
      />
    </section>
  );
}
