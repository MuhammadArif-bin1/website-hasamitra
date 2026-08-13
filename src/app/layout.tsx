import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PT BPR Hasamitra Jawa Barat",
    template: "%s - Bank Hasamitra Jawa Barat",
  },
  description:
    "PT BPR Hasamitra Jawa Barat — Mitra keuangan terpercaya. Berizin dan diawasi oleh OJK serta peserta penjaminan LPS.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-slate-50 font-sans text-slate-800"
        suppressHydrationWarning
      >
        <Navbar />
        <main className="flex-1 bg-slate-50">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
