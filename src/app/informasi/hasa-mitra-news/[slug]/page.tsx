import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import WhatsAppBanner from "@/components/common/WhatsAppBanner";
import OjkLpsNotice from "@/components/common/OjkLpsNotice";
import { parseArticleImages } from "@/lib/articleImages";
import ArticleDetailView from "@/components/news/ArticleDetailView";
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

  const { cover, content, contentImages } = parseArticleImages(article.image);
  const ogImage = contentImages[0] || content || cover;

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

  // Parse images (foto sampul vs banyak foto di dalam isi berita)
  const { cover, content: contentImage, contentImages } = parseArticleImages(article.image);
  const displayImages = contentImages.length > 0 ? contentImages : (contentImage || cover ? [contentImage || cover] : []);

  const serializedArticle = {
    id: article.id,
    title: article.title,
    category: article.category,
    content: article.content,
    createdAt: article.createdAt.toISOString(),
    slug: article.slug,
  };

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

  return (
    <div className="py-6 sm:py-10 lg:py-14 bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Main Article Container with Top Photo, Paragraphs, and Bottom Photo Grid */}
        <ArticleDetailView article={serializedArticle} images={displayImages} />

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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
