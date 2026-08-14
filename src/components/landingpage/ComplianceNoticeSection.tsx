import React from "react";

export default function ComplianceNoticeSection() {
  return (
    <section className="py-8 bg-slate-100 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-2">
        <p className="text-xs sm:text-sm font-bold text-slate-900">
          PT BPR Hasamitra Jawa Barat berizin dan diawasi oleh Otoritas Jasa Keuangan (OJK) serta merupakan peserta penjaminan Lembaga Penjamin Simpanan (LPS).
        </p>
        <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
          Nilai simpanan maksimum yang dijamin oleh LPS sebesar{" "}
          <strong className="text-slate-800 font-semibold">
            Rp 2.000.000.000,- (Dua Miliar Rupiah)
          </strong>{" "}
          dengan tingkat bunga penjaminan maksimum sebesar{" "}
          <strong className="text-slate-800 font-semibold">6.25%</strong> untuk rupiah sesuai ketentuan yang berlaku.
        </p>
      </div>
    </section>
  );
}
