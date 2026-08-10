"use client";

import React, { useState } from "react";
import TabunganFormModal from "./TabunganFormModal";

export default function ProductSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("New Tabungan Sabar");

  const openFormForProduct = (productName: string) => {
    setSelectedProduct(productName);
    setModalOpen(true);
  };

  const products = [
    {
      id: "tabungan-sabar",
      name: "New Tabungan Sabar",
      features: [
        "Nasabah dapat memilih hadiah sesuai yang diinginkan",
        "Bebas biaya administrasi",
        "Jangka waktu mulai 6 sampai 12 bulan",
      ],
      buttonText: "Isi datamu sekarang",
    },
    {
      id: "deposito-sideka",
      name: "Deposito Si Deka",
      features: [
        "Deposito berjangka yang sangat fleksibel dan sangat aman",
        "Suku bunga relatif tinggi",
        "Dijamin LPS",
      ],
      buttonText: "Isi datamu sekarang",
    },
    {
      id: "cicil-emas",
      name: "Cicil Emas",
      features: [
        "Angsuran Tetap",
        "Keamanan Terjamin",
        "Cocok Sebagai Investasi Jangka Panjang",
      ],
      buttonText: "Isi datamu sekarang",
    },
  ];

  return (
    <section id="produk" className="py-12 lg:py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header matching Image 2 (- Produk -) */}
        <div className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-amber-600/70 rounded-t-xl py-4 shadow-sm mb-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            - Produk -
          </h2>
        </div>

        {/* 3 Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-slate-200"
            >
              {/* Product Header Bar */}
              <div className="bg-[#00a651] text-white py-4 px-6 text-center font-bold text-lg sm:text-xl shadow-inner">
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
                  className="w-4/5 py-2.5 px-4 bg-[#ff7a00] hover:bg-[#e06b00] active:scale-95 text-white font-bold text-sm rounded-md shadow transition-all duration-200 text-center"
                >
                  {product.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Modal for direct user input (Nama, Alamat, Email, Jangka Waktu / Berat) */}
      <TabunganFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        productName={selectedProduct}
      />
    </section>
  );
}
