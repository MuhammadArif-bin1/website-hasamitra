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
      "No",
      "ID Registrasi",
      "Tanggal Daftar",
      "Waktu",
      "Nama Nasabah",
      "Produk Layanan",
      "Pilihan / Tipe",
      "Email",
      "Nomor WhatsApp / HP",
      "Alamat Domisili",
      "Status",
    ];

    // CSV Rows
    const rows = registrations.map((r, index) => {
      const d = new Date(r.createdAt);
      const dateStr = d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const timeStr = d.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      // Escape quotes for CSV
      const escape = (str: string | null | undefined) =>
        `"${(str || "").replace(/"/g, '""').replace(/\r?\n|\r/g, " ")}"`;

      // Phone as text to avoid Excel scientific notation (e.g. 6.28E+11)
      const phoneText = r.telepon ? `="${r.telepon.replace(/"/g, '""')}"` : '""';

      return [
        index + 1,
        `"REG-${String(r.id).padStart(4, "0")}"`,
        `"${dateStr}"`,
        `"${timeStr}"`,
        escape(r.nama),
        escape(r.produk),
        escape(r.pilihan || "-"),
        escape(r.email || "-"),
        phoneText,
        escape(r.alamat || "-"),
        escape(r.status || "Baru"),
      ].join(",");
    });

    // UTF-8 BOM (\uFEFF) for automatic UTF-8 recognition in Microsoft Excel
    const bom = "\uFEFF";
    const csvContent = bom + [headers.join(","), ...rows].join("\r\n");

    const dateFile = new Date().toISOString().split("T")[0];
    const filename = `Data_Pendaftaran_Nasabah_Hasamitra_${dateFile}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
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

