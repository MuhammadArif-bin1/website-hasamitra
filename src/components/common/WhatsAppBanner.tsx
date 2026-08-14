import React from "react";
import WhatsAppButton from "@/components/common/WhatsAppButton";

interface WhatsAppBannerProps {
  title?: string;
  subtitle?: string;
}

export default function WhatsAppBanner({
  title = "Ada Pertanyaan Lebih Lanjut?",
  subtitle = "Hubungi Customer Service kami via WhatsApp resmi.",
}: WhatsAppBannerProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-orange-500/20 gap-6 border border-orange-400">
      <div className="space-y-1 text-center sm:text-left">
        <h3 className="text-xl sm:text-2xl font-bold">{title}</h3>
        <p className="text-sm text-orange-100">{subtitle}</p>
      </div>
      <WhatsAppButton variant="primary" text="HUBUNGI CS" className="shrink-0 font-bold tracking-wide" />
    </div>
  );
}
