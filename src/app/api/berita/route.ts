import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: List all published articles (public, no auth required)
export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    console.error("Error fetching public articles:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data berita." },
      { status: 500 }
    );
  }
}

// ISR: Revalidate every 60 seconds
export const revalidate = 60;
