import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET: Fetch list of ATK requests with search, status, and type filters
export async function GET(request: NextRequest) {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const requestType = searchParams.get("requestType")?.trim() || "";

    // Build filter conditions
    const where: Record<string, unknown> = {};

    if (status && status !== "Semua") {
      where.status = status;
    }

    if (requestType && requestType !== "Semua") {
      where.requestType = requestType;
    }

    if (search) {
      where.OR = [
        { namaKaryawan: { contains: search, mode: "insensitive" } },
        { departemen: { contains: search, mode: "insensitive" } },
        { jabatan: { contains: search, mode: "insensitive" } },
        { requestNumber: { contains: search, mode: "insensitive" } },
        { namaBarang: { contains: search, mode: "insensitive" } },
        { pilihBarangAtk: { contains: search, mode: "insensitive" } },
        { jenisAtk: { contains: search, mode: "insensitive" } },
      ];
    }

    const [requests, total, countPending, countProcessing, countApproved, countRejected, countCompleted] = await Promise.all([
      prisma.atkRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
      }),
      prisma.atkRequest.count(),
      prisma.atkRequest.count({ where: { status: "PENDING" } }),
      prisma.atkRequest.count({ where: { status: "PROCESSING" } }),
      prisma.atkRequest.count({ where: { status: "APPROVED" } }),
      prisma.atkRequest.count({ where: { status: "REJECTED" } }),
      prisma.atkRequest.count({ where: { status: "COMPLETED" } }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: requests,
        stats: {
          total,
          pending: countPending,
          processing: countProcessing,
          approved: countApproved,
          rejected: countRejected,
          completed: countCompleted,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching ATK requests:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data pengajuan ATK." },
      { status: 500 }
    );
  }
}
