"use client";

import React, { useState, useEffect, useCallback } from "react";

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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append("search", search);
      if (statusFilter && statusFilter !== "Semua") query.append("status", statusFilter);

      const res = await fetch(`/api/admin/pendaftaran?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.data);
        if (data.stats) setStats(data.stats);
      }
    } catch {
      setErrorMsg("Gagal memuat data pendaftaran.");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRegistrations();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchRegistrations]);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setUpdatingId(id);
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
        fetchRegistrations();
        if (selectedReg && selectedReg.id === id) {
          setSelectedReg((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      } else {
        setErrorMsg(data.message || "Gagal mengubah status.");
      }
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (reg: Registration) => {
    if (!confirm(`Hapus data pendaftaran dari "${reg.nama}"?`)) return;

    try {
      const res = await fetch(`/api/admin/pendaftaran/${reg.id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg("Data pendaftaran berhasil dihapus.");
        setTimeout(() => setSuccessMsg(""), 3000);
        if (selectedReg?.id === reg.id) setSelectedReg(null);
        fetchRegistrations();
      } else {
        setErrorMsg(data.message || "Gagal menghapus data.");
      }
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan.");
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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Pendaftaran Nasabah</h1>
          <p className="text-sm text-slate-500 mt-1">
            Daftar data nasabah yang mengajukan produk tabungan, deposito, dan kredit.
          </p>
        </div>

        {/* Export Data CSV / Excel Button */}
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold rounded-xl transition shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
          Export Data Excel (CSV)
        </button>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl flex items-center justify-between">
          <span>✅ {successMsg}</span>
          <button onClick={() => setSuccessMsg("")} className="text-emerald-500 hover:text-emerald-700 cursor-pointer">✕</button>
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center justify-between">
          <span>❌ {errorMsg}</span>
          <button onClick={() => setErrorMsg("")} className="text-red-500 hover:text-red-700 cursor-pointer">✕</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pendaftar</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Baru Masuk</p>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">{stats.baru}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Sedang Diproses</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{stats.diproses}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Selesai</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.selesai}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <svg className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, email, no HP, produk..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Status:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
            {["Semua", "Baru", "Diproses", "Selesai"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  statusFilter === st
                    ? "bg-white text-orange-600 shadow-xs"
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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="px-6 py-4">ID & Tanggal</th>
                <th className="px-6 py-4">Nama Nasabah</th>
                <th className="px-6 py-4">Produk & Tipe</th>
                <th className="px-6 py-4">Kontak (Email / WhatsApp)</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                    Memuat data pendaftaran...
                  </td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                    Tidak ditemukan data pendaftaran.
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-block text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200/50">
                        REG-{String(reg.id).padStart(4, "0")}
                      </span>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(reg.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{reg.nama}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[220px] mt-0.5" title={reg.alamat}>
                        {reg.alamat || "Alamat belum diisi"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800">{reg.produk}</p>
                      <span className="inline-flex px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded mt-0.5 border border-slate-200/60">
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

                        {/* Quick Status Toggles */}
                        <div className="flex items-center gap-2 text-[11px]">
                          {reg.status !== "Diproses" && (
                            <button
                              disabled={updatingId === reg.id}
                              onClick={() => handleUpdateStatus(reg.id, "Diproses")}
                              className="text-amber-600 hover:text-amber-800 font-semibold cursor-pointer"
                            >
                              Proses
                            </button>
                          )}
                          {reg.status !== "Selesai" && (
                            <button
                              disabled={updatingId === reg.id}
                              onClick={() => handleUpdateStatus(reg.id, "Selesai")}
                              className="text-emerald-600 hover:text-emerald-800 font-semibold cursor-pointer"
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
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition cursor-pointer"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => handleDelete(reg)}
                          className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition cursor-pointer"
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

      {/* Detail Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-orange-100 font-mono font-bold">
                  REG-{String(selectedReg.id).padStart(4, "0")}
                </span>
                <h2 className="text-xl font-extrabold">{selectedReg.nama}</h2>
              </div>
              <button onClick={() => setSelectedReg(null)} className="text-white/80 hover:text-white text-xl">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm text-slate-700">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Produk Pengajuan</p>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedReg.produk}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Pilihan / Jangka Waktu</p>
                  <p className="font-bold text-orange-600 mt-0.5">{selectedReg.pilihan || "Standard"}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Alamat Domisili</p>
                <p className="font-medium text-slate-800 mt-0.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedReg.alamat}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Email</p>
                  <p className="font-medium text-slate-800 mt-0.5">{selectedReg.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Nomor Telepon / WA</p>
                  <p className="font-mono font-bold text-slate-900 mt-0.5">{selectedReg.telepon}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Tanggal Pendaftaran</p>
                  <p className="font-medium text-slate-800 mt-0.5">
                    {new Date(selectedReg.createdAt).toLocaleString("id-ID")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Status Saat Ini</p>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                      selectedReg.status === "Selesai"
                        ? "bg-emerald-50 text-emerald-700"
                        : selectedReg.status === "Diproses"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {selectedReg.status || "Baru"}
                  </span>
                </div>
              </div>

              {/* Status Change Buttons in Modal */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase">Ubah Status Pendaftaran:</p>
                <div className="grid grid-cols-3 gap-2">
                  {["Baru", "Diproses", "Selesai"].map((st) => (
                    <button
                      key={st}
                      disabled={updatingId === selectedReg.id || selectedReg.status === st}
                      onClick={() => handleUpdateStatus(selectedReg.id, st)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                        selectedReg.status === st
                          ? "bg-slate-800 text-white border-slate-800"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <a
                href={formatWhatsAppUrl(selectedReg.telepon, selectedReg.nama, selectedReg.produk)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
              >
                <span>HUBUNGI CS</span> ↗
              </a>
              <button
                onClick={() => setSelectedReg(null)}
                className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition"
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
