import { NextResponse } from "next/server";
import { generateCaptchaChallenge } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/auth/captcha
 * Menghasilkan tantangan captcha matematika yang ditandatangani HMAC secara kriptografis oleh server.
 */
export async function GET() {
  const challenge = generateCaptchaChallenge();

  return NextResponse.json(
    {
      success: true,
      captcha: challenge,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    }
  );
}
