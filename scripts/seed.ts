import dotenv from "dotenv";
dotenv.config();

import { prisma } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@hasamitrajabar.com";
  const password = process.env.ADMIN_PASSWORD || "HsmtrAdmin@2026!";
  const name = "Admin Hasamitra";

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log(`⚠️  Admin dengan email ${email} sudah ada. Skip.`);
  } else {
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { name, email, password: hashedPassword, role: "Admin" },
    });
    console.log(`✅ Admin berhasil dibuat!`);
    console.log(`   Email    : ${email}`);
    console.log(`   Password : ${password}`);
    console.log(`   ⚠️  GANTI PASSWORD INI di production!\n`);
  }
}

async function seedProducts() {
  const count = await prisma.product.count();
  if (count > 0) {
    console.log(`⚠️  Sudah ada ${count} produk di database. Skip seed produk.`);
    return;
  }

  const products = [
    {
      slug: "tabungan-sabar",
      name: "New Tabungan Sabar",
      category: "tabungan",
      description: "Tabungan berhadiah dengan bebas biaya administrasi.",
      features: [
        "Nasabah dapat memilih hadiah sesuai yang diinginkan",
        "Bebas biaya administrasi",
        "Jangka waktu mulai 6 sampai 12 bulan",
      ],
      buttonText: "Isi datamu sekarang",
      isActive: true,
      order: 0,
    },
    {
      slug: "deposito-sideka",
      name: "Deposito Si Deka",
      category: "deposito",
      description: "Deposito berjangka yang aman dan fleksibel.",
      features: [
        "Deposito berjangka yang sangat fleksibel dan sangat aman",
        "Suku bunga relatif tinggi",
        "Dijamin LPS",
      ],
      buttonText: "Isi datamu sekarang",
      isActive: true,
      order: 1,
    },
    {
      slug: "cicil-emas",
      name: "Cicil Emas",
      category: "kredit",
      description: "Program cicilan emas sebagai investasi jangka panjang.",
      features: [
        "Angsuran Tetap",
        "Keamanan Terjamin",
        "Cocok Sebagai Investasi Jangka Panjang",
      ],
      buttonText: "Isi datamu sekarang",
      isActive: true,
      order: 2,
    },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }
  console.log(`✅ ${products.length} produk berhasil di-seed ke database.`);
}

async function main() {
  console.log("🌱 Menjalankan seeder...\n");
  await seedAdmin();
  await seedProducts();
  console.log("\n🎉 Seeder selesai!");
}

main()
  .catch((err) => {
    console.error("❌ Seeder gagal:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
