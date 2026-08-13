import React from "react";

export default function OjkLpsNotice() {
  return (
    <div className="text-center space-y-2 text-slate-700 py-6 border-y border-slate-200">
      <p className="text-sm font-semibold">
        BPR Hasamitra Jabar berizin dan diawasi oleh{" "}
        <strong className="text-slate-900">
          Otoritas Jasa Keuangan (OJK)
        </strong>{" "}
        dan merupakan peserta penjaminan{" "}
        <strong className="text-slate-900">
          Lembaga Penjamin Simpanan (LPS)
        </strong>
        .
      </p>
      <p className="text-xs text-slate-600">
        Nilai simpanan maksimum yang dijamin oleh LPS sebesar{" "}
        <strong className="text-slate-900">Rp 2 Miliar</strong>, dengan tingkat
        bunga penjaminan maksimum sebesar{" "}
        <strong className="text-slate-900">6.25%</strong> untuk rupiah sesuai
        ketentuan yang berlaku.
      </p>
    </div>
  );
}
