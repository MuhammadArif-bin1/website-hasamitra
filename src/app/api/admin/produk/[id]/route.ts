import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdmin } from "@/lib/auth";

// PUT: Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ success: false, message: "ID tidak valid." }, { status: 400 });
    }

    const body = await request.json();
    const { slug, name, category, description, features, buttonText, isActive, order } = body;

    // Check if product exists
    const existing = await prisma.product.findUnique({ where: { id: productId } });
    if (!existing) {
      return NextResponse.json({ success: false, message: "Produk tidak ditemukan." }, { status: 404 });
    }

    // Check slug uniqueness (exclude self)
    if (slug && slug !== existing.slug) {
      const slugConflict = await prisma.product.findUnique({ where: { slug } });
      if (slugConflict) {
        return NextResponse.json(
          { success: false, message: "Slug sudah digunakan produk lain." },
          { status: 400 }
        );
      }
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(slug && { slug: slug.trim() }),
        ...(name && { name: name.trim() }),
        ...(category !== undefined && { category: category.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(features !== undefined && { features }),
        ...(buttonText !== undefined && { buttonText: buttonText.trim() }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui produk." },
      { status: 500 }
    );
  }
}

// DELETE: Delete product
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ success: false, message: "ID tidak valid." }, { status: 400 });
    }

    await prisma.product.delete({ where: { id: productId } });

    return NextResponse.json({ success: true, message: "Produk berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus produk." },
      { status: 500 }
    );
  }
}
