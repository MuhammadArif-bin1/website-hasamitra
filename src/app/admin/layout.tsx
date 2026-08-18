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
    router.push("/");
    router.refresh();
  };

  // Get active page title for header
  let pageTitle = "Dashboard";
  if (pathname.includes("/admin/produk")) pageTitle = "Kelola Produk";
  else if (pathname.includes("/admin/pendaftaran")) pageTitle = "Pendaftaran Nasabah";

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col lg:flex-row text-slate-800 selection:bg-orange-500 selection:text-white max-w-full overflow-x-hidden">
      {/* Admin Sidebar (Desktop fixed & Mobile Drawer) */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 w-full">
        {/* Desktop & Mobile Header Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between shadow-2xs">
          {/* Mobile hamburger + Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none cursor-pointer shrink-0"
              aria-label="Buka Navigasi Admin"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium truncate">
              <span className="hidden sm:inline">Portal Admin</span>
              <span className="hidden sm:inline text-slate-300">/</span>
              <span className="text-slate-800 font-semibold truncate">
                {pageTitle}
              </span>
            </div>
          </div>

          {/* Right Header Badges */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="hidden sm:inline">Sistem Online</span>
            </div>

            <button
              onClick={handleGoToWebsite}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
              title="Buka Website Utama"
            >
              <span>Website</span>
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
