"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import CicilEmasModal from "@/components/forms/CicilEmasModal";
import TabunganFormModal from "@/components/forms/TabunganFormModal";

interface ProductItem {
  id: number | string;
  slug: string;
  name: string;
  category?: string;
  description?: string;
  features: string[];
  buttonText: string;
}

const fallbackProducts: ProductItem[] = [
  {
    id: 1,
    slug: "new-tabungan-sabar",
    name: "New Tabungan Sabar",
    category: "Tabungan",
    description: "Solusi simpanan fleksibel dengan kemudahan transaksi dan suku bunga yang menarik tanpa potongan memberatkan.",
    features: [
      "Bebas biaya administrasi bulanan",
      "Setoran awal terjangkau & fleksibel",
      "Dijamin oleh Lembaga Penjamin Simpanan (LPS)",
    ],
    buttonText: "Daftar Tabungan Online",
  },
  {
    id: 2,
    slug: "deposito-si-deka",
    name: "Deposito Si Deka",
    category: "Deposito",
    description: "Investasi simpanan berjangka dengan suku bunga optimal, kepastian hasil, serta keamanan penjaminan LPS penuh.",
    features: [
      "Pilihan jangka waktu 1, 3, 6, hingga 12 bulan",
      "Bunga kompetitif dapat ditransfer ke rekening",
      "Bisa dijadikan agunan kredit cepat",
    ],
    buttonText: "Buka Deposito Online",
  },
  {
    id: 3,
    slug: "cicil-emas",
    name: "Program Cicil Emas",
    category: "Investasi Emas",
    description: "Cara mudah dan aman memiliki emas batangan murni (Antam/Galeri 24) melalui skema angsuran tetap yang terjangkau.",
    features: [
      "Pilihan gramatur: 1 gr, 2 gr, 5 gr, s/d 50 gr",
      "Emas fisik asli bersertifikat resmi",
      "Pendaftaran cepat via formulir interaktif online",
    ],
    buttonText: "Formulir Cicil Emas Online",
  },
];

export default function Home() {
  const [products, setProducts] = useState<ProductItem[]>(fallbackProducts);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [cicilEmasOpen, setCicilEmasOpen] = useState(false);
  const [tabunganModalOpen, setTabunganModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("New Tabungan Sabar");
  const [piagamPreviewOpen, setPiagamPreviewOpen] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/produk");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setProducts(json.data);
        }
      } catch (err) {
        console.error("Gagal memuat produk dari database:", err);
      } finally {
        setLoadingProducts(false);
      }
    }

    loadProducts();
  }, []);

  const openProductForm = (productName: string) => {
    if (productName.toLowerCase().includes("emas")) {
      setCicilEmasOpen(true);
    } else {
      setSelectedProduct(productName);
      setTabunganModalOpen(true);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 scroll-smooth">
      {/* 1. HERO SECTION WITH IMAGE BACKGROUND */}
      <section id="hasamitra" className="relative bg-slate-950 text-white border-b border-slate-800 overflow-hidden min-h-[540px] lg:min-h-[580px] flex items-center">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/profil/gambar background hasamitra.png"
            alt="Background Bank Hasamitra Jawa Barat"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Dark gradient overlay for crystal clear contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-950/70"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b20_1px,transparent_1px),linear-gradient(to_bottom,#1e293b20_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10 w-full">
          <div className="max-w-3xl space-y-6 text-left">
            {/* Official Status Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-xs font-semibold text-orange-400 uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 bg-orange-500 rounded-none animate-pulse"></span>
              <span>PT BPR Hasamitra Jawa Barat • OJK & LPS</span>
            </div>

            {/* Primary Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
              Mitra Finansial Terpercaya untuk Pertumbuhan{" "}
              <span className="text-orange-500 border-b-2 border-orange-500 pb-0.5">
                Ekonomi Jawa Barat
              </span>
            </h1>

            {/* Comprehensive Description */}
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl drop-shadow-xs">
              BPR Hasamitra Jawa Barat berkomitmen menghimpun dana masyarakat melalui produk Tabungan & Deposito bergaransi LPS, serta menyalurkan fasilitas kredit modal kerja dan konsumtif dengan proses cepat, transparan, dan terpercaya.
            </p>

            {/* Action Buttons Group */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#produk"
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors inline-flex items-center gap-2 border border-orange-500 shadow-lg shadow-orange-600/20 cursor-pointer"
              >
                Lihat Produk Perbankan
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>

              <a
                href="https://hasamitrajabar.com/wp-content/uploads/2021/05/Permohonan-Kredit.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors inline-flex items-center gap-2 border border-slate-700 backdrop-blur-xs"
              >
                <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Form Kredit (PDF)
              </a>

              <WhatsAppButton variant="compact" text="Konsultasi WhatsApp" className="py-3 px-4 text-xs uppercase tracking-wider font-bold rounded-none" />
            </div>

            {/* Regulatory Quick Strip */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
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

      {/* 3. LAYANAN & PRODUK UNGGULAN (DYNAMIC FROM ADMIN DATABASE) */}
      <section id="produk" className="py-16 lg:py-20 bg-slate-100/70 border-b border-slate-200 scroll-mt-20">
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
              Pilihan produk simpanan, investasi, dan pembiayaan yang terintegrasi untuk mendukung stabilitas keuangan Anda.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {products.map((product) => {
              const isEmas = product.slug.includes("emas") || product.name.toLowerCase().includes("emas");

              return (
                <div
                  key={product.id}
                  className="bg-white border border-slate-200 flex flex-col justify-between hover:border-orange-500 transition-colors shadow-xs"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span
                        className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 border ${
                          isEmas
                            ? "text-amber-700 bg-amber-50 border-amber-200"
                            : "text-orange-600 bg-orange-50 border-orange-200"
                        }`}
                      >
                        {product.category || (isEmas ? "Investasi Emas" : "Perbankan")}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {isEmas ? "Logam Mulia" : "Perorangan & Usaha"}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900">{product.name}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                      {product.description || "Solusi keuangan terbaik dengan pelayanan aman dan terpercaya."}
                    </p>

                    <div className="pt-2 space-y-2 border-t border-slate-100 text-xs text-slate-700">
                      {product.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className={`font-bold ${isEmas ? "text-amber-600" : "text-orange-500"}`}>✓</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => openProductForm(product.name)}
                      className={`w-full py-2.5 px-4 text-white font-bold text-xs uppercase tracking-wider transition-colors text-center border cursor-pointer ${
                        isEmas
                          ? "bg-amber-600 hover:bg-amber-700 border-amber-500"
                          : "bg-orange-600 hover:bg-orange-700 border-orange-500"
                      }`}
                    >
                      {product.buttonText || (isEmas ? "Formulir Cicil Emas Online" : "Isi Datamu Sekarang")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. PIAGAM & PENGHARGAAN RESMI (CORPORATE AWARDS & CERTIFICATES SHOWCASE) */}
      <section id="piagam" className="py-16 lg:py-20 bg-white border-b border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-300 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-orange-600">
                Prestasi &amp; Legalitas
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Piagam &amp; Penghargaan Resmi
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              Bukti dedikasi, kepatuhan regulasi, dan pengakuan performa terbaik PT BPR Hasa Mitra Jawa Barat.
            </p>
          </div>

          {/* Piagam Document Display Card */}
          <div className="bg-slate-900 border border-slate-800 p-4 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-amber-400"></span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  Sertifikasi &amp; Penghargaan Lembaga Keuangan
                </span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest bg-amber-950/60 px-2.5 py-1 border border-amber-800/60">
                Infobank &amp; The Finance
              </span>
            </div>

            {/* Document Image with Click to Zoom */}
            <div
              className="relative border border-slate-800 bg-white group cursor-pointer overflow-hidden"
              onClick={() => setPiagamPreviewOpen(true)}
              title="Klik untuk memperbesar dokumen piagam"
            >
              <Image
                src="/images/dokumen/piagam-hasamitra.png"
                alt="Piagam dan Penghargaan Resmi PT BPR Hasa Mitra Jawa Barat"
                width={1400}
                height={800}
                className="w-full h-auto object-contain transition-transform duration-200 group-hover:scale-[1.01]"
                priority
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs sm:text-sm font-semibold uppercase tracking-wider">
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                Klik untuk Memperbesar Piagam
              </div>
            </div>

            {/* Footer Details */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <p className="leading-relaxed">
                Diraih atas komitmen kinerja keuangan yang sehat, tata kelola transparan, dan pelayanan terpercaya.
              </p>
              <button
                type="button"
                onClick={() => setPiagamPreviewOpen(true)}
                className="text-amber-400 hover:text-amber-300 font-semibold underline text-xs inline-flex items-center gap-1 cursor-pointer shrink-0"
              >
                Lihat Ukuran Penuh ↗
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 5. PUSAT UNDUHAN BERKAS & FORMULIR PENGAJUAN (DOCUMENT HUB) */}
      <section className="py-16 lg:py-20 bg-slate-100/70 border-b border-slate-200">
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
            <div className="border border-slate-300 p-6 sm:p-8 bg-white flex flex-col justify-between space-y-6">
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
            <div className="border border-slate-300 p-6 sm:p-8 bg-white flex flex-col justify-between space-y-6">
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

      {/* MODAL 3: FULL VIEW PIAGAM & PENGHARGAAN PREVIEW */}
      {piagamPreviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md"
          onClick={() => setPiagamPreviewOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block">
                  Piagam &amp; Penghargaan Resmi
                </span>
                <h4 className="text-sm sm:text-base font-bold">
                  Sertifikat Kinerja &amp; Prestasi PT BPR Hasamitra Jawa Barat
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setPiagamPreviewOpen(false)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-mono border border-slate-600 transition-colors cursor-pointer"
              >
                ✕ TUTUP
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-white flex items-center justify-center">
              <Image
                src="/images/dokumen/piagam-hasamitra.png"
                alt="Piagam dan Penghargaan Resmi PT BPR Hasamitra Jawa Barat Full"
                width={1400}
                height={900}
                className="w-full h-auto max-h-[72vh] object-contain mx-auto"
              />
            </div>

            <div className="p-3 border-t border-slate-800 bg-slate-950 text-right text-xs text-slate-400">
              Penghargaan dari Infobank dan The Finance atas kinerja keuangan terbaik.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}