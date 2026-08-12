"use client";

import React from "react";
import InformasiTabs from "@/components/informasi/InformasiTabs";
import WhatsAppBanner from "@/components/common/WhatsAppBanner";
import OjkLpsNotice from "@/components/common/OjkLpsNotice";

const annualReports = [
  {
    year: 2025,
    title: "Annual Report 2025 - Pertumbuhan Berkelanjutan & Layanan Digital",
    auditor: "KAP Terdaftar OJK",
    opinion: "Wajar Tanpa Pengecualian (WTP)",
    size: "8.5 MB",
  },
  {
    year: 2024,
    title: "Annual Report 2024 - Penguatan Kinerja & Solusi Keuangan",
    auditor: "KAP Terdaftar OJK",
    opinion: "Wajar Tanpa Pengecualian (WTP)",
    size: "7.8 MB",
  },
  {
    year: 2023,
    title: "Annual Report 2023 - Kemitraan Tangguh Demi Kemajuan Bersama",
    auditor: "KAP Terdaftar OJK",
    opinion: "Wajar Tanpa Pengecualian (WTP)",
    size: "6.9 MB",
  },
];

export default function LaporanTahunanPage() {
  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Submenu Tabs Navigation */}
        <InformasiTabs />

        {/* Section Banner Header */}
        <div className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 rounded-2xl py-4 shadow-md text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            - Laporan Tahunan (Annual Report) -
          </h1>
        </div>

        {/* Intro Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md text-center space-y-4">
          <span className="px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 font-bold text-xs uppercase tracking-wider">
            Akuntabilitas Publik
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Laporan Tahunan PT BPR Hasamitra Jawa Barat
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto leading-relaxed text-sm sm:text-base">
            Laporan Tahunan (*Annual Report*) menyajikan gambaran komprehensif mengenai kinerja keuangan, pencapaian strategis, tata kelola, dan kontribusi sosial PT BPR Hasamitra Jawa Barat selama satu tahun buku.
          </p>
        </div>

        {/* Annual Reports Cards */}
        <div className="space-y-6">
          {annualReports.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
            >
              <div className="lg:col-span-3 flex justify-center">
                <div className="w-full max-w-[200px] aspect-[3/4] bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 text-white flex flex-col justify-between shadow-lg text-center">
                  <span className="text-xs font-bold uppercase tracking-wider bg-white/20 py-1 px-3 rounded-full mx-auto">
                    Annual Report
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-4xl font-extrabold">{item.year}</h3>
                    <p className="text-xs text-orange-100">Hasamitra Jabar</p>
                  </div>
                  <p className="text-[10px] text-white/80">PDF Document</p>
                </div>
              </div>

              <div className="lg:col-span-9 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-md bg-orange-100 text-orange-800 font-bold text-xs">
                    Tahun Buku {item.year}
                  </span>
                  <span className="px-3 py-1 rounded-md bg-green-100 text-green-800 font-bold text-xs">
                    Opini: {item.opinion}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Diaudit oleh: <strong className="text-slate-800">{item.auditor}</strong> • Ukuran Berkas: {item.size}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => alert(`Mengunduh Laporan Tahunan ${item.year}...`)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors shadow-md shadow-orange-500/20 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Unduh Annual Report ({item.year})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* OJK & LPS Notice */}
        <OjkLpsNotice />

        {/* WhatsApp CS Banner */}
        <WhatsAppBanner title="Informasi Lebih Lanjut Mengenai Laporan Tahunan?" />
      </div>
    </div>
  );
}
