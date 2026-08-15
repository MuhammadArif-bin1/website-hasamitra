"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Validasi session tab aktif saat berada di halaman admin
    if (typeof window !== "undefined" && !isLoginPage) {
      const isActive = sessionStorage.getItem("hasamitra_admin_session_active");
      if (!isActive) {
        // Jika tidak ada session aktif (misal membuka tab baru setelah meninggalkan halaman), minta login kembali
        fetch("/api/admin/auth/login", { method: "DELETE" }).finally(() => {
          router.push("/admin/login");
          router.refresh();
        });
      }
    }
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleGoToWebsite = async () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("hasamitra_admin_session_active");
    }
    await fetch("/api/admin/auth/login", { method: "DELETE" });
    window.location.href = "/";
  };

  // Get active page title for header
  let pageTitle = "Dashboard";
  if (pathname.includes("/admin/produk")) pageTitle = "Kelola Produk";
  else if (pathname.includes("/admin/pendaftaran")) pageTitle = "Pendaftaran Nasabah";

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans flex flex-col lg:flex-row text-slate-800 selection:bg-orange-500 selection:text-white max-w-full overflow-x-hidden">
      {/* Admin Sidebar (Desktop fixed & Mobile Drawer) */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-72 w-full">
        {/* Desktop & Mobile Header Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-3.5 sm:px-6 lg:px-8 py-3 flex items-center justify-between shadow-xs">
          {/* Mobile hamburger + Breadcrumb */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none cursor-pointer shrink-0"
              aria-label="Buka Navigasi Admin"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-slate-400 truncate">
              <span className="hidden md:inline">Portal Admin</span>
              <span className="hidden md:inline">/</span>
              <span className="text-orange-600 font-extrabold bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200/60 truncate text-xs">
                {pageTitle}
              </span>
            </div>
          </div>

          {/* Right Header Badges */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-[11px] sm:text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden sm:inline">Sistem Online</span>
            </div>

            <button
              onClick={handleGoToWebsite}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 border border-slate-200 transition-all inline-flex items-center gap-1.5 cursor-pointer"
              title="Buka Website Utama dan Akhiri Sesi Admin"
            >
              <span>Website</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-5 sm:space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
