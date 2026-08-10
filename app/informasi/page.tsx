import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { contactData } from "@/data/contact";

export const metadata = {
  title: "Informasi - Bank Hasamitra Jawa Barat",
  description: "Informasi & Transparansi Pelayanan PT BPR Hasamitra Jawa Barat.",
};

export default function InformasiPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <main className="flex-1 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold text-xs uppercase tracking-wider mb-3">
              Informasi Publik
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Informasi & Transparansi
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Komitmen kami dalam menyajikan transparansi informasi publik dan pelayanan terbaik bagi seluruh nasabah.
            </p>
          </div>

          {/* Grid Informasi */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                Komitmen Pelayanan Terbaik untuk Nasabah
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Kami mengutamakan asas transparansi dan kemudahan akses informasi publik bagi setiap nasabah. Jika Anda memiliki pertanyaan atau butuh bantuan lebih lanjut, silakan sampaikan melalui formulir atau kontak WhatsApp kami.
              </p>
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold mt-0.5 shrink-0">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Layanan Pengaduan Resmi</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Dapat diakses secara online via Contact Form maupun WhatsApp resmi CS.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold mt-0.5 shrink-0">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Respons Cepat CS Hasamitra</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Tim Customer Service siap melayani pertanyaan pada jam operasional kerja.</p>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm transition-colors shadow-md"
                >
                  Buka Halaman Contact Form
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-900 text-white p-8 sm:p-10 rounded-3xl space-y-6 shadow-xl">
              <h2 className="text-2xl font-bold">Hubungi CS via WhatsApp</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Tekan tombol di bawah untuk terhubung langsung dengan pihak Bank Hasamitra Jawa Barat di nomor resmi <strong className="text-emerald-400">{contactData.whatsapp}</strong>.
              </p>
              <div className="pt-2">
                <WhatsAppButton variant="primary" text="Hubungi Kami via WhatsApp" className="w-full justify-center" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
