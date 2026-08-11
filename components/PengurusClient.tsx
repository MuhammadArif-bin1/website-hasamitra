"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, Variants } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PengurusClient() {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"image" | "text">("image");
  const shouldReduceMotion = useReducedMotion();

  // Animation variants for cards
  const cardVariants: Variants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 24,
      scale: shouldReduceMotion ? 1 : 0.95,
    },
    visible: (customIndex: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.7,
        ease: "easeOut",
        delay: shouldReduceMotion ? 0 : customIndex * 0.12,
      },
    }),
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedProfile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProfile]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProfile(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <main className="flex-1 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Submenu Tabs Navigation */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
            <Link
              href="/tentang-kami/profil-perusahaan"
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
            >
              Profil Perusahaan
            </Link>
            <Link
              href="/tentang-kami/logo-makna"
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
            >
              Logo &amp; Makna
            </Link>
            <Link
              href="/tentang-kami/pengurus"
              className="px-5 py-2.5 rounded-full text-sm font-bold bg-emerald-600 text-white shadow-sm shrink-0"
            >
              Pengurus
            </Link>
            <Link
              href="/tentang-kami/struktur-organisasi"
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
            >
              Struktur Organisasi
            </Link>
            <Link
              href="/tentang-kami/penghargaan"
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
            >
              Penghargaan
            </Link>
          </div>

          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md text-center space-y-4"
          >
            <span className="px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-xs uppercase tracking-wider">
              Tentang Kami
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Pengurus Perusahaan
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Jajaran Dewan Komisaris dan Manajemen PT BPR Hasamitra Jawa Barat yang profesional, berpengalaman, dan terpercaya.
            </p>
          </motion.div>

          {/* Dewan Komisaris Section */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Dewan Komisaris
              </h2>
              <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </div>

            {/* Grid of Cards */}
            <div className="flex flex-wrap justify-center items-stretch gap-8 lg:gap-16 pt-4">
              {/* Card 1: Yonggris */}
              <motion.div
                custom={0}
                initial="hidden"
                whileInView="visible"
                whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
                onClick={() => setSelectedProfile("yonggris")}
                className="group cursor-pointer flex flex-col items-center max-w-[260px] w-full text-center focus:outline-none"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedProfile("yonggris");
                  }
                }}
              >
                {/* Image Container with Blue Border */}
                <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden border-4 border-[#0065b3] shadow-lg group-hover:shadow-2xl transition-all duration-300 bg-slate-100">
                  <Image
                    src="/pak yonggris.jpg"
                    alt="YONGGRIS - Komisaris Utama"
                    fill
                    sizes="(max-width: 768px) 100vw, 260px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  {/* Hover Overlay Badge */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3">
                    <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Lihat Detail Profile
                    </span>
                  </div>
                </div>

                {/* Name & Title */}
                <div className="mt-4 space-y-1">
                  <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide group-hover:text-blue-600 transition-colors">
                    YONGGRIS
                  </h3>
                  <p className="text-sm font-semibold text-slate-600">
                    Komisaris Utama
                  </p>
                </div>
              </motion.div>

              {/* Card 2: I Gusti Putu Gunawan */}
              <motion.div
                custom={1}
                initial="hidden"
                whileInView="visible"
                whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
                onClick={() => setSelectedProfile("igp")}
                className="group cursor-pointer flex flex-col items-center max-w-[260px] w-full text-center focus:outline-none"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedProfile("igp");
                  }
                }}
              >
                {/* Image Container with Blue Border */}
                <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden border-4 border-[#0065b3] shadow-lg group-hover:shadow-2xl transition-all duration-300 bg-slate-100">
                  <Image
                    src="/i-gusti-putu.jpg"
                    alt="I GUSTI PUTU GUNAWAN - Komisaris"
                    fill
                    sizes="(max-width: 768px) 100vw, 260px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Hover Overlay Badge */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3">
                    <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Lihat Detail Profile
                    </span>
                  </div>
                </div>

                {/* Name & Title */}
                <div className="mt-4 space-y-1">
                  <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide group-hover:text-blue-600 transition-colors">
                    I GUSTI PUTU GUNAWAN
                  </h3>
                  <p className="text-sm font-semibold text-slate-600">
                    Komisaris
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Dewan Direksi Section */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Dewan Direksi
              </h2>
              <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </div>

            {/* Grid of Cards */}
            <div className="flex flex-wrap justify-center items-stretch gap-8 lg:gap-16 pt-4">
              {/* Card 1: Ketut Sugiata */}
              <motion.div
                custom={2}
                initial="hidden"
                whileInView="visible"
                whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
                onClick={() => setSelectedProfile("ketut")}
                className="group cursor-pointer flex flex-col items-center max-w-[260px] w-full text-center focus:outline-none"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedProfile("ketut");
                  }
                }}
              >
                {/* Image Container with Blue Border */}
                <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden border-4 border-[#0065b3] shadow-lg group-hover:shadow-2xl transition-all duration-300 bg-slate-100">
                  <Image
                    src="/ketut.jpg"
                    alt="KETUT SUGIATA - Direktur Utama"
                    fill
                    sizes="(max-width: 768px) 100vw, 260px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Hover Overlay Badge */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3">
                    <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Lihat Detail Profile
                    </span>
                  </div>
                </div>

                {/* Name & Title */}
                <div className="mt-4 space-y-1">
                  <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide group-hover:text-blue-600 transition-colors">
                    KETUT SUGIATA
                  </h3>
                  <p className="text-sm font-semibold text-slate-600">
                    Direktur Utama
                  </p>
                </div>
              </motion.div>

              {/* Card 2: Prim Budi Susanto */}
              <motion.div
                custom={3}
                initial="hidden"
                whileInView="visible"
                whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
                onClick={() => setSelectedProfile("budi")}
                className="group cursor-pointer flex flex-col items-center max-w-[260px] w-full text-center focus:outline-none"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedProfile("budi");
                  }
                }}
              >
                {/* Image Container with Blue Border */}
                <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden border-4 border-[#0065b3] shadow-lg group-hover:shadow-2xl transition-all duration-300 bg-slate-100">
                  <Image
                    src="/PRIM-BUDI.jpg"
                    alt="PRIM BUDI SUSANTO - Direktur"
                    fill
                    sizes="(max-width: 768px) 100vw, 260px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Hover Overlay Badge */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3">
                    <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Lihat Detail Profile
                    </span>
                  </div>
                </div>

                {/* Name & Title */}
                <div className="mt-4 space-y-1">
                  <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-wide group-hover:text-blue-600 transition-colors">
                    PRIM BUDI SUSANTO
                  </h3>
                  <p className="text-sm font-semibold text-slate-600">
                    Direktur
                  </p>
                </div>
              </motion.div>
            </div>

            {/* OJK & LPS Guarantees Notice */}
            <div className="text-center space-y-2 text-slate-700 pt-8 border-t border-slate-200">
              <p className="text-sm font-semibold">
                BPR Hasamitra Jabar berizin dan diawasi oleh <strong className="text-slate-900">Otoritas Jasa Keuangan (OJK)</strong> dan merupakan peserta penjaminan <strong className="text-slate-900">Lembaga Penjamin Simpanan (LPS)</strong>.
              </p>
              <p className="text-xs text-slate-600">
                Nilai simpanan maksimum yang dijamin oleh LPS sebesar <strong className="text-slate-900">Rp 2 Miliar</strong>, dengan tingkat bunga penjaminan maksimum sebesar <strong className="text-slate-900">6.25%</strong> untuk rupiah sesuai ketentuan yang berlaku.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Popup for Pak Yonggris */}
      {selectedProfile === "yonggris" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedProfile(null)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Dr. Ir. Yonggris, MM
                  </h2>
                  <p className="text-xs font-semibold text-slate-500">
                    Komisaris Utama - PT BPR Hasamitra Jawa Barat
                  </p>
                </div>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-200 p-1 rounded-lg text-xs font-medium">
                  <button
                    onClick={() => setActiveTab("image")}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      activeTab === "image"
                        ? "bg-white text-slate-900 font-bold shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Gambar Poster
                  </button>
                  <button
                    onClick={() => setActiveTab("text")}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      activeTab === "text"
                        ? "bg-white text-slate-900 font-bold shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Teks Profile
                  </button>
                </div>

                <button
                  onClick={() => setSelectedProfile(null)}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                  aria-label="Tutup Modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100">
              {activeTab === "image" ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-full max-w-4xl rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-white">
                    <Image
                      src="/Company-Profile-pak-yonggris.png"
                      alt="Company Profile Dr. Ir. Yonggris, MM - Komisaris Utama"
                      width={1920}
                      height={1080}
                      className="w-full h-auto object-contain"
                      priority
                    />
                  </div>
                  <p className="text-xs text-slate-500 italic text-center">
                    *Gambar profil resmi Dr. Ir. Yonggris, MM (Komisaris Utama PT BPR Hasamitra Jawa Barat)
                  </p>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
                  <div className="border-b border-slate-200 pb-4">
                    <h3 className="text-2xl font-extrabold text-orange-600">
                      Dr. Ir. Yonggris, MM
                    </h3>
                    <p className="text-sm font-bold text-slate-600">
                      Komisaris Utama
                    </p>
                  </div>

                  <div className="space-y-4 text-justify">
                    <p>
                      Warga Negara Indonesia, dilahirkan di Ujung Pandang, 12 Juni 1966. Menyelesaikan pendidikan terakhir Strata-3 (S3) pada Fakultas Ekonomi Universitas Hasanuddin tahun 2018 dengan gelar Doktor. Beliau adalah sosok entrepreneur yang berjiwa sosial, tetapi kecakapan dan pemahaman tentang keuangan dan Lembaga perbankan tidak bisa diragukan.
                    </p>
                    <p>
                      Sebagai Komisaris Utama, Beliau telah mengantongi sertifikat kompetensi Komisaris dari Lembaga Sertifikasi Profesi - Lembaga Keuangan Mikro (LSP-LKM) Certif. Reputasi Bapak Yonggris sebagai sosok yang humanis dan sosial menjadi tokoh masyarakat Makassar dan Sulawesi Selatan secara umum, terlebih lagi dikalangan masyarakat Tionghoa.
                    </p>
                    <p>
                      Beliau adalah Ketua Persatuan Umat Budha Indonesia (PERMABUDHI) Propinsi Sulawesi Selatan, aktif sebagai Pengurus di Forum Komunikasi Umat Beragama (FKUB), Pengurus di Forum Koordinasi Pencegahan Terorisme (FKPT) dan beragam aktivitas sosial kemasyarakatan lainnya. Beliau juga aktif menjadi pembicara dan narasumber pada beberapa event-event seminar dan forum diskusi. Bahkan kerap mengisi siaran mimbar spiritual agama Budha di media televisi dan/atau media lainnya.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedProfile(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm shadow transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Popup for Pak I Gusti Putu Gunawan */}
      {selectedProfile === "igp" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedProfile(null)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Drs. I Gusti Putu Gunawan, MM
                  </h2>
                  <p className="text-xs font-semibold text-slate-500">
                    Komisaris - PT BPR Hasamitra Jawa Barat
                  </p>
                </div>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-200 p-1 rounded-lg text-xs font-medium">
                  <button
                    onClick={() => setActiveTab("image")}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      activeTab === "image"
                        ? "bg-white text-slate-900 font-bold shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Gambar Poster
                  </button>
                  <button
                    onClick={() => setActiveTab("text")}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      activeTab === "text"
                        ? "bg-white text-slate-900 font-bold shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Teks Profile
                  </button>
                </div>

                <button
                  onClick={() => setSelectedProfile(null)}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                  aria-label="Tutup Modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100">
              {activeTab === "image" ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-full max-w-4xl rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-white">
                    <Image
                      src="/Company-Profile-igp.png"
                      alt="Company Profile Drs. I Gusti Putu Gunawan, MM - Komisaris"
                      width={1920}
                      height={1080}
                      className="w-full h-auto object-contain"
                      priority
                    />
                  </div>
                  <p className="text-xs text-slate-500 italic text-center">
                    *Gambar profil resmi Drs. I Gusti Putu Gunawan, MM (Komisaris PT BPR Hasamitra Jawa Barat)
                  </p>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
                  <div className="border-b border-slate-200 pb-4">
                    <h3 className="text-2xl font-extrabold text-orange-600">
                      Drs. I Gusti Putu Gunawan, MM
                    </h3>
                    <p className="text-sm font-bold text-slate-600">
                      Komisaris
                    </p>
                  </div>

                  <div className="space-y-4 text-justify">
                    <p>
                      Lahir di Singaraja-Bali pada tanggal 21 Juli 1960. Meraih gelar Magister Manajemen dari Universitas Trilogi Jakarta tahun 2013. Memulai karir perbankan di Bank Duta sejak 1987 sebagai Senior Clerk – Urusan Pelaksana Pengawasan. Pada 1989 s.d 1990 mengikuti pendidikan Officer Development Program (ODP) Bank Duta Angkatan XII.
                    </p>
                    <p>
                      Pada 1990 s.d 1991 menjabat sebagai Assistant Manager – SKAI. Pada 1991 s.d 1993 menjabat sebagai Manager – Credit ADM And Control Group. Pada 1993 s.d 1995 menjabat sebagai Manager – Full Time Counterpart “Credit Improvement Project PT Bank Duta”. Pada 1995 s.d 1997 menjabat sebagai Senior Manager – Urusan Supervisi Kredit. Pada 1997 s.d 1999 menjabat sebagai Assistant Vice President – Group Bisnis Komersial. Pada 1999 s.d 2000 menjabat sebagai Assistant Vice President – Risk Management Div.
                    </p>
                    <p>
                      Bergabung di PT Bank Yudha Bhakti sejak tahun 2004 menjabat sebagai Ka. Dept. Akuntansi &amp; Risk Management. Tahun 2004 s.d 2009 menjabat sebagai Ka. Satker Manajemen Risiko. Pada 2009 s.d 2012 menjabat sebagai Ka. Divisi Perencanaan &amp; Akuntansi. Pada 2012 s.d 2016 menjabat sebagai Divisi Operasi &amp; Umum.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedProfile(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm shadow transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Popup for Pak Ketut Sugiata */}
      {selectedProfile === "ketut" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedProfile(null)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Ketut Sugiata, SE
                  </h2>
                  <p className="text-xs font-semibold text-slate-500">
                    Direktur Utama - PT BPR Hasamitra Jawa Barat
                  </p>
                </div>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-200 p-1 rounded-lg text-xs font-medium">
                  <button
                    onClick={() => setActiveTab("image")}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      activeTab === "image"
                        ? "bg-white text-slate-900 font-bold shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Gambar Poster
                  </button>
                  <button
                    onClick={() => setActiveTab("text")}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      activeTab === "text"
                        ? "bg-white text-slate-900 font-bold shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Teks Profile
                  </button>
                </div>

                <button
                  onClick={() => setSelectedProfile(null)}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                  aria-label="Tutup Modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100">
              {activeTab === "image" ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-full max-w-4xl rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-white">
                    <Image
                      src="/Company-Profile-pak-ketut.png"
                      alt="Company Profile Ketut Sugiata, SE - Direktur Utama"
                      width={1920}
                      height={1080}
                      className="w-full h-auto object-contain"
                      priority
                    />
                  </div>
                  <p className="text-xs text-slate-500 italic text-center">
                    *Gambar profil resmi Ketut Sugiata, SE (Direktur Utama PT BPR Hasamitra Jawa Barat)
                  </p>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
                  <div className="border-b border-slate-200 pb-4">
                    <h3 className="text-2xl font-extrabold text-orange-600">
                      Ketut Sugiata, SE
                    </h3>
                    <p className="text-sm font-bold text-slate-600">
                      Direktur Utama
                    </p>
                  </div>

                  <div className="space-y-4 text-justify">
                    <p>
                      Lahir di Buleleng, Bali pada tanggal 14 Agustus 1967. Berkarir di BPR Hasa Mitra, Makassar sejak awal BPR berdiri tahun 2005 sampai Agustus 2018 dengan posisi yang dijabat diantaranya sebagai analis kredit dari tahun 2005 s.d 2009, sebagai Kepala Kantor Kas dari tahun 2009 s.d 2012, menjabat sebagai Manager HRD pada tahun 2013, kemudian pada tahun 2013 s.d 2014 sebagai Pjs Manager Kredit, Kepala Kantor Cabang Daya Tahun 2014, Kepala Kantor Cabang Bone dari tahun 2014 s.d 2017, sebagai Kepala Kantor Cabang Gowa dari tahun 2017 s.d 2018.
                    </p>
                    <p>
                      Pernah bekerja di Bank Perniagaan dari tahun 1989 s.d 1993 sebagai petugas administrasi tabungan. Menyelesaikan pendidikan S-1 Program studi Manajemen di STIEM Bongaya, Makassar tahun 2012.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedProfile(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm shadow transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Popup for Pak Prim Budi Susanto */}
      {selectedProfile === "budi" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedProfile(null)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Prim Budi Susanto SE, MM
                  </h2>
                  <p className="text-xs font-semibold text-slate-500">
                    Direktur - PT BPR Hasamitra Jawa Barat
                  </p>
                </div>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-200 p-1 rounded-lg text-xs font-medium">
                  <button
                    onClick={() => setActiveTab("image")}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      activeTab === "image"
                        ? "bg-white text-slate-900 font-bold shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Gambar Poster
                  </button>
                  <button
                    onClick={() => setActiveTab("text")}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      activeTab === "text"
                        ? "bg-white text-slate-900 font-bold shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Teks Profile
                  </button>
                </div>

                <button
                  onClick={() => setSelectedProfile(null)}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                  aria-label="Tutup Modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100">
              {activeTab === "image" ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-full max-w-4xl rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-white">
                    <Image
                      src="/Company-Profil-pak-budi.png"
                      alt="Company Profile Prim Budi Susanto SE, MM - Direktur"
                      width={1920}
                      height={1080}
                      className="w-full h-auto object-contain"
                      priority
                    />
                  </div>
                  <p className="text-xs text-slate-500 italic text-center">
                    *Gambar profil resmi Prim Budi Susanto SE, MM (Direktur PT BPR Hasamitra Jawa Barat)
                  </p>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
                  <div className="border-b border-slate-200 pb-4">
                    <h3 className="text-2xl font-extrabold text-orange-600">
                      Prim Budi Susanto SE, MM
                    </h3>
                    <p className="text-sm font-bold text-slate-600">
                      Direktur
                    </p>
                  </div>

                  <div className="space-y-4 text-justify">
                    <p>
                      Lahir di Klaten, tanggal 28 Oktober 1963. Berkarir di BPR Hasa Mitra, Makassar sejak tahun 2012 sampai Juli 2019 dengan beberapa posisi yang pernah dijabat antara lain; Manager bisnis tahun 2012 s.d tahun 2013, Manager Umum &amp; SDM tahun 2014 s.d 2019.
                    </p>
                    <p>
                      Mengawali karir di PT Bank Duta tahun 1990 s.d 1992, dengan jabatan terakhir sebagai Kepala kantor Kas. Pada tahun 1993 s.d 2000 bergabung di Bank Putera Multikarsa (likuidasi) dengan jabatan terakhir sebagai Deputy Branch Manager. BPPN tahun 2000 s.d 2001 jabatan kuasa kas.
                    </p>
                    <p>
                      PT Kalla Intikarsa (kalla Grup) 2002 s.d 2003 HRD Manager. Mall GTC Makassar (lippo Grup) 2003 s.d 2010 jabatan Property Manager. PT Ramayana Lestari Sentosa 2010 s.d 2012 jabatan Property Manager.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedProfile(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm shadow transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
