import React from "react";
import { prisma } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [totalRegistrations, totalProducts, totalArticles] = await Promise.all([
    prisma.registration.count(),
    prisma.product.count(),
    prisma.article.count(),
  ]);

  const recentRegistrations = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const stats = [
    {
      label: "Total Pendaftaran",
      value: totalRegistrations,
      subtext: "Nasabah baru masuk",
      href: "/admin/pendaftaran",
      gradient: "from-orange-500 to-amber-500",
      shadow: "shadow-orange-500/20",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: "Katalog Produk",
      value: totalProducts,
      subtext: "Produk aktif di web",
      href: "/admin/produk",
      gradient: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/20",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      label: "Artikel & Berita",
      value: totalArticles,
      subtext: "Dipublikasikan",
      href: "/admin/berita",
      gradient: "from-blue-500 to-indigo-500",
      shadow: "shadow-blue-500/20",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
            Overview Sistem
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Selamat Datang di Portal Admin Hasamitra
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Pantau dan kelola seluruh transaksi pendaftaran nasabah online, pembaruan katalog produk perbankan, dan publikasi artikel berita resmi secara terpadu.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {stat.label}
              </span>
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform duration-300`}
              >
                {stat.icon}
              </div>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">{stat.subtext}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Registrations Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md shadow-slate-200/50 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="font-extrabold text-base text-slate-900">Pendaftaran Nasabah Terbaru</h2>
            <p className="text-xs text-slate-500">Data masuk dari form online beranda</p>
          </div>
          <Link
            href="/admin/pendaftaran"
            className="px-4 py-2 rounded-xl text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors border border-orange-200/60"
          >
            Kelola Semua Pendaftaran →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3.5 text-left">Nama Pemohon</th>
                <th className="px-6 py-3.5 text-left">Produk Diajukan</th>
                <th className="px-6 py-3.5 text-left">Status</th>
                <th className="px-6 py-3.5 text-right">Tanggal Masuk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-400">
                    Belum ada data pendaftaran yang masuk.
                  </td>
                </tr>
              ) : (
                recentRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{reg.nama}</p>
                      <p className="text-xs text-slate-400">{reg.telepon}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">
                        {reg.produk}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                          reg.status === "Selesai"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : reg.status === "Diproses"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 text-right font-mono">
                      {reg.createdAt.toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
