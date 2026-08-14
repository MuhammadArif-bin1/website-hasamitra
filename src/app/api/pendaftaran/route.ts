import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isValidEmail } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PendaftaranRequestBody {
  produk?: string;
  nama?: string;
  alamat?: string;
  email?: string;
  telepon?: string;
  pilihan?: string;
  jangka_waktu?: string | number;
  berat_emas_gram?: string | number;
}

export async function POST(request: NextRequest) {
  try {
    let body: PendaftaranRequestBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Data formulir tidak valid.",
        },
        { status: 400 }
      );
    }

    const { produk, nama, alamat, email, telepon, pilihan, jangka_waktu, berat_emas_gram } = body;

    // Standard string sanitization
    const cleanProduk = typeof produk === "string" ? produk.trim() : "";
    const cleanNama = typeof nama === "string" ? nama.trim() : "";
    const cleanAlamat = typeof alamat === "string" ? alamat.trim() : "";
    const cleanEmail = typeof email === "string" ? email.trim() : "";
    const cleanTelepon = typeof telepon === "string" ? telepon.trim() : "";

    // 1. Basic field presence checks
    if (!cleanProduk || !cleanNama || !cleanAlamat || !cleanEmail || !cleanTelepon) {
      return NextResponse.json(
        {
          success: false,
          message: "Data belum lengkap. Mohon isi semua kolom bertanda bintang (*).",
        },
        { status: 400 }
      );
    }

    // 2. Email format validation
    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: "Format email tidak valid.",
        },
        { status: 400 }
      );
    }

    // 3. Determine final choice label (Jangka Waktu / Berat Emas / Pilihan)
    let finalPilihan = typeof pilihan === "string" && pilihan.trim() ? pilihan.trim() : "";
    const isEmas = cleanProduk.toLowerCase().includes("emas");

    if (!finalPilihan) {
      if (isEmas) {
        const beratStr = String(berat_emas_gram ?? "").trim();
        finalPilihan = beratStr ? (beratStr.includes("Gram") ? beratStr : `${beratStr} Gram`) : "1 Gram";
      } else {
        const jkWaktuStr = String(jangka_waktu ?? "").trim();
        finalPilihan = jkWaktuStr ? (jkWaktuStr.includes("Bulan") ? jkWaktuStr : `${jkWaktuStr} Bulan`) : "Standard";
      }
    }

    // 4. Save registration record to PostgreSQL database via Prisma
    const newReg = await prisma.registration.create({
      data: {
        produk: cleanProduk,
        nama: cleanNama,
        alamat: cleanAlamat,
        email: cleanEmail,
        telepon: cleanTelepon,
        pilihan: finalPilihan,
        status: "Baru",
      },
    });

    // 5. Append to CSV file locally
    try {
      const fs = await import("node:fs");
      const path = await import("node:path");
      
      const csvPath = path.join(process.cwd(), "data", "pendaftaran", "pendaftaran-hasamitra.csv");
      const regId = `REG-${String(newReg.id).padStart(4, "0")}`;
      const dateStr = newReg.createdAt.toISOString().split("T")[0];
      const jkWaktu = !isEmas ? String(jangka_waktu ?? "") : "";
      const beratEmas = isEmas ? String(berat_emas_gram ?? "") : "";

      const csvLine = `${regId},${dateStr},"${cleanProduk.replace(/"/g, '""')}","${cleanNama.replace(/"/g, '""')}","${cleanAlamat.replace(/"/g, '""')}","${cleanEmail.replace(/"/g, '""')}",${jkWaktu},${beratEmas}\n`;

      if (!fs.existsSync(path.dirname(csvPath))) {
        fs.mkdirSync(path.dirname(csvPath), { recursive: true });
      }

      fs.appendFileSync(csvPath, csvLine, "utf-8");
    } catch (csvError) {
      console.warn("Peringatan: Gagal menulis data ke CSV lokal:", csvError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Pendaftaran berhasil dikirim.",
        data: newReg,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );

  } catch (error) {
    console.error("Error saving registration:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server saat menyimpan data.",
      },
      { status: 500 }
    );
  }
}
