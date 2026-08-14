import React from "react";
import Image from "next/image";

interface PiagamSectionProps {
  onOpenPreview: () => void;
}

export default function PiagamSection({ onOpenPreview }: PiagamSectionProps) {
  return (
    <section id="piagam" className="py-20 lg:py-24 bg-slate-950 text-white relative overflow-hidden scroll-mt-24">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/profil/background piagam hasamitra.png"
          alt="Background Piagam Hasamitra"
          fill
          className="object-cover object-center"
        />
        {/* Deep dark gradient overlay for optimal contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/85 to-slate-950/95"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Piagam &amp; Penghargaan Resmi
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Bukti dedikasi, kepatuhan regulasi, dan pengakuan performa terbaik PT BPR Hasa Mitra Jawa Barat.
          </p>
        </div>

        {/* Clean Piagam Showcase */}
        <div className="max-w-5xl mx-auto">
          <div
            className="relative rounded-3xl bg-white p-3 sm:p-5 shadow-2xl shadow-black/60 group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-orange-500/20 hover:scale-[1.01]"
            onClick={onOpenPreview}
            title="Klik untuk memperbesar dokumen piagam"
          >
            <Image
              src="/images/dokumen/piagam-hasamitra.png"
              alt="Piagam dan Penghargaan Resmi PT BPR Hasa Mitra Jawa Barat"
              width={1400}
              height={800}
              className="w-full h-auto object-contain rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
              priority
            />

            {/* Modern Hover Overlay */}
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2.5 text-white text-sm font-bold backdrop-blur-xs rounded-3xl">
              <span className="p-3 rounded-full bg-white/20 border border-white/30">
                <svg className="w-6 h-6 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </span>
              <span>Klik untuk Memperbesar Piagam</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
