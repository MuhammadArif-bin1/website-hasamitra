import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
    });

    // CSV Header
    const headers = ["ID", "Produk", "Nama", "Alamat", "Email", "Telepon", "Pilihan", "Status", "Tanggal Daftar"];
    
    // CSV Rows
    const rows = registrations.map((r) => [
      r.id,
      `"${(r.produk || "").replace(/"/g, '""')}"`,
      `"${(r.nama || "").replace(/"/g, '""')}"`,
      `"${(r.alamat || "").replace(/"/g, '""')}"`,
      `"${(r.email || "").replace(/"/g, '""')}"`,
      `"${(r.telepon || "").replace(/"/g, '""')}"`,
      `"${(r.pilihan || "").replace(/"/g, '""')}"`,
      `"${(r.status || "").replace(/"/g, '""')}"`,
      `"${r.createdAt.toISOString()}"`,
    ]);

    const csvString = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `data_nasabah_pendaftaran_${dateStr}.csv`;

    return new NextResponse(csvString, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting data:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengekstrak data nasabah." },
      { status: 500 }
    );
  }
}
