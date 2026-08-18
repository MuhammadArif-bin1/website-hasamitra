"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

interface AtkRequest {
  id: number;
  requestNumber: string;
  requestType: "PURCHASE" | "REQUEST";
  namaKaryawan: string;
  departemen: string;
  jabatan: string;
  jenisAtk?: string | null;
  namaBarang?: string | null;
  pilihBarangAtk?: string | null;
  jumlah: number;
  alasan?: string | null;
  keperluan?: string | null;
  status: "PENDING" | "PROCESSING" | "APPROVED" | "REJECTED" | "COMPLETED";
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  processedAt?: string | null;
  completedAt?: string | null;
}

interface Stats {
  total: number;
  pending: number;
  processing: number;
  approved: number;
  rejected: number;
  completed: number;
}

function AdminPengajuanAtkContent() {
  const searchParams = useSearchParams();
  const [requests, setRequests] = useState<AtkRequest[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    processing: 0,
    approved: 0,
    rejected: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [typeFilter, setTypeFilter] = useState("Semua");
  const [selectedReq, setSelectedReq] = useState<AtkRequest | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const searchRef = useRef(search);
  const statusFilterRef = useRef(statusFilter);
  const typeFilterRef = useRef(typeFilter);
  const detailHandledRef = useRef(false);

  useEffect(() => {
    searchRef.current = search;
    statusFilterRef.current = statusFilter;
    typeFilterRef.current = typeFilter;
  }, [search, statusFilter, typeFilter]);

  const broadcastChange = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        const now = Date.now();
        if ("BroadcastChannel" in window) {
          const bc = new BroadcastChannel("hasamitra_sync_channel");
          bc.postMessage({ type: "NEW_ATK_REQUEST", timestamp: now });
          bc.close();
        }
        localStorage.setItem("hasamitra_last_atk_request", String(now));
      }
    } catch {}
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setSelectedReq(null);
    setAdminNotesInput("");
    if (typeof window !== "undefined" && window.location.search.includes("detail")) {
      window.history.replaceState({}, "", "/admin/pengajuan-atk");
    }
  }, []);

  const fetchRequests = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsRefreshing(true);
    try {
      const query = new URLSearchParams();
      if (searchRef.current) query.append("search", searchRef.current);
      if (statusFilterRef.current && statusFilterRef.current !== "Semua") {
        query.append("status", statusFilterRef.current);
      }
      if (typeFilterRef.current && typeFilterRef.current !== "Semua") {
        query.append("requestType", typeFilterRef.current);
      }

      const res = await fetch(`/api/admin/atk?${query.toString()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const data = await res.json();
      if (data.success) {
        setRequests(data.data || []);
        if (data.stats) setStats(data.stats);
      }
    } catch {
      if (!isSilent) setErrorMsg("Gagal memuat data pengajuan ATK.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load and URL param detail handler (runs once)
  useEffect(() => {
    const detailParam = searchParams.get("detail");
    if (detailParam && !detailHandledRef.current) {
      detailHandledRef.current = true;
      fetch(`/api/admin/atk/${encodeURIComponent(detailParam)}`, { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setSelectedReq(data.data);
            setAdminNotesInput(data.data.adminNotes || "");
          }
        })
        .catch(() => {});
    }
  }, [searchParams]);

  // Debounced search / filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRequests(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, typeFilter, fetchRequests]);

  // Real-time polling & BroadcastChannel
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRequests(true);
    }, 6000);

    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        bc = new BroadcastChannel("hasamitra_sync_channel");
        bc.onmessage = () => {
          fetchRequests(true);
        };
      }
    } catch {}

    const handleFocus = () => fetchRequests(true);
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "hasamitra_last_atk_request") fetchRequests(true);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);

    return () => {
      clearInterval(interval);
      if (bc) bc.close();
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
    };
  }, [fetchRequests]);

  const handleUpdateStatus = async (id: number, newStatus: string, notes?: string) => {
    setUpdatingId(id);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch(`/api/admin/atk/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: notes !== undefined ? notes : adminNotesInput,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Status pengajuan berhasil diubah menjadi: ${getStatusText(newStatus)}`);
        setRequests((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...data.data } : item))
        );
        if (selectedReq && selectedReq.id === id) {
          setSelectedReq(data.data);
        }
        broadcastChange();
        fetchRequests(true);
      } else {
        setErrorMsg(data.message || "Gagal mengubah status pengajuan.");
      }
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch(`/api/admin/atk/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Data pengajuan ATK berhasil dihapus.");
        setRequests((prev) => prev.filter((item) => item.id !== id));
        if (selectedReq?.id === id) {
          handleCloseDetailModal();
        }
        setDeleteConfirmId(null);
        broadcastChange();
        fetchRequests(true);
      } else {
        setErrorMsg(data.message || "Gagal menghapus data pengajuan.");
      }
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan saat menghapus.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Menunggu</span>
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>Diproses</span>
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            <span>Disetujui</span>
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Selesai</span>
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>Ditolak</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200">
            <span>{status}</span>
          </span>
        );
    }
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      PENDING: "Menunggu",
      PROCESSING: "Diproses",
      APPROVED: "Disetujui",
      REJECTED: "Ditolak",
      COMPLETED: "Selesai",
    };
    return map[status] || status;
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Top Banner & Refresh Button */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Kelola Pengajuan ATK
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftar pengajuan pembelian dan permintaan stok ATK dari seluruh karyawan Bank Hasamitra
          </p>
        </div>

        <button
          onClick={() => fetchRequests(false)}
          disabled={isRefreshing}
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors border border-slate-200 cursor-pointer inline-flex items-center justify-center gap-2 shadow-2xs shrink-0"
          title="Segarkan data"
        >
          <svg
            className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? "animate-spin text-orange-600" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{isRefreshing ? "Memperbarui..." : "Refresh Data"}</span>
        </button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-xl flex items-center justify-between gap-2">
          <span>✓ {successMsg}</span>
          <button onClick={() => setSuccessMsg("")} className="font-bold text-emerald-900 cursor-pointer">✕</button>
        </div>
      )}
      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium rounded-xl flex items-center justify-between gap-2">
          <span>⚠️ {errorMsg}</span>
          <button onClick={() => setErrorMsg("")} className="font-bold text-rose-900 cursor-pointer">✕</button>
        </div>
      )}

      {/* Stats Cards: 6 Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{loading ? "..." : stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-200/70 bg-amber-50/20 shadow-2xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">Menunggu</p>
          <p className="text-2xl font-bold text-amber-800 mt-1">{loading ? "..." : stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-blue-200/70 bg-blue-50/20 shadow-2xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-700">Diproses</p>
          <p className="text-2xl font-bold text-blue-800 mt-1">{loading ? "..." : stats.processing}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-indigo-200/70 bg-indigo-50/20 shadow-2xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700">Disetujui</p>
          <p className="text-2xl font-bold text-indigo-800 mt-1">{loading ? "..." : stats.approved}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200/70 bg-emerald-50/20 shadow-2xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">Selesai</p>
          <p className="text-2xl font-bold text-emerald-800 mt-1">{loading ? "..." : stats.completed}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-rose-200/70 bg-rose-50/20 shadow-2xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-700">Ditolak</p>
          <p className="text-2xl font-bold text-rose-800 mt-1">{loading ? "..." : stats.rejected}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Cari nama karyawan, no. pengajuan, barang, divisi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-xs text-slate-800 transition-all bg-slate-50/50"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          >
            <option value="Semua">Semua Status</option>
            <option value="PENDING">Menunggu</option>
            <option value="PROCESSING">Diproses</option>
            <option value="APPROVED">Disetujui</option>
            <option value="COMPLETED">Selesai</option>
            <option value="REJECTED">Ditolak</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          >
            <option value="Semua">Semua Jenis</option>
            <option value="PURCHASE">Pembelian ATK</option>
            <option value="REQUEST">Pengajuan ATK</option>
          </select>
        </div>
      </div>

      {/* Main Table / Mobile Card List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Mobile View */}
        <div className="block lg:hidden divide-y divide-slate-100">
          {loading && requests.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              <div className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
                <span>Memuat data pengajuan...</span>
              </div>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              Tidak ada pengajuan ATK yang sesuai filter.
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                onClick={() => {
                  setSelectedReq(req);
                  setAdminNotesInput(req.adminNotes || "");
                }}
                className="p-4 space-y-3 hover:bg-slate-50/70 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-orange-600 block">
                      {req.requestNumber}
                    </span>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">{req.namaKaryawan}</p>
                    <p className="text-xs text-slate-400">{req.departemen} • {req.jabatan}</p>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    {new Date(req.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <div className="space-y-0.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.requestType === "PURCHASE"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {req.requestType === "PURCHASE" ? "Pembelian" : "Permintaan"}
                    </span>
                    <p className="text-slate-700 font-medium truncate max-w-[200px]">
                      {req.requestType === "PURCHASE" ? req.namaBarang : req.pilihBarangAtk} ({req.jumlah} unit)
                    </p>
                  </div>
                  <div>{getStatusBadge(req.status)}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block overflow-x-auto w-full">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3.5">No. Pengajuan</th>
                <th className="px-5 py-3.5">Pemohon</th>
                <th className="px-5 py-3.5">Divisi &amp; Jabatan</th>
                <th className="px-5 py-3.5">Jenis</th>
                <th className="px-5 py-3.5">Barang &amp; Jumlah</th>
                <th className="px-5 py-3.5">Alasan / Keperluan</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Tanggal</th>
                <th className="px-5 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading && requests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-sm text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
                      <span>Memuat data pengajuan...</span>
                    </div>
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-sm text-slate-400">
                    Tidak ada data pengajuan ATK yang sesuai filter.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedReq(req);
                      setAdminNotesInput(req.adminNotes || "");
                    }}
                  >
                    <td className="px-5 py-3.5 font-mono font-bold text-orange-600 whitespace-nowrap">
                      {req.requestNumber}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900 whitespace-nowrap">
                      {req.namaKaryawan}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                      <span>{req.departemen}</span>
                      <span className="text-slate-400 block text-[11px]">{req.jabatan}</span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          req.requestType === "PURCHASE"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {req.requestType === "PURCHASE" ? "Pembelian" : "Permintaan"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-800">
                      <p className="font-medium">{req.requestType === "PURCHASE" ? req.namaBarang : req.pilihBarangAtk}</p>
                      <p className="text-slate-400 font-mono text-[11px]">{req.jumlah} unit {req.jenisAtk ? `• ${req.jenisAtk}` : ""}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate" title={req.alasan || req.keperluan || ""}>
                      {req.alasan || req.keperluan || "-"}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-right font-mono whitespace-nowrap">
                      {new Date(req.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          setSelectedReq(req);
                          setAdminNotesInput(req.adminNotes || "");
                        }}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold text-orange-600 hover:bg-orange-50 border border-orange-200 transition-colors cursor-pointer"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal / Drawer */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div
            className="bg-white w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white p-5 sm:p-6 flex items-center justify-between shadow-md shrink-0">
              <div className="space-y-0.5">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-100 block">
                  Detail Pengajuan ATK
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-mono">{selectedReq.requestNumber}</h3>
              </div>
              <button
                onClick={handleCloseDetailModal}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
                aria-label="Tutup modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
              {/* Section 1: Informasi Pengajuan */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  1. Informasi Pengajuan
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Nomor Pengajuan</span>
                    <span className="font-mono font-bold text-orange-600">{selectedReq.requestNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Jenis Pengajuan</span>
                    <span className="font-bold text-slate-800">
                      {selectedReq.requestType === "PURCHASE" ? "Pembelian ATK" : "Pengajuan ATK"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Tanggal Diajukan</span>
                    <span className="font-mono text-slate-700">
                      {new Date(selectedReq.createdAt).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Status Saat Ini</span>
                    <div className="mt-0.5">{getStatusBadge(selectedReq.status)}</div>
                  </div>
                </div>
              </div>

              {/* Section 2: Informasi Pemohon */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  2. Informasi Pemohon
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Nama Karyawan</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedReq.namaKaryawan}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Divisi / Departemen</span>
                    <span className="font-semibold text-slate-800">{selectedReq.departemen}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Jabatan</span>
                    <span className="font-semibold text-slate-800">{selectedReq.jabatan}</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Informasi ATK */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  3. Informasi Barang ATK
                </h4>
                {selectedReq.requestType === "PURCHASE" ? (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-slate-400 block">Jenis ATK</span>
                        <span className="font-semibold text-slate-800">{selectedReq.jenisAtk || "-"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Nama Barang</span>
                        <span className="font-bold text-slate-900">{selectedReq.namaBarang || "-"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Jumlah</span>
                        <span className="font-mono font-bold text-orange-600">{selectedReq.jumlah} unit</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">Alasan / Keperluan</span>
                      <p className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700 leading-relaxed text-xs">
                        {selectedReq.alasan || "-"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-400 block">Barang ATK</span>
                        <span className="font-bold text-slate-900">{selectedReq.pilihBarangAtk || "-"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Jumlah</span>
                        <span className="font-mono font-bold text-orange-600">{selectedReq.jumlah} unit</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">Keperluan</span>
                      <p className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700 leading-relaxed text-xs">
                        {selectedReq.keperluan || "-"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 4: Catatan Admin & Status Action */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  4. Kelola Status &amp; Catatan Admin
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Catatan Internal Admin (opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={adminNotesInput}
                    onChange={(e) => setAdminNotesInput(e.target.value)}
                    placeholder="Tuliskan catatan internal admin terkait pengajuan ini..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-xs text-slate-800 bg-white"
                  />
                </div>

                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-700 block mb-2">
                    Ubah Status Pengajuan:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={updatingId === selectedReq.id || selectedReq.status === "PENDING"}
                      onClick={() => handleUpdateStatus(selectedReq.id, "PENDING")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedReq.status === "PENDING"
                          ? "bg-amber-600 text-white shadow-xs"
                          : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                      }`}
                    >
                      Menunggu
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === selectedReq.id || selectedReq.status === "PROCESSING"}
                      onClick={() => handleUpdateStatus(selectedReq.id, "PROCESSING")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedReq.status === "PROCESSING"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100"
                      }`}
                    >
                      Diproses
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === selectedReq.id || selectedReq.status === "APPROVED"}
                      onClick={() => handleUpdateStatus(selectedReq.id, "APPROVED")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedReq.status === "APPROVED"
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100"
                      }`}
                    >
                      Disetujui
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === selectedReq.id || selectedReq.status === "COMPLETED"}
                      onClick={() => handleUpdateStatus(selectedReq.id, "COMPLETED")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedReq.status === "COMPLETED"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                      }`}
                    >
                      Selesai
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === selectedReq.id || selectedReq.status === "REJECTED"}
                      onClick={() => handleUpdateStatus(selectedReq.id, "REJECTED")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedReq.status === "REJECTED"
                          ? "bg-rose-600 text-white shadow-xs"
                          : "bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100"
                      }`}
                    >
                      Ditolak
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(selectedReq.id)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
              >
                Hapus Data
              </button>

              <button
                type="button"
                onClick={handleCloseDetailModal}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div className="text-center space-y-1">
              <h4 className="font-bold text-base text-slate-900">Hapus Pengajuan Ini?</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Data pengajuan yang dihapus tidak dapat dipulihkan kembali.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPengajuanAtkPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-slate-400">
          <div className="inline-flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
            <span>Memuat halaman pengajuan ATK...</span>
          </div>
        </div>
      }
    >
      <AdminPengajuanAtkContent />
    </Suspense>
  );
}

