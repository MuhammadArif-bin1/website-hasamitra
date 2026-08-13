"use client";

import React from "react";

interface CicilEmasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CicilEmasModal({ isOpen, onClose }: CicilEmasModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-5 sm:p-6 flex items-center justify-between shrink-0 shadow-md">
          <div className="space-y-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100 block">
              Formulir Online Resmi
            </span>
            <h3 className="text-xl sm:text-2xl font-black">Form Pendaftaran Cicil Emas</h3>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdYUYQqVCdL-ivWTeEycZdvIo_a1ruNXPsGgVaL_droYCPCFQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs backdrop-blur-sm transition-colors"
            >
              Buka Tab Baru ↗
            </a>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors focus:outline-none text-base font-bold"
              aria-label="Tutup modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Embedded Google Form Container */}
        <div className="flex-1 w-full bg-slate-50 relative overflow-y-auto">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdYUYQqVCdL-ivWTeEycZdvIo_a1ruNXPsGgVaL_droYCPCFQ/viewform?embedded=true"
            className="w-full h-[68vh] border-0"
            title="Form Pendaftaran Cicil Emas Hasamitra"
          >
            Memuat Formulir Google Form...
          </iframe>
        </div>

        {/* Footer info bar */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 text-xs text-slate-600">
          <span>Official Google Form PT BPR Hasamitra Jawa Barat</span>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdYUYQqVCdL-ivWTeEycZdvIo_a1ruNXPsGgVaL_droYCPCFQ/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 font-bold hover:underline inline-flex items-center gap-1"
          >
            Buka Formulir Langsung di Google Forms ↗
          </a>
        </div>
      </div>
    </div>
  );
}
