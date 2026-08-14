import React from "react";
import Image from "next/image";
import Link from "next/link";
import WhatsAppBanner from "@/components/common/WhatsAppBanner";
import OjkLpsNotice from "@/components/common/OjkLpsNotice";
import { prisma } from "@/lib/db";
import { parseArticleImages } from "@/lib/articleImages";

export const metadata = {
  title: "Hasa Mitra News",
  description: "Berita & Pengumuman Resmi PT BPR Hasamitra Jawa Barat.",
};

export const revalidate = 60;

export default async function HasaMitraNewsPage() {
  const articles = await prisma.article.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "Kegiatan Sosial":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200/60";
      case "Berita Utama":
        return "bg-blue-100 text-blue-800 border border-blue-200/60";
      case "Edukasi Keuangan":
        return "bg-violet-100 text-violet-800 border border-violet-200/60";
      case "Penghargaan":
        return "bg-amber-100 text-amber-800 border border-amber-200/60";
      default:
        return "bg-orange-100 text-orange-800 border border-orange-200/60";
    }
  };

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
        {articles.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm text-center">
            <p className="text-slate-400 text-sm">Belum ada berita yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((news) => {
              const { cover } = parseArticleImages(news.image);
              return (
                <article
                  key={news.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group"
                >
                  {/* Article Cover Image */}
                  {cover && (
                    <Link
                      href={`/informasi/hasa-mitra-news/${news.slug}`}
                      className="relative w-full h-48 sm:h-56 block overflow-hidden bg-slate-100"
                    >
                      <Image
                        src={cover}
                        alt={news.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  )}

                <div className="p-6 sm:p-8 space-y-4 flex flex-col justify-between flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-3 py-1 rounded-md text-xs font-bold ${getCategoryBadgeClass(news.category)}`}>
                        {news.category}
                      </span>
                      <span className="text-slate-400 font-medium">{formatDate(news.createdAt)}</span>
                    </div>

                    <Link href={`/informasi/hasa-mitra-news/${news.slug}`} className="block">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
                        {news.title}
                      </h3>
                    </Link>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {news.content}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <Link
                      href={`/informasi/hasa-mitra-news/${news.slug}`}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 group/btn"
                    >
                      Baca Selengkapnya
                      <svg
                        className="w-4 h-4 transition-transform group-hover/btn:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* OJK & LPS Notice */}
        <OjkLpsNotice />

        {/* WhatsApp CS Banner */}
        <WhatsAppBanner title="Ada Pertanyaan Seputar Berita Hasamitra?" />
      </div>
    </div>
  );
}

