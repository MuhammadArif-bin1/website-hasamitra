import React from "react";
import Image from "next/image";
import WhatsAppButton from "@/components/common/WhatsAppButton";

export default function HeroSection() {
  return (
    <section
      id="hasamitra"
      className="relative bg-slate-950 text-white min-h-[540px] sm:min-h-[600px] lg:min-h-[680px] flex items-center overflow-hidden border-b border-slate-800/80"
    >
      {/* Background Image with Ambient Glow Overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Background Image: Scaled and shifted towards right on mobile so Hasamitra Jabar text is fully visible */}
        <div className="absolute top-0 left-0 right-0 h-[320px] xs:h-[360px] sm:h-full sm:inset-0">
          <Image
            src="/images/profil/gambar background hasamitra.png"
            alt="Background Bank Hasamitra Jawa Barat"
            fill
            priority
            className="object-cover object-[80%_center] sm:object-center transition-all duration-700"
          />
          {/* Mobile vertical gradient fade so image is clearly visible and fades smoothly to dark content area */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/70 to-slate-950 sm:hidden"></div>
        </div>

        {/* Desktop Gradient Overlay */}
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/50"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 relative z-10 w-full">
        <div className="max-w-3xl space-y-8 text-left">
          {/* Primary Modern Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
            Mitra Finansial Terpercaya untuk Pertumbuhan{" "}
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              Ekonomi Jawa Barat
            </span>
          </h1>

          {/* Crisp Value Proposition Description */}
          <p className="text-base sm:text-lg text-slate-200/90 leading-relaxed max-w-2xl font-normal">
            BPR Hasamitra Jawa Barat berkomitmen menghimpun dana masyarakat melalui produk Tabungan &amp; Deposito bergaransi LPS, serta menyalurkan fasilitas kredit modal kerja dan konsumtif dengan proses cepat, transparan, dan terpercaya.
          </p>

          {/* Modern Floating Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href="#produk"
              className="group px-7 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm tracking-wide shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 hover:-translate-y-0.5 inline-flex items-center gap-2.5 cursor-pointer"
            >
              <span>Lihat Produk Perbankan</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </a>

            <a
              href="https://hasamitrajabar.com/wp-content/uploads/2021/05/Permohonan-Kredit.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-100 hover:text-white font-semibold text-sm tracking-wide transition-all duration-300 hover:-translate-y-0.5 inline-flex items-center gap-2 border border-white/20 backdrop-blur-xl shadow-md"
            >
              <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Form Kredit (PDF)</span>
            </a>

            <WhatsAppButton
              variant="primary"
              text="HUBUNGI CS"
              className="rounded-2xl px-6 py-3.5 text-sm font-bold shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/35 transition-all duration-300 hover:-translate-y-0.5"
            />
          </div>

          {/* Regulatory Quick Strip (Modern Glass Chips) */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">✓</span>
              <span><strong>Berizin &amp; Diawasi:</strong> Otoritas Jasa Keuangan (OJK)</span>
            </div>
            <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">✓</span>
              <span><strong>Peserta Penjaminan:</strong> LPS hingga Rp 2 Miliar</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
