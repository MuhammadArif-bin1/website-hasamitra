import React from "react";
import { contactData } from "@/data/contact";

interface WhatsAppButtonProps {
  text?: string;
  message?: string;
  variant?: "primary" | "secondary" | "outline" | "compact";
  className?: string;
}

export function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.764.459 3.487 1.332 5.006L2 22l5.127-1.341a9.96 9.96 0 004.885 1.325h.004c5.507 0 9.99-4.478 9.99-9.985 0-2.667-1.038-5.174-2.925-7.06A9.923 9.923 0 0012.012 2zm0 18.286h-.003a8.281 8.281 0 01-4.223-1.157l-.303-.18-3.136.821.836-3.057-.197-.313a8.272 8.272 0 01-1.272-4.416c0-4.568 3.717-8.285 8.285-8.285 2.213 0 4.293.862 5.858 2.428a8.23 8.23 0 012.422 5.857c0 4.569-3.717 8.286-8.284 8.286zm4.538-6.195c-.248-.124-1.468-.724-1.696-.807-.228-.083-.394-.124-.559.124-.165.248-.641.807-.786.972-.145.165-.29.186-.538.062-.248-.124-1.047-.386-1.995-1.231-.738-.658-1.236-1.47-1.381-1.718-.145-.248-.015-.382.109-.505.112-.11.248-.29.372-.434.124-.145.165-.248.248-.414.083-.165.041-.31-.021-.434-.062-.124-.559-1.343-.765-1.838-.201-.484-.405-.418-.559-.426l-.476-.008c-.165 0-.434.062-.661.31-.228.248-.868.848-.868 2.068 0 1.22.889 2.398 1.013 2.563.124.165 1.75 2.672 4.238 3.747.592.256 1.054.409 1.414.523.594.189 1.134.162 1.56.098.475-.071 1.468-.6 1.674-1.179.207-.579.207-1.075.145-1.179-.062-.104-.228-.166-.476-.29z" />
    </svg>
  );
}

export default function WhatsAppButton({
  text,
  message,
  variant = "primary",
  className = "",
}: WhatsAppButtonProps) {
  const whatsappUrl = contactData.getWhatsAppUrl(message);

  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 active:scale-[0.98]";

  const variantStyles = {
    primary:
      "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg px-4 py-2.5 sm:px-5 sm:py-3 text-sm sm:text-base",
    secondary:
      "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-4 py-2.5 text-sm sm:text-base",
    outline:
      "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-4 py-2.5 text-sm sm:text-base",
    compact:
      "bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs sm:text-sm rounded-md",
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi Kami via WhatsApp"
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      <WhatsAppIcon className="w-5 h-5 shrink-0" />
      {text ? (
        <span>{text}</span>
      ) : (
        <>
          <span className="hidden sm:inline">Hubungi Kami via WhatsApp</span>
          <span className="sm:hidden">WhatsApp</span>
        </>
      )}
    </a>
  );
}
