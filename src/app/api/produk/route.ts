import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const defaultProducts = [
  {
    slug: "new-tabungan-sabar",
    name: "New Tabungan Sabar",
    category: "Tabungan",
    description: "Tabungan fleksibel dengan suku bunga menarik.",
    features: [
      "Nasabah dapat memilih hadiah sesuai yang diinginkan",
      "Bebas biaya administrasi",
      "Jangka waktu mulai 6 sampai 12 bulan",
    ],
    buttonText: "Isi datamu sekarang",
    order: 0,
    isActive: true,
  },
  {
    slug: "deposito-si-deka",
    name: "Deposito Si Deka",
    category: "Deposito",
    description: "Simpanan berjangka dengan bunga optimal.",
    features: [
      "Deposito berjangka yang sangat fleksibel dan sangat aman",
      "Suku bunga relatif tinggi",
      "Dijamin LPS",
    ],
    buttonText: "Isi datamu sekarang",
    order: 1,
    isActive: true,
  },
  {
    slug: "cicil-emas",
    name: "Cicil Ema",
    category: "Investasi",
    description: "Investasi emas logam mulia murni dengan angsuran ringan.",
    features: [
      "Angsuran Tetap",
      "Keamanan Terjamin",
      "Cocok Sebagai Investasi Jangka Panjang",
    ],
    buttonText: "Isi datamu sekarang",
    order: 2,
    isActive: true,
  },
];

export async function GET() {
  try {
    let products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        category: true,
        description: true,
        features: true,
        buttonText: true,
        order: true,
      },
    });

    // Auto-seed default products if database is currently empty
    if (products.length === 0) {
      for (const p of defaultProducts) {
        await prisma.product.upsert({
          where: { slug: p.slug },
          update: {},
          create: p,
        });
      }

      products = await prisma.product.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        select: {
          id: true,
          slug: true,
          name: true,
          category: true,
          description: true,
          features: true,
          buttonText: true,
          order: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: products.length > 0 ? products : defaultProducts,
    });
  } catch (error) {
    console.error("Error fetching public products:", error);
    return NextResponse.json({
      success: true,
      data: defaultProducts,
    });
  }
}
