import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Pengurus - Bank Hasamitra Jawa Barat",
  description: "Jajaran Pengurus & Manajemen PT BPR Hasamitra Jawa Barat.",
};

export default function PengurusPage() {
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
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
            >
              Logo & Makna
            </Link>
            <Link
              href="/tentang-kami/pengurus"
              className="px-5 py-2.5 rounded-full text-sm font-bold bg-emerald-600 text-white shadow-sm shrink-0"
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

          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md text-center space-y-6">
            <span className="px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-xs uppercase tracking-wider">
              Tentang Kami
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Pengurus
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Silakan lampirkan gambar/materi untuk jajaran Pengurus berikutnya untuk kami implementasikan.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
