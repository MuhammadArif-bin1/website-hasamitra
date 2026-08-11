import dotenv from "dotenv";
dotenv.config();

import { prisma } from "../lib/db";
import fs from "node:fs";
import path from "node:path";


async function exportData() {
  console.log("📥 Mengambil data pendaftaran nasabah dari database Neon...");
  
  const registrations = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
  });

  console.log(`📊 Ditemukan ${registrations.length} data pendaftaran.`);

  const headers = ["ID", "Produk", "Nama", "Alamat", "Email", "Pilihan", "Status", "Tanggal Daftar"];
  const rows = registrations.map((r) => [
    r.id,
    `"${(r.produk || "").replace(/"/g, '""')}"`,
    `"${(r.nama || "").replace(/"/g, '""')}"`,
    `"${(r.alamat || "").replace(/"/g, '""')}"`,
    `"${(r.email || "").replace(/"/g, '""')}"`,
    `"${(r.pilihan || "").replace(/"/g, '""')}"`,
    `"${(r.status || "").replace(/"/g, '""')}"`,
    `"${r.createdAt.toISOString()}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  const filename = `data_nasabah_pendaftaran_${new Date().toISOString().split("T")[0]}.csv`;
  const outputPath = path.join(process.cwd(), filename);

  fs.writeFileSync(outputPath, csvContent, "utf-8");
  console.log(`✅ File CSV berhasil diekstrak ke: ${outputPath}`);
}

exportData()
  .catch((err) => {
    console.error("❌ Gagal mengekstrak data:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
