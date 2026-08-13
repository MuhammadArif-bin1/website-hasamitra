import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdmin } from "@/lib/auth";

// GET: List all products
export async function GET() {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data produk." },
      { status: 500 }
    );
  }
}

// POST: Create new product
export async function POST(request: NextRequest) {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { slug, name, category, description, features, buttonText, isActive, order } = body;

    if (!slug || !name) {
      return NextResponse.json(
        { success: false, message: "Slug dan nama produk wajib diisi." },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Slug sudah digunakan produk lain." },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        slug: slug.trim(),
        name: name.trim(),
        category: category?.trim() || "produk",
        description: description?.trim() || "",
        features: features || [],
        buttonText: buttonText?.trim() || "Isi datamu sekarang",
        isActive: isActive ?? true,
        order: order ?? 0,
      },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, message: "Gagal membuat produk." },
      { status: 500 }
    );
  }
}
