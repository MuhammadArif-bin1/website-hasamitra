import React from "react";
import { ProductItem } from "./types";

interface ProductsSectionProps {
  products: ProductItem[];
  onOpenForm: (productName: string) => void;
}

export default function ProductsSection({ products, onOpenForm }: ProductsSectionProps) {
  return (
    <section id="produk" className="py-20 lg:py-28 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Modern Centered Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Produk Perbankan Pilihan
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Pilihan produk simpanan, investasi, dan pembiayaan yang terintegrasi untuk mendukung pertumbuhan finansial Anda.
          </p>
        </div>

        {/* Modern Products Grid with Sleek Hover Animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {products.map((product) => {
            const isEmas = product.slug.includes("emas") || product.name.toLowerCase().includes("emas");

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-orange-400 flex flex-col justify-between shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden group relative"
              >
                {/* Decorative top accent line */}
                <div
                  className={`h-2 w-full ${
                    isEmas
                      ? "bg-gradient-to-r from-amber-400 to-amber-600"
                      : "bg-gradient-to-r from-orange-500 to-amber-500"
                  }`}
                ></div>

                <div className="p-7 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Pill Badge */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          isEmas
                            ? "text-amber-800 bg-amber-50 border border-amber-200"
                            : "text-orange-700 bg-orange-50 border border-orange-200"
                        }`}
                      >
                        {product.category || (isEmas ? "Investasi Emas" : "Perbankan")}
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        {isEmas ? "Logam Mulia" : "Perorangan & Usaha"}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed min-h-[44px]">
                      {product.description || "Solusi keuangan terbaik dengan pelayanan aman dan terpercaya."}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                            isEmas
                              ? "bg-amber-100 text-amber-700"
                              : "bg-orange-100 text-orange-600"
                          }`}
                        >
                          ✓
                        </span>
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button Footer */}
                <div className="p-6 sm:p-8 bg-slate-50/80 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onOpenForm(product.name)}
                    className={`w-full py-3.5 px-5 rounded-2xl text-white font-bold text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-lg text-center cursor-pointer ${
                      isEmas
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-500/25 hover:shadow-amber-500/40"
                        : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-500/25 hover:shadow-orange-500/40"
                    }`}
                  >
                    {product.buttonText || (isEmas ? "Formulir Cicil Emas Online" : "Isi Datamu Sekarang")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
