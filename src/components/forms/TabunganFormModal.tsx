"use client";

import React, { useState } from "react";

interface TabunganFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

export default function TabunganFormModal({
  isOpen,
  onClose,
  productName = "New Tabungan Sabar",
}: TabunganFormModalProps) {
  const isEmas = productName.toLowerCase().includes("emas");

  const options = isEmas
    ? [
        { label: "1 Gram", value: "1 Gram" },
        { label: "2 Gram", value: "2 Gram" },
        { label: "5 Gram", value: "5 Gram" },
        { label: "10 Gram", value: "10 Gram" },
        { label: "25 Gram", value: "25 Gram" },
        { label: "50 Gram", value: "50 Gram" },
      ]
    : [
        { label: "1 Bulan", value: "1 Bulan" },
        { label: "3 Bulan", value: "3 Bulan" },
        { label: "6 Bulan", value: "6 Bulan" },
        { label: "12 Bulan", value: "12 Bulan" },
      ];

  const defaultOptionValue = options[0].value;

  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    email: "",
    telepon: "",
    selectedValue: defaultOptionValue,
  });

  const [submitted, setSubmitted] = useState(false);
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

    if (!formData.nama.trim() || !formData.alamat.trim() || !formData.email.trim() || !formData.telepon.trim()) {
      setError("Data belum lengkap. Mohon lengkapi semua kolom bertanda bintang (*).");
      return;
    }

    setLoading(true);

    try {
      const payload: Record<string, string> = {
        produk: productName,
        nama: formData.nama.trim(),
        alamat: formData.alamat.trim(),
        email: formData.email.trim(),
        telepon: formData.telepon.trim(),
      };

      if (isEmas) {
        payload.berat_emas_gram = formData.selectedValue;
        payload.pilihan = formData.selectedValue;
      } else {
        payload.jangka_waktu = formData.selectedValue;
        payload.pilihan = formData.selectedValue;
      }

      const res = await fetch("/api/pendaftaran", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (res.ok && resData.success) {
        setSubmitted(true);
      } else {
        setError(resData.message || "Gagal mengirim pendaftaran. Silakan periksa kembali data Anda.");
      }
    } catch {
      setError("Terjadi gangguan koneksi internet. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setFormData({
      nama: "",
      alamat: "",
      email: "",
      telepon: "",
      selectedValue: defaultOptionValue,
    });
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white p-6 sm:p-7 flex items-center justify-between shadow-md">
          <div className="space-y-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-100 block">
              Formulir Pendaftaran Online
            </span>
            <h3 className="text-xl sm:text-2xl font-black">{productName}</h3>
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
        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <svg className="w-9 h-9 fill-current" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>

              <div className="space-y-1">
                <h4 className="text-2xl font-black text-slate-900">
                  Pendaftaran Berhasil Dikirim!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  Terima kasih, tim Customer Service Bank Hasamitra akan segera menghubungi Anda untuk konfirmasi proses selanjutnya.
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

              {/* Nama */}
              <div>
                <label htmlFor="modal-nama" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="modal-nama"
                  name="nama"
                  required
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm text-slate-900 transition-all"
                />
              </div>

              {/* Alamat */}
              <div>
                <label htmlFor="modal-alamat" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Alamat Domisili <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="modal-alamat"
                  name="alamat"
                  required
                  rows={2}
                  value={formData.alamat}
                  onChange={handleChange}
                  placeholder="Masukkan alamat domisili lengkap"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm text-slate-900 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="modal-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Aktif <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  id="modal-email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm text-slate-900 transition-all"
                />
              </div>

              {/* Telepon / No. WhatsApp */}
              <div>
                <label htmlFor="modal-telepon" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nomor WhatsApp / HP <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  id="modal-telepon"
                  name="telepon"
                  required
                  value={formData.telepon}
                  onChange={handleChange}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm text-slate-900 transition-all font-mono"
                />
              </div>

              {/* Pilihan Berat Emas / Jangka Waktu */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {isEmas ? "Pilihan Berat Emas (Gram)" : "Pilihan Jangka Waktu"}{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <div
                  className={`grid ${
                    isEmas ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4"
                  } gap-2`}
                >
                  {options.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        formData.selectedValue === opt.value
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent shadow-md shadow-orange-500/20"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <input
                        type="radio"
                        name="selectedValue"
                        value={opt.value}
                        checked={formData.selectedValue === opt.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
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
                  {loading ? "Mengirim..." : "Kirim Pendaftaran"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
