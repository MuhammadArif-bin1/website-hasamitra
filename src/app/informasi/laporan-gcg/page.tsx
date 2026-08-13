import React from "react";
import OjkLpsNotice from "@/components/common/OjkLpsNotice";

export const metadata = {
  title: "Laporan GCG",
  description: "Laporan Good Corporate Governance (GCG) PT BPR Hasamitra Jawa Barat.",
};

export default function LaporanGcgPage() {
  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">


        {/* Section Banner Header */}
        <div className="w-full bg-gradient-to-r from-[#59C173] via-[#FBC02D] to-[#E57A44] rounded-2xl py-4 shadow-md text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            - Laporan GCG -
          </h1>
        </div>

        {/* Main Content Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm max-w-5xl mx-auto space-y-6">
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed text-justify sm:text-left">
            BPR Hasa Mitra Jawa Barat telah melaksanakan dan menjalankan Tata Kelola Perusahaan yang baik dan benar dengan berlandaskan sikap kehati-hatian serta manajemen yang sehat. Prinsip Good Corporate Governance sesungguhnya telah ditanamkan dalam budaya serta perilaku bisnis BPR Hasa Mitra Jawa Barat hal ini tercermin pada kewajaran dalam bertransaksi usaha, keterbukaan serta perilaku manajemen dalam menjalankan bisnis perbankan.
          </p>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed text-justify sm:text-left">
            Prinsip GCG sebagaimana yang telah diterapkan di BPR Hasa Mitra Jawa Barat berpedoman kepada petunjuk pelaksanaan kebijakan dan praktek tata kelola perusahaan antara lain diambil dari Kode Etik Tata Kelola Perusahaan serta prinsip-prinsip yang dikandung dalam GCG. Berikut ini adalah laporan Good Corporate Governance BPR Hasa Mitra Jawa Barat:
          </p>

          {/* PDF Download Card */}
          <div className="bg-[#eeeeee] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200/60 mt-6">
            <span className="font-bold text-slate-800 text-base sm:text-lg">
              Laporan GCG Tahun 2024
            </span>

            <a
              href="https://hasamitrajabar.com/wp-content/uploads/2025/05/Laporan-Transparansi-Tata-Kelola-periode-2024-.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-[#5cb85c] hover:bg-[#4cae4c] text-white text-sm font-bold shadow-sm transition-colors shrink-0"
            >
              <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
              </svg>
              <span>Download PDF</span>
            </a>
          </div>
        </div>

        {/* OJK & LPS Notice */}
        <OjkLpsNotice />
      </div>
    </div>
  );
}

