"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import WhatsAppButton from "./WhatsAppButton";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTentangKamiOpen, setIsTentangKamiOpen] = useState(false);
  const [isMobileTentangKamiOpen, setIsMobileTentangKamiOpen] = useState(false);
  const pathname = usePathname();

  const tentangKamiSubmenu = [
    { name: "Profil Perusahaan", href: "/tentang-kami/profil-perusahaan" },
    { name: "Logo & Makna", href: "/tentang-kami/logo-makna" },
    { name: "Pengurus", href: "/tentang-kami/pengurus" },
    { name: "Struktur Organisasi", href: "/tentang-kami/struktur-organisasi" },
    { name: "Penghargaan", href: "/tentang-kami/penghargaan" },
  ];

  const isTentangKamiActive = pathname.startsWith("/tentang-kami");

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo-hasamitra.png"
              alt="Bank Hasamitra Jawa Barat"
              width={220}
              height={55}
              className="h-11 w-auto object-contain transition-transform group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                pathname === "/"
                  ? "text-blue-700 bg-blue-50"
                  : "text-slate-700 hover:text-blue-700 hover:bg-slate-50"
              }`}
            >
              HASAMITRA
            </Link>

            {/* Dropdown Tentang Kami */}
            <div
              className="relative"
              onMouseEnter={() => setIsTentangKamiOpen(true)}
              onMouseLeave={() => setIsTentangKamiOpen(false)}
            >
              <Link
                href="/tentang-kami/profil-perusahaan"
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                  isTentangKamiActive
                    ? "text-blue-700 bg-blue-50"
                    : "text-slate-700 hover:text-blue-700 hover:bg-slate-50"
                }`}
              >
                TENTANG KAMI
                <svg
                  className={`w-4 h-4 text-emerald-600 transition-transform ${
                    isTentangKamiOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              {/* Dropdown Menu */}
              {isTentangKamiOpen && (
                <div className="absolute top-full left-0 w-56 pt-2 z-50">
                  <div className="bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-fade-in">
                    {tentangKamiSubmenu.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className={`block px-4 py-2.5 text-sm font-semibold transition-colors ${
                          pathname === sub.href
                            ? "text-blue-700 bg-blue-50"
                            : "text-slate-800 hover:bg-slate-50 hover:text-blue-700"
                        }`}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/produk"
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                pathname === "/produk"
                  ? "text-blue-700 bg-blue-50"
                  : "text-slate-700 hover:text-blue-700 hover:bg-slate-50"
              }`}
            >
              PRODUK
            </Link>

            <Link
              href="/informasi"
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                pathname === "/informasi"
                  ? "text-blue-700 bg-blue-50"
                  : "text-slate-700 hover:text-blue-700 hover:bg-slate-50"
              }`}
            >
              INFORMASI
            </Link>

            <Link
              href="/contact"
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                pathname === "/contact"
                  ? "text-blue-700 bg-blue-50"
                  : "text-slate-700 hover:text-blue-700 hover:bg-slate-50"
              }`}
            >
              CONTACT
            </Link>
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
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-blue-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-700"
            >
              HASAMITRA
            </Link>

            {/* Mobile Submenu Tentang Kami */}
            <div>
              <button
                onClick={() => setIsMobileTentangKamiOpen(!isMobileTentangKamiOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-700"
              >
                <span>TENTANG KAMI</span>
                <svg
                  className={`w-4 h-4 text-emerald-600 transition-transform ${
                    isMobileTentangKamiOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isMobileTentangKamiOpen && (
                <div className="pl-6 space-y-1 mt-1 border-l-2 border-slate-200">
                  {tentangKamiSubmenu.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        pathname === sub.href
                          ? "text-blue-700 bg-blue-50"
                          : "text-slate-700 hover:text-blue-700 hover:bg-slate-50"
                      }`}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/produk"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-700"
            >
              PRODUK
            </Link>

            <Link
              href="/informasi"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-700"
            >
              INFORMASI
            </Link>

            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-700"
            >
              CONTACT
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
