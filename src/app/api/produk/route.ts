import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    const products = await prisma.product.findMany({
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

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching public products:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data produk dari database." },
      { status: 500 }
    );
  }
}
