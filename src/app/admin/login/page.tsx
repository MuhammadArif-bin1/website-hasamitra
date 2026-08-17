"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface MathCaptcha {
  num1: number;
  num2: number;
  operator: "+" | "-" | "×";
  token: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captcha, setCaptcha] = useState<MathCaptcha | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch server-signed cryptographic math captcha
  const generateCaptcha = useCallback(async (isManual = false) => {
    if (isManual) setIsRotating(true);
    setCaptchaInput("");

    try {
      const res = await fetch("/api/admin/auth/captcha", { cache: "no-store" });
      const data = await res.json();
      if (data.success && data.captcha) {
        setCaptcha(data.captcha);
      }
    } catch {
      setError("Gagal memuat verifikasi keamanan. Silakan refresh halaman.");
    } finally {
      if (isManual) setTimeout(() => setIsRotating(false), 400);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const initCaptcha = async () => {
      try {
        const res = await fetch("/api/admin/auth/captcha", { cache: "no-store" });
        const data = await res.json();
        if (isMounted && data.success && data.captcha) {
          setCaptcha(data.captcha);
        }
      } catch {
        if (isMounted) setError("Gagal memuat verifikasi keamanan. Silakan refresh halaman.");
      }
    };
    initCaptcha();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!captcha || !captcha.token) {
      setError("Verifikasi keamanan belum siap. Silakan klik tombol muat ulang captcha.");
      generateCaptcha();
      return;
    }

    if (!captchaInput.trim()) {
      setError("Silakan masukkan jawaban verifikasi keamanan matematika.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          captchaToken: captcha.token,
          captchaAnswer: parseInt(captchaInput.trim(), 10),
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("hasamitra_admin_session_active", "true");
        }
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.message || "Login gagal.");
        generateCaptcha(); // Refresh captcha setelah percobaan gagal
      }
    } catch {
      setError("Terjadi kesalahan jaringan. Silakan coba kembali.");
      generateCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8 sm:py-12 relative">
      <div className="w-full max-w-[420px] bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-slate-200 relative z-10">
        {/* Header & Logo Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white p-2 border border-slate-200/80 shadow-2xs mb-3">
            <Image
              src="/images/logo/logo-bulat.png"
              alt="Logo Hasamitra"
              width={56}
              height={56}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Admin Portal</h1>
          <p className="text-[11px] sm:text-xs font-semibold text-orange-600 uppercase tracking-wider mt-1">
            PT BPR Hasamitra Jawa Barat
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg flex items-start gap-2.5">
              <svg className="w-4 h-4 shrink-0 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="leading-snug">{error}</span>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={150}
                placeholder="admin@hasamitrajabar.com"
                className="w-full h-10 sm:h-11 px-3.5 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                maxLength={200}
                placeholder="••••••••"
                className="w-full h-10 sm:h-11 pl-3.5 pr-10 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors cursor-pointer"
                title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Math Captcha Verification (Server Signed) */}
          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Verifikasi Keamanan
              </label>
              <span className="text-[11px] text-slate-400 font-medium">Hitung hasil di bawah</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Captcha Challenge Box */}
              <div className="flex-1 h-10 sm:h-11 bg-slate-50 border border-slate-200 rounded-lg px-3 flex items-center justify-between select-none">
                <div className="flex items-center gap-1 text-slate-800 font-mono font-bold text-xs sm:text-sm tracking-wide">
                  <span className="text-orange-700 bg-orange-50 border border-orange-200/60 px-1.5 py-0.5 rounded">
                    {captcha ? captcha.num1 : "..."}
                  </span>
                  <span className="text-slate-600 font-semibold px-0.5">
                    {captcha ? captcha.operator : "+"}
                  </span>
                  <span className="text-orange-700 bg-orange-50 border border-orange-200/60 px-1.5 py-0.5 rounded">
                    {captcha ? captcha.num2 : "..."}
                  </span>
                  <span className="text-slate-500 font-semibold px-0.5">=</span>
                  <span className="text-slate-400 font-semibold">?</span>
                </div>

                {/* Refresh Captcha Button */}
                <button
                  type="button"
                  onClick={() => generateCaptcha(true)}
                  title="Ganti soal captcha"
                  className="p-1 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors focus:outline-none cursor-pointer"
                >
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${isRotating ? "rotate-180 text-orange-600" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>

              {/* Captcha Answer Input */}
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                required
                placeholder="Jawaban"
                className="w-24 sm:w-28 h-10 sm:h-11 px-2.5 text-center font-bold text-slate-900 rounded-lg bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 sm:h-12 px-4 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Memverifikasi...</span>
                </>
              ) : (
                "Masuk ke Dashboard"
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 font-normal">
            © 2026 PT BPR Hasamitra Jawa Barat — All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}
