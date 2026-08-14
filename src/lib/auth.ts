import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import crypto from "node:crypto";

const RAW_JWT_SECRET = process.env.JWT_SECRET || "hasamitra-admin-secret-key-2026";
const JWT_SECRET = new TextEncoder().encode(RAW_JWT_SECRET);

if (process.env.NODE_ENV === "production" && RAW_JWT_SECRET === "hasamitra-admin-secret-key-2026") {
  console.warn(
    "[SECURITY WARNING] JWT_SECRET menggunakan kunci default di lingkungan produksi! Segera definisikan JWT_SECRET yang kuat dan acak di file .env!"
  );
}

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
// CRYPTOGRAPHIC CAPTCHA CHALLENGE (SERVER-SIDE)
// =============================================
export interface CaptchaChallenge {
  num1: number;
  num2: number;
  operator: "+" | "-" | "×";
  token: string;
}

/**
 * Buat tantangan captcha matematika yang ditandatangani HMAC secara kriptografis di server.
 */
export function generateCaptchaChallenge(): CaptchaChallenge {
  const operators: ("+" | "-" | "×")[] = ["+", "-", "×"];
  const op = operators[Math.floor(Math.random() * operators.length)];
  let n1 = 0;
  let n2 = 0;
  let ans = 0;

  if (op === "+") {
    n1 = Math.floor(Math.random() * 15) + 3;
    n2 = Math.floor(Math.random() * 12) + 2;
    ans = n1 + n2;
  } else if (op === "-") {
    n1 = Math.floor(Math.random() * 18) + 10;
    n2 = Math.floor(Math.random() * 9) + 1;
    ans = n1 - n2;
  } else {
    n1 = Math.floor(Math.random() * 8) + 2;
    n2 = Math.floor(Math.random() * 6) + 2;
    ans = n1 * n2;
  }

  const exp = Date.now() + 5 * 60 * 1000; // Berlaku 5 menit
  const payload = JSON.stringify({ ans, exp });
  const signature = crypto.createHmac("sha256", RAW_JWT_SECRET).update(payload).digest("hex");
  const token = `${Buffer.from(payload).toString("base64url")}.${signature}`;

  return { num1: n1, num2: n2, operator: op, token };
}

/**
 * Validasi jawaban captcha secara kriptografis di server dengan timing-safe comparison.
 */
export function verifyCaptchaChallenge(token: string, userAnswer: string | number): boolean {
  try {
    if (!token || typeof token !== "string" || userAnswer === undefined || userAnswer === null) {
      return false;
    }

    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) return false;

    const payloadStr = Buffer.from(encodedPayload, "base64url").toString("utf-8");
    const expectedSignature = crypto.createHmac("sha256", RAW_JWT_SECRET).update(payloadStr).digest("hex");

    // Timing-safe comparison to prevent side-channel timing attacks
    const sigBuffer = Buffer.from(signature);
    const expBuffer = Buffer.from(expectedSignature);
    if (sigBuffer.length !== expBuffer.length || !crypto.timingSafeEqual(sigBuffer, expBuffer)) {
      return false;
    }

    const payload = JSON.parse(payloadStr);
    if (!payload.exp || Date.now() > payload.exp) {
      return false; // Token kedaluwarsa
    }

    return Number(userAnswer) === Number(payload.ans);
  } catch {
    return false;
  }
}

// =============================================
// CSRF / SAME-ORIGIN VERIFICATION
// =============================================
/**
 * Verifikasi header origin pada mutasi request (POST/PUT/DELETE)
 */
export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return true;

  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
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
 * Log aksi admin (console-based, dapat dipantau dari log cloud hosting).
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
