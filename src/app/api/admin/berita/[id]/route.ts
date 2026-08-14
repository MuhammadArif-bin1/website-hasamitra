import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdmin } from "@/lib/auth";
import { serializeArticleImages, parseArticleImages } from "@/lib/articleImages";

// PUT: Update article
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
    const articleId = parseInt(id, 10);
    if (isNaN(articleId)) {
      return NextResponse.json({ success: false, message: "ID tidak valid." }, { status: 400 });
    }

    const body = await request.json();
    const { title, category, content, image, contentImage, contentImages, isPublished } = body;

    // Check if article exists
    const existing = await prisma.article.findUnique({ where: { id: articleId } });
    if (!existing) {
      return NextResponse.json({ success: false, message: "Berita tidak ditemukan." }, { status: 404 });
    }

    // If title changed, regenerate slug
    let slugUpdate: { slug: string } | object = {};
    if (title && title.trim() !== existing.title) {
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/(^-|-$)/g, "");

      let slug = baseSlug;
      const slugConflict = await prisma.article.findUnique({ where: { slug } });
      if (slugConflict && slugConflict.id !== articleId) {
        slug = `${baseSlug}-${Date.now()}`;
      }
      slugUpdate = { slug };
    }

    // Determine final image value
    let imageUpdate: { image: string | null } | object = {};
    if (image !== undefined || contentImage !== undefined || contentImages !== undefined) {
      const currentImages = parseArticleImages(existing.image);
      const newCover = image !== undefined ? image : currentImages.cover;
      const newContentImages =
        contentImages !== undefined
          ? contentImages
          : contentImage !== undefined
          ? contentImage
          : currentImages.contentImages;
      imageUpdate = { image: serializeArticleImages(newCover, newContentImages) };
    }

    const article = await prisma.article.update({
      where: { id: articleId },
      data: {
        ...(title && { title: title.trim() }),
        ...slugUpdate,
        ...(category !== undefined && { category: category.trim() }),
        ...(content !== undefined && { content: content.trim() }),
        ...imageUpdate,
        ...(isPublished !== undefined && { isPublished }),
      },
    });

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui berita." },
      { status: 500 }
    );
  }
}

// DELETE: Delete article
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
    const articleId = parseInt(id, 10);
    if (isNaN(articleId)) {
      return NextResponse.json({ success: false, message: "ID tidak valid." }, { status: 400 });
    }

    await prisma.article.delete({ where: { id: articleId } });

    return NextResponse.json({ success: true, message: "Berita berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus berita." },
      { status: 500 }
    );
  }
}
