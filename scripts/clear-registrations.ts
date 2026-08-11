import dotenv from "dotenv";
dotenv.config();

import { prisma } from "../lib/db";

async function clearRegistrations() {
  console.log("🗑️ Menghapus seluruh data pendaftaran di tabel Registration...");
  
  const result = await prisma.registration.deleteMany({});
  
  console.log(`✅ Berhasil menghapus ${result.count} data pendaftaran nasabah.`);
}

clearRegistrations()
  .catch((err) => {
    console.error("❌ Gagal menghapus data:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
