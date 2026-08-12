"use client";

import React from "react";
import InformasiTabs from "@/components/informasi/InformasiTabs";
import WhatsAppBanner from "@/components/common/WhatsAppBanner";
import OjkLpsNotice from "@/components/common/OjkLpsNotice";

const charterSections = [
  {
    title: "1. Maksud & Tujuan Audit Internal",
    content: "Piagam Audit Internal (*Internal Audit Charter*) menetapkan kerangka kerja, posisi, wewenang, dan tanggung jawab Satuan Kerja Audit Internal (SKAI) dalam memberikan keyakinan objektif (*assurance*) serta konsultasi demi meningkatkan nilai operasional PT BPR Hasamitra Jawa Barat.",
  },
  {
    title: "2. Kedudukan & Independensi SKAI",
    content: "SKAI bertanggung jawab langsung kepada Direktur Utama dan berkoordinasi dengan Dewan Komisaris melalui Komite Audit. Auditor internal menjaga independensi, kebebasan dari benturan kepentingan, serta objektivitas dalam pelaksanaan tugas pemeriksaan audit.",
  },
  {
    title: "3. Wewenang Audit Internal",
    content: "Auditor Internal memiliki akses penuh dan tidak terbatas terhadap seluruh catatan keuangan, dokumen operasional, aset perusahaan, serta personel PT BPR Hasamitra Jawa Barat sesuai lingkup pengawasan.",
  },
  {
    title: "4. Ruang Lingkup & Kepatuhan Regulasi",
    content: "Pemeriksaan mencakup evaluasi kecukupan sistem pengendalian internal, efektivitas manajemen risiko, kepatuhan terhadap peraturan perundang-undangan OJK, serta standar etika profesi audit internal perbankan.",
  },
];

export default function PiagamAuditInternalPage() {
  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Submenu Tabs Navigation */}
        <InformasiTabs />

        {/* Section Banner Header */}
        <div className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 rounded-2xl py-4 shadow-md text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            - Piagam Audit Internal (Internal Audit Charter) -
          </h1>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md text-center space-y-4">
          <span className="px-3.5 py-1 rounded-full bg-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider">
            Pengawasan & Integritas
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Piagam Audit Internal SKAI Hasamitra Jabar
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto leading-relaxed text-sm sm:text-base">
            Pedoman kerja resmi Satuan Kerja Audit Internal (SKAI) dalam menjalankan fungsi audit dan pengawasan independen yang disahkan oleh Manajemen dan Dewan Komisaris.
          </p>
        </div>

        {/* Charter Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {charterSections.map((sec, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3"
            >
              <h3 className="text-lg font-bold text-slate-900">{sec.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify sm:text-left">
                {sec.content}
              </p>
            </div>
          ))}
        </div>

        {/* PDF Download Document Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Unduh Dokumen Lengkap Piagam Audit Internal</h3>
            <p className="text-slate-300 text-xs sm:text-sm">
              Unduh salinan resmi Piagam Audit Internal PT BPR Hasamitra Jawa Barat versi terpublikasi (Format PDF).
            </p>
          </div>
          <button
            type="button"
            onClick={() => alert("Mengunduh Piagam Audit Internal (PDF)...")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm transition-colors shrink-0 shadow-md shadow-orange-500/25 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Unduh Dokumen (PDF)
          </button>
        </div>

        {/* OJK & LPS Notice */}
        <OjkLpsNotice />

        {/* WhatsApp CS Banner */}
        <WhatsAppBanner title="Pertanyaan Terkait Piagam Audit Internal?" />
      </div>
    </div>
  );
}
