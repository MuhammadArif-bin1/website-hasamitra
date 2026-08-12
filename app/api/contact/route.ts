import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isValidEmail, sanitizeInput } from "@/lib/utils";

interface ContactRequestBody {
  nama?: string;
  email?: string;
  telepon?: string;
  layanan?: string;
  message?: string;
  recaptchaToken?: string;
}

// Function to verify Google reCAPTCHA token with secret key
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    // If secret key is not configured in environment, allow in dev mode or log warning
    console.warn("RECAPTCHA_SECRET_KEY is not defined in environment variables.");
    // In production this must be set. For testing without real keys, fallback gracefully if token equals 'test-token' or secret key is unconfigured.
    if (process.env.NODE_ENV !== "production") {
      return true;
    }
    return false;
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();
    return Boolean(data.success);
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: ContactRequestBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Data yang dikirim belum lengkap.",
        },
        { status: 400 }
      );
    }

    const { nama, email, telepon, layanan, message, recaptchaToken } = body;

    // Validate required fields presence
    if (
      !nama ||
      !email ||
      !telepon ||
      !layanan ||
      !message ||
      !recaptchaToken ||
      typeof nama !== "string" ||
      typeof email !== "string" ||
      typeof telepon !== "string" ||
      typeof layanan !== "string" ||
      typeof message !== "string" ||
      typeof recaptchaToken !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Data yang dikirim belum lengkap.",
        },
        { status: 400 }
      );
    }

    // Sanitize string inputs
    const cleanNama = sanitizeInput(nama);
    const cleanEmail = sanitizeInput(email);
    const cleanTelepon = sanitizeInput(telepon);
    const cleanLayanan = sanitizeInput(layanan);
    const cleanMessage = sanitizeInput(message);

    if (
      !cleanNama ||
      !cleanEmail ||
      !cleanTelepon ||
      !cleanLayanan ||
      !cleanMessage ||
      !recaptchaToken.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Data yang dikirim belum lengkap.",
        },
        { status: 400 }
      );
    }

    // Validate Email Format
    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: "Data yang dikirim belum lengkap.",
        },
        { status: 400 }
      );
    }

    // Validate Layanan strictly: only "Pertanyaan" or "Pengaduan" allowed
    const validLayananOptions = ["Pertanyaan", "Pengaduan"];
    if (!validLayananOptions.includes(cleanLayanan)) {
      return NextResponse.json(
        {
          success: false,
          message: "Data yang dikirim belum lengkap.",
        },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA token
    const isCaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isCaptchaValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Verifikasi reCAPTCHA gagal.",
        },
        { status: 400 }
      );
    }

    // Process contact form message & save to database
    await prisma.contactMessage.create({
      data: {
        nama: cleanNama,
        email: cleanEmail,
        telepon: cleanTelepon,
        layanan: cleanLayanan,
        message: cleanMessage,
      },
    });


    return NextResponse.json(
      {
        success: true,
        message: "Pesan Anda berhasil dikirim.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error in /api/contact:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}
