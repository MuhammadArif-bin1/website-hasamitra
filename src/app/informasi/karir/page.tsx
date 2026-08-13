import React from "react";
import Image from "next/image";
import InformasiTabs from "@/components/informasi/InformasiTabs";
import OjkLpsNotice from "@/components/common/OjkLpsNotice";

export const metadata = {
  title: "Karir",
  description: "Kesempatan Karir & Bergabung dengan PT BPR Hasamitra Jawa Barat.",
};

export default function KarirPage() {
  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Submenu Tabs Navigation */}
        <InformasiTabs />

        {/* Section Banner Header */}
        <div className="w-full bg-gradient-to-r from-[#59C173] via-[#FBC02D] to-[#E57A44] rounded-2xl py-4 shadow-md text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            - Karir -
          </h1>
        </div>

        {/* Main Karir Banner & Content Layout */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left Column: Karir Image & Meta */}
            <div className="flex flex-col items-start">
              <div className="relative w-full overflow-hidden rounded-xl">
                <Image
                  src="/images/dokumen/karir.png"
                  alt="Hasamitra Jabar Karir"
                  width={600}
                  height={500}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
              <div className="mt-4 text-left">
                <h3 className="text-slate-800 font-bold text-base sm:text-lg">
                  Hasamitra Jabar Karir
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  November 8, 2022 // No Comments
                </p>
              </div>
            </div>

            {/* Right Column: Karir Invitation & Description */}
            <div className="flex flex-col justify-start md:text-right text-center md:items-end items-center pt-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#DF744A] leading-tight">
                Ayo gabung<br />
                di BPR Hasamitra<br />
                Jabar
              </h2>

              <p className="text-slate-700 font-semibold text-sm sm:text-base leading-relaxed mt-6 max-w-md">
                Keberadaan sumber daya<br className="hidden sm:inline" />
                manusia yang unggul,<br className="hidden sm:inline" />
                professional, dan adaptif<br className="hidden sm:inline" />
                dalam organisasi merupakan<br className="hidden sm:inline" />
                salah satu kunci keberhasilan<br className="hidden sm:inline" />
                BPR Hasamitra Jabar
              </p>
            </div>
          </div>

          {/* Centered Clickable Link */}
          <div className="text-center pt-12 pb-6">
            <a
              href="https://docs.google.com/forms/d/1V8FFXWBTbD859w1BeOt7JUoucTPACm10DkPZVs-53DU/viewform?edit_requested=true"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-3xl sm:text-4xl font-black text-[#0066CC] hover:text-[#004499] transition-all transform hover:scale-105 tracking-wider uppercase underline underline-offset-8 decoration-2"
            >
              KLIK DISINI
            </a>
          </div>
        </div>

        {/* OJK & LPS Notice */}
        <OjkLpsNotice />
      </div>
    </div>
  );
}

