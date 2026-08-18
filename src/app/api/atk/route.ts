import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendTelegramNotification } from "@/lib/telegram";

export const dynamic = "force-dynamic";

// Departemen yang tersedia
const DEPARTEMEN_LIST = [
  "IT",
  "Keuangan",
  "SDM",
  "Marketing",
  "Operasional",
  "Umum",
  "Kredit",
  "Teller",
  "Customer Service",
  "Kepatuhan",
  "Audit Internal",
  "Sekretariat",
];

// Jenis ATK yang tersedia (untuk PURCHASE)
const JENIS_ATK_LIST = [
  "Alat Tulis",
  "Kertas & Amplop",
  "Tinta & Toner",
  "Perlengkapan Kantor",
  "Perlengkapan Komputer",
  "Perlengkapan Kebersihan",
  "Lainnya",
];

// Barang ATK yang tersedia (untuk REQUEST)
const BARANG_ATK_LIST = [
  "Pulpen",
  "Pensil",
  "Penghapus",
  "Spidol",
  "Stabilo",
  "Kertas HVS A4",
  "Kertas HVS F4",
  "Amplop",
  "Map / Folder",
  "Binder Clip",
  "Paper Clip",
  "Stapler",
  "Isi Staples",
  "Gunting",
  "Cutter",
  "Lem",
  "Selotip",
  "Correction Pen",
  "Tinta Printer",
  "Toner Printer",
  "Buku Tulis",
  "Post-it / Sticky Notes",
  "Lainnya",
];

/**
 * Generate nomor pengajuan otomatis
 * Format: ATK-PBL-YYYYMMDD-NNNN (PURCHASE) atau ATK-REQ-YYYYMMDD-NNNN (REQUEST)
 */
async function generateRequestNumber(requestType: "PURCHASE" | "REQUEST"): Promise<string> {
  const prefix = requestType === "PURCHASE" ? "ATK-PBL" : "ATK-REQ";
  const now = new Date();
  const dateStr = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  // Count existing requests for today to generate sequence
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const count = await prisma.atkRequest.count({
    where: {
      requestType: requestType,
      createdAt: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
  });

  const seq = String(count + 1).padStart(4, "0");
  return `${prefix}-${dateStr}-${seq}`;
}

/**
 * Format status untuk display
 */
function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    PENDING: "Menunggu",
    PROCESSING: "Diproses",
    APPROVED: "Disetujui",
    REJECTED: "Ditolak",
    COMPLETED: "Selesai",
  };
  return map[status] || status;
}

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Data formulir tidak valid." },
        { status: 400 }
      );
    }

    const { requestType } = body;

    // Validate requestType
    if (!requestType || !["PURCHASE", "REQUEST"].includes(requestType as string)) {
      return NextResponse.json(
        { success: false, message: "Jenis pengajuan tidak valid. Gunakan PURCHASE atau REQUEST." },
        { status: 400 }
      );
    }

    // Common field validation
    const namaKaryawan = typeof body.namaKaryawan === "string" ? body.namaKaryawan.trim() : "";
    const departemen = typeof body.departemen === "string" ? body.departemen.trim() : "";
    const jabatan = typeof body.jabatan === "string" ? body.jabatan.trim() : "";
    const jumlah = Number(body.jumlah);

    if (!namaKaryawan) {
      return NextResponse.json(
        { success: false, message: "Nama Karyawan wajib diisi." },
        { status: 400 }
      );
    }

    if (!departemen) {
      return NextResponse.json(
        { success: false, message: "Divisi / Departemen wajib diisi." },
        { status: 400 }
      );
    }

    if (!jabatan) {
      return NextResponse.json(
        { success: false, message: "Jabatan wajib diisi." },
        { status: 400 }
      );
    }

    if (!jumlah || isNaN(jumlah) || jumlah <= 0) {
      return NextResponse.json(
        { success: false, message: "Jumlah harus berupa angka dan lebih dari 0." },
        { status: 400 }
      );
    }

    const type = requestType as "PURCHASE" | "REQUEST";

    // Type-specific validation
    if (type === "PURCHASE") {
      const jenisAtk = typeof body.jenisAtk === "string" ? body.jenisAtk.trim() : "";
      const namaBarang = typeof body.namaBarang === "string" ? body.namaBarang.trim() : "";
      const alasan = typeof body.alasan === "string" ? body.alasan.trim() : "";

      if (!jenisAtk || !JENIS_ATK_LIST.includes(jenisAtk)) {
        return NextResponse.json(
          { success: false, message: "Jenis ATK wajib diisi dan harus valid." },
          { status: 400 }
        );
      }

      if (!namaBarang) {
        return NextResponse.json(
          { success: false, message: "Nama Barang wajib diisi." },
          { status: 400 }
        );
      }

      if (!alasan) {
        return NextResponse.json(
          { success: false, message: "Alasan / Keperluan wajib diisi." },
          { status: 400 }
        );
      }

      // Generate request number
      const requestNumber = await generateRequestNumber("PURCHASE");

      // Save to database
      const newRequest = await prisma.atkRequest.create({
        data: {
          requestNumber,
          requestType: "PURCHASE",
          namaKaryawan,
          departemen,
          jabatan,
          jenisAtk,
          namaBarang,
          jumlah: Math.floor(jumlah),
          alasan,
          status: "PENDING",
        },
      });

      // Send admin notification (in-app)
      try {
        await prisma.adminNotification.create({
          data: {
            title: "Pengajuan Pembelian ATK Baru",
            message: `${namaKaryawan} mengajukan pembelian ATK — ${requestNumber}`,
            link: `/admin/pengajuan-atk?detail=${newRequest.id}`,
          },
        });
      } catch (notifError) {
        console.warn("[Notification] Gagal membuat notifikasi in-app:", notifError);
      }

      // Send Telegram notification
      try {
        const telegramMsg = [
          `<b>PENGAJUAN PEMBELIAN ATK BARU</b>`,
          ``,
          `<b>Nomor Pengajuan:</b>`,
          requestNumber,
          ``,
          `<b>Nama Karyawan:</b>`,
          namaKaryawan,
          ``,
          `<b>Divisi / Departemen:</b>`,
          departemen,
          ``,
          `<b>Jabatan:</b>`,
          jabatan,
          ``,
          `<b>Jenis ATK:</b>`,
          jenisAtk,
          ``,
          `<b>Nama Barang:</b>`,
          namaBarang,
          ``,
          `<b>Jumlah:</b>`,
          String(Math.floor(jumlah)),
          ``,
          `<b>Alasan:</b>`,
          alasan,
          ``,
          `<b>Status:</b>`,
          getStatusLabel("PENDING"),
        ].join("\n");

        await sendTelegramNotification(telegramMsg);
      } catch (tgError) {
        console.warn("[Telegram] Gagal mengirim notifikasi:", tgError);
      }

      return NextResponse.json(
        {
          success: true,
          message: "Pengajuan pembelian ATK berhasil dikirim.",
          data: newRequest,
        },
        { status: 200, headers: { "Cache-Control": "no-store, max-age=0" } }
      );
    }

    // REQUEST type
    const pilihBarangAtk = typeof body.pilihBarangAtk === "string" ? body.pilihBarangAtk.trim() : "";
    const keperluan = typeof body.keperluan === "string" ? body.keperluan.trim() : "";

    if (!pilihBarangAtk || !BARANG_ATK_LIST.includes(pilihBarangAtk)) {
      return NextResponse.json(
        { success: false, message: "Pilih Barang ATK wajib diisi dan harus valid." },
        { status: 400 }
      );
    }

    if (!keperluan) {
      return NextResponse.json(
        { success: false, message: "Keperluan wajib diisi." },
        { status: 400 }
      );
    }

    // Generate request number
    const requestNumber = await generateRequestNumber("REQUEST");

    // Save to database
    const newRequest = await prisma.atkRequest.create({
      data: {
        requestNumber,
        requestType: "REQUEST",
        namaKaryawan,
        departemen,
        jabatan,
        pilihBarangAtk,
        jumlah: Math.floor(jumlah),
        keperluan,
        status: "PENDING",
      },
    });

    // Send admin notification (in-app)
    try {
      await prisma.adminNotification.create({
        data: {
          title: "Pengajuan ATK Baru",
          message: `${namaKaryawan} mengajukan ATK — ${requestNumber}`,
          link: `/admin/pengajuan-atk?detail=${newRequest.id}`,
        },
      });
    } catch (notifError) {
      console.warn("[Notification] Gagal membuat notifikasi in-app:", notifError);
    }

    // Send Telegram notification
    try {
      const telegramMsg = [
        `<b>PENGAJUAN ATK BARU</b>`,
        ``,
        `<b>Nomor Pengajuan:</b>`,
        requestNumber,
        ``,
        `<b>Nama Karyawan:</b>`,
        namaKaryawan,
        ``,
        `<b>Divisi / Departemen:</b>`,
        departemen,
        ``,
        `<b>Jabatan:</b>`,
        jabatan,
        ``,
        `<b>Jenis Pengajuan:</b>`,
        `Pengajuan ATK`,
        ``,
        `<b>Barang:</b>`,
        pilihBarangAtk,
        ``,
        `<b>Jumlah:</b>`,
        String(Math.floor(jumlah)),
        ``,
        `<b>Keperluan:</b>`,
        keperluan,
        ``,
        `<b>Status:</b>`,
        getStatusLabel("PENDING"),
      ].join("\n");

      await sendTelegramNotification(telegramMsg);
    } catch (tgError) {
      console.warn("[Telegram] Gagal mengirim notifikasi:", tgError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Pengajuan ATK berhasil dikirim.",
        data: newRequest,
      },
      { status: 200, headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    console.error("Error saving ATK request:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server saat menyimpan data." },
      { status: 500 }
    );
  }
}
