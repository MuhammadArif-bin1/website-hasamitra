import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Logo & Makna - Bank Hasamitra Jawa Barat",
  description: "Makna dan filosofi logo resmi PT BPR Hasamitra Jawa Barat.",
};

export default function LogoMaknaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <main className="flex-1 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Submenu Tabs Navigation */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
            <Link
              href="/tentang-kami/profil-perusahaan"
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
            >
              Profil Perusahaan
            </Link>
            <Link
              href="/tentang-kami/logo-makna"
              className="px-5 py-2.5 rounded-full text-sm font-bold bg-emerald-600 text-white shadow-sm shrink-0"
            >
              Logo &amp; Makna
            </Link>
            <Link
              href="/tentang-kami/pengurus"
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
            >
              Pengurus
            </Link>
            <Link
              href="/tentang-kami/struktur-organisasi"
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
            >
              Struktur Organisasi
            </Link>
            <Link
              href="/tentang-kami/penghargaan"
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
            >
              Penghargaan
            </Link>
          </div>

          {/* Section Banner Header (- Logo & Makna -) */}
          <div className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-amber-600/70 rounded-2xl py-4 shadow-md text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
              - Logo &amp; Makna -
            </h1>
          </div>

          {/* Main Logo & Description Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Round Logo Image */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 shrink-0">
                  <Image
                    src="/logo bulat.png"
                    alt="Logo Bulat Bank Hasamitra"
                    width={320}
                    height={320}
                    className="w-full h-full object-contain drop-shadow-md"
                    priority
                  />
                </div>
              </div>

              {/* Right Column: Logo Explanation Text */}
              <div className="lg:col-span-8 space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed text-justify sm:text-left">
                <p>
                  Hasamitra diambil dari bahasa Sansekerta. <em className="not-italic font-semibold text-slate-900">Hasa</em> berarti harapan dan bahagia, sedangkan <em className="not-italic font-semibold text-slate-900">Mitra</em> adalah rekan atau sahabat. <em className="not-italic font-semibold text-slate-900">Hasa Mitra</em> berarti tekad ketulusan dalam menjalin persahabatan untuk meraih kebahagiaan bersama.
                </p>
                <p>
                  Bentuk logogram hasamitra terinspirasi oleh koin yang terdiri atas dua buah kurva setengah lingkar yang dihubungkan oleh simbol equality dan dibungkus oleh lingkaran penuh yang mendeskripsikan makna logo seperti diatas, dan merefleksikan value BPR Hasamitra : <span className="font-semibold text-slate-900">Trust</span> (kepercayaan), <span className="font-semibold text-slate-900">Integrity</span> (Kejujuran), <span className="font-semibold text-slate-900">Prudence</span> (Kehati-hatian) dan <span className="font-semibold text-slate-900">Professionalism</span> (profesionalisme).
                </p>
              </div>
            </div>
          </div>

          {/* OJK & LPS Guarantees Notice */}
          <div className="text-center space-y-2 text-slate-700 py-6 border-y border-slate-200">
            <p className="text-sm font-semibold">
              BPR Hasamitra Jabar berizin dan diawasi oleh <strong className="text-slate-900">Otoritas Jasa Keuangan (OJK)</strong> dan merupakan peserta penjaminan <strong className="text-slate-900">Lembaga Penjamin Simpanan (LPS)</strong>.
            </p>
            <p className="text-xs text-slate-600">
              Nilai simpanan maksimum yang dijamin oleh LPS sebesar <strong className="text-slate-900">Rp 2 Miliar</strong>, dengan tingkat bunga penjaminan maksimum sebesar <strong className="text-slate-900">6.25%</strong> untuk rupiah sesuai ketentuan yang berlaku.
            </p>
          </div>

          {/* Bottom WhatsApp CS Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900 text-white p-8 rounded-3xl shadow-xl gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-xl font-bold">Ada Pertanyaan Seputar Layanan Hasamitra?</h3>
              <p className="text-sm text-slate-300">Hubungi Customer Service kami via WhatsApp resmi.</p>
            </div>
            <WhatsAppButton variant="primary" text="Hubungi via WhatsApp" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
