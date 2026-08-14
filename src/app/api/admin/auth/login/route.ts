import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  signToken,
  isRateLimited,
  recordFailedLogin,
  resetLoginAttempts,
  getLockoutRemainingSeconds,
  auditLog,
  verifyCaptchaChallenge,
  isSameOrigin,
} from "@/lib/auth";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/auth/login
 * Autentikasi admin dengan email & password.
 * Dilengkapi server-side captcha verification, CSRF origin check, rate limiting, dan audit logging.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Validasi Same-Origin untuk mitigasi CSRF
    if (!isSameOrigin(request)) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak: Permintaan lintas asal tidak diizinkan." },
        { status: 403 }
      );
    }

    // 2. Ambil IP address untuk rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // 3. Cek rate limit
    if (isRateLimited(ip)) {
      const remaining = getLockoutRemainingSeconds(ip);
      auditLog("LOGIN_BLOCKED_RATE_LIMIT", "unknown", { ip, lockoutSeconds: remaining });
      return NextResponse.json(
        {
          success: false,
          message: `Terlalu banyak percobaan login. Coba lagi dalam ${Math.ceil(remaining / 60)} menit.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { email, password, captchaToken, captchaAnswer } = body;

    // 4. Validasi server-side Cryptographic Captcha Challenge
    if (!captchaToken || captchaAnswer === undefined || !verifyCaptchaChallenge(captchaToken, captchaAnswer)) {
      recordFailedLogin(ip);
      auditLog("LOGIN_FAILED_CAPTCHA", email ? String(email).trim().toLowerCase() : "unknown", { ip });
      return NextResponse.json(
        { success: false, message: "Verifikasi keamanan (captcha) salah atau telah kedaluwarsa. Silakan coba kembali." },
        { status: 400 }
      );
    }

    // 5. Validasi field wajib dan batasan panjang string (mencegah DoS / ReDoS)
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password);

    if (cleanEmail.length > 150 || cleanPassword.length > 200) {
      return NextResponse.json(
        { success: false, message: "Input melebihi batas panjang yang diizinkan." },
        { status: 400 }
      );
    }

    // 6. Pencarian data admin di database
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      recordFailedLogin(ip);
      auditLog("LOGIN_FAILED_USER_NOT_FOUND", cleanEmail, { ip });
      return NextResponse.json(
        { success: false, message: "Email atau password salah." },
        { status: 401 }
      );
    }

    // 7. Komparasi password dengan bcrypt
    const isPasswordValid = await bcrypt.compare(cleanPassword, user.password);

    if (!isPasswordValid) {
      recordFailedLogin(ip);
      auditLog("LOGIN_FAILED_WRONG_PASSWORD", cleanEmail, { ip });
      return NextResponse.json(
        { success: false, message: "Email atau password salah." },
        { status: 401 }
      );
    }

    // 8. Login berhasil — reset rate limit & generate token
    resetLoginAttempts(ip);
    auditLog("LOGIN_SUCCESS", user.email, { ip, userId: user.id });

    const token = await signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil.",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

    // Simpan token sebagai Session Cookie (HttpOnly, Lax, Secure on prod)
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/auth/login
 * Logout admin — hapus cookie token.
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logout berhasil." });
  response.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
