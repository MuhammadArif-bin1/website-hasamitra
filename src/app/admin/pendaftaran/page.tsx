"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

interface Registration {
  id: number;
  produk: string;
  nama: string;
  alamat: string;
  email: string;
  telepon: string;
  pilihan: string;
  status: string;
  createdAt: string;
}

interface Stats {
  total: number;
  baru: number;
  diproses: number;
  selesai: number;
}

export default function AdminPendaftaranPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, baru: 0, diproses: 0, selesai: 0 });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [lastSyncTime, setLastSyncTime] = useState<string>("");

  const searchRef = useRef(search);
  const statusFilterRef = useRef(statusFilter);

  useEffect(() => {
    searchRef.current = search;
    statusFilterRef.current = statusFilter;
  }, [search, statusFilter]);

  const fetchRegistrations = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setIsRefreshing(true);
    try {
      const query = new URLSearchParams();
      if (searchRef.current) query.append("search", searchRef.current);
      if (statusFilterRef.current && statusFilterRef.current !== "Semua") {
        query.append("status", statusFilterRef.current);
      }

      const res = await fetch(`/api/admin/pendaftaran?${query.toString()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.data);
        if (data.stats) setStats(data.stats);
        setLastSyncTime(new Date().toLocaleTimeString("id-ID"));
      }
    } catch {
      if (!isSilent) setErrorMsg("Gagal memuat data pendaftaran.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load and debounce when typing search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRegistrations(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, fetchRegistrations]);

  // Real-time automatic polling & BroadcastChannel listener
  useEffect(() => {
    // 1. Periodic background polling every 4 seconds
    const interval = setInterval(() => {
      fetchRegistrations(true);
    }, 4000);

    // 2. BroadcastChannel real-time trigger from customer form submission
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        bc = new BroadcastChannel("hasamitra_sync_channel");
        bc.onmessage = (event) => {
          if (event.data?.type === "NEW_REGISTRATION") {
            fetchRegistrations(true);
          }
        };
      }
    } catch {
      // Ignore if not supported
    }

    // 3. Window focus and Storage event listeners
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "hasamitra_last_registration") {
        fetchRegistrations(true);
      }
    };
    const handleFocus = () => {
      fetchRegistrations(true);
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      if (bc) bc.close();
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchRegistrations]);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setUpdatingId(id);

    // Optimistic UI update
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    if (selectedReg && selectedReg.id === id) {
      setSelectedReg((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    try {
      const res = await fetch(`/api/admin/pendaftaran/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(`Status pendaftaran berhasil diubah ke "${newStatus}".`);
        setTimeout(() => setSuccessMsg(""), 3000);
        fetchRegistrations(true);
      } else {
        setErrorMsg(data.message || "Gagal mengubah status.");
        fetchRegistrations(true);
      }
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan.");
      fetchRegistrations(true);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (reg: Registration) => {
    if (!confirm(`Hapus data pendaftaran dari "${reg.nama}"?`)) return;

    // Optimistic deletion
    setRegistrations((prev) => prev.filter((r) => r.id !== reg.id));
    if (selectedReg?.id === reg.id) setSelectedReg(null);

    try {
      const res = await fetch(`/api/admin/pendaftaran/${reg.id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg("Data pendaftaran berhasil dihapus.");
        setTimeout(() => setSuccessMsg(""), 3000);
        fetchRegistrations(true);
      } else {
        setErrorMsg(data.message || "Gagal menghapus data.");
        fetchRegistrations(true);
      }
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan.");
      fetchRegistrations(true);
    }
  };

  const handleExportCSV = () => {
    window.open("/api/admin/export", "_blank");
  };

  const formatWhatsAppUrl = (phone: string, name: string, product: string) => {
    let cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    }
    const msg = `Halo Kak ${name}, terima kasih telah mendaftar produk ${product} di Bank Hasamitra Jawa Barat. Kami ingin mengonfirmasi data pendaftaran Anda.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              Manajemen Nasabah
            </div>
            {/* Live Real-time Sync Indicator */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Live Auto-Sync</span>
              {lastSyncTime && (
                <span className="text-[10px] text-slate-400 font-mono">({lastSyncTime})</span>
              )}
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pendaftaran Nasabah Online
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Data pemohon masuk secara otomatis (real-time tanpa perlu refresh halaman).
          </p>
        </div>

        {/* Action Buttons: Manual Sync & Export */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchRegistrations(false)}
            disabled={isRefreshing}
            className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition border border-slate-200 cursor-pointer inline-flex items-center gap-2"
            title="Perbarui data sekarang"
          >
            <svg
              className={`w-4 h-4 text-slate-600 ${isRefreshing ? "animate-spin text-orange-500" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">Perbarui</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 cursor-pointer shrink-0"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
            <span>Export Excel (CSV)</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-5 py-3.5 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">✓</span>
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg("")} className="text-emerald-600 hover:text-emerald-800 font-bold cursor-pointer">✕</button>
        </div>
      )}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm px-5 py-3.5 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs">✕</span>
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg("")} className="text-rose-600 hover:text-rose-800 font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* Modern Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pendaftar</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Baru Masuk</p>
          <p className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">{stats.baru}</p>
        </div>
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Sedang Diproses</p>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{stats.diproses}</p>
        </div>
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Selesai</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{stats.selesai}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <svg className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama nasabah, produk, WhatsApp, email..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Filter Status:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl w-full sm:w-auto overflow-x-auto">
            {["Semua", "Baru", "Diproses", "Selesai"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === st
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">ID &amp; Tanggal</th>
                <th className="px-6 py-4">Nama Pemohon</th>
                <th className="px-6 py-4">Produk &amp; Pilihan</th>
                <th className="px-6 py-4">Kontak (WhatsApp / Email)</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && registrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-sm text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
                      <span>Memuat data pendaftaran...</span>
                    </div>
                  </td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-sm text-slate-400">
                    Tidak ada data pendaftaran yang sesuai kriteria.
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200/60">
                        REG-{String(reg.id).padStart(4, "0")}
                      </span>
                      <p className="text-xs text-slate-400 mt-1 font-mono">
                        {new Date(reg.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-extrabold text-slate-900">{reg.nama}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[220px] mt-0.5" title={reg.alamat}>
                        {reg.alamat || "Alamat belum diisi"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800">{reg.produk}</p>
                      <span className="inline-flex px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md mt-0.5 border border-slate-200/60">
                        {reg.pilihan || "Standard"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-600 font-medium">{reg.email || "-"}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono font-semibold text-slate-800">{reg.telepon || "-"}</span>
                        {reg.telepon && (
                          <a
                            href={formatWhatsAppUrl(reg.telepon, reg.nama, reg.produk)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md hover:bg-emerald-100 transition"
                            title="Chat WhatsApp"
                          >
                            <span>WhatsApp</span> ↗
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="inline-flex flex-col items-center gap-1.5">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                            reg.status === "Selesai"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : reg.status === "Diproses"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {reg.status || "Baru"}
                        </span>

                        {/* Quick Status Action Buttons */}
                        <div className="flex items-center gap-2 text-[11px]">
                          {reg.status !== "Diproses" && (
                            <button
                              disabled={updatingId === reg.id}
                              onClick={() => handleUpdateStatus(reg.id, "Diproses")}
                              className="text-amber-600 hover:text-amber-800 font-bold cursor-pointer"
                            >
                              Proses
                            </button>
                          )}
                          {reg.status !== "Selesai" && (
                            <button
                              disabled={updatingId === reg.id}
                              onClick={() => handleUpdateStatus(reg.id, "Selesai")}
                              className="text-emerald-600 hover:text-emerald-800 font-bold cursor-pointer"
                            >
                              Selesai
                            </button>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedReg(reg)}
                          className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => handleDelete(reg)}
                          className="px-3.5 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition border border-rose-200 cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Detail Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white p-6 sm:p-7 flex items-center justify-between shadow-md">
              <div>
                <span className="text-xs uppercase tracking-wider text-orange-100 font-mono font-bold">
                  REG-{String(selectedReg.id).padStart(4, "0")}
                </span>
                <h2 className="text-xl font-black">{selectedReg.nama}</h2>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 sm:p-7 space-y-4 text-sm text-slate-700">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Produk Pengajuan</p>
                  <p className="font-extrabold text-slate-900 mt-0.5">{selectedReg.produk}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pilihan / Jangka Waktu</p>
                  <p className="font-extrabold text-orange-600 mt-0.5">{selectedReg.pilihan || "Standard"}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Alamat Domisili</p>
                <p className="font-medium text-slate-800 mt-1 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 leading-relaxed">
                  {selectedReg.alamat || "Alamat tidak diisi"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Email</p>
                  <p className="font-medium text-slate-800 mt-0.5">{selectedReg.email || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Nomor Telepon / WA</p>
                  <p className="font-mono font-bold text-slate-900 mt-0.5">{selectedReg.telepon || "-"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tanggal Masuk</p>
                  <p className="font-medium text-slate-800 mt-0.5">
                    {new Date(selectedReg.createdAt).toLocaleString("id-ID")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status Pemrosesan</p>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                      selectedReg.status === "Selesai"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : selectedReg.status === "Diproses"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {selectedReg.status || "Baru"}
                  </span>
                </div>
              </div>

              {/* Status Update Quick Buttons */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ubah Status Cepat:</p>
                <div className="grid grid-cols-3 gap-2">
                  {["Baru", "Diproses", "Selesai"].map((st) => (
                    <button
                      key={st}
                      disabled={updatingId === selectedReg.id || selectedReg.status === st}
                      onClick={() => handleUpdateStatus(selectedReg.id, st)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedReg.status === st
                          ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
              <a
                href={formatWhatsAppUrl(selectedReg.telepon, selectedReg.nama, selectedReg.produk)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20"
              >
                <span>HUBUNGI CS</span> ↗
              </a>
              <button
                onClick={() => setSelectedReg(null)}
                className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
