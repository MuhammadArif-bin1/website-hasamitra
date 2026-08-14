"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import WhatsAppButton from "@/components/common/WhatsAppButton";
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

  const [tabunganModalOpen, setTabunganModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("New Tabungan Sabar");
  const [piagamPreviewOpen, setPiagamPreviewOpen] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/produk", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
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

    // 1. Polling check every 6 seconds
    const interval = setInterval(loadProducts, 6000);

    // 2. BroadcastChannel trigger when admin updates product in real time
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        bc = new BroadcastChannel("hasamitra_sync_channel");
        bc.onmessage = (event) => {
          if (event.data?.type === "PRODUCTS_UPDATED") {
            loadProducts();
          }
        };
      }
    } catch {}

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "hasamitra_last_product_update") {
        loadProducts();
      }
    };
    const handleFocus = () => loadProducts();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      if (bc) bc.close();
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const openProductForm = (productName: string) => {
    setSelectedProduct(productName);
    setTabunganModalOpen(true);
  };

  return (
    <div className="bg-slate-50/60 text-slate-900 font-sans selection:bg-orange-500 selection:text-white scroll-smooth">
      {/* 1. HERO SECTION (ULTRA MODERN GLASSMORPHIC FINTECH DESIGN) */}
      <section
        id="hasamitra"
        className="relative bg-slate-950 text-white min-h-[540px] sm:min-h-[600px] lg:min-h-[680px] flex items-center overflow-hidden border-b border-slate-800/80"
      >
        {/* Background Image with Ambient Glow Overlays */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/profil/gambar background hasamitra.png"
            alt="Background Bank Hasamitra Jawa Barat"
            fill
            priority
            className="object-cover object-[75%_30%] sm:object-center transition-all duration-700"
          />
          {/* Deep modern radial and gradient overlay optimized for mobile & desktop */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/85 to-slate-950/95 sm:bg-gradient-to-r sm:from-slate-950/95 sm:via-slate-950/85 sm:to-slate-950/65"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 relative z-10 w-full">
          <div className="max-w-3xl space-y-8 text-left">
            {/* Status Pill Badge with Glow */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg shadow-black/20 text-xs font-semibold tracking-wide text-orange-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
              </span>
              <span>PT BPR Hasamitra Jawa Barat • Berizin Resmi OJK &amp; LPS</span>
            </div>

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

      {/* 2. TRUST & REGULATORY METRICS STRIP (FLOATING MODERN CARDS) */}
      <section className="relative -mt-8 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1 */}
          <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Berizin &amp; Diawasi OJK</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Operasional perbankan terdaftar dan berizin resmi dari Otoritas Jasa Keuangan.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Dijamin LPS s/d 2 Miliar</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Simpanan nasabah terlindungi program penjaminan Lembaga Penjamin Simpanan.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Kredit Cepat &amp; Solutif</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fasilitas pinjaman modal kerja, investasi usaha mikro, dan kebutuhan konsumtif.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
              04
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Cicil Emas Logam Mulia</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kemudahan memiliki emas batangan asli dengan angsuran terencana dan terjangkau.
            </p>
          </div>

        </div>
      </section>

      {/* 3. LAYANAN & PRODUK UNGGULAN (DYNAMIC DATABASE INTEGRATION) */}
      <section id="produk" className="py-20 lg:py-28 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          
          {/* Modern Centered Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Produk Perbankan Pilihan
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Pilihan produk simpanan, investasi, dan pembiayaan yang terintegrasi untuk mendukung pertumbuhan finansial Anda.
            </p>
          </div>

          {/* Modern Products Grid with Sleek Hover Animation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {products.map((product) => {
              const isEmas = product.slug.includes("emas") || product.name.toLowerCase().includes("emas");

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-slate-200/90 hover:border-orange-400 flex flex-col justify-between shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden group relative"
                >
                  {/* Decorative top accent line */}
                  <div
                    className={`h-2 w-full ${
                      isEmas
                        ? "bg-gradient-to-r from-amber-400 to-amber-600"
                        : "bg-gradient-to-r from-orange-500 to-amber-500"
                    }`}
                  ></div>

                  <div className="p-7 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Pill Badge */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                            isEmas
                              ? "text-amber-800 bg-amber-50 border border-amber-200"
                              : "text-orange-700 bg-orange-50 border border-orange-200"
                          }`}
                        >
                          {product.category || (isEmas ? "Investasi Emas" : "Perbankan")}
                        </span>
                        <span className="text-xs font-medium text-slate-400">
                          {isEmas ? "Logam Mulia" : "Perorangan & Usaha"}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-2xl font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed min-h-[44px]">
                        {product.description || "Solusi keuangan terbaik dengan pelayanan aman dan terpercaya."}
                      </p>
                    </div>

                    {/* Features List */}
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      {product.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                              isEmas
                                ? "bg-amber-100 text-amber-700"
                                : "bg-orange-100 text-orange-600"
                            }`}
                          >
                            ✓
                          </span>
                          <span className="leading-snug">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button Footer */}
                  <div className="p-6 sm:p-8 bg-slate-50/80 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => openProductForm(product.name)}
                      className={`w-full py-3.5 px-5 rounded-2xl text-white font-bold text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-lg text-center cursor-pointer ${
                        isEmas
                          ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-500/25 hover:shadow-amber-500/40"
                          : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-500/25 hover:shadow-orange-500/40"
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

      {/* 4. PIAGAM & PENGHARGAAN RESMI (AURA SHOWCASE CARD WITH BACKGROUND IMAGE) */}
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

          {/* Clean Piagam Showcase without bulky black box */}
          <div className="max-w-5xl mx-auto">
            <div
              className="relative rounded-3xl bg-white p-3 sm:p-5 shadow-2xl shadow-black/60 group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-orange-500/20 hover:scale-[1.01]"
              onClick={() => setPiagamPreviewOpen(true)}
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

      {/* 5. PUSAT UNDUHAN BERKAS & FORMULIR PENGAJUAN */}
      <section id="unduh" className="py-20 lg:py-24 bg-slate-50 border-b border-slate-200 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Pusat Formulir &amp; Pengajuan Berkas
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Unduh formulir resmi atau lengkapi pengajuan perbankan Anda secara langsung melalui pilihan di bawah ini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Box 1: Form Permohonan Kredit PDF */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-8 flex flex-col justify-between space-y-6 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200">
                    Berkas Cetak PDF
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Resmi Hasamitra</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Form Permohonan Kredit</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Formulir permohonan pinjaman kredit modal kerja, investasi usaha, atau konsumtif. Silakan unduh, cetak, lengkapi persyaratan, dan serahkan ke kantor cabang terdekat.
                </p>
              </div>

              <a
                href="https://hasamitrajabar.com/wp-content/uploads/2021/05/Permohonan-Kredit.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm tracking-wide text-center inline-flex items-center justify-center gap-2.5 transition-all duration-300 hover:shadow-lg shadow-slate-900/20"
              >
                <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Unduh Form Kredit (PDF) ↗</span>
              </a>
            </div>

            {/* Box 2: Form Online Cicil Emas */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-8 flex flex-col justify-between space-y-6 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                    Formulir Digital
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Resmi Hasamitra</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Form Pendaftaran Cicil Emas</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Pengajuan kepemilikan emas logam mulia secara online melalui formulir digital interaktif. Tim Hasamitra akan segera menghubungi Anda untuk konfirmasi pesanan.
                </p>
              </div>

              <button
                type="button"
                onClick={() => openProductForm("Program Cicil Emas")}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm tracking-wide text-center inline-flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Buka Form Cicil Emas (Online)</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 6. COMPLIANCE & LEGAL NOTICES (OJK & LPS MODERN BANNER) */}
      <section className="py-8 bg-slate-100 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-2">
          <p className="text-xs sm:text-sm font-bold text-slate-900">
            PT BPR Hasamitra Jawa Barat berizin dan diawasi oleh Otoritas Jasa Keuangan (OJK) serta merupakan peserta penjaminan Lembaga Penjamin Simpanan (LPS).
          </p>
          <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
            Nilai simpanan maksimum yang dijamin oleh LPS sebesar <strong className="text-slate-800 font-semibold">Rp 2.000.000.000,- (Dua Miliar Rupiah)</strong> dengan tingkat bunga penjaminan maksimum sebesar <strong className="text-slate-800 font-semibold">6.25%</strong> untuk rupiah sesuai ketentuan yang berlaku.
          </p>
        </div>
      </section>

      {/* MODAL: UNIFIED PRODUCT REGISTRATION MODAL (TABUNGAN, DEPOSITO, CICIL EMAS) */}
      <TabunganFormModal
        isOpen={tabunganModalOpen}
        onClose={() => setTabunganModalOpen(false)}
        productName={selectedProduct}
      />

      {/* MODAL: FULL VIEW PIAGAM & PENGHARGAAN PREVIEW */}
      {piagamPreviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in"
          onClick={() => setPiagamPreviewOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="space-y-0.5">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  Piagam &amp; Penghargaan Resmi
                </span>
                <h4 className="text-sm sm:text-base font-bold">
                  Sertifikat Kinerja &amp; Prestasi PT BPR Hasamitra Jawa Barat
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setPiagamPreviewOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
              >
                ✕
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

            <div className="p-4 border-t border-slate-800 bg-slate-950 text-right text-xs text-slate-400">
              Penghargaan dari Infobank dan The Finance atas kinerja keuangan terbaik.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}