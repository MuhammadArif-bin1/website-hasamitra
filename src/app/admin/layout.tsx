"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      {/* Admin Sidebar (Persistent on Desktop, Drawer on Mobile) */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Mobile Top Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800 shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors focus:outline-none"
              aria-label="Buka Menu Navigasi"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-sm">
                <span className="text-white font-black text-xs">HM</span>
              </div>
              <span className="font-bold text-sm tracking-tight text-white">Admin Hasamitra</span>
            </div>
          </div>

          <span className="text-[11px] font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2.5 py-1 rounded-full">
            Admin Panel
          </span>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

