import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface PendaftaranRequestBody {
  produk?: string;
  nama?: string;
  alamat?: string;
  email?: string;
  telepon?: string;
  jangka_waktu?: string | number;
  berat_emas_gram?: string | number;
}

// Function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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
          message: "Data belum lengkap atau tidak valid.",
        },
        { status: 400 }
      );
    }

    const { produk, nama, alamat, email, telepon, jangka_waktu, berat_emas_gram } = body;

    // Standard string sanitization check
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
          message: "Data belum lengkap atau tidak valid.",
        },
        { status: 400 }
      );
    }

    // 2. Email format validation
    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: "Data belum lengkap atau tidak valid.",
        },
        { status: 400 }
      );
    }

    const validProducts = ["New Tabungan Sabar", "Deposito Si Deka", "Cicil Emas"];
    if (!validProducts.includes(cleanProduk)) {
      return NextResponse.json(
        {
          success: false,
          message: "Data belum lengkap atau tidak valid.",
        },
        { status: 400 }
      );
    }

    let finalPilihan = "";

    // 3. Product-specific validations
    if (cleanProduk === "New Tabungan Sabar" || cleanProduk === "Deposito Si Deka") {
      const allowedJangkaWaktu = ["1", "3", "6", "12"];
      const jkWaktuStr = String(jangka_waktu ?? "").trim();

      if (!allowedJangkaWaktu.includes(jkWaktuStr)) {
        return NextResponse.json(
          {
            success: false,
            message: "Data belum lengkap atau tidak valid.",
          },
          { status: 400 }
        );
      }
      finalPilihan = `${jkWaktuStr} Bulan`;
    } else if (cleanProduk === "Cicil Emas") {
      const allowedBeratEmas = ["1", "2", "5", "10", "25", "50"];
      const beratStr = String(berat_emas_gram ?? "").trim();

      if (!allowedBeratEmas.includes(beratStr)) {
        return NextResponse.json(
          {
            success: false,
            message: "Data belum lengkap atau tidak valid.",
          },
          { status: 400 }
        );
      }
      finalPilihan = `${beratStr} Gram`;
    }

    // 4. Save to PostgreSQL database via Prisma
    const newReg = await prisma.registration.create({
      data: {
        produk: cleanProduk,
        nama: cleanNama,
        alamat: cleanAlamat,
        email: cleanEmail,
        telepon: cleanTelepon,
        pilihan: finalPilihan,
      },
    });

    // 5. Otomatis bertambah ke file CSV lokal secara real-time
    try {
      const fs = await import("node:fs");
      const path = await import("node:path");
      
      const csvPath = path.join(process.cwd(), "data", "pendaftaran", "pendaftaran-hasamitra.csv");
      const regId = `REG-${String(newReg.id).padStart(4, "0")}`;
      const dateStr = newReg.createdAt.toISOString().split("T")[0];
      const jkWaktu = cleanProduk !== "Cicil Emas" ? String(jangka_waktu ?? "") : "";
      const beratEmas = cleanProduk === "Cicil Emas" ? String(berat_emas_gram ?? "") : "";

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
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error saving registration:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}
