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

  const fetchDashboardData = useCallback(async (isSilent = false) => {
    if (!isSilent) {
      setIsRefreshing(true);
    }
    try {
      const res = await fetch("/api/admin/dashboard", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Gagal memuat statistik dashboard:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const initFetch = async () => {
      try {
        const res = await fetch("/api/admin/dashboard", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        const json = await res.json();
        if (isMounted && json.success && json.data) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Gagal memuat statistik dashboard:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    initFetch();

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
      isMounted = false;
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
      icon: (
        <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      label: "Katalog Produk Aktif",
      value: data.totalProducts,
      subtext: "Produk perbankan aktif di website utama",
      href: "/admin/produk",
      icon: (
        <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
  ];

  const getStatusBadge = (status: string) => {
    const isSelesai = status === "Selesai";
    const isDiproses = status === "Diproses" || status === "Sedang Diproses";

    if (isSelesai) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Selesai</span>
        </span>
      );
    }
    if (isDiproses) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span>Sedang Diproses</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/80">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
        <span>{status || "Baru"}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Page Header */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Selamat Datang di Portal Admin Hasamitra
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        <button
          onClick={() => fetchDashboardData(false)}
          disabled={isRefreshing}
          className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors border border-slate-200 cursor-pointer inline-flex items-center justify-center gap-2 shadow-2xs shrink-0"
          title="Perbarui data"
        >
          <svg
            className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? "animate-spin text-orange-600" : ""}`}
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
            className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {stat.label}
              </span>
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                {stat.icon}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                {loading ? "..." : stat.value}
              </p>
              <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{stat.subtext}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Registrations Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-base text-slate-900">Pendaftaran Nasabah Terbaru</h2>
            <p className="text-xs text-slate-500 mt-0.5">Daftar calon nasabah yang baru masuk</p>
          </div>
          <Link
            href="/admin/pendaftaran"
            className="w-full sm:w-auto text-center px-3.5 py-1.5 rounded-lg text-xs font-semibold text-orange-600 hover:text-orange-700 hover:bg-orange-50 border border-transparent hover:border-orange-200 transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <span>Kelola Semua Pendaftaran</span>
            <span>→</span>
          </Link>
        </div>

        {/* Mobile Card List View */}
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
              <div key={reg.id} className="p-4 space-y-2.5 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-md bg-orange-50 text-orange-700 font-semibold text-xs flex items-center justify-center shrink-0 border border-orange-100">
                      {reg.nama ? reg.nama.charAt(0).toUpperCase() : "N"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{reg.nama}</p>
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
                  <span className="text-xs text-slate-600 truncate max-w-[55%] font-medium">
                    {reg.produk}
                  </span>
                  {getStatusBadge(reg.status)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto w-full">
          <table className="w-full min-w-[540px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-5 sm:px-6 py-3">Nama Pemohon</th>
                <th className="px-5 sm:px-6 py-3">Produk Diajukan</th>
                <th className="px-5 sm:px-6 py-3">Status</th>
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
                  <tr key={reg.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 sm:px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-md bg-orange-50 text-orange-700 font-semibold text-xs flex items-center justify-center shrink-0 border border-orange-100">
                          {reg.nama ? reg.nama.charAt(0).toUpperCase() : "N"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{reg.nama}</p>
                          <p className="text-xs text-slate-400 font-mono">{reg.telepon}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 sm:px-6 py-3.5 text-xs font-medium text-slate-700">
                      {reg.produk}
                    </td>
                    <td className="px-5 sm:px-6 py-3.5">
                      {getStatusBadge(reg.status)}
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
