"use client";

import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar />
      <div className="ml-64">
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
