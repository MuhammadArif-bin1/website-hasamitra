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
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form state
  const [form, setForm] = useState({
    slug: "",
    name: "",
    category: "produk",
    description: "",
    features: "",
    buttonText: "Isi datamu sekarang",
    isActive: true,
    order: 0,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/produk");
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch {
      setError("Gagal memuat data produk.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openCreate = () => {
    setEditingProduct(null);
    setForm({
      slug: "",
      name: "",
      category: "produk",
      description: "",
      features: "",
      buttonText: "Isi datamu sekarang",
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
      features: form.features.split("\n").map((f) => f.trim()).filter(Boolean),
      buttonText: form.buttonText,
      isActive: form.isActive,
      order: form.order,
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
        setShowModal(false);
        setSuccessMsg(editingProduct ? "Produk berhasil diperbarui!" : "Produk berhasil ditambahkan!");
        setTimeout(() => setSuccessMsg(""), 3000);
        fetchProducts();
      } else {
        setError(data.message || "Gagal menyimpan produk.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Hapus produk "${product.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/produk/${product.id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg("Produk berhasil dihapus!");
        setTimeout(() => setSuccessMsg(""), 3000);
        fetchProducts();
      } else {
        setError(data.message || "Gagal menghapus produk.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    }
  };

  const toggleActive = async (product: Product) => {
    try {
      await fetch(`/api/admin/produk/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      fetchProducts();
    } catch {
      setError("Gagal mengubah status produk.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Produk</h1>
          <p className="text-sm text-slate-500 mt-1">Tambah, edit, dan atur produk yang tampil di landing page.</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold rounded-xl hover:from-orange-600 hover:to-amber-600 transition shadow-lg shadow-orange-500/25"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Produk
        </button>
      </div>

      {/* Success/Error Messages */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl">
          ✅ {successMsg}
        </div>
      )}
      {error && !showModal && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          ❌ {error}
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3 text-left">Urutan</th>
                <th className="px-6 py-3 text-left">Nama Produk</th>
                <th className="px-6 py-3 text-left">Slug</th>
                <th className="px-6 py-3 text-left">Fitur</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                    Memuat data...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                    Belum ada produk. Klik &quot;Tambah Produk&quot; untuk memulai.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 text-sm text-slate-500 font-mono">{product.order}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{product.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{product.category}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-mono">{product.slug}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.features.slice(0, 2).map((f, i) => (
                          <span key={i} className="inline-flex px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs truncate max-w-[200px]">
                            {f}
                          </span>
                        ))}
                        {product.features.length > 2 && (
                          <span className="text-xs text-slate-400">+{product.features.length - 2} lagi</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleActive(product)}
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-bold transition ${
                          product.isActive
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {product.isActive ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {error && showModal && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Produk *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                      slug: !editingProduct
                        ? e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
                        : prev.slug,
                    }));
                  }}
                  placeholder="Contoh: New Tabungan Sabar"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug *</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="contoh: tabungan-sabar"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fitur (satu per baris)</label>
                <textarea
                  value={form.features}
                  onChange={(e) => setForm((prev) => ({ ...prev, features: e.target.value }))}
                  rows={4}
                  placeholder={"Bebas biaya administrasi\nJangka waktu mulai 6 sampai 12 bulan"}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Teks Tombol</label>
                  <input
                    type="text"
                    value={form.buttonText}
                    onChange={(e) => setForm((prev) => ({ ...prev, buttonText: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Urutan</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi (opsional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                />
                <label htmlFor="isActive" className="text-sm text-slate-700">Tampilkan di landing page (Aktif)</label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl hover:from-orange-600 hover:to-amber-600 transition disabled:opacity-50 shadow-lg shadow-orange-500/25"
              >
                {saving ? "Menyimpan..." : editingProduct ? "Simpan Perubahan" : "Tambah Produk"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
