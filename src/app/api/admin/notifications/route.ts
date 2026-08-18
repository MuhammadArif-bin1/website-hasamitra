import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET: List notifications & unread count
export async function GET() {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const [notifications, unreadCount] = await Promise.all([
      prisma.adminNotification.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.adminNotification.count({
        where: { isRead: false },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: notifications,
        unreadCount,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching admin notifications:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil notifikasi." },
      { status: 500 }
    );
  }
}

// PATCH: Mark notification(s) as read
export async function PATCH(request: NextRequest) {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { id, all } = body;

    if (all) {
      await prisma.adminNotification.updateMany({
        where: { isRead: false },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, message: "Semua notifikasi telah ditandai dibaca." });
    }

    if (id) {
      const notifId = parseInt(id, 10);
      if (!isNaN(notifId)) {
        await prisma.adminNotification.update({
          where: { id: notifId },
          data: { isRead: true },
        });
        return NextResponse.json({ success: true, message: "Notifikasi ditandai dibaca." });
      }
    }

    return NextResponse.json({ success: false, message: "Parameter tidak valid." }, { status: 400 });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui notifikasi." },
      { status: 500 }
    );
  }
}
