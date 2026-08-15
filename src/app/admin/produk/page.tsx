"use client";

import React, { useState, useEffect, useCallback } from "react";

interface Product {
  id: number;
  slug: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  buttonText: string;
  isActive: boolean;
  order: number;
}

export default function AdminProdukPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form state
  const [form, setForm] = useState({
    slug: "",
    name: "",
    category: "Tabungan",
    description: "",
    features: "",
    buttonText: "Isi Datamu Sekarang",
    isActive: true,
    order: 0,
  });

  const broadcastProductUpdate = () => {
    try {
      if (typeof window !== "undefined") {
        if ("BroadcastChannel" in window) {
          const bc = new BroadcastChannel("hasamitra_sync_channel");
          bc.postMessage({ type: "PRODUCTS_UPDATED", timestamp: Date.now() });
          bc.close();
        }
        localStorage.setItem("hasamitra_last_product_update", String(Date.now()));
      }
    } catch {
      // Ignore
    }
  };

  const fetchProducts = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/produk", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch {
      if (!isSilent) setError("Gagal memuat data produk.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(false);

    // Auto-polling every 5 seconds
    const interval = setInterval(() => {
      fetchProducts(true);
    }, 5000);

    // BroadcastChannel listener
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        bc = new BroadcastChannel("hasamitra_sync_channel");
        bc.onmessage = (event) => {
          if (event.data?.type === "PRODUCTS_UPDATED") {
            fetchProducts(true);
          }
        };
      }
    } catch {}

    const handleFocus = () => fetchProducts(true);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      if (bc) bc.close();
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchProducts]);

  const openCreate = () => {
    setEditingProduct(null);
    setForm({
      slug: "",
      name: "",
      category: "Tabungan",
      description: "",
      features: "",
      buttonText: "Isi Datamu Sekarang",
      isActive: true,
      order: products.length,
    });
    setError("");
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      slug: product.slug,
      name: product.name,
      category: product.category,
      description: product.description,
      features: product.features.join("\n"),
      buttonText: product.buttonText,
      isActive: product.isActive,
      order: product.order,
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.slug || !form.name) {
      setError("Slug dan nama produk wajib diisi.");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      slug: form.slug,
      name: form.name,
      category: form.category,
      description: form.description,
      features: form.features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      buttonText: form.buttonText,
      isActive: form.isActive,
      order: Number(form.order) || 0,
    };

    try {
      const url = editingProduct
        ? `/api/admin/produk/${editingProduct.id}`
        : "/api/admin/produk";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMsg(
          editingProduct
            ? "Produk berhasil diperbarui."
            : "Produk baru berhasil ditambahkan."
        );
        setTimeout(() => setSuccessMsg(""), 3000);
        setShowModal(false);
        fetchProducts(true);
        broadcastProductUpdate();
      } else {
        setError(data.message || "Gagal menyimpan produk.");
      }
    } catch {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Yakin ingin menghapus produk "${product.name}"?`)) return;

    // Optimistic delete
    setProducts((prev) => prev.filter((p) => p.id !== product.id));

    try {
      const res = await fetch(`/api/admin/produk/${product.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg("Produk berhasil dihapus.");
        setTimeout(() => setSuccessMsg(""), 3000);
        fetchProducts(true);
        broadcastProductUpdate();
      } else {
        setError(data.message || "Gagal menghapus produk.");
        fetchProducts(true);
      }
    } catch {
      setError("Gagal menghapus produk.");
      fetchProducts(true);
    }
  };

  const toggleActive = async (product: Product) => {
    // Optimistic update
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, isActive: !p.isActive } : p))
    );

    try {
      await fetch(`/api/admin/produk/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      fetchProducts(true);
      broadcastProductUpdate();
    } catch {
      setError("Gagal mengubah status produk.");
      fetchProducts(true);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Kelola Produk Perbankan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Kelola daftar produk simpanan, deposito, dan program investasi yang tampil di website utama.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchProducts(false)}
            disabled={isRefreshing}
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition border border-slate-200 cursor-pointer inline-flex items-center gap-2"
            title="Perbarui daftar produk"
          >
            <svg
              className={`w-3.5 h-3.5 text-slate-600 ${isRefreshing ? "animate-spin text-orange-500" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">Perbarui</span>
          </button>

          <button
            onClick={openCreate}
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs inline-flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Tambah Produk</span>
          </button>
        </div>
      </div>

      {/* Success/Error Alerts */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-5 py-3.5 rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">✓</span>
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg("")} className="text-emerald-600 hover:text-emerald-800 font-bold cursor-pointer">✕</button>
        </div>
      )}
      {error && !showModal && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm px-5 py-3.5 rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs">✕</span>
            <span>{error}</span>
          </div>
          <button onClick={() => setError("")} className="text-rose-600 hover:text-rose-800 font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* Modern Products Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[920px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-4 w-20 text-center">Urutan</th>
                <th className="px-6 py-4 min-w-[200px]">Nama &amp; Kategori</th>
                <th className="px-5 py-4 min-w-[170px]">Slug URL</th>
                <th className="px-6 py-4 min-w-[340px]">Fitur Keunggulan</th>
                <th className="px-5 py-4 w-32 text-center">Status</th>
                <th className="px-6 py-4 w-36 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-sm text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
                      <span>Memuat data produk...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-sm text-slate-400">
                    Belum ada produk terdaftar. Klik &quot;Tambah Produk&quot; untuk memulai.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const catLower = (product.category || "").toLowerCase();
                  let catBadgeStyle = "bg-orange-50 text-orange-700 border-orange-200/70";
                  if (catLower.includes("deposito")) {
                    catBadgeStyle = "bg-blue-50 text-blue-700 border-blue-200/70";
                  } else if (catLower.includes("emas") || catLower.includes("investasi") || catLower.includes("kredit")) {
                    catBadgeStyle = "bg-amber-50 text-amber-800 border-amber-200/70";
                  }

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Order */}
                      <td className="px-5 py-4 text-center">
                        <span className="w-8 h-8 mx-auto rounded-xl bg-slate-100 font-bold text-slate-700 text-xs flex items-center justify-center font-mono border border-slate-200/60 shadow-2xs">
                          {product.order}
                        </span>
                      </td>

                      {/* Name & Category */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-extrabold text-slate-900 whitespace-nowrap">{product.name}</p>
                        <span className={`inline-flex items-center mt-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${catBadgeStyle}`}>
                          {product.category || "Tabungan"}
                        </span>
                      </td>

                      {/* Slug */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono font-medium border border-slate-200/80 whitespace-nowrap shadow-2xs">
                          {product.slug}
                        </span>
                      </td>

                      {/* Features */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5 max-w-md">
                          {product.features.map((f, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-2.5 py-1 bg-slate-100/90 text-slate-700 rounded-lg text-xs font-medium border border-slate-200/60 leading-normal"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Status Pill Toggle */}
                      <td className="px-5 py-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => toggleActive(product)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer border ${
                            product.isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                          }`}
                          title={product.isActive ? "Klik untuk menonaktifkan" : "Klik untuk mengaktifkan"}
                        >
                          <span className={`w-2 h-2 rounded-full ${product.isActive ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                          <span>{product.isActive ? "Aktif" : "Nonaktif"}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(product)}
                            className="px-3.5 py-1.5 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all border border-orange-200 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="px-3.5 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all border border-rose-200 cursor-pointer"
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

      {/* Modern Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="px-7 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                  Formulir Produk
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {editingProduct ? "Edit Detail Produk" : "Tambah Produk Baru"}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="px-7 py-6 space-y-5">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nama Produk <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Contoh: New Tabungan Sabar"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Slug URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                  placeholder="Contoh: new-tabungan-sabar"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm font-mono transition-all"
                />
              </div>

              {/* Category & Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Kategori
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Tabungan / Deposito / Investasi Emas"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Penjelasan ringkas mengenai produk..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all"
                />
              </div>

              {/* Features (One per line) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Fitur Keunggulan (1 baris per poin)
                </label>
                <textarea
                  rows={3}
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  placeholder="Bebas biaya administrasi bulanan&#10;Setoran awal terjangkau&#10;Dijamin oleh LPS"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all font-mono"
                />
              </div>

              {/* Button Text */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Teks Tombol Aksi
                </label>
                <input
                  type="text"
                  value={form.buttonText}
                  onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                  placeholder="Daftar Tabungan Online"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all"
                />
              </div>

              {/* Is Active Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-5 h-5 text-orange-600 rounded-md border-slate-300 focus:ring-orange-500"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-slate-800 cursor-pointer">
                  Tampilkan produk ini di landing page (Aktif)
                </label>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-7 py-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {saving ? "Menyimpan..." : editingProduct ? "Simpan Perubahan" : "Tambahkan Produk"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
