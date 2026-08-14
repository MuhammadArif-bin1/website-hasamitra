"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ArticleGalleryProps {
  images: string[];
  title: string;
}

export function ArticleMainPhoto({
  image,
  title,
  onClick,
}: {
  image: string;
  title: string;
  onClick?: () => void;
}) {
  if (!image) return null;

  return (
    <div
      onClick={onClick}
      className={`relative w-full aspect-video sm:aspect-16/10 max-h-[520px] rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200/80 ${
        onClick ? "cursor-pointer group" : ""
      }`}
    >
      <Image
        src={image}
        alt={title}
        fill
        priority
        className="object-cover group-hover:scale-102 transition-transform duration-500"
      />
      {onClick && (
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
          Perbesar
        </div>
      )}
    </div>
  );
}

export function ArticleBottomGrid({
  images,
  title,
  onImageClick,
}: {
  images: string[];
  title: string;
  onImageClick?: (index: number) => void;
}) {
  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-3 pt-4">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Dokumentasi Kegiatan ({images.length} Foto Tambahan)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => onImageClick?.(idx + 1)}
            className="relative aspect-4/3 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 cursor-pointer group shadow-xs hover:shadow-md transition-all"
          >
            <Image
              src={img}
              alt={`${title} - Dokumentasi ${idx + 1}`}
              fill
              className="object-cover group-hover:scale-104 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
              <span className="bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                Foto #{idx + 2} • Klik untuk perbesar
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ArticleGalleryViewer({
  images,
  title,
}: ArticleGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const mainPhoto = images[0];
  const additionalPhotos = images.slice(1);

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
    <>
      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6"
        >
          {/* Top Header */}
          <div className="w-full flex items-center justify-between text-white max-w-5xl z-10">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full">
                Foto {lightboxIndex + 1} dari {images.length}
              </span>
              <p className="text-xs sm:text-sm text-slate-300 font-medium truncate max-w-md hidden sm:block">
                {title}
              </p>
            </div>
            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition cursor-pointer"
              aria-label="Tutup"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Active Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl h-[65vh] sm:h-[75vh] flex items-center justify-center"
          >
            <Image
              src={images[lightboxIndex]}
              alt={`${title} - Foto ${lightboxIndex + 1}`}
              fill
              className="object-contain"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  className={`relative w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden shrink-0 border-2 transition cursor-pointer ${
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
    </>
  );
}
