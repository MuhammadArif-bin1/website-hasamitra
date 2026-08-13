import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  signToken,
  isRateLimited,
  recordFailedLogin,
  resetLoginAttempts,
  getLockoutRemainingSeconds,
  auditLog,
} from "@/lib/auth";
import bcrypt from "bcryptjs";

/**
 * POST /api/admin/auth/login
 * Autentikasi admin dengan email & password.
 * Dilengkapi rate limiting dan audit logging.
 */
export async function POST(request: NextRequest) {
  try {
    // Ambil IP address untuk rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Cek rate limit
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

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

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

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      recordFailedLogin(ip);
      auditLog("LOGIN_FAILED_WRONG_PASSWORD", cleanEmail, { ip });
      return NextResponse.json(
        { success: false, message: "Email atau password salah." },
        { status: 401 }
      );
    }

    // Login berhasil — reset rate limit & generate token
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

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * parseInt(process.env.ADMIN_TOKEN_EXPIRY_HOURS || "24"),
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
