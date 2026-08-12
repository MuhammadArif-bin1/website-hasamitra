import React from "react";
import Link from "next/link";
import InformasiTabs from "@/components/informasi/InformasiTabs";
import WhatsAppBanner from "@/components/common/WhatsAppBanner";
import OjkLpsNotice from "@/components/common/OjkLpsNotice";

export const metadata = {
  title: "Informasi Publik",
  description: "Pusat Informasi & Transparansi PT BPR Hasamitra Jawa Barat.",
};

const subFeatures = [
  {
    title: "Karir",
    desc: "Kesempatan karir & bergabung bersama tim profesional BPR Hasamitra Jawa Barat.",
    href: "/informasi/karir",
    badge: "Lowongan Kerja",
    color: "from-orange-500 to-amber-500",
  },
  {
    title: "Laporan GCG",
    desc: "Laporan pelaksanaan Good Corporate Governance (Tata Kelola Perusahaan).",
    href: "/informasi/laporan-gcg",
    badge: "Tata Kelola",
    color: "from-blue-600 to-indigo-600",
  },
  {
    title: "Laporan Triwulan",
    desc: "Publikasi Laporan Keuangan Berkala Triwulan I, II, III, dan IV.",
    href: "/informasi/laporan-triwulan",
    badge: "Keuangan Berkala",
    color: "from-emerald-600 to-teal-600",
  },
  {
    title: "Laporan Tahunan",
    desc: "Laporan Tahunan (Annual Report) dan pencapaian kinerja perusahaan.",
    href: "/informasi/laporan-tahunan",
    badge: "Annual Report",
    color: "from-purple-600 to-pink-600",
  },
  {
    title: "Hasa Mitra News",
    desc: "Berita terbaru, kegiatan perbankan, dan pengumuman resmi bagi nasabah.",
    href: "/informasi/hasa-mitra-news",
    badge: "Kabar Terbaru",
    color: "from-amber-500 to-orange-600",
  },
  {
    title: "Piagam Audit Internal",
    desc: "Pedoman kerja & piagam pengawasan independen Satuan Kerja Audit Internal (SKAI).",
    href: "/informasi/piagam-audit-internal",
    badge: "Audit & Pengawasan",
    color: "from-slate-700 to-slate-900",
  },
];

export default function InformasiPage() {
  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Submenu Tabs Navigation */}
        <InformasiTabs />

        {/* Header Section */}
        <div className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 rounded-2xl py-6 shadow-md text-center text-white space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wide">
            - Pusat Informasi & Transparansi -
          </h1>
          <p className="text-sm sm:text-base text-orange-100 max-w-2xl mx-auto px-4">
            Akses seluruh laporan publik, informasi karir, berita perbankan, dan dokumen pengawasan PT BPR Hasamitra Jawa Barat.
          </p>
        </div>

        {/* 6 Sub-features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subFeatures.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between space-y-4 hover:-translate-y-1"
            >
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 font-bold text-xs">
                  {item.badge}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">
                  {item.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-orange-600 group-hover:text-orange-700">
                <span>Lihat Selengkapnya</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* OJK & LPS Notice */}
        <OjkLpsNotice />

        {/* WhatsApp CS Banner */}
        <WhatsAppBanner title="Ada Pertanyaan Seputar Informasi Perbankan Hasamitra?" />
      </div>
    </div>
  );
}
