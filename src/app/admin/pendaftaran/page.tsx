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

  // Multi-select & Bulk Delete state
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showDeleteSelectedModal, setShowDeleteSelectedModal] = useState(false);
  const [deletingBulk, setDeletingBulk] = useState(false);

  const searchRef = useRef(search);
  const statusFilterRef = useRef(statusFilter);

  useEffect(() => {
    searchRef.current = search;
    statusFilterRef.current = statusFilter;
  }, [search, statusFilter]);

  const broadcastChange = () => {
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const bc = new BroadcastChannel("hasamitra_sync_channel");
        bc.postMessage({ type: "NEW_REGISTRATION", timestamp: Date.now() });
        bc.close();
      }
      localStorage.setItem("hasamitra_last_registration", String(Date.now()));
    } catch {}
  };

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
    const interval = setInterval(() => {
      fetchRegistrations(true);
    }, 4000);

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
    } catch {}

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

  // Row selection helpers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(registrations.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isAllSelected =
    registrations.length > 0 && selectedIds.length === registrations.length;

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setUpdatingId(id);

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
        broadcastChange();
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

  const handleDeleteSingle = async (reg: Registration) => {
    if (!confirm(`Hapus data pendaftaran dari "${reg.nama}"?`)) return;

    setRegistrations((prev) => prev.filter((r) => r.id !== reg.id));
    setSelectedIds((prev) => prev.filter((id) => id !== reg.id));
    if (selectedReg?.id === reg.id) setSelectedReg(null);

    try {
      const res = await fetch(`/api/admin/pendaftaran/${reg.id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg("Data pendaftaran berhasil dihapus.");
        setTimeout(() => setSuccessMsg(""), 3000);
        fetchRegistrations(true);
        broadcastChange();
      } else {
        setErrorMsg(data.message || "Gagal menghapus data.");
        fetchRegistrations(true);
      }
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan.");
      fetchRegistrations(true);
    }
  };

  // Bulk delete selected items
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    setDeletingBulk(true);

    try {
      const res = await fetch("/api/admin/pendaftaran", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(data.message || "Data terpilih berhasil dihapus.");
        setTimeout(() => setSuccessMsg(""), 3000);
        setSelectedIds([]);
        setShowDeleteSelectedModal(false);
        fetchRegistrations(true);
        broadcastChange();
      } else {
        setErrorMsg(data.message || "Gagal menghapus data.");
      }
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan saat menghapus.");
    } finally {
      setDeletingBulk(false);
    }
  };

  // Delete all records
  const handleDeleteAll = async () => {
    setDeletingBulk(true);

    try {
      const res = await fetch("/api/admin/pendaftaran", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(data.message || "Seluruh data pendaftaran berhasil dihapus.");
        setTimeout(() => setSuccessMsg(""), 3000);
        setRegistrations([]);
        setSelectedIds([]);
        setSelectedReg(null);
        setShowDeleteAllModal(false);
        fetchRegistrations(true);
        broadcastChange();
      } else {
        setErrorMsg(data.message || "Gagal mengosongkan data.");
      }
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan saat menghapus data.");
    } finally {
      setDeletingBulk(false);
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
    <div className="space-y-5 sm:space-y-8">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            Pendaftaran Nasabah Online
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Pantau dan kelola data permohonan pembukaan tabungan, deposito, dan cicil emas nasabah secara real-time.
          </p>
        </div>

        {/* Action Buttons: Refresh, Delete Data & Export */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full lg:w-auto">
          <button
            onClick={() => fetchRegistrations(false)}
            disabled={isRefreshing}
            className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition border border-slate-200 cursor-pointer inline-flex items-center justify-center gap-2"
            title="Perbarui data sekarang"
          >
            <svg
              className={`w-3.5 h-3.5 text-slate-600 ${isRefreshing ? "animate-spin text-orange-500" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Perbarui</span>
          </button>

          {/* Delete All / Clear Data Button */}
          <button
            onClick={() => setShowDeleteAllModal(true)}
            disabled={registrations.length === 0}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 text-xs font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Hapus / kosongkan semua data pendaftaran"
          >
            <svg className="w-3.5 h-3.5 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Hapus Semua</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Floating Bulk Action Bar when items selected */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-900 text-white px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 animate-fade-in border border-slate-800">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
              {selectedIds.length}
            </span>
            <span className="text-xs sm:text-sm font-semibold">
              {selectedIds.length} data pendaftaran dipilih
            </span>
          </div>
          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={() => setShowDeleteSelectedModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Hapus ({selectedIds.length}) Terpilih</span>
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm px-4 sm:px-5 py-3 rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0">✓</span>
            <span className="leading-snug">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg("")} className="text-emerald-600 hover:text-emerald-800 font-bold cursor-pointer shrink-0 ml-2">✕</button>
        </div>
      )}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm px-4 sm:px-5 py-3 rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs shrink-0">✕</span>
            <span className="leading-snug">{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg("")} className="text-rose-600 hover:text-rose-800 font-bold cursor-pointer shrink-0 ml-2">✕</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs">
          <p className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider truncate">Total Pendaftar</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs">
          <p className="text-[11px] sm:text-xs font-bold text-blue-600 uppercase tracking-wider truncate">Baru Masuk</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-blue-600 mt-1">{stats.baru}</p>
        </div>
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs">
          <p className="text-[11px] sm:text-xs font-bold text-amber-600 uppercase tracking-wider truncate">Sedang Diproses</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-amber-600 mt-1">{stats.diproses}</p>
        </div>
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs">
          <p className="text-[11px] sm:text-xs font-bold text-emerald-600 uppercase tracking-wider truncate">Selesai</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-emerald-600 mt-1">{stats.selesai}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80 md:w-96">
          <svg className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama nasabah, produk, WhatsApp..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap hidden sm:inline">Status:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
            {[
              { key: "Semua", label: "Semua" },
              { key: "Baru", label: "Baru" },
              { key: "Diproses", label: "Diproses" },
              { key: "Selesai", label: "Selesai" },
            ].map((st) => (
              <button
                key={st.key}
                onClick={() => setStatusFilter(st.key)}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer text-center ${
                  statusFilter === st.key
                    ? "bg-white text-orange-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Registrations List Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Mobile Header Bar on Card List */}
        <div className="md:hidden px-4 py-3 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
          <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
            />
            <span>Pilih Semua Data ({registrations.length})</span>
          </label>
          <span className="text-[11px] text-slate-400 font-medium font-mono">
            {registrations.length} data
          </span>
        </div>

        {/* Mobile Card List View (Visible on screens < md) */}
        <div className="block md:hidden divide-y divide-slate-100">
          {loading && registrations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              <div className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
                <span>Memuat data pendaftaran...</span>
              </div>
            </div>
          ) : registrations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Tidak ada data pendaftaran yang tersimpan.
            </div>
          ) : (
            registrations.map((reg) => {
              const isSelected = selectedIds.includes(reg.id);
              const isSelesai = reg.status === "Selesai";
              const isDiproses = reg.status === "Diproses" || reg.status === "Sedang Diproses";

              return (
                <div
                  key={reg.id}
                  className={`p-4 space-y-3 transition-colors ${
                    isSelected ? "bg-orange-50/40" : "hover:bg-slate-50/50"
                  }`}
                >
                  {/* Card Top: Selection Checkbox + ID Badge + Date */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(reg.id)}
                        className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                        aria-label={`Pilih pendaftaran ${reg.nama}`}
                      />
                      <span className="inline-block text-[11px] font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60 shadow-2xs">
                        REG-{String(reg.id).padStart(4, "0")}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(reg.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{reg.nama}</h3>
                    </div>
                    {reg.alamat && (
                      <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed" title={reg.alamat}>
                        {reg.alamat}
                      </p>
                    )}
                  </div>

                  {/* Product & Option */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2.5 py-0.5 bg-orange-50 text-orange-700 text-xs font-bold rounded-md border border-orange-200/60">
                      {reg.produk}
                    </span>
                    {reg.pilihan && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-md border border-slate-200/70">
                        {reg.pilihan}
                      </span>
                    )}
                  </div>

                  {/* Contact & WhatsApp Button */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                    <div className="min-w-0">
                      <p className="text-xs font-mono font-bold text-slate-900 truncate">{reg.telepon || "-"}</p>
                      {reg.email && <p className="text-[11px] text-slate-400 truncate">{reg.email}</p>}
                    </div>

                    {reg.telepon && (
                      <a
                        href={formatWhatsAppUrl(reg.telepon, reg.nama, reg.produk)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg hover:bg-emerald-100 transition shadow-2xs shrink-0"
                        title="Chat WhatsApp Nasabah"
                      >
                        <span>WhatsApp</span> ↗
                      </a>
                    )}
                  </div>

                  {/* Card Bottom: Status Selector + Action Buttons */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    {/* Status Dropdown */}
                    <div className="relative">
                      <select
                        disabled={updatingId === reg.id}
                        value={isDiproses ? "Diproses" : reg.status || "Baru"}
                        onChange={(e) => handleUpdateStatus(reg.id, e.target.value)}
                        className={`text-[11px] font-bold pl-6 pr-6 py-1 rounded-full border shadow-2xs appearance-none cursor-pointer transition-all focus:outline-none focus:ring-2 disabled:opacity-50 ${
                          isSelesai
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : isDiproses
                            ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                            : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                        }`}
                        title="Ubah status"
                      >
                        <option value="Baru">Baru</option>
                        <option value="Diproses">Diproses</option>
                        <option value="Selesai">Selesai</option>
                      </select>

                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelesai ? "bg-emerald-500" : isDiproses ? "bg-amber-500" : "bg-blue-500"
                          }`}
                        ></span>
                      </div>

                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5 text-current opacity-70">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedReg(reg)}
                        className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => handleDeleteSingle(reg)}
                        className="px-2.5 py-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition border border-rose-200 cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Table View (Hidden on screens < md) */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full min-w-[960px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                    aria-label="Pilih semua data"
                  />
                </th>
                <th className="px-5 py-4 min-w-[130px]">ID &amp; Tanggal</th>
                <th className="px-6 py-4 min-w-[220px]">Nama Pemohon</th>
                <th className="px-6 py-4 min-w-[200px]">Produk &amp; Pilihan</th>
                <th className="px-6 py-4 min-w-[220px]">Kontak (WhatsApp / Email)</th>
                <th className="px-6 py-4 min-w-[180px] text-center">Status</th>
                <th className="px-6 py-4 w-36 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && registrations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-sm text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
                      <span>Memuat data pendaftaran...</span>
                    </div>
                  </td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-sm text-slate-400">
                    Tidak ada data pendaftaran yang tersimpan.
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => {
                  const isSelected = selectedIds.includes(reg.id);
                  const isSelesai = reg.status === "Selesai";
                  const isDiproses = reg.status === "Diproses" || reg.status === "Sedang Diproses";

                  return (
                    <tr
                      key={reg.id}
                      className={`transition-colors ${
                        isSelected ? "bg-orange-50/50" : "hover:bg-slate-50/60"
                      }`}
                    >
                      {/* Checkbox Selection */}
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(reg.id)}
                          className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                          aria-label={`Pilih pendaftaran ${reg.nama}`}
                        />
                      </td>

                      {/* ID & Date */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-block text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200/60 shadow-2xs">
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

                      {/* Name & Address */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-extrabold text-slate-900 leading-snug">{reg.nama}</p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-[260px] line-clamp-2" title={reg.alamat}>
                          {reg.alamat || "Alamat belum diisi"}
                        </p>
                      </td>

                      {/* Product & Pilihan */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-extrabold text-slate-900 leading-snug whitespace-nowrap">{reg.produk}</p>
                        <span className="inline-flex items-center whitespace-nowrap px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md mt-1 border border-slate-200/70">
                          {reg.pilihan || "Standard"}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-xs text-slate-600 font-medium">{reg.email || "-"}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-mono font-semibold text-slate-900">{reg.telepon || "-"}</span>
                          {reg.telepon && (
                            <a
                              href={formatWhatsAppUrl(reg.telepon, reg.nama, reg.produk)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md hover:bg-emerald-100 transition shadow-2xs"
                              title="Chat WhatsApp Nasabah"
                            >
                              <span>WhatsApp</span> ↗
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Status Dropdown Selector */}
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center justify-center">
                          <div className="relative">
                            <select
                              disabled={updatingId === reg.id}
                              value={isDiproses ? "Diproses" : reg.status || "Baru"}
                              onChange={(e) => handleUpdateStatus(reg.id, e.target.value)}
                              className={`text-xs font-bold pl-7 pr-8 py-1.5 rounded-full border shadow-2xs appearance-none cursor-pointer transition-all focus:outline-none focus:ring-2 disabled:opacity-50 ${
                                isSelesai
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 focus:ring-emerald-500/20"
                                  : isDiproses
                                  ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 focus:ring-amber-500/20"
                                  : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 focus:ring-blue-500/20"
                              }`}
                              title="Klik untuk mengubah status pendaftaran"
                            >
                              <option value="Baru">Baru</option>
                              <option value="Diproses">Sedang Diproses</option>
                              <option value="Selesai">Selesai</option>
                            </select>

                            {/* Dot indicator */}
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  isSelesai
                                    ? "bg-emerald-500"
                                    : isDiproses
                                    ? "bg-amber-500"
                                    : "bg-blue-500"
                                }`}
                              ></span>
                            </div>

                            {/* Caret arrow */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-current opacity-70">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedReg(reg)}
                            className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                          >
                            Detail
                          </button>
                          <button
                            onClick={() => handleDeleteSingle(reg)}
                            className="px-3.5 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition border border-rose-200 cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal: Delete ALL Data */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 p-5 sm:p-7 space-y-4 sm:space-y-5 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Hapus Seluruh Data Pendaftaran?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tindakan ini akan mengosongkan <strong>seluruh ({registrations.length}) data pendaftaran</strong> nasabah di database secara permanen. Data yang telah dihapus tidak dapat dipulihkan kembali.
              </p>
            </div>

            <div className="pt-2 sm:pt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteAllModal(false)}
                disabled={deletingBulk}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-100 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteAll}
                disabled={deletingBulk}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {deletingBulk ? "Menghapus..." : "Ya, Kosongkan Semua"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete Selected Data */}
      {showDeleteSelectedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 p-5 sm:p-7 space-y-4 sm:space-y-5 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Hapus {selectedIds.length} Data Terpilih?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Anda akan menghapus <strong>{selectedIds.length} data pendaftaran</strong> yang ditandai. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="pt-2 sm:pt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteSelectedModal(false)}
                disabled={deletingBulk}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-100 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteSelected}
                disabled={deletingBulk}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {deletingBulk ? "Menghapus..." : `Ya, Hapus (${selectedIds.length}) Data`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Detail Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-lg max-h-[88vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white p-5 sm:p-7 flex items-center justify-between shadow-md shrink-0">
              <div className="min-w-0 pr-2">
                <span className="text-[11px] sm:text-xs uppercase tracking-wider text-orange-100 font-mono font-bold">
                  REG-{String(selectedReg.id).padStart(4, "0")}
                </span>
                <h2 className="text-lg sm:text-xl font-black truncate">{selectedReg.nama}</h2>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="p-5 sm:p-7 space-y-4 text-xs sm:text-sm text-slate-700 flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-100">
                <div>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">Produk Pengajuan</p>
                  <p className="font-extrabold text-slate-900 mt-0.5 leading-snug">{selectedReg.produk}</p>
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">Pilihan / Jangka Waktu</p>
                  <p className="font-extrabold text-orange-600 mt-0.5 leading-snug">{selectedReg.pilihan || "Standard"}</p>
                </div>
              </div>

              <div>
                <p className="text-[11px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">Alamat Domisili</p>
                <p className="font-medium text-slate-800 mt-1 bg-slate-50 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/80 leading-relaxed text-xs sm:text-sm">
                  {selectedReg.alamat || "Alamat tidak diisi"}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">Email</p>
                  <p className="font-medium text-slate-800 mt-0.5 truncate">{selectedReg.email || "-"}</p>
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">Nomor Telepon / WA</p>
                  <p className="font-mono font-bold text-slate-900 mt-0.5">{selectedReg.telepon || "-"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-slate-100">
                <div>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">Tanggal Masuk</p>
                  <p className="font-medium text-slate-800 mt-0.5 text-xs sm:text-sm">
                    {new Date(selectedReg.createdAt).toLocaleString("id-ID")}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">Status</p>
                  <span
                    className={`inline-flex px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold mt-1 ${
                      selectedReg.status === "Selesai"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : selectedReg.status === "Diproses" || selectedReg.status === "Sedang Diproses"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {selectedReg.status === "Diproses" ? "Sedang Diproses" : selectedReg.status || "Baru"}
                  </span>
                </div>
              </div>

              {/* Status Update Quick Buttons */}
              <div className="pt-3 sm:pt-4 border-t border-slate-100 space-y-2">
                <p className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Ubah Status Pendaftaran:</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "Baru", label: "Baru" },
                    { key: "Diproses", label: "Diproses" },
                    { key: "Selesai", label: "Selesai" },
                  ].map((st) => (
                    <button
                      key={st.key}
                      disabled={updatingId === selectedReg.id || selectedReg.status === st.key}
                      onClick={() => handleUpdateStatus(selectedReg.id, st.key)}
                      className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                        selectedReg.status === st.key
                          ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
              <a
                href={formatWhatsAppUrl(selectedReg.telepon, selectedReg.nama, selectedReg.produk)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 text-center"
              >
                <span>Hubungi via WhatsApp</span> ↗
              </a>
              <button
                onClick={() => setSelectedReg(null)}
                className="px-4 sm:px-5 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition cursor-pointer text-center"
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
