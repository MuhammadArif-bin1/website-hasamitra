import React from "react";
import Image from "next/image";
import TentangKamiTabs from "@/components/tentang-kami/TentangKamiTabs";
import WhatsAppBanner from "@/components/common/WhatsAppBanner";
import OjkLpsNotice from "@/components/common/OjkLpsNotice";

export const metadata = {
  title: "Struktur Organisasi",
  description: "Struktur Organisasi PT BPR Hasamitra Jawa Barat.",
};

export default function StrukturOrganisasiPage() {
  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Submenu Tabs Navigation */}
        <TentangKamiTabs />

        {/* Section Banner Header */}
        <div className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 rounded-2xl py-4 shadow-md text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            - Struktur Organisasi -
          </h1>
        </div>

        {/* Struktur Organisasi Image Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md text-center space-y-6">
          <div className="relative w-full overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
            <Image
              src="/struktur organisasi hasamitra.png"
              alt="Struktur Organisasi PT BPR Hasa Mitra Jawa Barat"
              width={1200}
              height={700}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Struktur Organisasi <strong className="text-slate-900">PT BPR Hasa Mitra Jawa Barat</strong> menggambarkan hierarki dan pembagian tugas dari RUPS, Dewan Komisaris, Direktur Utama, hingga seluruh bagian operasional perusahaan.
          </p>
        </div>

        {/* OJK & LPS Guarantees Notice */}
        <OjkLpsNotice />

        {/* Bottom WhatsApp CS Banner */}
        <WhatsAppBanner title="Ada Pertanyaan Seputar Layanan Hasamitra?" />
      </div>
    </div>
  );
}
