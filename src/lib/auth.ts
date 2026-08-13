import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "hasamitra-admin-secret-key-2026"
);

const COOKIE_NAME = "admin_token";
const TOKEN_EXPIRY = `${process.env.ADMIN_TOKEN_EXPIRY_HOURS || "24"}h`;

export interface AdminPayload {
  id: number;
  email: string;
  name: string;
  role: string;
}

// =============================================
// RATE LIMITING (in-memory, per instance)
// =============================================
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 menit

/**
 * Cek apakah IP di-lockout karena terlalu banyak gagal login.
 */
export function isRateLimited(ip: string): boolean {
  const record = loginAttempts.get(ip);
  if (!record) return false;

  const elapsed = Date.now() - record.lastAttempt;
  if (elapsed > LOCKOUT_DURATION_MS) {
    loginAttempts.delete(ip);
    return false;
  }

  return record.count >= MAX_LOGIN_ATTEMPTS;
}

/**
 * Catat percobaan login gagal.
 */
export function recordFailedLogin(ip: string): void {
  const record = loginAttempts.get(ip);
  if (record) {
    record.count += 1;
    record.lastAttempt = Date.now();
  } else {
    loginAttempts.set(ip, { count: 1, lastAttempt: Date.now() });
  }
}

/**
 * Reset counter setelah login berhasil.
 */
export function resetLoginAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

/**
 * Sisa waktu lockout dalam detik.
 */
export function getLockoutRemainingSeconds(ip: string): number {
  const record = loginAttempts.get(ip);
  if (!record) return 0;
  const elapsed = Date.now() - record.lastAttempt;
  return Math.max(0, Math.ceil((LOCKOUT_DURATION_MS - elapsed) / 1000));
}

// =============================================
// JWT TOKEN MANAGEMENT
// =============================================

/**
 * Sign a JWT token with admin payload.
 */
export async function signToken(payload: AdminPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

/**
 * Verify and decode a JWT token.
 */
export async function verifyToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminPayload;
  } catch {
    return null;
  }
}

/**
 * Get admin payload from cookies (server components & route handlers).
 */
export async function getAdmin(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Get admin payload from a NextRequest (middleware).
 */
export async function getAdminFromRequest(
  request: NextRequest
): Promise<AdminPayload | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// =============================================
// AUDIT LOGGING
// =============================================

/**
 * Log aksi admin (console-based, bisa diperluas ke database).
 */
export function auditLog(
  action: string,
  adminEmail: string,
  details?: Record<string, unknown>
): void {
  const timestamp = new Date().toISOString();
  console.log(
    `[AUDIT] ${timestamp} | ${action} | admin=${adminEmail} | ${
      details ? JSON.stringify(details) : ""
    }`
  );
}
