import React from "react";
import WhatsAppBanner from "@/components/common/WhatsAppBanner";
import OjkLpsNotice from "@/components/common/OjkLpsNotice";

export const metadata = {
  title: "Hasa Mitra News",
  description: "Berita & Pengumuman Resmi PT BPR Hasamitra Jawa Barat.",
};

const newsItems = [
  {
    date: "10 Agustus 2026",
    category: "Berita Utama",
    title: "BPR Hasamitra Jawa Barat Salurkan Kredit UMKM Siap Dorong Ekonomi Lokal",
    excerpt: "PT BPR Hasamitra Jawa Barat memperkuat komitmen penyerapan kredit sektor UMKM melalui program suku bunga yang kompetitif dan kemudahan proses.",
  },
  {
    date: "01 Juli 2026",
    category: "Edukasi Keuangan",
    title: "Tips Memilih Tabungan & Deposito Aman Berjaminan LPS hingga Rp 2 Miliar",
    excerpt: "Kenali manfaat memilih produk deposito perbankan berizin OJK dengan tingkat bunga penjaminan maksimum 6.25% sesuai ketentuan LPS.",
  },
  {
    date: "15 Mei 2026",
    category: "Penghargaan",
    title: "BPR Hasamitra Jabar Raih Predikat Sangat Bagus Kinerja Keuangan",
    excerpt: "Penghargaan bergengsi diraih BPR Hasamitra atas konsistensi menjaga rasio keuangan sehat dan tata kelola profesional.",
  },
  {
    date: "20 Maret 2026",
    category: "Pengumuman",
    title: "Pengumuman Jam Operasional & Layanan Nasabah Selama Bulan Ramadan",
    excerpt: "Informasi penyesuaian jam pelayanan operasional kantor pusat dan cabang BPR Hasamitra Jawa Barat selama bulan suci Ramadan.",
  },
];

export default function HasaMitraNewsPage() {
  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">


        {/* Section Banner Header */}
        <div className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 rounded-2xl py-4 shadow-md text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            - Hasa Mitra News & Pengumuman -
          </h1>
        </div>

        {/* Intro Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md text-center space-y-4">
          <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs uppercase tracking-wider">
            Kabar Terbaru
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Seputar Berita & Kegiatan Hasamitra
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
            Dapatkan informasi terkini mengenai perkembangan perusahaan, edukasi keuangan perbankan, serta pengumuman resmi bagi seluruh nasabah.
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {newsItems.map((news, idx) => (
            <article
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-3 py-1 rounded-md bg-orange-100 text-orange-800 font-bold">
                    {news.category}
                  </span>
                  <span className="text-slate-400 font-medium">{news.date}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug hover:text-orange-600 transition-colors">
                  {news.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {news.excerpt}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 cursor-pointer">
                  Baca Selengkapnya
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* OJK & LPS Notice */}
        <OjkLpsNotice />

        {/* WhatsApp CS Banner */}
        <WhatsAppBanner title="Ada Pertanyaan Seputar Berita Hasamitra?" />
      </div>
    </div>
  );
}
