"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface RecentRegistration {
  id: number;
  nama: string;
  produk: string;
  telepon: string;
  status: string;
  createdAt: string;
}

interface DashboardData {
  totalRegistrations: number;
  totalProducts: number;
  recentRegistrations: RecentRegistration[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData>({
    totalRegistrations: 0,
    totalProducts: 0,
    recentRegistrations: [],
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("");

  const fetchDashboardData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/dashboard", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
        setLastSyncTime(new Date().toLocaleTimeString("id-ID"));
      }
    } catch (err) {
      console.error("Gagal memuat statistik dashboard:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(false);

    // Auto-polling every 5 seconds
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 5000);

    // BroadcastChannel listener
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        bc = new BroadcastChannel("hasamitra_sync_channel");
        bc.onmessage = () => {
          fetchDashboardData(true);
        };
      }
    } catch {}

    const handleFocus = () => fetchDashboardData(true);
    const handleStorage = () => fetchDashboardData(true);

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);

    return () => {
      clearInterval(interval);
      if (bc) bc.close();
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
    };
  }, [fetchDashboardData]);

  const stats = [
    {
      label: "Total Pendaftaran",
      value: data.totalRegistrations,
      subtext: "Nasabah baru masuk (Online)",
      href: "/admin/pendaftaran",
      gradient: "from-orange-500 via-orange-600 to-amber-500",
      shadow: "shadow-orange-500/20",
      bgLight: "bg-orange-50",
      textColor: "text-orange-600",
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: "Katalog Produk Aktif",
      value: data.totalProducts,
      subtext: "Produk tampil di landing page",
      href: "/admin/produk",
      gradient: "from-emerald-500 via-teal-600 to-emerald-600",
      shadow: "shadow-emerald-500/20",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600",
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800/90 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute right-0 top-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-2.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Overview Sistem
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-semibold backdrop-blur-md border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Live Sync Real-Time</span>
              {lastSyncTime && (
                <span className="text-[10px] text-slate-300 font-mono">({lastSyncTime})</span>
              )}
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Selamat Datang di Portal Admin Hasamitra
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Data pendaftaran nasabah dan pembaruan produk perbankan terpantau secara real-time tanpa perlu me-refresh halaman.
          </p>
        </div>

        <button
          onClick={() => fetchDashboardData(false)}
          disabled={isRefreshing}
          className="relative z-10 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold transition border border-white/20 backdrop-blur-md cursor-pointer inline-flex items-center justify-center gap-2 shrink-0 shadow-lg"
          title="Perbarui data sekarang"
        >
          <svg
            className={`w-4 h-4 text-orange-400 ${isRefreshing ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Stats Grid: 2 Core Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {stat.label}
              </span>
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform duration-300`}
              >
                {stat.icon}
              </div>
            </div>
            <div>
              <p className="text-3xl sm:text-5xl font-black text-slate-900">
                {loading ? "..." : stat.value}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">{stat.subtext}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Registrations Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md shadow-slate-200/50 overflow-hidden">
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h2 className="font-extrabold text-base text-slate-900">Pendaftaran Nasabah Terbaru</h2>
            <p className="text-xs text-slate-500">Data masuk dari form online beranda secara real-time</p>
          </div>
          <Link
            href="/admin/pendaftaran"
            className="px-4 py-2 rounded-xl text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors border border-orange-200/60 inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Kelola Semua Pendaftaran</span>
            <span>→</span>
          </Link>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[540px]">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-5 sm:px-6 py-3.5 text-left">Nama Pemohon</th>
                <th className="px-5 sm:px-6 py-3.5 text-left">Produk Diajukan</th>
                <th className="px-5 sm:px-6 py-3.5 text-left">Status</th>
                <th className="px-5 sm:px-6 py-3.5 text-right">Tanggal Masuk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && data.recentRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
                      <span>Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : data.recentRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-400">
                    Belum ada data pendaftaran yang masuk.
                  </td>
                </tr>
              ) : (
                data.recentRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 sm:px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{reg.nama}</p>
                      <p className="text-xs text-slate-400 font-mono">{reg.telepon}</p>
                    </td>
                    <td className="px-5 sm:px-6 py-4 text-xs font-semibold text-slate-700">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">
                        {reg.produk}
                      </span>
                    </td>
                    <td className="px-5 sm:px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                          reg.status === "Selesai"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : reg.status === "Diproses"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-5 sm:px-6 py-4 text-xs text-slate-500 text-right font-mono">
                      {new Date(reg.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
