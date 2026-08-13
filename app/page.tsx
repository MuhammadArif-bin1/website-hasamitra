import React from "react";
import Link from "next/link";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      {/* HASAMITRA HERO SECTION */}
      <section id="hasamitra" className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/70 text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600/20 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto space-y-6 text-center">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 font-semibold text-xs uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
              Mitra Keuangan Terpercaya Jawa Barat
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              PT BPR Hasamitra <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-200">Jawa Barat</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              PT BPR Hasamitra Jawa Barat berizin dan diawasi oleh OJK serta merupakan peserta penjaminan LPS, memberikan pelayanan keuangan profesional, transparan, dan terpercaya.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all text-center"
              >
                Hubungi Kami
              </Link>
              <WhatsAppButton variant="primary" text="Hubungi Kami via WhatsApp" />
            </div>
          </div>
        </div>
      </section>

      {/* NAVIGATION FEATURE CARDS */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-2">Layanan & Fitur</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Jelajahi Fitur Bank Hasamitra
            </h3>
            <div className="w-16 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Tentang Kami */}
            <Link href="/tentang-kami" className="group bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:border-orange-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  01
                </div>
                <h4 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">TENTANG KAMI</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Pelajari profil perusahaan, legalitas OJK & LPS, serta komitmen pelayanan kami.
                </p>
              </div>
              <div className="pt-6 font-bold text-xs text-orange-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Selengkapnya →
              </div>
            </Link>

            {/* Produk */}
            <Link href="/produk" className="group bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:border-orange-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  02
                </div>
                <h4 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">PRODUK</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Produk resmi: New Tabungan Sabar, Deposito Si Deka, dan Cicil Emas.
                </p>
              </div>
              <div className="pt-6 font-bold text-xs text-orange-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Selengkapnya →
              </div>
            </Link>

            {/* Informasi */}
            <Link href="/informasi" className="group bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:border-orange-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  03
                </div>
                <h4 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">INFORMASI</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Informasi transparansi publik, pengaduan, dan bantuan customer service.
                </p>
              </div>
              <div className="pt-6 font-bold text-xs text-orange-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Selengkapnya →
              </div>
            </Link>

            {/* Contact */}
            <Link href="/contact" className="group bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:border-orange-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  04
                </div>
                <h4 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">CONTACT</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Formulir kontak online, WhatsApp 085772780037, alamat kantor, & lokasi Maps.
                </p>
              </div>
              <div className="pt-6 font-bold text-xs text-orange-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Selengkapnya →
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
