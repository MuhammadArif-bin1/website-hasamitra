"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { contactData } from "@/data/contact";
import { footerNavigation } from "@/data/navigation";
import WhatsAppButton from "@/components/common/WhatsAppButton";

export default function Footer() {
  const pathname = usePathname();

  // Sembunyikan footer publik di semua halaman admin
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block bg-white px-4 py-2.5 rounded-2xl shadow-md transition-transform hover:scale-105">
              <Image
                src="/images/logo/logo-hasamitra.png"
                alt="Bank Hasamitra Jawa Barat"
                width={200}
                height={50}
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              PT BPR Hasamitra Jawa Barat berkomitmen memberikan layanan perbankan terbaik, aman, terpercaya, dan profesional bagi masyarakat.
            </p>
          </div>

          {/* Navigasi Cepat */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wide uppercase">
              Navigasi Fitur
            </h3>
            <ul className="space-y-2.5 text-sm">
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-orange-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kantor & Kontak */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wide uppercase">
              Kantor Pusat
            </h3>
            <address className="not-italic text-sm text-slate-400 space-y-3">
              <p className="leading-relaxed">{contactData.address}</p>
              <p>
                <span className="font-semibold text-white">Email:</span>{" "}
                <a
                  href={`mailto:${contactData.email}`}
                  className="hover:text-orange-400 transition-colors"
                >
                  {contactData.email}
                </a>
              </p>
              <p>
                <span className="font-semibold text-white">Phone:</span>{" "}
                <a
                  href={`tel:${contactData.phone.replace(/[^0-9]/g, "")}`}
                  className="hover:text-orange-400 transition-colors"
                >
                  {contactData.phone}
                </a>
              </p>
            </address>
          </div>

          {/* WhatsApp Section & Social Media */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wide uppercase">
              Layanan Nasabah
            </h3>
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3 shadow-lg">
              <span className="text-xs text-slate-400 block font-medium">Customer Service Resmi</span>
              <WhatsAppButton text="HUBUNGI CS" variant="primary" className="w-full font-bold tracking-wide rounded-xl py-3 shadow-md shadow-emerald-600/20" />
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Media Sosial
              </h4>
              <div className="flex items-center gap-3">
                <a
                  href={contactData.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Bank Hasamitra"
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-orange-600 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a
                  href={contactData.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Bank Hasamitra"
                  className="w-10 h-10 rounded-full bg-slate-800 hover:bg-orange-600 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} PT BPR Hasamitra Jawa Barat. Berizin dan diawasi oleh OJK.</p>
          <div className="flex items-center gap-6">
            <a href={`https://wa.me/${contactData.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
              HUBUNGI CS
            </a>
            <span>•</span>
            <a href={`https://wa.me/${contactData.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
