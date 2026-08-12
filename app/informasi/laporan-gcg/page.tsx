"use client";

import React from "react";
import InformasiTabs from "@/components/informasi/InformasiTabs";
import WhatsAppBanner from "@/components/common/WhatsAppBanner";
import OjkLpsNotice from "@/components/common/OjkLpsNotice";

const gcgReports = [
  { year: 2025, title: "Laporan GCG Tahun 2025", status: "Terpublikasi", size: "2.4 MB" },
  { year: 2024, title: "Laporan GCG Tahun 2024", status: "Terpublikasi", size: "2.1 MB" },
  { year: 2023, title: "Laporan GCG Tahun 2023", status: "Terpublikasi", size: "1.9 MB" },
  { year: 2022, title: "Laporan GCG Tahun 2022", status: "Terpublikasi", size: "1.8 MB" },
];

export default function LaporanGcgPage() {
  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Submenu Tabs Navigation */}
        <InformasiTabs />

        {/* Section Banner Header */}
        <div className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 rounded-2xl py-4 shadow-md text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            - Laporan Good Corporate Governance (GCG) -
          </h1>
        </div>

        {/* Intro Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md text-center space-y-4">
          <span className="px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-xs uppercase tracking-wider">
            Tata Kelola Perusahaan
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Penerapan GCG PT BPR Hasamitra Jawa Barat
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto leading-relaxed text-sm sm:text-base">
            PT BPR Hasamitra Jawa Barat secara berkelanjutan menerapkan prinsip-prinsip <strong className="text-slate-900">Good Corporate Governance (GCG)</strong> yang mencakup Transparansi, Akuntabilitas, Responsibilitas, Independensi, dan Kewajaran demi menciptakan nilai tambah bagi seluruh pemangku kepentingan.
          </p>
        </div>

        {/* 5 Principles Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { title: "Transparansi", desc: "Keterbukaan dalam proses keputusan & informasi" },
            { title: "Akuntabilitas", desc: "Kejelasan fungsi & pertanggungjawaban organ bank" },
            { title: "Responsibilitas", desc: "Kepatuhan terhadap peraturan & regulasi OJK" },
            { title: "Independensi", desc: "Pengelolaan profesional tanpa benturan kepentingan" },
            { title: "Kewajaran", desc: "Keadilan dan kesetaraan bagi para stakeholder" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 text-center space-y-2 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center mx-auto text-xs">
                {idx + 1}
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Downloads List */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md space-y-6">
          <h3 className="text-xl font-bold text-slate-900">
            Arsip Laporan Pelaksanaan GCG
          </h3>
          <div className="divide-y divide-slate-100">
            {gcgReports.map((report, idx) => (
              <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">{report.title}</h4>
                    <p className="text-xs text-slate-500">Ukuran berkas: {report.size} • Format PDF</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Mengunduh ${report.title}...`)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Unduh Dokumen PDF
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* OJK & LPS Notice */}
        <OjkLpsNotice />

        {/* WhatsApp CS Banner */}
        <WhatsAppBanner title="Pertanyaan Seputar Tata Kelola Perusahaan (GCG)?" />
      </div>
    </div>
  );
}
