import React from "react";
import Image from "next/image";
import InformasiTabs from "@/components/informasi/InformasiTabs";
import OjkLpsNotice from "@/components/common/OjkLpsNotice";

export const metadata = {
  title: "Laporan Triwulan",
  description: "Laporan Keuangan Publikasi Triwulan PT BPR Hasamitra Jawa Barat.",
};

export default function LaporanTriwulanPage() {
  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Submenu Tabs Navigation */}
        <InformasiTabs />

        {/* Section Banner Header */}
        <div className="w-full bg-gradient-to-r from-[#59C173] via-[#FBC02D] to-[#E57A44] rounded-2xl py-4 shadow-md text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            - Laporan Keuangan Triwulan -
          </h1>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm max-w-5xl mx-auto space-y-10 text-center">
          {/* Laporan 2026 */}
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-[#E57A44]">
              Laporan Publikasi Triwulan Tahun 2026
            </h2>

            <div className="bg-[#f4f4f4] rounded-lg p-4 text-center border border-slate-200/60">
              <p className="text-slate-700 font-medium text-sm sm:text-base">
                Laporan Keuangan Publikasi Triwulan BPR Hasamitra Jawa Barat Tahun 2026
              </p>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
              <Image
                src="/images/laporan/laporan-publikasi-juni-2026.png"
                alt="Laporan Keuangan Publikasi Triwulan BPR Hasamitra Jawa Barat Tahun 2026"
                width={1200}
                height={1600}
                className="w-full h-auto object-contain mx-auto"
                priority
              />
            </div>
          </div>

          {/* Laporan 2025 */}
          <div className="border-t border-slate-200 pt-8 space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-[#E57A44]">
              Laporan Publikasi Tahunan 2025
            </h2>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
              <Image
                src="/images/laporan/laporan-publikasi-tahunan-2025.png"
                alt="Laporan Keuangan Publikasi Tahunan BPR Hasamitra Jawa Barat Tahun 2025"
                width={1200}
                height={1600}
                className="w-full h-auto object-contain mx-auto"
              />
            </div>
          </div>
        </div>

        {/* OJK & LPS Notice */}
        <OjkLpsNotice />
      </div>
    </div>
  );
}

