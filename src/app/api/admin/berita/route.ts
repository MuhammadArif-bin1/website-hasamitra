import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdmin } from "@/lib/auth";
import { serializeArticleImages } from "@/lib/articleImages";

// GET: List all articles
export async function GET() {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const articles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data berita." },
      { status: 500 }
    );
  }
}

// POST: Create new article
export async function POST(request: NextRequest) {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, category, content, image, contentImage, isPublished } = body;

    if (!title || !category || !content) {
      return NextResponse.json(
        { success: false, message: "Judul, kategori, dan konten berita wajib diisi." },
        { status: 400 }
      );
    }

    // Auto-generate slug from title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Ensure slug uniqueness by appending timestamp if needed
    let slug = baseSlug;
    const existingSlug = await prisma.article.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${baseSlug}-${Date.now()}`;
    }

    const finalImage = serializeArticleImages(image, contentImage);

    const article = await prisma.article.create({
      data: {
        title: title.trim(),
        slug,
        category: category.trim(),
        content: content.trim(),
        image: finalImage,
        isPublished: isPublished ?? true,
      },
    });

    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { success: false, message: "Gagal membuat berita." },
      { status: 500 }
    );
  }
}
