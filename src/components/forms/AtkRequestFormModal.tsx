"use client";

import React, { useState } from "react";

interface AtkRequestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEPARTEMEN_OPTIONS = [
  "IT",
  "Keuangan",
  "SDM",
  "Marketing",
  "Operasional",
  "Umum",
  "Kredit",
  "Teller",
  "Customer Service",
  "Kepatuhan",
  "Audit Internal",
  "Sekretariat",
];

const BARANG_ATK_OPTIONS = [
  "Pulpen",
  "Pensil",
  "Penghapus",
  "Spidol",
  "Stabilo",
  "Kertas HVS A4",
  "Kertas HVS F4",
  "Amplop",
  "Map / Folder",
  "Binder Clip",
  "Paper Clip",
  "Stapler",
  "Isi Staples",
  "Gunting",
  "Cutter",
  "Lem",
  "Selotip",
  "Correction Pen",
  "Tinta Printer",
  "Toner Printer",
  "Buku Tulis",
  "Post-it / Sticky Notes",
  "Lainnya",
];

export default function AtkRequestFormModal({
  isOpen,
  onClose,
}: AtkRequestFormModalProps) {
  const [formData, setFormData] = useState({
    namaKaryawan: "",
    departemen: "",
    jabatan: "",
    pilihBarangAtk: "",
    jumlah: "",
    keperluan: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submittedRequestNumber, setSubmittedRequestNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.namaKaryawan.trim() ||
      !formData.departemen.trim() ||
      !formData.jabatan.trim() ||
      !formData.pilihBarangAtk.trim() ||
      !formData.jumlah ||
      !formData.keperluan.trim()
    ) {
      setError("Mohon lengkapi semua kolom bertanda bintang (*).");
      return;
    }

    const jmlNum = Number(formData.jumlah);
    if (isNaN(jmlNum) || jmlNum <= 0) {
      setError("Jumlah barang harus berupa angka dan lebih dari 0.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        requestType: "REQUEST",
        namaKaryawan: formData.namaKaryawan.trim(),
        departemen: formData.departemen.trim(),
        jabatan: formData.jabatan.trim(),
        pilihBarangAtk: formData.pilihBarangAtk.trim(),
        jumlah: Math.floor(jmlNum),
        keperluan: formData.keperluan.trim(),
      };

      const res = await fetch("/api/atk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (res.ok && resData.success) {
        setSubmitted(true);
        setSubmittedRequestNumber(resData.data?.requestNumber || "");

        // Sync realtime
        try {
          if (typeof window !== "undefined") {
            const bc = new BroadcastChannel("hasamitra_sync_channel");
            bc.postMessage({ type: "NEW_ATK_REQUEST", timestamp: Date.now() });
            bc.close();
            localStorage.setItem("hasamitra_last_atk_request", String(Date.now()));
          }
        } catch {
          // BroadcastChannel fallback
        }
      } else {
        setError(resData.message || "Gagal mengirim pengajuan ATK. Silakan periksa kembali data Anda.");
      }
    } catch {
      setError("Terjadi gangguan koneksi internet. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setSubmittedRequestNumber("");
    setFormData({
      namaKaryawan: "",
      departemen: "",
      jabatan: "",
      pilihBarangAtk: "",
      jumlah: "",
      keperluan: "",
    });
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div
        className="bg-white w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white p-5 sm:p-6 flex items-center justify-between shadow-md shrink-0">
          <div className="space-y-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-100 block">
              Formulir Layanan Internal
            </span>
            <h3 className="text-xl sm:text-2xl font-black">Pengajuan ATK</h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
            aria-label="Tutup modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1">
          {submitted ? (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <svg className="w-9 h-9 fill-current" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>

              <div className="space-y-2">
                <h4 className="text-2xl font-black text-slate-900">
                  Pengajuan Berhasil Dikirim!
                </h4>
                {submittedRequestNumber && (
                  <div className="inline-block bg-orange-50 border border-orange-200 text-orange-800 font-mono text-sm px-4 py-1.5 rounded-xl font-bold">
                    {submittedRequestNumber}
                  </div>
                )}
                <p className="text-xs sm:text-sm text-slate-600 pt-1">
                  Pengajuan ATK Anda telah tercatat dalam sistem. Bagian umum akan segera menyiapkan barang sesuai dengan stok inventaris yang tersedia.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
                >
                  Selesai &amp; Tutup
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 font-medium text-xs rounded-xl flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* 1. Nama Karyawan */}
              <div>
                <label htmlFor="atk-req-nama" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nama Karyawan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="atk-req-nama"
                  name="namaKaryawan"
                  required
                  value={formData.namaKaryawan}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap karyawan"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm text-slate-900 transition-all"
                />
              </div>

              {/* 2. Divisi / Departemen */}
              <div>
                <label htmlFor="atk-req-dept" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Divisi / Departemen <span className="text-rose-500">*</span>
                </label>
                <select
                  id="atk-req-dept"
                  name="departemen"
                  required
                  value={formData.departemen}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm text-slate-900 transition-all bg-white"
                >
                  <option value="">-- Pilih Divisi / Departemen --</option>
                  {DEPARTEMEN_OPTIONS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Jabatan */}
              <div>
                <label htmlFor="atk-req-jabatan" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Jabatan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="atk-req-jabatan"
                  name="jabatan"
                  required
                  value={formData.jabatan}
                  onChange={handleChange}
                  placeholder="Contoh: Staff Operasional, Teller, Supervisor"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm text-slate-900 transition-all"
                />
              </div>

              {/* 4. Pilih Barang ATK */}
              <div>
                <label htmlFor="atk-req-barang" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Pilih Barang ATK <span className="text-rose-500">*</span>
                </label>
                <select
                  id="atk-req-barang"
                  name="pilihBarangAtk"
                  required
                  value={formData.pilihBarangAtk}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm text-slate-900 transition-all bg-white"
                >
                  <option value="">-- Pilih Barang ATK --</option>
                  {BARANG_ATK_OPTIONS.map((barang) => (
                    <option key={barang} value={barang}>
                      {barang}
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Jumlah */}
              <div>
                <label htmlFor="atk-req-jumlah" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Jumlah <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  id="atk-req-jumlah"
                  name="jumlah"
                  required
                  min="1"
                  step="1"
                  value={formData.jumlah}
                  onChange={handleChange}
                  placeholder="Masukkan jumlah barang yang diajukan (angka > 0)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm text-slate-900 transition-all font-mono"
                />
              </div>

              {/* 6. Keperluan */}
              <div>
                <label htmlFor="atk-req-keperluan" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Keperluan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="atk-req-keperluan"
                  name="keperluan"
                  required
                  rows={3}
                  value={formData.keperluan}
                  onChange={handleChange}
                  placeholder="Jelaskan kebutuhan atau keperluan penggunaan ATK..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm text-slate-900 transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Mengirim..." : "Ajukan ATK"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
