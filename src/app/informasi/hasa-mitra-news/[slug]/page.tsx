import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import WhatsAppBanner from "@/components/common/WhatsAppBanner";
import OjkLpsNotice from "@/components/common/OjkLpsNotice";
import { parseArticleImages } from "@/lib/articleImages";
import type { Metadata } from "next";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const article = await prisma.article.findFirst({
    where: {
      OR: [
        { slug: decodedSlug },
        ...(isNaN(Number(decodedSlug)) ? [] : [{ id: Number(decodedSlug) }]),
      ],
      isPublished: true,
    },
  });

  if (!article) {
    return {
      title: "Berita Tidak Ditemukan - PT BPR Hasamitra Jawa Barat",
    };
  }

  const { cover, content } = parseArticleImages(article.image);
  const ogImage = content || cover;

  return {
    title: `${article.title} - Hasa Mitra News`,
    description: article.content.slice(0, 160),
    openGraph: {
      title: article.title,
      description: article.content.slice(0, 160),
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const article = await prisma.article.findFirst({
    where: {
      OR: [
        { slug: decodedSlug },
        ...(isNaN(Number(decodedSlug)) ? [] : [{ id: Number(decodedSlug) }]),
      ],
      isPublished: true,
    },
  });

  if (!article) {
    notFound();
  }

  // Parse images (foto sampul vs foto di dalam berita)
  const { cover, content: contentImage } = parseArticleImages(article.image);
  const displayImage = contentImage || cover;

  // Ambil berita terbaru lainnya
  const relatedArticles = await prisma.article.findMany({
    where: {
      isPublished: true,
      id: { not: article.id },
    },
    orderBy: { createdAt: "desc" },
    take: 3,
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
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "Berita Utama":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "Edukasi Keuangan":
        return "bg-violet-100 text-violet-800 border border-violet-200";
      case "Penghargaan":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      default:
        return "bg-orange-100 text-orange-800 border border-orange-200";
    }
  };

  // Format paragraphs from plain content
  const paragraphs = article.content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return (
    <div className="py-8 sm:py-12 lg:py-16 bg-slate-50/50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 flex-wrap">
          <Link href="/" className="hover:text-orange-600 transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/informasi/hasa-mitra-news" className="hover:text-orange-600 transition-colors">
            Hasa Mitra News
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium line-clamp-1 max-w-[200px] sm:max-w-xs">
            {article.title}
          </span>
        </nav>

        {/* Back Button */}
        <div>
          <Link
            href="/informasi/hasa-mitra-news"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Semua Berita
          </Link>
        </div>

        {/* Main Article Container */}
        <article className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Article Header */}
          <div className="p-6 sm:p-10 space-y-4 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3.5 py-1 rounded-md text-xs font-bold ${getCategoryBadgeClass(article.category)}`}>
                {article.category}
              </span>
              <span className="text-xs sm:text-sm text-slate-400 font-medium flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(article.createdAt)}
              </span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                • PT BPR Hasamitra Jawa Barat
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
              {article.title}
            </h1>
          </div>

          {/* Featured Image Di Dalam Berita */}
          {displayImage && (
            <div className="relative w-full aspect-video sm:aspect-21/9 max-h-[460px] bg-slate-100">
              <Image
                src={displayImage}
                alt={article.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          {/* Article Content Body */}
          <div className="p-6 sm:p-10 space-y-6">
            <div className="text-slate-700 text-base sm:text-lg leading-relaxed space-y-5">
              {paragraphs.length > 0 ? (
                paragraphs.map((p, idx) => (
                  <p key={idx} className="whitespace-pre-line text-justify sm:text-left">
                    {p}
                  </p>
                ))
              ) : (
                <p className="whitespace-pre-line">{article.content}</p>
              )}
            </div>

            {/* Share and Tags Footer */}
            <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bagikan Berita:</span>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${article.title}\nhttps://hasamitrajabar.com/informasi/hasa-mitra-news/${article.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                  title="Bagikan via WhatsApp"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.203c.043.072.043.419-.101.824z" />
                  </svg>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://hasamitrajabar.com/informasi/hasa-mitra-news/${article.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  title="Bagikan via Facebook"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>

              <Link
                href="/informasi/hasa-mitra-news"
                className="text-xs font-bold text-slate-600 hover:text-orange-600 inline-flex items-center gap-1 transition-colors"
              >
                Lihat Semua Berita Hasamitra →
              </Link>
            </div>
          </div>
        </article>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Berita Terbaru Lainnya
              </h2>
              <Link
                href="/informasi/hasa-mitra-news"
                className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => {
                const relImages = parseArticleImages(rel.image);
                return (
                  <Link
                    key={rel.id}
                    href={`/informasi/hasa-mitra-news/${rel.slug}`}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
                  >
                    {relImages.cover && (
                      <div className="relative w-full h-36 bg-slate-100 overflow-hidden">
                        <Image
                          src={relImages.cover}
                          alt={rel.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${getCategoryBadgeClass(rel.category)}`}>
                        {rel.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 mt-1.5">
                        {rel.title}
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium pt-2">
                      {formatDate(rel.createdAt)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

        {/* OJK & LPS Notice */}
        <OjkLpsNotice />

        {/* WhatsApp CS Banner */}
        <WhatsAppBanner title="Ada Pertanyaan Seputar Berita & Layanan Kami?" />
      </div>
    </div>
  );
}
