"use client";

import React, { useState, useEffect, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    grecaptcha?: {
      render?: (
        container: HTMLElement | string,
        parameters: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => number;
      getResponse?: (widgetId?: number) => string;
      reset?: (widgetId?: number) => void;
    };
    onRecaptchaLoad?: () => void;
  }
}

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    telepon: "",
    layanan: "Pertanyaan",
    message: "",
  });

  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const siteKey =
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
    "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

  const renderRecaptcha = React.useCallback(() => {
    if (
      typeof window !== "undefined" &&
      window.grecaptcha?.render &&
      recaptchaContainerRef.current &&
      widgetIdRef.current === null
    ) {
      try {
        const id = window.grecaptcha.render(recaptchaContainerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            setRecaptchaToken(token);
          },
          "expired-callback": () => {
            setRecaptchaToken("");
          },
          "error-callback": () => {
            setRecaptchaToken("");
          },
        });
        widgetIdRef.current = id;
      } catch (e) {
        console.error("reCAPTCHA render error:", e);
      }
    }
  }, [siteKey]);

  useEffect(() => {
    window.onRecaptchaLoad = () => {
      renderRecaptcha();
    };

    if (typeof window !== "undefined" && window.grecaptcha?.render) {
      renderRecaptcha();
    }
  }, [renderRecaptcha]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    let currentToken = recaptchaToken;
    if (!currentToken && typeof window !== "undefined" && window.grecaptcha?.getResponse) {
      currentToken = window.grecaptcha.getResponse(
        widgetIdRef.current !== null ? widgetIdRef.current : undefined
      ) || "";
    }

    if (!formData.nama.trim() || !formData.email.trim() || !formData.telepon.trim() || !formData.message.trim()) {
      setStatusMessage({
        type: "error",
        text: "Data yang dikirim belum lengkap.",
      });
      return;
    }

    if (!currentToken) {
      setStatusMessage({
        type: "error",
        text: "Mohon selesaikan verifikasi reCAPTCHA ('I'm not a robot').",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: formData.nama,
          email: formData.email,
          telepon: formData.telepon,
          layanan: formData.layanan,
          message: formData.message,
          recaptchaToken: currentToken,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatusMessage({
          type: "success",
          text: result.message || "Pesan Anda berhasil dikirim.",
        });
        setFormData({
          nama: "",
          email: "",
          telepon: "",
          layanan: "Pertanyaan",
          message: "",
        });
        setRecaptchaToken("");
        if (typeof window !== "undefined" && window.grecaptcha?.reset) {
          window.grecaptcha.reset(
            widgetIdRef.current !== null ? widgetIdRef.current : undefined
          );
        }
      } else {
        setStatusMessage({
          type: "error",
          text: result.message || "Data yang dikirim belum lengkap.",
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      setStatusMessage({
        type: "error",
        text: "Terjadi kesalahan pada server.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xl">
      <Script
        src="https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit"
        strategy="lazyOnload"
      />

      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
        Pertanyaan dan Pengaduan
      </h3>
      <p className="text-sm text-slate-600 mb-6">
        Silakan isi formulir di bawah ini untuk mengirimkan pertanyaan atau pengaduan Anda kepada tim Bank Hasamitra.
      </p>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl mb-6 text-sm font-medium border ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="nama" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Nama <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nama"
            name="nama"
            required
            value={formData.nama}
            onChange={handleChange}
            placeholder="Masukkan nama lengkap Anda"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-slate-900 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="nama@email.com"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-slate-900 text-sm"
            />
          </div>
          <div>
            <label htmlFor="telepon" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Telepon <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="telepon"
              name="telepon"
              required
              value={formData.telepon}
              onChange={handleChange}
              placeholder="081234567890"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-slate-900 text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="layanan" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Pilihan Layanan <span className="text-red-500">*</span>
          </label>
          <select
            id="layanan"
            name="layanan"
            required
            value={formData.layanan}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-slate-900 text-sm bg-white"
          >
            <option value="Pertanyaan">Pertanyaan</option>
            <option value="Pengaduan">Pengaduan</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Pesan / Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder="Tuliskan pesan, pertanyaan, atau pengaduan Anda secara detail di sini..."
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-slate-900 text-sm"
          />
        </div>

        {/* reCAPTCHA Widget */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            Verifikasi Keamanan <span className="text-red-500">*</span>
          </label>
          <div ref={recaptchaContainerRef} className="min-h-[78px]"></div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-md shadow-orange-500/25 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Mengirim...
            </>
          ) : (
            "Send"
          )}
        </button>
      </form>
    </div>
  );
}
