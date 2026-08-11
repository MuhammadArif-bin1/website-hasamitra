import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface PendaftaranRequestBody {
  produk?: string;
  nama?: string;
  alamat?: string;
  email?: string;
  jangka_waktu?: string | number;
  berat_emas_gram?: string | number;
}

// Global in-memory queue promise lock to serialize concurrent server requests
let fileLockPromise: Promise<unknown> = Promise.resolve();

function withFileLock<T>(fn: () => Promise<T>): Promise<T> {
  const nextLock = fileLockPromise.then(fn, fn);
  fileLockPromise = nextLock.then(
    () => {},
    () => {}
  );
  return nextLock;
}

// Function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper to escape CSV field value according to RFC 4180 rules
function escapeCsv(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Helper with retries for Windows file locking (EBUSY / EPERM / EACCES)
async function safeReadCsvLines(csvFilePath: string, maxRetries = 10, delayMs = 100): Promise<string[]> {
  if (!fs.existsSync(csvFilePath)) return [];

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const fileContent = fs.readFileSync(csvFilePath, "utf-8");
      return fileContent
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
    } catch (err: any) {
      if (
        (err.code === "EBUSY" || err.code === "EPERM" || err.code === "EACCES" || err.code === "UNKNOWN") &&
        attempt < maxRetries
      ) {
        await new Promise((res) => setTimeout(res, delayMs * attempt));
      } else {
        console.warn(`Attempt ${attempt} to read CSV failed:`, err.message);
        if (attempt === maxRetries) return [];
      }
    }
  }
  return [];
}

async function safeAppendCsv(
  csvFilePath: string,
  csvHeader: string,
  newRow: string,
  maxRetries = 10,
  delayMs = 100
): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const exists = fs.existsSync(csvFilePath);
      if (!exists) {
        fs.writeFileSync(csvFilePath, csvHeader, "utf-8");
      }

      // Open with append flag 'a'
      const fd = fs.openSync(csvFilePath, "a");
      try {
        fs.writeSync(fd, newRow, null, "utf-8");
      } finally {
        fs.closeSync(fd);
      }
      return; // Success
    } catch (err: any) {
      if (
        (err.code === "EBUSY" || err.code === "EPERM" || err.code === "EACCES" || err.code === "UNKNOWN") &&
        attempt < maxRetries
      ) {
        await new Promise((res) => setTimeout(res, delayMs * attempt));
      } else {
        // Fallback file write if primary file is locked by external app (e.g. Microsoft Excel)
        try {
          const fallbackPath = path.join(path.dirname(csvFilePath), "pendaftaran-hasamitra-backup.csv");
          const fallbackExists = fs.existsSync(fallbackPath);
          if (!fallbackExists) {
            fs.writeFileSync(fallbackPath, csvHeader, "utf-8");
          }
          const fdBack = fs.openSync(fallbackPath, "a");
          try {
            fs.writeSync(fdBack, newRow, null, "utf-8");
          } finally {
            fs.closeSync(fdBack);
          }
          console.warn(`Primary CSV file locked (EBUSY). Saved registration to backup file: ${fallbackPath}`);
          return;
        } catch (backupErr) {
          console.error("Failed to write to both primary and backup CSV files:", backupErr);
          throw err;
        }
      }
    }
  }
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

    const { produk, nama, alamat, email, jangka_waktu, berat_emas_gram } = body;

    // Standard string sanitization check
    const cleanProduk = typeof produk === "string" ? produk.trim() : "";
    const cleanNama = typeof nama === "string" ? nama.trim() : "";
    const cleanAlamat = typeof alamat === "string" ? alamat.trim() : "";
    const cleanEmail = typeof email === "string" ? email.trim() : "";

    // 1. Basic field presence checks
    if (!cleanProduk || !cleanNama || !cleanAlamat || !cleanEmail) {
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

    let finalJangkaWaktu = "";
    let finalBeratEmas = "";

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
      finalJangkaWaktu = jkWaktuStr;
      finalBeratEmas = "";
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
      finalJangkaWaktu = "";
      finalBeratEmas = beratStr;
    }

    // 4. File storage setup (/data/pendaftaran/pendaftaran-hasamitra.csv)
    const dataDir = path.join(process.cwd(), "data", "pendaftaran");
    const csvFilePath = path.join(dataDir, "pendaftaran-hasamitra.csv");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const csvHeader = "id_pendaftaran,tanggal_pendaftaran,produk,nama,alamat,email,jangka_waktu,berat_emas_gram\n";

    // Perform serialized CSV read & append with queue lock and retries
    await withFileLock(async () => {
      const lines = await safeReadCsvLines(csvFilePath);

      // Find highest existing REG-xxxx ID
      let maxNum = 0;
      for (const line of lines) {
        const match = line.match(/^REG-(\d+)/i);
        if (match && match[1]) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxNum) {
            maxNum = num;
          }
        }
      }

      const nextIdNumber = maxNum > 0 ? maxNum + 1 : Math.max(1, lines.length > 0 ? lines.length : 1);
      const idPendaftaran = `REG-${String(nextIdNumber).padStart(4, "0")}`;

      // Format Date: YYYY-MM-DD
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const tanggalPendaftaran = `${year}-${month}-${day}`;

      // Construct CSV Row
      const newRow = [
        idPendaftaran,
        tanggalPendaftaran,
        escapeCsv(cleanProduk),
        escapeCsv(cleanNama),
        escapeCsv(cleanAlamat),
        escapeCsv(cleanEmail),
        escapeCsv(finalJangkaWaktu),
        escapeCsv(finalBeratEmas),
      ].join(",") + "\n";

      // Append to CSV file safely with retries
      await safeAppendCsv(csvFilePath, csvHeader, newRow);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Pendaftaran berhasil dikirim.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving registration to CSV:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}
