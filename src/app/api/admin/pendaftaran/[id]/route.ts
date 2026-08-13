import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdmin } from "@/lib/auth";

// PATCH: Update registration status
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
    const regId = parseInt(id, 10);
    if (isNaN(regId)) {
      return NextResponse.json({ success: false, message: "ID tidak valid." }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    const validStatuses = ["Baru", "Diproses", "Selesai"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Status tidak valid. Pilih: Baru, Diproses, Selesai." },
        { status: 400 }
      );
    }

    const updated = await prisma.registration.update({
      where: { id: regId },
      data: { status },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating registration:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengupdate status pendaftaran." },
      { status: 500 }
    );
  }
}

// DELETE: Delete registration record
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
    const regId = parseInt(id, 10);
    if (isNaN(regId)) {
      return NextResponse.json({ success: false, message: "ID tidak valid." }, { status: 400 });
    }

    await prisma.registration.delete({
      where: { id: regId },
    });

    return NextResponse.json({ success: true, message: "Data pendaftaran berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting registration:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus data pendaftaran." },
      { status: 500 }
    );
  }
}
