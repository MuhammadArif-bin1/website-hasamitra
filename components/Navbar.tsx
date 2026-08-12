"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import WhatsAppButton from "./WhatsAppButton";
import { tentangKamiSubmenu, informasiSubmenu } from "@/data/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTentangKamiOpen, setIsTentangKamiOpen] = useState(false);
  const [isMobileTentangKamiOpen, setIsMobileTentangKamiOpen] = useState(false);
  const [isInformasiOpen, setIsInformasiOpen] = useState(false);
  const [isMobileInformasiOpen, setIsMobileInformasiOpen] = useState(false);
  const pathname = usePathname();

  const isTentangKamiActive = pathname.startsWith("/tentang-kami");
  const isInformasiActive = pathname.startsWith("/informasi");

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
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                pathname === "/"
                  ? "text-orange-600 bg-orange-50"
                  : "text-slate-700 hover:text-orange-600 hover:bg-slate-50"
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
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isTentangKamiActive
                    ? "text-orange-600 bg-orange-50"
                    : "text-slate-700 hover:text-orange-600 hover:bg-slate-50"
                }`}
              >
                TENTANG KAMI
                <svg
                  className={`w-4 h-4 text-orange-500 transition-transform ${
                    isTentangKamiOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              {/* Dropdown Menu Tentang Kami */}
              {isTentangKamiOpen && (
                <div className="absolute top-full left-0 w-56 pt-2 z-50">
                  <div className="bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-fade-in">
                    {tentangKamiSubmenu.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className={`block px-4 py-2.5 text-sm font-semibold transition-colors ${
                          pathname === sub.href
                            ? "text-orange-600 bg-orange-50"
                            : "text-slate-800 hover:bg-orange-50/60 hover:text-orange-600"
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
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                pathname === "/produk"
                  ? "text-orange-600 bg-orange-50"
                  : "text-slate-700 hover:text-orange-600 hover:bg-slate-50"
              }`}
            >
              PRODUK
            </Link>

            {/* Dropdown Informasi */}
            <div
              className="relative"
              onMouseEnter={() => setIsInformasiOpen(true)}
              onMouseLeave={() => setIsInformasiOpen(false)}
            >
              <Link
                href="/informasi"
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isInformasiActive
                    ? "text-orange-600 bg-orange-50"
                    : "text-slate-700 hover:text-orange-600 hover:bg-slate-50"
                }`}
              >
                INFORMASI
                <svg
                  className={`w-4 h-4 text-orange-500 transition-transform ${
                    isInformasiOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              {/* Dropdown Menu Informasi */}
              {isInformasiOpen && (
                <div className="absolute top-full left-0 w-60 pt-2 z-50">
                  <div className="bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-fade-in">
                    {informasiSubmenu.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className={`block px-4 py-2.5 text-sm font-semibold transition-colors ${
                          pathname === sub.href
                            ? "text-orange-600 bg-orange-50"
                            : "text-slate-800 hover:bg-orange-50/60 hover:text-orange-600"
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
              href="/contact"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                pathname === "/contact"
                  ? "text-orange-600 bg-orange-50"
                  : "text-slate-700 hover:text-orange-600 hover:bg-slate-50"
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
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-orange-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-orange-50 hover:text-orange-600"
            >
              HASAMITRA
            </Link>

            {/* Mobile Submenu Tentang Kami */}
            <div>
              <button
                onClick={() => setIsMobileTentangKamiOpen(!isMobileTentangKamiOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-orange-50 hover:text-orange-600"
              >
                <span>TENTANG KAMI</span>
                <svg
                  className={`w-4 h-4 text-orange-500 transition-transform ${
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
                          ? "text-orange-600 bg-orange-50"
                          : "text-slate-700 hover:text-orange-600 hover:bg-slate-50"
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
              className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-orange-50 hover:text-orange-600"
            >
              PRODUK
            </Link>

            {/* Mobile Submenu Informasi */}
            <div>
              <button
                onClick={() => setIsMobileInformasiOpen(!isMobileInformasiOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-orange-50 hover:text-orange-600"
              >
                <span>INFORMASI</span>
                <svg
                  className={`w-4 h-4 text-orange-500 transition-transform ${
                    isMobileInformasiOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isMobileInformasiOpen && (
                <div className="pl-6 space-y-1 mt-1 border-l-2 border-slate-200">
                  {informasiSubmenu.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        pathname === sub.href
                          ? "text-orange-600 bg-orange-50"
                          : "text-slate-700 hover:text-orange-600 hover:bg-slate-50"
                      }`}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-orange-50 hover:text-orange-600"
            >
              CONTACT
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
