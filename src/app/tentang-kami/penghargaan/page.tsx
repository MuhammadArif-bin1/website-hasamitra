"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import WhatsAppBanner from "@/components/common/WhatsAppBanner";
import OjkLpsNotice from "@/components/common/OjkLpsNotice";

export default function PenghargaanPage() {
  const [zoomOpen, setZoomOpen] = useState(false);

  return (
    <div className="py-10 sm:py-14 lg:py-16 bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 flex-wrap">
          <Link href="/" className="hover:text-orange-600 transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">
            Piagam &amp; Penghargaan
          </span>
        </nav>

        {/* Section Banner Header */}
        <div className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 rounded-2xl py-5 shadow-md text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            - Piagam &amp; Penghargaan Resmi -
          </h1>
          <p className="text-xs sm:text-sm text-orange-100 mt-1">
            Bukti Komitmen dan Kinerja Terbaik PT BPR Hasa Mitra Jawa Barat
          </p>
        </div>

        {/* Piagam & Penghargaan Image Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs uppercase tracking-wider">
              Prestasi &amp; Legalitas Resmi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Dokumen Piagam &amp; Penghargaan
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Klik gambar di bawah untuk melihat piagam penghargaan dalam ukuran penuh.
            </p>
          </div>

          {/* Interactive Document Image */}
          <div
            onClick={() => setZoomOpen(true)}
            className="relative w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-slate-50 cursor-pointer group"
          >
            <Image
              src="/images/dokumen/piagam-hasamitra.png"
              alt="Piagam dan Penghargaan PT BPR Hasa Mitra Jawa Barat"
              width={1400}
              height={850}
              className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.01]"
              priority
            />

            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs sm:text-sm font-bold">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
              Klik untuk Memperbesar Piagam
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl mx-auto text-center">
            Berbagai piagam dan penghargaan resmi yang diraih oleh <strong className="text-slate-900">PT BPR Hasa Mitra Jawa Barat</strong> atas kinerja keuangan dan pelayanan terbaik, termasuk pengakuan dari Infobank dan The Finance.
          </p>
        </div>

        {/* OJK & LPS Guarantees Notice */}
        <OjkLpsNotice />

        {/* Bottom WhatsApp CS Banner */}
        <WhatsAppBanner title="Ada Pertanyaan Seputar Layanan & Legalitas Hasamitra?" />
      </div>

      {/* Lightbox Zoom Modal for Piagam */}
      {zoomOpen && (
        <div
          onClick={() => setZoomOpen(false)}
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6"
        >
          <div className="w-full flex items-center justify-between text-white max-w-6xl z-10">
            <span className="text-sm font-bold text-slate-200">
              Piagam &amp; Penghargaan PT BPR Hasamitra Jawa Barat
            </span>
            <button
              onClick={() => setZoomOpen(false)}
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition cursor-pointer"
              aria-label="Tutup"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl h-[75vh] sm:h-[82vh] flex items-center justify-center"
          >
            <Image
              src="/images/dokumen/piagam-hasamitra.png"
              alt="Piagam dan Penghargaan PT BPR Hasa Mitra Jawa Barat Full"
              fill
              className="object-contain"
            />
          </div>

          <div className="text-xs text-slate-400">
            Klik di luar gambar atau tombol silang untuk menutup
          </div>
        </div>
      )}
    </div>
  );
}
