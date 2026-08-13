"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import WhatsAppButton from "@/components/WhatsAppButton";
import CicilEmasModal from "@/components/CicilEmasModal";

export default function Home() {
  const [cicilEmasOpen, setCicilEmasOpen] = useState(false);

  return (
    <>
      {/* HASAMITRA HERO SECTION */}
      <section id="hasamitra" className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/70 text-white py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600/20 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto space-y-8 text-center">
            {/* Header Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Selamat Datang di <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-200">Website Hasamitra Jawa Barat</span>
            </h1>

            {/* Bank Korespondensi Image Showcase Card */}
            <div className="max-w-3xl mx-auto overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-800/80 p-3 sm:p-4 shadow-2xl backdrop-blur-md space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 px-2 text-left">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse"></span>
                  Daftar Korespondensi (Online) : A.N. PT BPR HASAMITRA JAWA BARAT
                </span>
                <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest bg-slate-700/80 px-2.5 py-1 rounded-md border border-slate-600">
                  Resmi
                </span>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-700/50 bg-white shadow-inner">
                <Image
                  src="/daftar bank korespondensi.png"
                  alt="Daftar Bank Korespondensi Online A.N. PT BPR Hasamitra Jawa Barat"
                  width={1200}
                  height={800}
                  className="w-full h-auto object-contain mx-auto transition-transform duration-300 hover:scale-[1.01]"
                  priority
                />
              </div>
            </div>

            {/* Welcome Description */}
            <div className="space-y-4 pt-2">
              <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Situs ini kami maksudkan untuk menjalin hubungan komunikasi yang akrab dengan masyarakat umum khususnya para nasabah BPR Hasamitra Jabar, sekaligus untuk memperkenalkan BPR Hasamitra Jabar sebagai Bank yang dapat menghimpun dana masyarakat dan memberikan pinjaman modal kerja maupun kebutuhan pinjaman konsumtif bagi masyarakat. Situs ini muncul sebagai perwujudan dari komitmen dan visi kami untuk menjadi Bank lokal dengan reputasi Nasional yang sehat, kuat dan terpercaya.
              </p>

              <p className="text-sm sm:text-base font-semibold text-orange-300 pt-2">
                Silahkan download form Hasamitra untuk mempermudah pengajuan perbankan anda!
              </p>
            </div>

            {/* Forms Action Cards Grid: Form Permohonan Kredit & Form Cicil Emas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 max-w-3xl mx-auto">
              {/* Form Permohonan Kredit Card */}
              <div className="bg-slate-800/70 border border-slate-700 hover:border-orange-500/50 p-5 rounded-2xl flex flex-col justify-between space-y-4 text-left transition-all shadow-md">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/20 inline-block">
                    Dokumen Kredit (PDF)
                  </span>
                  <h3 className="text-lg font-bold text-white">Form Permohonan Kredit</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Unduh formulir resmi permohonan kredit untuk fasilitas pinjaman modal kerja / konsumtif.
                  </p>
                </div>
                <a
                  href="https://hasamitrajabar.com/wp-content/uploads/2021/05/Permohonan-Kredit.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 transition-all text-center inline-flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Form Kredit (PDF)
                </a>
              </div>

              {/* Form Pendaftaran Cicil Emas Card */}
              <div className="bg-slate-800/70 border border-slate-700 hover:border-amber-500/50 p-5 rounded-2xl flex flex-col justify-between space-y-4 text-left transition-all shadow-md">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 inline-block">
                    Formulir Online (Google Form)
                  </span>
                  <h3 className="text-lg font-bold text-white">Form Pendaftaran Cicil Emas</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Pengajuan pendaftaran investasi Cicil Emas secara cepat melalui Google Forms resmi.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCicilEmasOpen(true)}
                  className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all text-center inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Isi Form Cicil Emas (Online)
                </button>
              </div>
            </div>

            {/* WhatsApp Contact Button */}
            <div className="pt-2 flex justify-center">
              <WhatsAppButton variant="primary" text="Hubungi Kami via WhatsApp" />
            </div>

            {/* OJK & LPS Regulatory Notice Text */}
            <div className="pt-4 border-t border-slate-800/80 max-w-2xl mx-auto">
              <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
                BPR Hasamitra Jabar berizin dan diawasi oleh Otoritas Jasa Keuangan (OJK) dan merupakan peserta penjaminan Lembaga Penjamin Simpanan (LPS).
              </p>
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

      {/* Cicil Emas Google Form Modal */}
      <CicilEmasModal isOpen={cicilEmasOpen} onClose={() => setCicilEmasOpen(false)} />
    </>
  );
}
