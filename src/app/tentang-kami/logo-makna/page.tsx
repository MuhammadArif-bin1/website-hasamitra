import React from "react";
import Image from "next/image";
import TentangKamiTabs from "@/components/tentang-kami/TentangKamiTabs";
import WhatsAppBanner from "@/components/common/WhatsAppBanner";
import OjkLpsNotice from "@/components/common/OjkLpsNotice";

export const metadata = {
  title: "Logo & Makna",
  description: "Makna dan filosofi logo resmi PT BPR Hasamitra Jawa Barat.",
};

export default function LogoMaknaPage() {
  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Submenu Tabs Navigation */}
        <TentangKamiTabs />

        {/* Section Banner Header (- Logo & Makna -) */}
        <div className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 rounded-2xl py-4 shadow-md text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            - Logo &amp; Makna -
          </h1>
        </div>

        {/* Main Logo & Description Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Round Logo Image */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 shrink-0">
                <Image
                  src="/images/logo/logo-bulat.png"
                  alt="Logo Bulat Bank Hasamitra"
                  width={320}
                  height={320}
                  className="w-full h-full object-contain drop-shadow-md"
                  priority
                />
              </div>
            </div>

            {/* Right Column: Logo Explanation Text */}
            <div className="lg:col-span-8 space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed text-justify sm:text-left">
              <p>
                Hasamitra diambil dari bahasa Sansekerta. <em className="not-italic font-semibold text-slate-900">Hasa</em> berarti harapan dan bahagia, sedangkan <em className="not-italic font-semibold text-slate-900">Mitra</em> adalah rekan atau sahabat. <em className="not-italic font-semibold text-slate-900">Hasa Mitra</em> berarti tekad ketulusan dalam menjalin persahabatan untuk meraih kebahagiaan bersama.
              </p>
              <p>
                Bentuk logogram hasamitra terinspirasi oleh koin yang terdiri atas dua buah kurva setengah lingkar yang dihubungkan oleh simbol equality dan dibungkus oleh lingkaran penuh yang mendeskripsikan makna logo seperti diatas, dan merefleksikan value BPR Hasamitra : <span className="font-semibold text-slate-900">Trust</span> (kepercayaan), <span className="font-semibold text-slate-900">Integrity</span> (Kejujuran), <span className="font-semibold text-slate-900">Prudence</span> (Kehati-hatian) dan <span className="font-semibold text-slate-900">Professionalism</span> (profesionalisme).
              </p>
            </div>
          </div>
        </div>

        {/* OJK & LPS Guarantees Notice */}
        <OjkLpsNotice />

        {/* Bottom WhatsApp CS Banner */}
        <WhatsAppBanner title="Ada Pertanyaan Seputar Layanan Hasamitra?" />
      </div>
    </div>
  );
}
