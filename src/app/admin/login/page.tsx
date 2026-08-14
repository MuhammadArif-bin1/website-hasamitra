"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface MathCaptcha {
  num1: number;
  num2: number;
  operator: "+" | "-" | "×";
  answer: number;
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

  // Generate random math captcha
  const generateCaptcha = useCallback(() => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 400);

    const operators: ("+" | "-" | "×")[] = ["+", "-", "×"];
    const op = operators[Math.floor(Math.random() * operators.length)];
    let n1 = 0;
    let n2 = 0;
    let ans = 0;

    if (op === "+") {
      n1 = Math.floor(Math.random() * 15) + 3; // 3 - 17
      n2 = Math.floor(Math.random() * 12) + 2; // 2 - 13
      ans = n1 + n2;
    } else if (op === "-") {
      n1 = Math.floor(Math.random() * 18) + 10; // 10 - 27
      n2 = Math.floor(Math.random() * 9) + 1; // 1 - 9
      ans = n1 - n2;
    } else {
      // Perkalian angka kecil agar mudah dihitung cepat
      n1 = Math.floor(Math.random() * 8) + 2; // 2 - 9
      n2 = Math.floor(Math.random() * 6) + 2; // 2 - 7
      ans = n1 * n2;
    }

    setCaptcha({ num1: n1, num2: n2, operator: op, answer: ans });
    setCaptchaInput("");
  }, []);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validasi Captcha
    if (!captcha || parseInt(captchaInput.trim(), 10) !== captcha.answer) {
      setError("Jawaban captcha matematika salah. Silakan coba lagi.");
      generateCaptcha();
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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
        generateCaptcha(); // Refresh captcha setelah gagal
      }
    } catch {
      setError("Terjadi kesalahan jaringan. Silakan coba kembali.");
      generateCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-slate-50 to-amber-50/60 px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Decorative Background Accent Blobs */}
      <div className="absolute -top-28 -left-28 w-80 sm:w-96 h-80 sm:h-96 bg-orange-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-28 -right-28 w-80 sm:w-96 h-80 sm:h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xl sm:shadow-2xl border border-slate-100/90 relative z-10">
        {/* Header & Logo Badge */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white p-1.5 shadow-lg border border-slate-100 mb-3 sm:mb-4 transition-transform hover:scale-105">
            <Image
              src="/images/logo/logo-bulat.png"
              alt="Logo Hasamitra"
              width={70}
              height={70}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Admin Portal</h1>
          <p className="text-[11px] sm:text-xs font-bold text-orange-600 uppercase tracking-wider mt-1">
            PT BPR Hasamitra Jawa Barat
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {error && (
            <div className="p-3 sm:p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium rounded-xl flex items-start gap-2.5 animate-shake">
              <svg className="w-4 h-4 shrink-0 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="leading-snug">{error}</span>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@hasamitrajabar.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-4 pr-11 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Math Captcha Verification */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Verifikasi Keamanan
              </label>
              <span className="text-[11px] text-slate-400 font-medium">Hitung hasil di bawah</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Captcha Challenge Box */}
              <div className="flex-1 bg-gradient-to-r from-orange-50 to-amber-50/80 border border-orange-200/80 rounded-xl px-3 py-2.5 flex items-center justify-between shadow-inner select-none">
                <div className="flex items-center gap-1 text-slate-800 font-mono font-black text-base sm:text-lg tracking-wider">
                  <span className="text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded-md">
                    {captcha ? captcha.num1 : "..."}
                  </span>
                  <span className="text-slate-600 font-bold px-1">
                    {captcha ? captcha.operator : "+"}
                  </span>
                  <span className="text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded-md">
                    {captcha ? captcha.num2 : "..."}
                  </span>
                  <span className="text-slate-500 font-bold px-1">=</span>
                  <span className="text-slate-400 font-semibold">?</span>
                </div>

                {/* Refresh Captcha Button */}
                <button
                  type="button"
                  onClick={generateCaptcha}
                  title="Ganti soal captcha"
                  className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-100/60 rounded-lg transition-all focus:outline-none"
                >
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${isRotating ? "rotate-180 text-orange-600" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.2}
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
                className="w-24 sm:w-28 px-3 py-2.5 text-center font-bold text-slate-900 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-100 text-center">
          <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
            © 2026 PT BPR Hasamitra Jawa Barat — All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}

