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

  const broadcastProductUpdate = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        const now = Date.now();
        if ("BroadcastChannel" in window) {
          const bc = new BroadcastChannel("hasamitra_sync_channel");
          bc.postMessage({ type: "PRODUCTS_UPDATED", timestamp: now });
          bc.close();
        }
        localStorage.setItem("hasamitra_last_product_update", String(now));
      }
    } catch {
      // Ignore
    }
  }, []);

  const fetchProducts = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsRefreshing(true);
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
    let isMounted = true;
    const initFetch = async () => {
      try {
        const res = await fetch("/api/admin/produk", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        const data = await res.json();
        if (isMounted && data.success) setProducts(data.data);
      } catch {
        if (isMounted) setError("Gagal memuat data produk.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    initFetch();

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
      isMounted = false;
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Kelola Produk Perbankan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Kelola data produk simpanan, deposito, dan program investasi yang tampil di website utama.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => fetchProducts(false)}
            disabled={isRefreshing}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors border border-slate-200 cursor-pointer inline-flex items-center justify-center gap-2 shadow-2xs"
            title="Perbarui daftar produk"
          >
            <svg
              className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? "animate-spin text-orange-600" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Perbarui</span>
          </button>

          <button
            onClick={openCreate}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium rounded-lg transition-colors shadow-2xs inline-flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Tambah Produk</span>
          </button>
        </div>
      </div>

      {/* Success/Error Alerts */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm px-4 py-3 rounded-lg flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">✓</span>
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg("")} className="text-emerald-700 hover:text-emerald-900 font-medium text-xs cursor-pointer ml-2">✕</button>
        </div>
      )}
      {error && !showModal && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm px-4 py-3 rounded-lg flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">✕</span>
            <span>{error}</span>
          </div>
          <button onClick={() => setError("")} className="text-rose-700 hover:text-rose-900 font-medium text-xs cursor-pointer ml-2">✕</button>
        </div>
      )}

      {/* Products Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Mobile Card List View */}
        <div className="block md:hidden divide-y divide-slate-100">
          {loading && products.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              <div className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
                <span>Memuat data produk...</span>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Belum ada produk terdaftar. Klik &quot;Tambah Produk&quot; untuk memulai.
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="p-4 space-y-3 hover:bg-slate-50/60 transition-colors">
                {/* Top: Order & Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-slate-500">
                      #{product.order}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {product.category || "Tabungan"}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleActive(product)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                      product.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                    }`}
                    title={product.isActive ? "Klik untuk menonaktifkan" : "Klik untuk mengaktifkan"}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${product.isActive ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                    <span>{product.isActive ? "Aktif" : "Nonaktif"}</span>
                  </button>
                </div>

                {/* Name & Slug */}
                <div className="space-y-0.5">
                  <h3 className="text-sm font-semibold text-slate-900 leading-snug">{product.name}</h3>
                  <p className="text-xs font-mono text-slate-500">/{product.slug}</p>
                </div>

                {/* Features */}
                {product.features && product.features.length > 0 && (
                  <ul className="text-xs text-slate-600 space-y-1 pl-4 list-disc">
                    {product.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                )}

                {/* Bottom: Action buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => openEdit(product)}
                    className="px-3 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-md transition-colors border border-slate-200 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="px-3 py-1 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors border border-rose-200/80 cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full min-w-[880px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-5 py-3.5 w-16 text-center">Urutan</th>
                <th className="px-6 py-3.5 min-w-[200px]">Nama &amp; Kategori</th>
                <th className="px-5 py-3.5 min-w-[150px]">Slug URL</th>
                <th className="px-6 py-3.5 min-w-[300px]">Fitur Keunggulan</th>
                <th className="px-5 py-3.5 w-28 text-center">Status</th>
                <th className="px-6 py-3.5 w-32 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
                      <span>Memuat data produk...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                    Belum ada produk terdaftar. Klik &quot;Tambah Produk&quot; untuk memulai.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Order */}
                    <td className="px-5 py-3.5 text-center">
                      <span className="font-mono text-xs font-semibold text-slate-600">
                        {product.order}
                      </span>
                    </td>

                    {/* Name & Category */}
                    <td className="px-6 py-3.5">
                      <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{product.category || "Tabungan"}</p>
                    </td>

                    {/* Slug */}
                    <td className="px-5 py-3.5">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-mono">
                        {product.slug}
                      </span>
                    </td>

                    {/* Features */}
                    <td className="px-6 py-3.5">
                      <ul className="text-xs text-slate-600 space-y-0.5 list-disc pl-4">
                        {product.features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </td>

                    {/* Status Toggle */}
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      <button
                        onClick={() => toggleActive(product)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                          product.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                        }`}
                        title={product.isActive ? "Klik untuk menonaktifkan" : "Klik untuk mengaktifkan"}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${product.isActive ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                        <span>{product.isActive ? "Aktif" : "Nonaktif"}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(product)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-md transition-colors border border-slate-200 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors border border-rose-200/80 cursor-pointer"
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

      {/* Modern Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {editingProduct ? "Edit Detail Produk" : "Tambah Produk Baru"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lengkapi data produk perbankan untuk website utama
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Produk <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Contoh: New Tabungan Sabar"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs sm:text-sm transition-colors"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Slug URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                  placeholder="Contoh: new-tabungan-sabar"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs sm:text-sm font-mono transition-colors"
                />
              </div>

              {/* Category & Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Tabungan / Deposito / Emas"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs sm:text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs sm:text-sm transition-colors"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Penjelasan ringkas mengenai produk..."
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs sm:text-sm transition-colors"
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fitur Keunggulan (1 baris per poin)
                </label>
                <textarea
                  rows={3}
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  placeholder="Bebas biaya administrasi bulanan&#10;Setoran awal terjangkau&#10;Dijamin oleh LPS"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs sm:text-sm transition-colors"
                />
              </div>

              {/* Button Text */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teks Tombol Aksi
                </label>
                <input
                  type="text"
                  value={form.buttonText}
                  onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                  placeholder="Daftar Tabungan Online"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs sm:text-sm transition-colors"
                />
              </div>

              {/* Is Active Toggle */}
              <div className="flex items-center gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Tampilkan produk ini di website utama (Aktif)
                </label>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-medium hover:bg-white transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium shadow-2xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
