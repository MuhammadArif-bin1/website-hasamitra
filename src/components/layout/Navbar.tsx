"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import { hasamitraSubmenu } from "@/data/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHasamitraOpen, setIsHasamitraOpen] = useState(false);
  const [isMobileHasamitraOpen, setIsMobileHasamitraOpen] = useState(true);
  const pathname = usePathname();

  // Sembunyikan navbar publik di semua halaman admin
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isHasamitraActive =
    pathname === "/" ||
    pathname.startsWith("/produk") ||
    pathname.startsWith("/penghargaan") ||
    pathname.startsWith("/tentang-kami/penghargaan");

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/images/logo/logo-hasamitra.png"
              alt="Bank Hasamitra Jawa Barat"
              width={220}
              height={55}
              className="h-11 w-auto object-contain transition-transform group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-3">
            {/* Dropdown HASAMITRA (Beranda, Produk & Layanan, Piagam & Penghargaan) */}
            <div
              className="relative"
              onMouseEnter={() => setIsHasamitraOpen(true)}
              onMouseLeave={() => setIsHasamitraOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsHasamitraOpen(!isHasamitraOpen)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all cursor-pointer ${
                  isHasamitraActive
                    ? "text-orange-600 bg-orange-50 border border-orange-200 shadow-xs"
                    : "text-slate-700 hover:text-orange-600 hover:bg-slate-50 border border-transparent"
                }`}
              >
                <span>HASAMITRA</span>
                <svg
                  className={`w-4 h-4 text-orange-500 transition-transform duration-200 ${
                    isHasamitraOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu Hasamitra */}
              {isHasamitraOpen && (
                <div className="absolute top-full left-0 w-64 pt-2 z-50 animate-fade-in">
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-100 py-2 divide-y divide-slate-50">
                    {hasamitraSubmenu.map((sub) => {
                      const isActive =
                        pathname === sub.href ||
                        (sub.href === "/penghargaan" && pathname.startsWith("/tentang-kami/penghargaan"));

                      return (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={() => setIsHasamitraOpen(false)}
                          className={`flex items-center justify-between px-4 py-3 text-sm font-semibold transition-colors ${
                            isActive
                              ? "text-orange-600 bg-orange-50 font-bold"
                              : "text-slate-800 hover:bg-orange-50/60 hover:text-orange-600"
                          }`}
                        >
                          <span>{sub.name}</span>
                          {sub.href === "/penghargaan" && (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                              Piagam
                            </span>
                          )}
                          {sub.href === "/produk" && (
                            <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                              Layanan
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Action WhatsApp Button on Navbar */}
          <div className="hidden lg:flex items-center">
            <WhatsAppButton variant="compact" text="Hubungi Kami" />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <WhatsAppButton variant="compact" text="WhatsApp" />
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-orange-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
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
        <div className="md:hidden border-t border-slate-100 bg-white" id="mobile-menu">
          <div className="px-4 pt-3 pb-6 space-y-2">
            {/* Mobile Submenu HASAMITRA */}
            <div>
              <button
                onClick={() => setIsMobileHasamitraOpen(!isMobileHasamitraOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-bold text-slate-800 hover:bg-orange-50 hover:text-orange-600 cursor-pointer"
              >
                <span>HASAMITRA</span>
                <svg
                  className={`w-4 h-4 text-orange-500 transition-transform ${
                    isMobileHasamitraOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isMobileHasamitraOpen && (
                <div className="pl-4 space-y-1 mt-1 border-l-2 border-orange-200">
                  {hasamitraSubmenu.map((sub) => {
                    const isActive =
                      pathname === sub.href ||
                      (sub.href === "/penghargaan" && pathname.startsWith("/tentang-kami/penghargaan"));

                    return (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                          isActive
                            ? "text-orange-600 bg-orange-50 font-bold"
                            : "text-slate-700 hover:text-orange-600 hover:bg-slate-50"
                        }`}
                      >
                        <span>{sub.name}</span>
                        {sub.href === "/penghargaan" && (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                            Piagam
                          </span>
                        )}
                        {sub.href === "/produk" && (
                          <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                            Layanan
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
