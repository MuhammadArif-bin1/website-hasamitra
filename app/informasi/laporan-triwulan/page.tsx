"use client";

import React from "react";
import InformasiTabs from "@/components/informasi/InformasiTabs";
import WhatsAppBanner from "@/components/common/WhatsAppBanner";
import OjkLpsNotice from "@/components/common/OjkLpsNotice";

const triwulanData = [
  { year: 2025, quarter: "Triwulan IV (Desember 2025)", status: "Terpublikasi" },
  { year: 2025, quarter: "Triwulan III (September 2025)", status: "Terpublikasi" },
  { year: 2025, quarter: "Triwulan II (Juni 2025)", status: "Terpublikasi" },
  { year: 2025, quarter: "Triwulan I (Maret 2025)", status: "Terpublikasi" },
  { year: 2024, quarter: "Triwulan IV (Desember 2024)", status: "Terpublikasi" },
  { year: 2024, quarter: "Triwulan III (September 2024)", status: "Terpublikasi" },
];

export default function LaporanTriwulanPage() {
  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Submenu Tabs Navigation */}
        <InformasiTabs />

        {/* Section Banner Header */}
        <div className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 rounded-2xl py-4 shadow-md text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            - Laporan Keuangan Triwulan -
          </h1>
        </div>

        {/* Intro Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md text-center space-y-4">
          <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider">
            Transparansi Keuangan
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Publikasi Keuangan Publik Berkala
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
            Sesuai dengan ketentuan Otoritas Jasa Keuangan (OJK), PT BPR Hasamitra Jawa Barat mempublikasikan Laporan Keuangan Triwulan secara akurat dan tepat waktu.
          </p>
        </div>

        {/* Table / List */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <h3 className="text-xl font-bold text-slate-900">
            Daftar Laporan Keuangan Triwulan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {triwulanData.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 hover:border-orange-300 bg-slate-50/50 flex items-center justify-between transition-all"
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                    Tahun {item.year}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm">{item.quarter}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Mengunduh ${item.quarter}...`)}
                  className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Unduh
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* OJK & LPS Notice */}
        <OjkLpsNotice />

        {/* WhatsApp CS Banner */}
        <WhatsAppBanner title="Pertanyaan Seputar Laporan Keuangan Triwulan?" />
      </div>
    </div>
  );
}
