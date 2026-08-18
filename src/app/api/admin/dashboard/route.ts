import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const [totalRegistrations, totalProducts] = await Promise.all([
      prisma.registration.count(),
      prisma.product.count(),
    ]);

    const recentRegistrations = await prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          totalRegistrations,
          totalProducts,
          recentRegistrations,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data dashboard." },
      { status: 500 }
    );
  }
}
