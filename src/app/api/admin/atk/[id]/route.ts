import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdmin } from "@/lib/auth";

// GET: Fetch single ATK request detail
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const reqId = parseInt(id, 10);
    if (isNaN(reqId)) {
      return NextResponse.json({ success: false, message: "ID tidak valid." }, { status: 400 });
    }

    const atkRequest = await prisma.atkRequest.findUnique({
      where: { id: reqId },
    });

    if (!atkRequest) {
      return NextResponse.json({ success: false, message: "Pengajuan ATK tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: atkRequest });
  } catch (error) {
    console.error("Error fetching ATK request detail:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil detail pengajuan ATK." },
      { status: 500 }
    );
  }
}

// PATCH: Update ATK request status (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const reqId = parseInt(id, 10);
    if (isNaN(reqId)) {
      return NextResponse.json({ success: false, message: "ID tidak valid." }, { status: 400 });
    }

    const body = await request.json();
    const { status, adminNotes } = body;

    const validStatuses = ["PENDING", "PROCESSING", "APPROVED", "REJECTED", "COMPLETED"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Status tidak valid. Pilih: PENDING, PROCESSING, APPROVED, REJECTED, atau COMPLETED." },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: Record<string, unknown> = { status };

    if (adminNotes !== undefined) {
      updateData.adminNotes = typeof adminNotes === "string" ? adminNotes.trim() : null;
    }

    // Set timestamps based on status change
    if (status === "PROCESSING") {
      updateData.processedAt = new Date();
    } else if (status === "COMPLETED") {
      updateData.completedAt = new Date();
    }

    const updated = await prisma.atkRequest.update({
      where: { id: reqId },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating ATK request:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengupdate status pengajuan ATK." },
      { status: 500 }
    );
  }
}

// DELETE: Delete ATK request (admin only)
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
    const reqId = parseInt(id, 10);
    if (isNaN(reqId)) {
      return NextResponse.json({ success: false, message: "ID tidak valid." }, { status: 400 });
    }

    await prisma.atkRequest.delete({
      where: { id: reqId },
    });

    return NextResponse.json({ success: true, message: "Pengajuan ATK berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting ATK request:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus pengajuan ATK." },
      { status: 500 }
    );
  }
}
