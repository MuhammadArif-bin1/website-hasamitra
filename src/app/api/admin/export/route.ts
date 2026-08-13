import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
    });

    // CSV Header
    const headers = [
      "ID Registrasi",
      "Tanggal Daftar",
      "Nama Nasabah",
      "Produk",
      "Pilihan",
      "Email",
      "Telepon / WA",
      "Alamat Domisili",
      "Status Pendaftaran",
    ];

    // CSV Rows
    const rows = registrations.map((r) => [
      `"REG-${String(r.id).padStart(4, "0")}"`,
      `"${r.createdAt.toLocaleDateString("id-ID")} ${r.createdAt.toLocaleTimeString("id-ID")}"`,
      `"${(r.nama || "").replace(/"/g, '""')}"`,
      `"${(r.produk || "").replace(/"/g, '""')}"`,
      `"${(r.pilihan || "").replace(/"/g, '""')}"`,
      `"${(r.email || "").replace(/"/g, '""')}"`,
      `"${(r.telepon || "").replace(/"/g, '""')}"`,
      `"${(r.alamat || "").replace(/"/g, '""')}"`,
      `"${(r.status || "Baru").replace(/"/g, '""')}"`,
    ]);

    // UTF-8 BOM for Microsoft Excel compatibility
    const bom = "\uFEFF";
    const csvString = bom + [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `Data_Pendaftaran_Nasabah_Hasamitra_${dateStr}.csv`;

    return new NextResponse(csvString, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting CSV:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mendownload data CSV pendaftaran." },
      { status: 500 }
    );
  }
}
