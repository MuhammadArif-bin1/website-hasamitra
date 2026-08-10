import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Profil Perusahaan - Bank Hasamitra Jawa Barat",
  description: "Profil perusahaan, sejarah berdiri, Visi & Misi PT BPR Hasamitra Jawa Barat.",
};

export default function ProfilPerusahaanPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <main className="flex-1 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Submenu Tabs Navigation */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
            <Link
              href="/tentang-kami/profil-perusahaan"
              className="px-5 py-2.5 rounded-full text-sm font-bold bg-emerald-600 text-white shadow-sm shrink-0"
            >
              Profil Perusahaan
            </Link>
            <Link
              href="/tentang-kami/logo-makna"
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
            >
              Logo & Makna
            </Link>
            <Link
              href="/tentang-kami/pengurus"
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
            >
              Pengurus
            </Link>
            <Link
              href="/tentang-kami/struktur-organisasi"
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
            >
              Struktur Organisasi
            </Link>
            <Link
              href="/tentang-kami/penghargaan"
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
            >
              Penghargaan
            </Link>
          </div>

          {/* SECTION 1: Profile Header & Description */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 text-center mb-10">
              Profile
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Office Image: Gambar Kantor Perusahaan */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white">
                  <Image
                    src="/Kantor-Hasamitra-jabar.jpg"
                    alt="Gedung Kantor PT BPR Hasamitra Jawa Barat"
                    width={600}
                    height={450}
                    className="w-full h-auto object-cover rounded-2xl"
                    priority
                  />
                </div>
              </div>

              {/* Profile Text Content */}
              <div className="lg:col-span-7 space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                <p>
                  BPR Hasa Mitra Jawa Barat merupakan lembaga keuangan bank yang berdiri sejak Tahun 2018 di Kota Depok. BPR Hasa Mitra Jawa Barat hadir untuk masyarakat Kota Depok sebagai mitra perbankan yang kuat, sehat dan terpercaya dengan melaksanakan kegiatan usaha berupa simpanan dalam bentuk deposito berjangka dan tabungan serta menyalurkan dana dalam bentuk kredit.
                </p>
                <p>
                  Kami yakin dengan kehadiran BPR Hasa Mitra Jawa Barat dapat membantu perkembangan ekonomi Kota Depok dengan program pinjaman, tabungan dan deposito yang berpihak kepada kepentingan warga masyarakat terutama pada pemenuhan kebutuhan pendanaan di berbagai sektor produktif seperti UMKM hingga dana pendidikan.
                </p>
                <p>
                  Hati anda adalah Jiwa kami menjadi pedoman kami dalam melayani nasabah dan keamanan nasabah adalah prioritas kami oleh karenanya BPR Hasa Mitra Jawa Barat menjadi anggota Lembaga Penjamin (LPS) yang menawarkan ketenangan dalam setiap transaksi anda. Kami berkomitmen untuk terus memberikan pelayanan terbaik. Mengembangkan perekonomian di Kota Depok dan menjadi BPR kebanggaan anda semua.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: Visi & Misi Box */}
          <div className="rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 text-white p-8 sm:p-12 shadow-xl text-center space-y-4 border border-orange-400">
            <p className="text-lg sm:text-xl font-bold italic leading-snug">
              Visi : &quot;Menjadi Bank Lokal Bereputasi Nasional yang Sehat, Kuat dan Terpercaya.&quot;
            </p>
            <p className="text-base sm:text-lg font-bold italic leading-relaxed max-w-5xl mx-auto">
              Misi : &quot;Mensejahterakan masyarakat melalui implementasi sosial bisnis enterprise dengan pelayanan terbaik yang berlandaskan nilai-nilai kearifan lokal.&quot;
            </p>
          </div>

          {/* OJK & LPS Guarantees Notice */}
          <div className="text-center space-y-2 text-slate-700 py-2 border-y border-slate-200">
            <p className="text-sm font-semibold">
              BPR Hasamitra Jabar berizin dan diawasi oleh <strong className="text-slate-900">Otoritas Jasa Keuangan (OJK)</strong> dan merupakan peserta penjaminan <strong className="text-slate-900">Lembaga Penjamin Simpanan (LPS)</strong>.
            </p>
            <p className="text-xs text-slate-600">
              Nilai simpanan maksimum yang dijamin oleh LPS sebesar <strong className="text-slate-900">Rp 2 Miliar</strong>, dengan tingkat bunga penjaminan maksimum sebesar <strong className="text-slate-900">6.25%</strong> untuk rupiah sesuai ketentuan yang berlaku.
            </p>
          </div>

          {/* SECTION 3: Sejarah Berdiri & Performa Perusahaan */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md space-y-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Sejarah Berdiri &amp; Performa Perusahaan
              </h2>
              <div className="w-16 h-1 bg-emerald-600 mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="space-y-5 text-slate-700 text-sm sm:text-base leading-relaxed text-justify sm:text-left">
              <p>
                PT BPR Hasa Mitra Jawa Barat adalah merupakan hasil akuisisi dari PT BPR Narwastu Mikro Perkasa oleh pemegang saham baru pada bulan Agustus 2018. Pada awal pendiriannya BPR ini didirikan dengan nama PT BPR Bantoru. BPR didirikan pada tanggal 28 November 1988 berdasarkan akta pendirian nomor 35 dan diubah dengan akta Nomor 12 tertanggal 05 juni 1989 yang dibuat dihadapan Notaris Mohamad Ali, Jakarta dan telah mendapatkan pengesahan dari Menteri Kehakiman RI dengan surat keputusan No. C2-6447.HT.01. Th&apos;89.
              </p>
              <p>
                Kemudian pada tanggal 08 Juli 2008 melalui akta Nomor 5 dibuat oleh Notaris Haji Zulmaizar Zul, SH, M.Hum perseroan berganti nama menjadi PT BPR Mitra Agung Nasari dan telah mendapat persetujuan oleh Menteri hukum dan Hak Asasi Manusia RI dengan surat keputusan No. AHU-61306.AH.01.02 Tahun 2008.
              </p>
              <p>
                Pada tahun 2013, nama PT BPR Mitra Agung Nasari kembali diubah menjadi PT BPR Narwastu Mikro Perkasa. Perubahan nama dibuat dihadapan notaris Evi Novita Tri Setyorini, SH, M.Kn, Notaris di kabupaten Kendal, akta No 3 tertanggal 06 April 2013 dan telah mendapat pengesahan Menteri Hukum dan Hak Asasi Manusia RI No. AHU-19272.AH.01.02 Tahun 2013.
              </p>
              <p>
                Pada tahun 2018 BPR Narwastu Mikro Perkasa secara resmi diakuisisi oleh Bapak Yonggris sebagai pemegang saham baru, melalui akta No.05 tertanggal 02 Agustus 2018 di hadapan Gibson Thomasyadi, SH, M.Kn, Notaris di Tangerang dan telah mendapat pengesahan Menteri Hukum dan Hak Asasi Manusia No. AHU-0016202.AH.02. Tahun 2018 dan setelah mendapat izin penetapan perubahan nama dari OJK No.S-320/KR.021/2018 resmi berubah nama menjadi PT BPR Hasa Mitra Jawa Barat.
              </p>
            </div>

            {/* Team Photo: Foto Seluruh Karyawan */}
            <div className="pt-4">
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg">
                <Image
                  src="/foto seluruh karyawan.png"
                  alt="Foto Seluruh Karyawan PT BPR Hasamitra Jawa Barat - Sosialisasi RBB 2024"
                  width={1200}
                  height={700}
                  className="w-full h-auto object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>

          {/* Bottom WhatsApp CS Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900 text-white p-8 rounded-3xl shadow-xl gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-xl font-bold">Ada Pertanyaan Lebih Lanjut?</h3>
              <p className="text-sm text-slate-300">Hubungi Customer Service kami via WhatsApp resmi.</p>
            </div>
            <WhatsAppButton variant="primary" text="Hubungi via WhatsApp" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
