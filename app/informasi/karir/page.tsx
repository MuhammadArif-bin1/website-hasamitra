import React from "react";
import InformasiTabs from "@/components/informasi/InformasiTabs";
import WhatsAppBanner from "@/components/common/WhatsAppBanner";
import OjkLpsNotice from "@/components/common/OjkLpsNotice";

export const metadata = {
  title: "Karir",
  description: "Kesempatan Karir & Bergabung dengan PT BPR Hasamitra Jawa Barat.",
};

const jobVacancies = [
  {
    title: "Account Officer (AO) / Marketing Kredit",
    location: "Depok, Jawa Barat",
    type: "Full-Time",
    department: "Bisnis & Pemasaran",
    requirements: [
      "Pendidikan minimal D3 / S1 semua jurusan",
      "Pengalaman minimal 1 tahun di bidang marketing perbankan / BPR",
      "Memiliki jaringan nasabah yang luas dan berorientasi pada target",
      "Komunikatif, jujur, dan berintegritas tinggi",
      "Memiliki kendaraan pribadi & SIM C/A",
    ],
  },
  {
    title: "Customer Service & Teller",
    location: "Depok, Jawa Barat",
    type: "Full-Time",
    department: "Operasional & Front Office",
    requirements: [
      "Pendidikan minimal D3 / S1 (IPK min. 3.00)",
      "Usia maksimal 26 tahun",
      "Penampilan menarik, komunikatif, ramah, dan cekatan",
      "Mampu mengoperasikan komputer (Ms. Office)",
      "Fresh graduate dipersilakan melamar",
    ],
  },
  {
    title: "Staff Audit Internal",
    location: "Depok, Jawa Barat",
    type: "Full-Time",
    department: "Audit & Kepatuhan",
    requirements: [
      "Pendidikan minimal S1 Akuntansi / Keuangan / Perbankan",
      "Pengalaman minimal 1-2 tahun sebagai auditor di BPR / Bank Umum",
      "Memahami regulasi OJK & standar akuntansi perbankan (SAK)",
      "Detail, analitis, objektif, dan dapat bekerja di bawah tekanan",
    ],
  },
];

export default function KarirPage() {
  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Submenu Tabs Navigation */}
        <InformasiTabs />

        {/* Section Banner Header */}
        <div className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 rounded-2xl py-4 shadow-md text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            - Karir & Kesempatan Bergabung -
          </h1>
        </div>

        {/* Hero Karir Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md text-center space-y-4">
          <span className="px-3.5 py-1 rounded-full bg-orange-100 text-orange-800 font-bold text-xs uppercase tracking-wider">
            Bergabung Bersama Kami
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Tumbuh & Berkembang Bersama BPR Hasamitra Jabar
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
            Kami mengundang para profesional muda yang dinamis, jujur, dan berintegritas untuk menjadi bagian dari keluarga besar PT BPR Hasamitra Jawa Barat.
          </p>
        </div>

        {/* Vacancies List */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 px-1">
            Lowongan Pekerjaan Tersedia
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobVacancies.map((job, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-semibold text-xs">
                      {job.department}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-green-50 text-green-700 font-semibold text-xs">
                      {job.type}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">{job.title}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </p>
                  <hr className="border-slate-100 my-2" />
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-700">Kualifikasi:</p>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {job.requirements.map((req, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-1.5">
                          <span className="text-orange-500 font-bold">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4">
                  <a
                    href="mailto:hrd@hasamitrajabar.com?subject=Lamaran Pekerjaan - Hasamitra Jabar"
                    className="block w-full text-center px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    Kirim Lamaran (HRD)
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* OJK & LPS Notice */}
        <OjkLpsNotice />

        {/* WhatsApp CS Banner */}
        <WhatsAppBanner title="Ingin Bertanya Lebih Lanjut Mengenai Karir?" />
      </div>
    </div>
  );
}
