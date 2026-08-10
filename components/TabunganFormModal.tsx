"use client";

import React, { useState, useEffect } from "react";
import { contactData } from "@/data/contact";

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
  const fieldLabel = isEmas ? "Berat (Gram)" : "Jangka Waktu";
  const defaultOption = isEmas ? "1 gram" : "1 bulan";
  const options = isEmas
    ? ["1 gram", "2 gram", "5 gram", "10 gram", "25 gram", "50 gram"]
    : ["1 bulan", "3 bulan", "6 bulan", "12 bulan"];

  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    email: "",
    pilihan: defaultOption,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [waUrl, setWaUrl] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        pilihan: isEmas ? "1 gram" : "1 bulan",
      }));
      setSubmitted(false);
      setError("");
    }
  }, [isOpen, isEmas]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.nama.trim() || !formData.alamat.trim() || !formData.email.trim()) {
      setError(`Mohon isi semua data (Nama, Alamat, Email, dan ${fieldLabel}).`);
      return;
    }

    setLoading(true);

    const waNumber = contactData.whatsappNumber || "6285772780037";

    // Format CSV Data Line
    const csvHeader = `Produk,Nama,Alamat,Email,${fieldLabel}`;
    const csvRow = `"${productName}","${formData.nama.trim()}","${formData.alamat.trim().replace(/"/g, '""')}","${formData.email.trim()}","${formData.pilihan}"`;

    // Formatted text with explicit CSV section for WhatsApp
    const formattedMessage =
      `*FORM PENDAFTARAN NASABAH - BANK HASAMITRA JAWA BARAT*\n\n` +
      `*FORMAT DATA CSV:*\n` +
      `\`${csvHeader}\`\n` +
      `\`${csvRow}\`\n\n` +
      `--------------------------------------------------\n` +
      `📌 *Produk:* ${productName}\n` +
      `👤 *Nama Lengkap:* ${formData.nama.trim()}\n` +
      `🏠 *Alamat Domisili:* ${formData.alamat.trim()}\n` +
      `✉️ *Email Nasabah:* ${formData.email.trim()}\n` +
      `⏱️ *${fieldLabel}:* ${formData.pilihan}\n` +
      `--------------------------------------------------\n` +
      `Halo Hasamitra Jawa Barat, berikut data pendaftaran nasabah dalam format CSV. Mohon informasi dan proses lebih lanjut. Terima kasih!`;

    const generatedWaUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(formattedMessage)}`;
    setWaUrl(generatedWaUrl);

    // Directly open WhatsApp in a new tab
    if (typeof window !== "undefined") {
      window.open(generatedWaUrl, "_blank");
    }

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 300);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setFormData({
      nama: "",
      alamat: "",
      email: "",
      pilihan: defaultOption,
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
        <div className="bg-emerald-600 text-white p-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100 block">
              Form Pendaftaran Produk
            </span>
            <h3 className="text-xl font-bold">{productName}</h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full bg-emerald-700/50 hover:bg-emerald-800 text-white flex items-center justify-center transition-colors focus:outline-none"
            aria-label="Tutup modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <svg className="w-9 h-9 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.099 4.019 4.142-1.087z" />
                </svg>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-slate-900">Data CSV Dialihkan ke WhatsApp!</h4>
                <p className="text-xs text-emerald-700 font-semibold mt-1">
                  Nomor Resmi: {contactData.whatsapp} ({contactData.whatsappNumber})
                </p>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Data pendaftaran <strong>{productName}</strong> atas nama <strong>{formData.nama}</strong> ({fieldLabel.toLowerCase()}: <strong>{formData.pilihan}</strong>) telah disusun dalam format data <strong>CSV</strong> dan dialihkan ke WhatsApp Bank Hasamitra Jawa Barat.
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.099 4.019 4.142-1.087z" />
                  </svg>
                  Buka WhatsApp ({contactData.whatsapp})
                </a>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-lg transition-colors mt-1"
                >
                  Selesai &amp; Tutup
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                  {error}
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
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none text-sm text-slate-900"
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
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none text-sm text-slate-900"
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
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none text-sm text-slate-900"
                />
              </div>

              {/* Dynamic Field: Jangka Waktu / Berat (Gram) */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  {fieldLabel} <span className="text-red-500">*</span>
                </label>
                <div className={`grid ${isEmas ? "grid-cols-3 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-4"} gap-2`}>
                  {options.map((option) => (
                    <label
                      key={option}
                      className={`flex items-center justify-center p-2.5 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
                        formData.pilihan === option
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <input
                        type="radio"
                        name="pilihan"
                        value={option}
                        checked={formData.pilihan === option}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      {option}
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
                  className="px-6 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-md hover:shadow-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Menyiapkan CSV WhatsApp..." : "Kirim Pendaftaran"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
