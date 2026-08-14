import React from "react";

export default function TrustMetricsSection() {
  return (
    <section className="relative -mt-8 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
            01
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Berizin &amp; Diawasi OJK</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Operasional perbankan terdaftar dan berizin resmi dari Otoritas Jasa Keuangan.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
            02
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Dijamin LPS s/d 2 Miliar</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Simpanan nasabah terlindungi program penjaminan Lembaga Penjamin Simpanan.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            03
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Kredit Cepat &amp; Solutif</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Fasilitas pinjaman modal kerja, investasi usaha mikro, dan kebutuhan konsumtif.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
            04
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Cicil Emas Logam Mulia</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Kemudahan memiliki emas batangan asli dengan angsuran terencana dan terjangkau.
          </p>
        </div>
      </div>
    </section>
  );
}
