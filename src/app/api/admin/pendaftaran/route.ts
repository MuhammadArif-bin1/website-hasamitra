import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdmin } from "@/lib/auth";

// GET: Fetch list of registrations with search and status filters
export async function GET(request: NextRequest) {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const produk = searchParams.get("produk")?.trim() || "";

    // Build filter conditions
    const where: Record<string, unknown> = {};

    if (status && status !== "Semua") {
      where.status = status;
    }

    if (produk && produk !== "Semua") {
      where.produk = { contains: produk, mode: "insensitive" };
    }

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { telepon: { contains: search, mode: "insensitive" } },
        { produk: { contains: search, mode: "insensitive" } },
      ];
    }

    const [registrations, total, countBaru, countDiproses, countSelesai] = await Promise.all([
      prisma.registration.findMany({
        where,
        orderBy: { createdAt: "desc" },
      }),
      prisma.registration.count(),
      prisma.registration.count({ where: { status: "Baru" } }),
      prisma.registration.count({ where: { status: "Diproses" } }),
      prisma.registration.count({ where: { status: "Selesai" } }),
    ]);

    return NextResponse.json({
      success: true,
      data: registrations,
      stats: {
        total,
        baru: countBaru,
        diproses: countDiproses,
        selesai: countSelesai,
      },
    });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data pendaftaran." },
      { status: 500 }
    );
  }
}
