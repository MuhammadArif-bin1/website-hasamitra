"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import CicilEmasModal from "@/components/forms/CicilEmasModal";
import TabunganFormModal from "@/components/forms/TabunganFormModal";
import { contactData } from "@/data/contact";

export default function Home() {
  const [cicilEmasOpen, setCicilEmasOpen] = useState(false);
  const [tabunganModalOpen, setTabunganModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("New Tabungan Sabar");
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);

  const openProductForm = (productName: string) => {
    if (productName.toLowerCase().includes("emas")) {
      setCicilEmasOpen(true);
    } else {
      setSelectedProduct(productName);
      setTabunganModalOpen(true);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900">
      {/* 1. HERO SECTION (FLAT & STRUCTURED 2-COLUMN) */}
      <section id="hasamitra" className="relative bg-slate-950 text-white border-b border-slate-800 overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Institutional Headline & Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Official Status Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 text-xs font-semibold text-orange-400 uppercase tracking-wider">
                <span className="w-2 h-2 bg-orange-500 rounded-none"></span>
                <span>PT BPR Hasamitra Jawa Barat • OJK & LPS</span>
              </div>

              {/* Primary Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                Mitra Finansial Terpercaya untuk Pertumbuhan{" "}
                <span className="text-orange-500 border-b-2 border-orange-500 pb-0.5">
                  Ekonomi Jawa Barat
                </span>
              </h1>

              {/* Comprehensive Description */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                BPR Hasamitra Jawa Barat berkomitmen menghimpun dana masyarakat melalui produk Tabungan & Deposito bergaransi LPS, serta menyalurkan fasilitas kredit modal kerja dan konsumtif dengan proses cepat, transparan, dan terpercaya.
              </p>

              {/* Action Buttons Group */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/produk"
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors inline-flex items-center gap-2 border border-orange-500 shadow-sm"
                >
                  Lihat Produk Perbankan
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <a
                  href="https://hasamitrajabar.com/wp-content/uploads/2021/05/Permohonan-Kredit.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors inline-flex items-center gap-2 border border-slate-700"
                >
                  <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Form Kredit (PDF)
                </a>

                <WhatsAppButton variant="compact" text="Konsultasi WhatsApp" className="py-3 px-4 text-xs uppercase tracking-wider font-bold rounded-none" />
              </div>

              {/* Regulatory Quick Strip */}
              <div className="pt-4 border-t border-slate-800/90 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
                <div className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold">✓</span>
                  <span><strong>Berizin & Diawasi:</strong> Otoritas Jasa Keuangan (OJK)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold">✓</span>
                  <span><strong>Peserta Penjaminan:</strong> LPS hingga Rp 2 Miliar</span>
                </div>
              </div>
            </div>

            {/* Right Column: Bank Korespondensi Document Showcase */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 shadow-2xl relative">
                {/* Showcase Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500"></span>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                      Rekening Resmi Penampungan
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-slate-800 px-2 py-0.5 border border-slate-700">
                    Dokumen Sah
                  </span>
                </div>

                {/* Document Image with Click to Zoom */}
                <div 
                  className="relative border border-slate-800 bg-white group cursor-pointer overflow-hidden"
                  onClick={() => setImagePreviewOpen(true)}
                  title="Klik untuk memperbesar dokumen bank korespondensi"
                >
                  <Image
                    src="/images/dokumen/daftar-bank-korespondensi.png"
                    alt="Daftar Bank Korespondensi Online A.N. PT BPR Hasamitra Jawa Barat"
                    width={800}
                    height={550}
                    className="w-full h-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                    priority
                  />
                  
                  {/* Hover Overlay Indicator */}
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold uppercase tracking-wider">
                    <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                    Klik untuk Memperbesar
                  </div>
                </div>

                {/* Showcase Footer Note */}
                <div className="pt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-orange-400">A.N. PT BPR HASAMITRA JAWA BARAT</span>
                  <button
                    type="button"
                    onClick={() => setImagePreviewOpen(true)}
                    className="text-slate-300 hover:text-white font-semibold underline text-[11px] inline-flex items-center gap-1"
                  >
                    Buka Preview ↗
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. TRUST & REGULATORY METRICS STRIP (FLAT GEOMETRIC DIVIDER) */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
            
            {/* Metric 1 */}
            <div className="p-6 text-left space-y-1">
              <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-orange-600 block">
                01. Legalitas Resmi
              </span>
              <h3 className="text-base font-bold text-slate-900">Berizin & Diawasi OJK</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Operasional perbankan terdaftar dan berizin resmi dari Otoritas Jasa Keuangan.
              </p>
            </div>

            {/* Metric 2 */}
            <div className="p-6 text-left space-y-1">
              <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-orange-600 block">
                02. Keamanan Dana
              </span>
              <h3 className="text-base font-bold text-slate-900">Dijamin LPS s/d 2 Miliar</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Simpanan nasabah terlindungi program penjaminan Lembaga Penjamin Simpanan.
              </p>
            </div>

            {/* Metric 3 */}
            <div className="p-6 text-left space-y-1">
              <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-orange-600 block">
                03. Penyaluran Dana
              </span>
              <h3 className="text-base font-bold text-slate-900">Kredit Cepat & Solutif</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fasilitas pinjaman modal kerja, investasi usaha mikro, dan kebutuhan konsumtif.
              </p>
            </div>

            {/* Metric 4 */}
            <div className="p-6 text-left space-y-1">
              <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-orange-600 block">
                04. Investasi Berjangka
              </span>
              <h3 className="text-base font-bold text-slate-900">Cicil Emas Logam Mulia</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kemudahan memiliki emas batangan asli dengan angsuran terencana dan terjangkau.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. LAYANAN & PRODUK UNGGULAN (STRUCTURED FLAT CARDS GRID) */}
      <section className="py-16 lg:py-20 bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-300 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-orange-600">
                Solusi Finansial
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Produk Perbankan Pilihan
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              Pilihan produk simpanan, investasi, dan pembiayaan yang dirancang untuk mendukung stabilitas keuangan Anda.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Product Card 1: New Tabungan Sabar */}
            <div className="bg-white border border-slate-200 flex flex-col justify-between hover:border-orange-500 transition-colors">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 border border-orange-200">
                    Tabungan
                  </span>
                  <span className="text-xs font-semibold text-slate-500">Perorangan & Usaha</span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900">New Tabungan Sabar</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Solusi simpanan fleksibel dengan kemudahan transaksi dan suku bunga yang menarik tanpa potongan memberatkan.
                </p>

                <div className="pt-2 space-y-2 border-t border-slate-100 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">✓</span>
                    <span>Bebas biaya administrasi bulanan</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">✓</span>
                    <span>Setoran awal terjangkau & fleksibel</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">✓</span>
                    <span>Dijamin oleh Lembaga Penjamin Simpanan (LPS)</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => openProductForm("New Tabungan Sabar")}
                  className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider transition-colors text-center border border-orange-500 cursor-pointer"
                >
                  Daftar Tabungan Online
                </button>
              </div>
            </div>

            {/* Product Card 2: Deposito Si Deka */}
            <div className="bg-white border border-slate-200 flex flex-col justify-between hover:border-orange-500 transition-colors">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 border border-orange-200">
                    Deposito
                  </span>
                  <span className="text-xs font-semibold text-slate-500">Maks. LPS 6.25%</span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900">Deposito Si Deka</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Investasi simpanan berjangka dengan suku bunga optimal, kepastian hasil, serta keamanan penjaminan LPS penuh.
                </p>

                <div className="pt-2 space-y-2 border-t border-slate-100 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">✓</span>
                    <span>Pilihan jangka waktu 1, 3, 6, hingga 12 bulan</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">✓</span>
                    <span>Bunga kompetitif dapat ditransfer ke rekening</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">✓</span>
                    <span>Bisa dijadikan agunan kredit cepat</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => openProductForm("Deposito Si Deka")}
                  className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider transition-colors text-center border border-orange-500 cursor-pointer"
                >
                  Buka Deposito Online
                </button>
              </div>
            </div>

            {/* Product Card 3: Investasi Cicil Emas */}
            <div className="bg-white border border-slate-200 flex flex-col justify-between hover:border-amber-500 transition-colors">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200">
                    Investasi Emas
                  </span>
                  <span className="text-xs font-semibold text-slate-500">Logam Mulia</span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900">Program Cicil Emas</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cara mudah dan aman memiliki emas batangan murni (Antam/Galeri 24) melalui skema angsuran tetap yang terjangkau.
                </p>

                <div className="pt-2 space-y-2 border-t border-slate-100 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span>Pilihan gramatur: 1 gr, 2 gr, 5 gr, s/d 50 gr</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span>Emas fisik asli bersertifikat resmi</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">✓</span>
                    <span>Pendaftaran cepat via formulir interaktif online</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setCicilEmasOpen(true)}
                  className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider transition-colors text-center border border-amber-500 cursor-pointer"
                >
                  Formulir Cicil Emas Online
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. PUSAT UNDUHAN BERKAS & FORMULIR PENGAJUAN (DOCUMENT HUB) */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="space-y-1 text-left">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-orange-600">
              Pelayanan Cepat
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Pusat Formulir & Pengajuan Berkas
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              Unduh formulir resmi atau lengkapi pengajuan perbankan Anda secara langsung melalui opsi di bawah ini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Box 1: Form Permohonan Kredit PDF */}
            <div className="border border-slate-300 p-6 sm:p-8 bg-slate-50 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200">
                    Berkas Cetak PDF
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Resmi Hasamitra</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Form Permohonan Kredit</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Formulir permohonan pinjaman kredit modal kerja, investasi usaha, atau konsumtif. Silakan unduh, cetak, lengkapi persyaratan, dan serahkan ke kantor cabang terdekat.
                </p>
              </div>

              <a
                href="https://hasamitrajabar.com/wp-content/uploads/2021/05/Permohonan-Kredit.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm uppercase tracking-wider text-center inline-flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Unduh Form Kredit (PDF) ↗
              </a>
            </div>

            {/* Box 2: Form Online Cicil Emas */}
            <div className="border border-slate-300 p-6 sm:p-8 bg-slate-50 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                    Formulir Digital
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Google Forms</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Form Pendaftaran Cicil Emas</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Pengajuan kepemilikan emas logam mulia secara online melalui formulir digital interaktif. Tim Hasamitra akan segera menghubungi Anda untuk konfirmasi pesanan.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCicilEmasOpen(true)}
                className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider text-center inline-flex items-center justify-center gap-2 border border-orange-500 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Buka Form Cicil Emas (Online)
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 5. SEKILAS HASAMITRA & TATA KELOLA (STRUCTURED CORPORATE OVERVIEW) */}
      <section className="py-16 lg:py-20 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Box: Visi & Misi */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-orange-400 block">
                Tentang Kami
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                PT BPR Hasamitra Jawa Barat
              </h2>
              
              <p className="text-sm text-slate-300 leading-relaxed">
                Didirikan dengan visi menjadi Bank lokal dengan reputasi Nasional yang sehat, kuat, dan terpercaya. Kami menjalankan kegiatan perbankan dengan berlandaskan tata kelola perusahaan yang baik (Good Corporate Governance) dan integritas pelayanan prima.
              </p>

              <div className="border border-slate-800 bg-slate-950/80 p-5 space-y-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-bold text-orange-400 uppercase tracking-wider">
                    Visi Perusahaan:
                  </span>
                  <p className="text-sm font-semibold text-slate-200">
                    &quot;Menjadi Bank Lokal Bereputasi Nasional yang Sehat, Kuat dan Terpercaya.&quot;
                  </p>
                </div>
                <div className="border-t border-slate-800 pt-3 space-y-1">
                  <span className="text-[11px] font-mono font-bold text-orange-400 uppercase tracking-wider">
                    Misi Perusahaan:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Mensejahterakan masyarakat melalui implementasi sosial bisnis enterprise dengan pelayanan terbaik yang berlandaskan nilai-nilai kearifan lokal.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold">
                <Link
                  href="/tentang-kami/profil-perusahaan"
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                >
                  Profil Lengkap Perusahaan →
                </Link>
                <Link
                  href="/informasi/hasa-mitra-news"
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                >
                  Hasa Mitra News →
                </Link>
              </div>
            </div>

            {/* Right Box: Kantor Pusat & Kontak */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400">
                  Kantor & Layanan
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-slate-900 px-2 py-0.5 border border-slate-800">
                  Depok, Jabar
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400 block mb-0.5">Alamat Kantor:</span>
                  <p className="font-medium text-white leading-relaxed">
                    {contactData.address}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Telepon:</span>
                    <p className="font-mono font-bold text-white">{contactData.phone}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Email Resmi:</span>
                    <p className="font-mono text-slate-200">{contactData.email}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-400 block mb-1">Customer Service WhatsApp:</span>
                  <WhatsAppButton variant="primary" text={`Hubungi WhatsApp ${contactData.whatsapp}`} className="w-full py-2.5 text-xs font-bold uppercase tracking-wider rounded-none" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. COMPLIANCE & LEGAL NOTICES (OJK & LPS FLAT SECTION) */}
      <section className="bg-slate-200/80 text-slate-800 py-6 border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <p className="text-xs sm:text-sm font-bold text-slate-900">
            PT BPR Hasamitra Jawa Barat berizin dan diawasi oleh Otoritas Jasa Keuangan (OJK) serta merupakan peserta penjaminan Lembaga Penjamin Simpanan (LPS).
          </p>
          <p className="text-[11px] sm:text-xs text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Nilai simpanan maksimum yang dijamin oleh LPS sebesar <strong className="text-slate-900">Rp 2.000.000.000,- (Dua Miliar Rupiah)</strong> dengan tingkat bunga penjaminan maksimum sebesar <strong className="text-slate-900">6.25%</strong> untuk rupiah sesuai ketentuan yang berlaku.
          </p>
        </div>
      </section>

      {/* MODAL 1: TABUNGAN & DEPOSITO REGISTRATION */}
      <TabunganFormModal
        isOpen={tabunganModalOpen}
        onClose={() => setTabunganModalOpen(false)}
        productName={selectedProduct}
      />

      {/* MODAL 2: CICIL EMAS GOOGLE FORM */}
      <CicilEmasModal
        isOpen={cicilEmasOpen}
        onClose={() => setCicilEmasOpen(false)}
      />

      {/* MODAL 3: FULL VIEW BANK KORESPONDENSI IMAGE PREVIEW */}
      {imagePreviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setImagePreviewOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400 block">
                  Dokumen Resmi
                </span>
                <h4 className="text-sm sm:text-base font-bold">
                  Daftar Bank Korespondensi Online A.N. PT BPR Hasamitra Jawa Barat
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setImagePreviewOpen(false)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-mono border border-slate-600 transition-colors"
              >
                ✕ TUTUP
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="flex-1 overflow-auto p-4 bg-white flex items-center justify-center">
              <Image
                src="/images/dokumen/daftar-bank-korespondensi.png"
                alt="Daftar Bank Korespondensi Online A.N. PT BPR Hasamitra Jawa Barat"
                width={1200}
                height={900}
                className="w-full h-auto max-h-[72vh] object-contain mx-auto"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-950 text-right text-xs text-slate-400">
              Pastikan transfer transaksi ditujukan kepada rekening resmi yang tertera pada dokumen.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}