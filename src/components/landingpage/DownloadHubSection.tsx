import React from "react";

interface DownloadHubSectionProps {
  onOpenForm: (productName: string) => void;
}

export default function DownloadHubSection({ onOpenForm }: DownloadHubSectionProps) {
  return (
    <section id="formulir" className="py-20 lg:py-24 bg-slate-50 border-b border-slate-200 scroll-mt-24 relative">
      {/* Anchor alias to also support #unduh */}
      <span id="unduh" className="absolute -top-24 left-0 pointer-events-none"></span>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pusat Formulir &amp; Pengajuan Berkas
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Unduh formulir resmi atau lengkapi pengajuan perbankan Anda secara langsung melalui pilihan di bawah ini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Box 1: Form Permohonan Kredit PDF */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 flex flex-col justify-between space-y-6 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200">
                  Berkas Cetak PDF
                </span>
                <span className="text-xs text-slate-400 font-medium">Resmi Hasamitra</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Form Permohonan Kredit</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Formulir permohonan pinjaman kredit modal kerja, investasi usaha, atau konsumtif. Silakan unduh, cetak, lengkapi persyaratan, dan serahkan ke kantor cabang terdekat.
              </p>
            </div>

            <a
              href="https://hasamitrajabar.com/wp-content/uploads/2021/05/Permohonan-Kredit.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm tracking-wide text-center inline-flex items-center justify-center gap-2.5 transition-all duration-300 hover:shadow-lg shadow-slate-900/20"
            >
              <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Unduh Form Kredit (PDF) ↗</span>
            </a>
          </div>

          {/* Box 2: Form Online Cicil Emas */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 flex flex-col justify-between space-y-6 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                  Formulir Digital
                </span>
                <span className="text-xs text-slate-400 font-medium">Resmi Hasamitra</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Form Pendaftaran Cicil Emas</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pengajuan kepemilikan emas logam mulia secara online melalui formulir digital interaktif. Tim Hasamitra akan segera menghubungi Anda untuk konfirmasi pesanan.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenForm("Program Cicil Emas")}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm tracking-wide text-center inline-flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Buka Form Cicil Emas (Online)</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
