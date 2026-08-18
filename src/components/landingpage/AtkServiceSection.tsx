"use client";

import React from "react";

interface AtkServiceSectionProps {
  onOpenPurchaseModal: () => void;
  onOpenRequestModal: () => void;
}

export function TelegramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  );
}

export default function AtkServiceSection({
  onOpenPurchaseModal,
  onOpenRequestModal,
}: AtkServiceSectionProps) {
  const telegramStaffUrl =
    process.env.NEXT_PUBLIC_TELEGRAM_STAFF_URL || "https://t.me/hasamitrajabar";

  return (
    <section id="layanan-atk" className="py-20 lg:py-24 bg-white border-b border-slate-200 scroll-mt-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider border border-orange-200/80">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            Layanan Internal Operasional
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Layanan Pengajuan ATK
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Portal terintegrasi untuk pengajuan permohonan alat tulis kantor maupun pengadaan pembelian barang baru bagi seluruh divisi dan karyawan Bank Hasamitra.
          </p>
        </div>

        {/* 2 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Pengajuan Pembelian ATK */}
          <div className="bg-slate-50/70 rounded-3xl border border-slate-200/90 hover:border-orange-400 p-8 flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200">
                  Pengadaan Baru
                </span>
                <span className="text-xs text-slate-400 font-medium font-mono">PURCHASE</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                  Pengajuan Pembelian ATK
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Ajukan pengadaan pembelian barang atau perlengkapan ATK baru yang belum tersedia di inventaris kantor melalui formulir cepat dan transparan.
                </p>
              </div>

              {/* Feature Points */}
              <div className="pt-3 border-t border-slate-200/70 space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                  <span className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  <span>Formulir ringkas 7 data esensial</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                  <span className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  <span>Nomor pengajuan otomatis dari sistem</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                  <span className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  <span>Pemantauan status pengadaan terpusat</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                type="button"
                onClick={onOpenPurchaseModal}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm tracking-wide text-center inline-flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Ajukan Pembelian ATK</span>
              </button>
            </div>
          </div>

          {/* Card 2: Pengajuan ATK (Stok Inventaris) */}
          <div className="bg-slate-50/70 rounded-3xl border border-slate-200/90 hover:border-amber-400 p-8 flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                  Permintaan Stok
                </span>
                <span className="text-xs text-slate-400 font-medium font-mono">REQUEST</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  Pengajuan ATK
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Permintaan barang ATK dari inventaris kantor untuk kebutuhan operasional harian karyawan, divisi, atau unit kerja Bank Hasamitra.
                </p>
              </div>

              {/* Feature Points */}
              <div className="pt-3 border-t border-slate-200/70 space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  <span>Formulir cepat 6 data esensial</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  <span>Pilihan barang standar siap distribusi</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                  <span>Konfirmasi langsung dari staf inventaris</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                type="button"
                onClick={onOpenRequestModal}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm tracking-wide text-center inline-flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md shadow-amber-500/20 hover:shadow-amber-500/35 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Ajukan ATK</span>
              </button>
            </div>
          </div>
        </div>

        {/* Telegram Urgent CTA Banner */}
        <div className="bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 text-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-sky-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 border border-sky-400">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/20 text-sky-100 text-xs font-semibold backdrop-blur-xs">
              <span>⚡</span>
              <span>Layanan Cepat</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">Argent? Hubungi staf sekarang</h3>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
              Butuh perlengkapan mendesak untuk operasional darurat? Hubungi staf administrasi langsung melalui Telegram resmi.
            </p>
          </div>

          <a
            href={telegramStaffUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-white hover:bg-sky-50 text-sky-700 font-bold text-sm tracking-wide shadow-lg transition-all duration-300 hover:-translate-y-0.5 inline-flex items-center gap-2.5 cursor-pointer"
          >
            <TelegramIcon className="w-5 h-5 text-sky-600" />
            <span>Hubungi via Telegram</span>
          </a>
        </div>
      </div>
    </section>
  );
}
