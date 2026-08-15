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
      label: "Total Pendaftaran Nasabah",
      value: data.totalRegistrations,
      subtext: "Nasabah baru terdaftar online",
      href: "/admin/pendaftaran",
      iconBg: "bg-orange-50 text-orange-600 border border-orange-100",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      label: "Katalog Produk Aktif",
      value: data.totalProducts,
      subtext: "Produk perbankan aktif di landing page",
      href: "/admin/produk",
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-8 w-full max-w-full">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            Selamat Datang di Portal Admin Hasamitra
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        <button
          onClick={() => fetchDashboardData(false)}
          disabled={isRefreshing}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-orange-50 hover:text-orange-600 text-slate-700 text-xs font-bold transition border border-slate-200 hover:border-orange-200 cursor-pointer inline-flex items-center justify-center gap-2 shadow-xs shrink-0"
          title="Perbarui data"
        >
          <svg
            className={`w-3.5 h-3.5 text-orange-500 ${isRefreshing ? "animate-spin" : ""}`}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-orange-300 transition-all duration-200 group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                {stat.label}
              </span>
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${stat.iconBg} flex items-center justify-center group-hover:scale-105 transition-transform`}
              >
                {stat.icon}
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                {loading ? "..." : stat.value}
              </p>
              <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{stat.subtext}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Registrations Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-extrabold text-sm sm:text-base text-slate-900">Pendaftaran Nasabah Terbaru</h2>
            <p className="text-xs text-slate-500 mt-0.5">Daftar calon nasabah yang baru masuk</p>
          </div>
          <Link
            href="/admin/pendaftaran"
            className="w-full sm:w-auto text-center px-4 py-2 rounded-xl text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors border border-orange-200/60 inline-flex items-center justify-center gap-1.5"
          >
            <span>Kelola Semua Pendaftaran</span>
            <span>→</span>
          </Link>
        </div>

        {/* Mobile Card List View (Visible on small screens) */}
        <div className="block sm:hidden divide-y divide-slate-100">
          {loading && data.recentRegistrations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              <div className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
                <span>Memuat data...</span>
              </div>
            </div>
          ) : data.recentRegistrations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Belum ada data pendaftaran yang masuk.
            </div>
          ) : (
            data.recentRegistrations.map((reg) => (
              <div key={reg.id} className="p-4 space-y-2.5 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {reg.nama ? reg.nama.charAt(0).toUpperCase() : "N"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-slate-900 truncate">{reg.nama}</p>
                      <p className="text-xs text-slate-400 font-mono">{reg.telepon}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    {new Date(reg.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 truncate max-w-[55%]">
                    {reg.produk}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                      reg.status === "Selesai"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : reg.status === "Diproses" || reg.status === "Sedang Diproses"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        reg.status === "Selesai"
                          ? "bg-emerald-500"
                          : reg.status === "Diproses" || reg.status === "Sedang Diproses"
                          ? "bg-amber-500"
                          : "bg-blue-500"
                      }`}
                    ></span>
                    <span>{reg.status === "Diproses" ? "Sedang Diproses" : reg.status || "Baru"}</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View (Hidden on small screens) */}
        <div className="hidden sm:block overflow-x-auto w-full">
          <table className="w-full min-w-[540px]">
            <thead>
              <tr className="bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <th className="px-5 sm:px-6 py-3 text-left">Nama Pemohon</th>
                <th className="px-5 sm:px-6 py-3 text-left">Produk Diajukan</th>
                <th className="px-5 sm:px-6 py-3 text-left">Status</th>
                <th className="px-5 sm:px-6 py-3 text-right">Tanggal Masuk</th>
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
                    <td className="px-5 sm:px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {reg.nama ? reg.nama.charAt(0).toUpperCase() : "N"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{reg.nama}</p>
                          <p className="text-xs text-slate-400 font-mono">{reg.telepon}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 sm:px-6 py-3.5 text-xs font-semibold text-slate-700">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">
                        {reg.produk}
                      </span>
                    </td>
                    <td className="px-5 sm:px-6 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          reg.status === "Selesai"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : reg.status === "Diproses" || reg.status === "Sedang Diproses"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            reg.status === "Selesai"
                              ? "bg-emerald-500"
                              : reg.status === "Diproses" || reg.status === "Sedang Diproses"
                              ? "bg-amber-500"
                              : "bg-blue-500"
                          }`}
                        ></span>
                        <span>{reg.status === "Diproses" ? "Sedang Diproses" : reg.status || "Baru"}</span>
                      </span>
                    </td>
                    <td className="px-5 sm:px-6 py-3.5 text-xs text-slate-500 text-right font-mono">
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
