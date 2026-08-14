"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import WhatsAppButton from "@/components/common/WhatsAppButton";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Sembunyikan navbar publik di semua halaman admin
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isHomeActive = pathname === "/";

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/60 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/images/logo/logo-hasamitra.png"
              alt="Bank Hasamitra Jawa Barat"
              width={220}
              height={55}
              className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Navigation - Single HASAMITRA Pill Link */}
          <nav className="hidden md:flex items-center space-x-3">
            <Link
              href="/"
              className={`px-5 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${
                isHomeActive
                  ? "text-orange-600 bg-orange-50/90 border border-orange-200/80 shadow-xs"
                  : "text-slate-700 hover:text-orange-600 hover:bg-slate-100/80 border border-transparent"
              }`}
            >
              HASAMITRA
            </Link>
          </nav>

          {/* Action WhatsApp CS Button on Navbar */}
          <div className="hidden lg:flex items-center">
            <WhatsAppButton
              variant="compact"
              text="HUBUNGI CS"
              className="rounded-full px-5 py-2.5 font-bold shadow-sm hover:shadow-md transition-all"
            />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <WhatsAppButton
              variant="compact"
              text="CS"
              className="rounded-full px-3.5 py-1.5 font-bold text-xs"
            />
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-700 hover:text-orange-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Buka menu</span>
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl shadow-lg" id="mobile-menu">
          <div className="px-4 pt-3 pb-6 space-y-2">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`block px-5 py-3 rounded-2xl text-base font-bold transition-colors ${
                isHomeActive
                  ? "text-orange-600 bg-orange-50"
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
