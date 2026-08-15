"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    label: "Kelola Produk",
    href: "/admin/produk",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    label: "Pendaftaran Nasabah",
    href: "/admin/pendaftaran",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    onClose?.();
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("hasamitra_admin_session_active");
    }
    await fetch("/api/admin/auth/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleGoToWebsite = async () => {
    onClose?.();
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("hasamitra_admin_session_active");
    }
    await fetch("/api/admin/auth/login", { method: "DELETE" });
    window.location.href = "/";
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer - High-End Orange Brand Theme */}
      <aside
        className={`fixed left-0 top-0 z-50 w-72 h-screen bg-gradient-to-b from-orange-600 via-orange-600 to-amber-700 border-r border-orange-500/50 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Section: Brand Header & Nav */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Brand Header */}
          <div className="px-6 py-6 border-b border-orange-500/50 flex items-center justify-between bg-orange-700/25">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white p-1 shadow-lg shadow-black/10 flex items-center justify-center shrink-0 border border-white/40 ring-2 ring-white/30">
                <Image
                  src="/images/logo/logo-bulat.png"
                  alt="Logo Hasamitra"
                  width={38}
                  height={38}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-0.5">
                <p className="text-white font-black text-sm tracking-wide leading-tight">Hasamitra</p>
                <p className="text-orange-100 text-xs font-bold tracking-wider uppercase">ADMIN MAS DENI</p>
              </div>
            </div>

            {/* Close button on mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition-colors focus:outline-none cursor-pointer"
              aria-label="Tutup Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu Title */}
          <div className="px-6 pt-5 pb-2">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-orange-200/90 font-mono">
              Menu Utama
            </p>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold tracking-wide transition-all duration-200 group ${
                    isActive
                      ? "bg-white text-orange-600 shadow-lg shadow-black/10 border border-white font-black"
                      : "text-white/90 hover:text-white hover:bg-white/15 border border-transparent"
                  }`}
                >
                  <div
                    className={`transition-colors duration-200 ${
                      isActive ? "text-orange-600" : "text-white/80 group-hover:text-white"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-orange-600 shadow-sm shadow-orange-600"></span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer User & Actions Card */}
        <div className="p-4 border-t border-orange-500/50 bg-orange-700/30 space-y-2">
          <button
            onClick={handleGoToWebsite}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-xs font-bold text-white/90 hover:text-white hover:bg-white/15 transition-all cursor-pointer text-left"
          >
            <svg className="w-4 h-4 text-white/90 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>Buka Website Utama</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-xs font-bold text-rose-100 hover:text-white bg-rose-950/25 hover:bg-rose-900/40 border border-rose-300/30 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 text-rose-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Keluar Sesi Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
}