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
        { label: "1 Gram", value: "1" },
        { label: "2 Gram", value: "2" },
        { label: "5 Gram", value: "5" },
        { label: "10 Gram", value: "10" },
        { label: "25 Gram", value: "25" },
        { label: "50 Gram", value: "50" },
      ]
    : [
        { label: "1 Bulan", value: "1" },
        { label: "3 Bulan", value: "3" },
        { label: "6 Bulan", value: "6" },
        { label: "12 Bulan", value: "12" },
      ];

  const defaultOptionValue = "1";

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
      setError("Data belum lengkap atau tidak valid.");
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
      } else {
        payload.jangka_waktu = formData.selectedValue;
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
        setError(resData.message || "Data belum lengkap atau tidak valid.");
      }
    } catch {
      setError("Data belum lengkap atau tidak valid.");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-orange-500 text-white p-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-100 block">
              Form Pendaftaran Produk
            </span>
            <h3 className="text-xl font-bold">{productName}</h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full bg-orange-600/50 hover:bg-orange-700 text-white flex items-center justify-center transition-colors focus:outline-none"
            aria-label="Tutup modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-inner">
                <svg className="w-9 h-9 fill-current" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>

              <div>
                <h4 className="text-2xl font-bold text-slate-900">
                  Pendaftaran berhasil dikirim.
                </h4>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-md transition-all"
                >
                  Tutup
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 font-semibold text-xs rounded-lg">
                  {error}
                </div>
              )}

              {isEmas && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                  <span className="text-amber-900 font-medium text-center sm:text-left">
                    Tersedia Google Form Resmi pendaftaran Cicil Emas.
                  </span>
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdYUYQqVCdL-ivWTeEycZdvIo_a1ruNXPsGgVaL_droYCPCFQ/viewform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition-colors inline-flex items-center gap-1 shadow-sm"
                  >
                    Buka Google Form ↗
                  </a>
                </div>
              )}

              {/* Nama */}
              <div>
                <label htmlFor="modal-nama" className="block text-sm font-semibold text-slate-800 mb-1">
                  Nama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="modal-nama"
                  name="nama"
                  required
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm text-slate-900"
                />
              </div>

              {/* Alamat */}
              <div>
                <label htmlFor="modal-alamat" className="block text-sm font-semibold text-slate-800 mb-1">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="modal-alamat"
                  name="alamat"
                  required
                  rows={2}
                  value={formData.alamat}
                  onChange={handleChange}
                  placeholder="Masukkan alamat domisili Anda"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm text-slate-900"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="modal-email" className="block text-sm font-semibold text-slate-800 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="modal-email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm text-slate-900"
                />
              </div>

              {/* Telepon / No. WhatsApp */}
              <div>
                <label htmlFor="modal-telepon" className="block text-sm font-semibold text-slate-800 mb-1">
                  Nomor Telepon / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="modal-telepon"
                  name="telepon"
                  required
                  value={formData.telepon}
                  onChange={handleChange}
                  placeholder="081234567890"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm text-slate-900"
                />
              </div>

              {/* Product specific choice */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  {isEmas ? "Berat Emas (Gram)" : "Jangka Waktu"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div
                  className={`grid ${
                    isEmas ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4"
                  } gap-2`}
                >
                  {options.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center justify-center p-2.5 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
                        formData.selectedValue === opt.value
                          ? "bg-orange-500 text-white border-orange-500 shadow-sm"
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
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-md shadow-orange-500/20 transition-colors flex items-center gap-2 disabled:opacity-50"
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
