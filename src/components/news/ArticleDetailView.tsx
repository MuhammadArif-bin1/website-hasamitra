"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ArticleDetailViewProps {
  article: {
    id: number;
    title: string;
    category: string;
    content: string;
    createdAt: string;
    slug: string;
  };
  images: string[];
}

export default function ArticleDetailView({ article, images }: ArticleDetailViewProps) {
  const router = useRouter();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const mainPhoto = images[0] || "";
  const additionalPhotos = images.slice(1);

  const paragraphs = article.content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % images.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      {/* Top Navigation Bar: Back button & Link to all news */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push("/informasi/hasa-mitra-news");
            }
          }}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-orange-600 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition shadow-2xs cursor-pointer group"
        >
          <svg
            className="w-4 h-4 text-slate-500 group-hover:text-orange-600 group-hover:-translate-x-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali (Back)
        </button>

        <Link
          href="/informasi/hasa-mitra-news"
          className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 hover:underline px-2 py-1"
        >
          Semua Berita
        </Link>
      </div>

      {/* Main Content Card with Wide Layout & Elegant Border */}
      <article className="w-full bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-8 lg:p-12 space-y-6 sm:space-y-8">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-snug sm:leading-tight tracking-tight break-words">
          {article.title}
        </h1>

        {/* Pill Badges (Home, Berita / Kategori, Judul Berita) */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 pt-0.5 pb-1">
          <Link
            href="/"
            className="bg-[#9c6a3a] hover:bg-[#83562a] text-white text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 rounded transition shadow-2xs shrink-0"
          >
            Home
          </Link>
          <Link
            href="/informasi/hasa-mitra-news"
            className="bg-[#9c6a3a] hover:bg-[#83562a] text-white text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 rounded transition shadow-2xs shrink-0"
          >
            {article.category || "Berita"}
          </Link>
          <span className="bg-[#0b9758] text-white text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 rounded shadow-2xs max-w-full sm:max-w-md md:max-w-lg truncate">
            {article.title}
          </span>
        </div>

        {/* 1. Main Featured Photo (Foto Utama) */}
        {mainPhoto && (
          <div
            onClick={() => setLightboxIndex(0)}
            className="relative w-full aspect-video sm:aspect-16/9 lg:aspect-21/9 max-h-[580px] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/90 cursor-pointer group shadow-2xs"
          >
            <Image
              src={mainPhoto}
              alt={article.title}
              fill
              priority
              className="object-cover group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute top-3 right-3 bg-black/65 backdrop-blur-xs text-white text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
              Perbesar Foto
            </div>
          </div>
        )}

        {/* 2. Article Text Paragraphs (Konten Berita) */}
        <div className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed sm:leading-loose space-y-4 sm:space-y-5 pt-2 text-justify sm:text-left">
          {paragraphs.length > 0 ? (
            paragraphs.map((p, idx) => (
              <p key={idx} className="whitespace-pre-line">
                {p}
              </p>
            ))
          ) : (
            <p className="whitespace-pre-line">{article.content}</p>
          )}
        </div>

        {/* 3. Additional Photos Grid (Galeri Foto-foto Tambahan di Bawah Isi Berita) */}
        {additionalPhotos.length > 0 && (
          <div className="space-y-4 pt-6 sm:pt-8 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Dokumentasi Kegiatan ({additionalPhotos.length} Foto Tambahan)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
              {additionalPhotos.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx + 1)}
                  className="relative aspect-4/3 sm:aspect-16/10 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/90 cursor-pointer group shadow-2xs hover:shadow-md transition-all"
                >
                  <Image
                    src={img}
                    alt={`${article.title} - Foto ${idx + 2}`}
                    fill
                    className="object-cover group-hover:scale-104 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="bg-black/70 backdrop-blur-xs text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                      <svg className="w-3 h-3 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                      Foto #{idx + 2} • Klik untuk perbesar
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions (Back Button & Share) */}
        <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push("/informasi/hasa-mitra-news");
              }
            }}
            className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-orange-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            ← Kembali ke Berita (Back)
          </button>

          <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bagikan Berita:</span>
            <div className="flex items-center gap-2">
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
          </div>
        </div>
      </article>

      {/* Lightbox Modal with Full Responsive Mobile View */}
      {lightboxIndex !== null && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6"
        >
          {/* Top Bar */}
          <div className="w-full flex items-center justify-between text-white max-w-6xl z-10">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full">
                Foto {lightboxIndex + 1} dari {images.length}
              </span>
              <p className="text-xs sm:text-sm text-slate-300 font-medium truncate max-w-xs sm:max-w-md hidden sm:block">
                {article.title}
              </p>
            </div>
            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition cursor-pointer"
              aria-label="Tutup"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main Display */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl h-[60vh] sm:h-[75vh] flex items-center justify-center"
          >
            <Image
              src={images[lightboxIndex]}
              alt={`${article.title} - Foto ${lightboxIndex + 1}`}
              fill
              className="object-contain"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition cursor-pointer"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition cursor-pointer"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails */}
          {images.length > 1 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 max-w-3xl overflow-x-auto p-2 scrollbar-thin z-10"
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  className={`relative w-12 h-9 sm:w-16 sm:h-12 rounded-lg overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                    idx === lightboxIndex ? "border-orange-500 scale-105" : "border-white/30 opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
