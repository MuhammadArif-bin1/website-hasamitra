import React from "react";
import Image from "next/image";

interface PiagamPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PiagamPreviewModal({ isOpen, onClose }: PiagamPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl rounded-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="space-y-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
              Piagam &amp; Penghargaan Resmi
            </span>
            <h4 className="text-sm sm:text-base font-bold">
              Sertifikat Kinerja &amp; Prestasi PT BPR Hasamitra Jawa Barat
            </h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
            aria-label="Tutup preview piagam"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 bg-white flex items-center justify-center">
          <Image
            src="/images/dokumen/piagam-hasamitra.png"
            alt="Piagam dan Penghargaan Resmi PT BPR Hasamitra Jawa Barat Full"
            width={1400}
            height={900}
            className="w-full h-auto max-h-[72vh] object-contain mx-auto"
          />
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950 text-right text-xs text-slate-400">
          Penghargaan dari Infobank dan The Finance atas kinerja keuangan terbaik.
        </div>
      </div>
    </div>
  );
}
