"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Sembunyikan navbar publik di semua halaman admin
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isHomeActive = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand Hasamitra */}
          <Link
            href="/"
            className="flex items-center group py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-xl"
            aria-label="Bank Hasamitra Jawa Barat"
          >
            <div className="relative h-11 w-48 sm:w-56 transition-transform duration-300 group-hover:scale-[1.02]">
              <Image
                src="/images/logo/logo-hasamitra.png"
                alt="Bank Hasamitra Jawa Barat"
                fill
                sizes="(max-width: 640px) 190px, 230px"
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation - Single HASAMITRA Pill Link */}
          <nav className="hidden md:flex items-center">
            <Link
              href="/"
              className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${
                isHomeActive
                  ? "text-orange-600 bg-orange-50/90 border border-orange-200/80 shadow-xs"
                  : "text-slate-700 hover:text-orange-600 hover:bg-slate-100/80 border border-transparent"
              }`}
            >
              HASAMITRA
            </Link>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2.5 rounded-2xl text-slate-700 hover:text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 border border-slate-200/60 transition-all cursor-pointer"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Tutup menu" : "Buka menu navigasi"}
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      {isOpen && (
        <div
          className="md:hidden border-t border-slate-200/80 bg-white/98 backdrop-blur-2xl shadow-xl animate-fade-in"
          id="mobile-menu"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-6 space-y-2">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`block px-5 py-3 rounded-2xl text-base font-bold transition-colors ${
                isHomeActive
                  ? "text-orange-600 bg-orange-50 border border-orange-200/60"
                  : "text-slate-800 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              HASAMITRA
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
