import React from "react";
import InformasiTabs from "@/components/informasi/InformasiTabs";
import WhatsAppBanner from "@/components/common/WhatsAppBanner";
import OjkLpsNotice from "@/components/common/OjkLpsNotice";

export const metadata = {
  title: "Laporan Tahunan",
  description: "Laporan Keuangan & Annual Report PT BPR Hasamitra Jawa Barat.",
};

const annualReports = [
  {
    year: "2025",
    title: "Annual Report 2025",
    subtitle: "Pertumbuhan Berkelanjutan & Layanan Digital",
    auditor: "KAP Terdaftar OJK",
    opinion: "Wajar Tanpa Pengecualian (WTP)",
    fileUrl: "https://hasamitrajabar.com/wp-content/uploads/2026/05/ilovepdf_merged-16.pdf",
    gradient: "from-orange-500 via-amber-500 to-orange-600",
    badgeBg: "bg-orange-50 text-orange-700 border-orange-200",
  },
  {
    year: "2024",
    title: "Annual Report 2024",
    subtitle: "Penguatan Kinerja & Solusi Keuangan Terpercaya",
    auditor: "KAP Terdaftar OJK",
    opinion: "Wajar Tanpa Pengecualian (WTP)",
    fileUrl: "https://hasamitrajabar.com/wp-content/uploads/2025/05/ANNUAL-REPORT-2024.pdf",
    gradient: "from-slate-800 via-slate-900 to-orange-950",
    badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    year: "2023",
    title: "Annual Report 2023",
    subtitle: "Kemitraan Tangguh Demi Kemajuan Bersama",
    auditor: "KAP Terdaftar OJK",
    opinion: "Wajar Tanpa Pengecualian (WTP)",
    fileUrl: "https://hasamitrajabar.com/wp-content/uploads/2025/05/ANNUAL-REPORT-2023_merged.pdf",
    gradient: "from-orange-600 via-amber-600 to-slate-900",
    badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
  },
  {
    year: "2022",
    title: "Publikasi Tahunan 2022",
    subtitle: "Laporan Keuangan Publikasi Tahunan BPR Hasamitra",
    auditor: "KAP Terdaftar OJK",
    opinion: "Wajar Tanpa Pengecualian (WTP)",
    fileUrl: "https://hasamitrajabar.com/wp-content/uploads/2022/04/Publikasi-tahunan-2021-pdf.pdf",
    gradient: "from-slate-700 via-slate-800 to-slate-900",
    badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
  },
];

export default function LaporanTahunanPage() {
  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Submenu Tabs Navigation */}
        <InformasiTabs />

        {/* Section Banner Header */}
        <div className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 rounded-2xl py-4 shadow-md text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            - Laporan Tahunan (Annual Report) -
          </h1>
        </div>

        {/* Intro Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm text-center space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-800 font-bold text-xs uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            Transparansi & Akuntabilitas Publik
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Laporan Keuangan Tahunan PT BPR Hasamitra Jawa Barat
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto leading-relaxed text-sm sm:text-base">
            Unduh dan tinjau laporan publikasi tahunan resmi PT BPR Hasamitra Jawa Barat yang telah diaudit oleh Kantor Akuntan Publik (KAP) terdaftar di OJK.
          </p>
        </div>

        {/* Reports Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {annualReports.map((report) => (
            <div
              key={report.year}
              className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Card Header Thumbnail */}
              <div className={`relative bg-gradient-to-r ${report.gradient} p-6 sm:p-8 text-white flex items-center justify-between overflow-hidden`}>
                <div className="space-y-1 relative z-10">
                  <span className="text-xs uppercase font-bold tracking-widest text-white/80 bg-white/10 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm">
                    Tahun Buku {report.year}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white pt-2">
                    {report.title}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-1">{report.subtitle}</p>
                </div>

                {/* PDF Icon Badge */}
                <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-md flex flex-col items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[9px] font-extrabold tracking-wider text-white uppercase">PDF</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 rounded-lg border text-xs font-bold ${report.badgeBg}`}>
                      Opini: {report.opinion}
                    </span>
                    <span className="px-3 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium">
                      {report.auditor}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Dokumen resmi publikasi laporan keuangan tahunan BPR Hasamitra Jawa Barat periode {report.year}. Silakan unduh atau lihat langsung melalui format PDF.
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={report.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 hover:shadow-lg transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Lihat PDF ({report.year})
                  </a>
                  <a
                    href={report.fileUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Unduh
                  </a>
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
