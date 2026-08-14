"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  content: string;
  image: string | null;
  isPublished: boolean;
  createdAt: string;
}

const CATEGORIES = [
  "Berita Utama",
  "Kegiatan Sosial",
  "Edukasi Keuangan",
  "Penghargaan",
  "Pengumuman",
];

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dhx7maf56";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "Hasamitra";

export default function AdminBeritaPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // Form state
  const [form, setForm] = useState({
    title: "",
    category: "Berita Utama",
    content: "",
    image: "",
    isPublished: true,
  });

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/berita");
      const data = await res.json();
      if (data.success) setArticles(data.data);
    } catch {
      setError("Gagal memuat data berita.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const openCreate = () => {
    setEditingArticle(null);
    setForm({
      title: "",
      category: "Berita Utama",
      content: "",
      image: "",
      isPublished: true,
    });
    setError("");
    setShowModal(true);
  };

  const openEdit = (article: Article) => {
    setEditingArticle(article);
    setForm({
      title: article.title,
      category: article.category,
      content: article.content,
      image: article.image || "",
      isPublished: article.isPublished,
    });
    setError("");
    setShowModal(true);
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (JPG, PNG, WebP, dll).");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 5MB.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!res.ok) {
        throw new Error("Upload gagal");
      }

      const data = await res.json();
      setForm((prev) => ({ ...prev, image: data.secure_url }));
    } catch {
      setError("Gagal mengupload gambar ke Cloudinary. Pastikan preset dan cloud name sudah benar.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.category || !form.content) {
      setError("Judul, kategori, dan konten berita wajib diisi.");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      title: form.title,
      category: form.category,
      content: form.content,
      image: form.image || null,
      isPublished: form.isPublished,
    };

    try {
      const url = editingArticle
        ? `/api/admin/berita/${editingArticle.id}`
        : "/api/admin/berita";
      const method = editingArticle ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setShowModal(false);
        setSuccessMsg(editingArticle ? "Berita berhasil diperbarui!" : "Berita berhasil dipublikasikan!");
        setTimeout(() => setSuccessMsg(""), 3000);
        fetchArticles();
      } else {
        setError(data.message || "Gagal menyimpan berita.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (article: Article) => {
    if (!confirm(`Hapus berita "${article.title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/berita/${article.id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg("Berita berhasil dihapus!");
        setTimeout(() => setSuccessMsg(""), 3000);
        fetchArticles();
      } else {
        setError(data.message || "Gagal menghapus berita.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    }
  };

  const togglePublish = async (article: Article) => {
    try {
      await fetch(`/api/admin/berita/${article.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !article.isPublished }),
      });
      fetchArticles();
    } catch {
      setError("Gagal mengubah status berita.");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Berita</h1>
          <p className="text-sm text-slate-500 mt-1">Tulis, edit, dan kelola berita Hasa Mitra News.</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold rounded-xl hover:from-orange-600 hover:to-amber-600 transition shadow-lg shadow-orange-500/25"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tulis Berita
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

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {["Semua", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul atau isi berita..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 focus:bg-white transition"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3 text-left">Gambar</th>
                <th className="px-6 py-3 text-left">Judul</th>
                <th className="px-6 py-3 text-left">Kategori</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-left">Tanggal</th>
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
              ) : articles.filter((a) => {
                  const matchCategory = selectedCategory === "Semua" || a.category === selectedCategory;
                  const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase());
                  return matchCategory && matchSearch;
                }).length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                    {articles.length === 0
                      ? "Belum ada berita. Klik \"Tulis Berita\" untuk memulai."
                      : "Tidak ada berita yang cocok dengan filter atau pencarian."}
                  </td>
                </tr>
              ) : (
                articles
                  .filter((a) => {
                    const matchCategory = selectedCategory === "Semua" || a.category === selectedCategory;
                    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase());
                    return matchCategory && matchSearch;
                  })
                  .map((article) => (
                    <tr key={article.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        {article.image ? (
                          <Image
                            src={article.image}
                            alt={article.title}
                            width={64}
                            height={40}
                            className="w-16 h-10 object-cover rounded-lg border border-slate-200"
                          />
                        ) : (
                          <div className="w-16 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900 line-clamp-1">{article.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5 font-mono">{article.slug}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-md text-xs font-bold ${
                            article.category === "Kegiatan Sosial"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : article.category === "Berita Utama"
                              ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                              : article.category === "Edukasi Keuangan"
                              ? "bg-violet-50 text-violet-700 border border-violet-200/60"
                              : article.category === "Penghargaan"
                              ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                              : "bg-orange-50 text-orange-700 border border-orange-200/60"
                          }`}
                        >
                          {article.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => togglePublish(article)}
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-bold transition ${
                            article.isPublished
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                          {article.isPublished ? "Published" : "Draft"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {formatDate(article.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/informasi/hasa-mitra-news/${article.slug}`}
                            target="_blank"
                            className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition flex items-center gap-1"
                            title="Buka halaman baca berita"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Lihat
                          </Link>
                          <button
                            onClick={() => openEdit(article)}
                            className="px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(article)}
                            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition cursor-pointer"
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
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {editingArticle ? "Edit Berita" : "Tulis Berita Baru"}
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

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Judul Berita *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Contoh: BPR Hasamitra Raih Penghargaan Kinerja Terbaik"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kategori *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Foto Berita</label>
                <div className="space-y-3">
                  {/* Preview */}
                  {form.image && (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200">
                      <Image
                        src={form.image}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition shadow-md"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Upload Button */}
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {uploading ? "Mengupload..." : form.image ? "Ganti Gambar" : "Pilih Gambar"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadImage}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    {uploading && (
                      <span className="text-xs text-orange-500 animate-pulse font-medium">Mengupload ke Cloudinary...</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">Format: JPG, PNG, WebP. Maks. 5MB.</p>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Konten Berita *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                  rows={8}
                  placeholder="Tulis isi berita lengkap di sini..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 resize-none"
                />
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={form.isPublished}
                  onChange={(e) => setForm((prev) => ({ ...prev, isPublished: e.target.checked }))}
                  className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                />
                <label htmlFor="isPublished" className="text-sm text-slate-700">Publikasikan berita (tampil di halaman Hasa Mitra News)</label>
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
                disabled={saving || uploading}
                className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl hover:from-orange-600 hover:to-amber-600 transition disabled:opacity-50 shadow-lg shadow-orange-500/25"
              >
                {saving ? "Menyimpan..." : editingArticle ? "Simpan Perubahan" : "Publikasikan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
