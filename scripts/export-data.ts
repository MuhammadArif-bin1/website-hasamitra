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

  const headers = ["ID", "Produk", "Nama", "Alamat", "Email", "Telepon", "Pilihan", "Status", "Tanggal Daftar"];
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

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  const dateStr = new Date().toISOString().split("T")[0];
  const filename = `data_nasabah_pendaftaran_${dateStr}.csv`;
  let targetPath = path.join(process.cwd(), filename);

  try {
    fs.writeFileSync(targetPath, csvContent, "utf-8");
  } catch (err: any) {
    if (err && err.code === "EBUSY") {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(11, 19);
      const fallbackFilename = `data_nasabah_pendaftaran_${dateStr}_${timestamp}.csv`;
      targetPath = path.join(process.cwd(), fallbackFilename);
      fs.writeFileSync(targetPath, csvContent, "utf-8");
      console.log(`⚠️ File ${filename} sedang dibuka di Excel. Disimpan ke file baru.`);
    } else {
      throw err;
    }
  }

  console.log(`✅ File CSV berhasil diekstrak ke: ${targetPath}`);
}


exportData()
  .catch((err) => {
    console.error("❌ Gagal mengekstrak data:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
