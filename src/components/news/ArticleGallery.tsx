"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ArticleGalleryProps {
  images: string[];
  title: string;
}

export default function ArticleGallery({ images, title }: ArticleGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  // Single Image View
  if (images.length === 1) {
    return (
      <div className="relative w-full aspect-video sm:aspect-21/9 max-h-[480px] bg-slate-100 overflow-hidden">
        <Image
          src={images[0]}
          alt={title}
          fill
          priority
          className="object-cover"
        />
      </div>
    );
  }

  const activeImage = images[activeIndex] || images[0];

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-3 bg-slate-900/5 p-3 sm:p-4 rounded-3xl border border-slate-100">
      {/* Main Active Image Container */}
      <div
        onClick={() => setLightboxOpen(true)}
        className="relative w-full aspect-video sm:aspect-21/9 max-h-[480px] bg-slate-900 rounded-2xl overflow-hidden cursor-pointer group shadow-sm"
      >
        <Image
          src={activeImage}
          alt={`${title} - Foto ${activeIndex + 1}`}
          fill
          priority
          className="object-cover group-hover:scale-102 transition-transform duration-500"
        />

        {/* Gradient Overlay for controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 pointer-events-none" />

        {/* Counter Badge */}
        <div className="absolute top-3 left-3 bg-slate-900/75 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 z-10 pointer-events-none">
          <svg className="w-3.5 h-3.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Foto {activeIndex + 1} dari {images.length}
        </div>

        {/* Click to Enlarge Hint */}
        <div className="absolute top-3 right-3 bg-slate-900/75 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10 pointer-events-none">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
          Klik untuk perbesar
        </div>

        {/* Prev / Next Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md transition shadow-lg opacity-80 group-hover:opacity-100 z-10 cursor-pointer"
          aria-label="Foto Sebelumnya"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md transition shadow-lg opacity-80 group-hover:opacity-100 z-10 cursor-pointer"
          aria-label="Foto Selanjutnya"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Thumbnail Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin">
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
              idx === activeIndex
                ? "border-orange-500 scale-102 shadow-md ring-2 ring-orange-500/20"
                : "border-slate-200/80 hover:border-slate-400 opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              src={img}
              alt={`${title} thumbnail ${idx + 1}`}
              fill
              className="object-cover"
            />
            <span className="absolute bottom-1 right-1 bg-black/70 text-[9px] font-bold text-white px-1.5 py-0.2 rounded font-mono">
              #{idx + 1}
            </span>
          </button>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6"
        >
          {/* Lightbox Top Bar */}
          <div className="w-full flex items-center justify-between text-white z-10 max-w-5xl">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full">
                Foto {activeIndex + 1} / {images.length}
              </span>
              <p className="text-xs sm:text-sm text-slate-300 font-medium truncate max-w-md hidden sm:block">
                {title}
              </p>
            </div>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition cursor-pointer"
              aria-label="Tutup"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Lightbox Main Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl h-[65vh] sm:h-[75vh] flex items-center justify-center"
          >
            <Image
              src={activeImage}
              alt={`${title} - Fullscreen Foto ${activeIndex + 1}`}
              fill
              className="object-contain"
            />

            {/* Modal Prev / Next Buttons */}
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
          </div>

          {/* Lightbox Bottom Thumbnail Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 max-w-3xl overflow-x-auto p-2 scrollbar-thin z-10"
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                  idx === activeIndex ? "border-orange-500 scale-105" : "border-white/30 opacity-50 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`Modal thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
