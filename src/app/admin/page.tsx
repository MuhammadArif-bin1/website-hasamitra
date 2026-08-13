import React from "react";
import { prisma } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [totalRegistrations, totalMessages, totalProducts] = await Promise.all([
    prisma.registration.count(),
    prisma.contactMessage.count(),
    prisma.product.count(),
  ]);

  const recentRegistrations = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    {
      label: "Total Pendaftaran",
      value: totalRegistrations,
      href: "/admin/pendaftaran",
      color: "from-orange-500 to-amber-500",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: "Pesan Masuk",
      value: totalMessages,
      href: "/admin/pesan",
      color: "from-blue-500 to-indigo-500",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Produk Aktif",
      value: totalProducts,
      href: "/admin/produk",
      color: "from-emerald-500 to-teal-500",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Selamat datang di Admin Panel PT BPR Hasamitra Jawa Barat
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Registrations */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Pendaftaran Terbaru</h2>
          <Link href="/admin/pendaftaran" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
            Lihat Semua →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3 text-left">Nama</th>
                <th className="px-6 py-3 text-left">Produk</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400">
                    Belum ada data pendaftaran.
                  </td>
                </tr>
              ) : (
                recentRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-3 text-sm font-medium text-slate-900">{reg.nama}</td>
                    <td className="px-6 py-3 text-sm text-slate-600">{reg.produk}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        reg.status === "Selesai"
                          ? "bg-emerald-50 text-emerald-700"
                          : reg.status === "Diproses"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-500">
                      {reg.createdAt.toLocaleDateString("id-ID")}
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
