import React from "react";
import PageHeader from "@/components/common/PageHeader";
import ContactForm from "@/components/ContactForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import { contactData } from "@/data/contact";

export const metadata = {
  title: "Contact Us",
  description:
    "Hubungi PT BPR Hasamitra Jawa Barat via Email, Telepon, WhatsApp 085772780037, atau kunjungi kantor kami di Margonda Depok.",
};

export default function ContactPage() {
  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <PageHeader
          badge="Hubungi Kami"
          title="Kontak & Layanan Hasamitra"
          description="Tim Bank Hasamitra Jawa Barat siap melayani segala kebutuhan perbankan, pertanyaan, dan pengaduan Anda."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Right Column: Office Info, Email, Phone, WhatsApp, Social Media */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md space-y-6">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
                Informasi Kontak
              </h2>

              {/* Kantor */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H7m4 0v5" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Kantor</h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
                    {contactData.address}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Email</h3>
                  <a
                    href={`mailto:${contactData.email}`}
                    className="text-sm text-orange-600 font-semibold hover:underline mt-1 inline-block"
                  >
                    {contactData.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Phone</h3>
                  <a
                    href={`tel:${contactData.phone.replace(/[^0-9]/g, "")}`}
                    className="text-sm text-slate-800 font-semibold hover:text-orange-600 mt-1 inline-block"
                  >
                    {contactData.phone}
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-4 pt-2 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.764.459 3.487 1.332 5.006L2 22l5.127-1.341a9.96 9.96 0 004.885 1.325h.004c5.507 0 9.99-4.478 9.99-9.985 0-2.667-1.038-5.174-2.925-7.06A9.923 9.923 0 0012.012 2zm0 18.286h-.003a8.281 8.281 0 01-4.223-1.157l-.303-.18-3.136.821.836-3.057-.197-.313a8.272 8.272 0 01-1.272-4.416c0-4.568 3.717-8.285 8.285-8.285 2.213 0 4.293.862 5.858 2.428a8.23 8.23 0 012.422 5.857c0 4.569-3.717 8.286-8.284 8.286z" />
                  </svg>
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">WhatsApp</h3>
                    <p className="text-base font-bold text-orange-600 tracking-wide mt-0.5">
                      {contactData.whatsapp}
                    </p>
                  </div>
                  <WhatsAppButton text="Hubungi Kami via WhatsApp" variant="primary" className="w-full" />
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm mb-3">Social Media</h3>
                <div className="flex items-center gap-3">
                  <a
                    href={contactData.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-orange-500 hover:text-white text-slate-700 font-semibold text-xs flex items-center gap-2 transition-colors"
                  >
                    Facebook
                  </a>
                  <a
                    href={contactData.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-orange-500 hover:text-white text-slate-700 font-semibold text-xs flex items-center gap-2 transition-colors"
                  >
                    Instagram
                  </a>
                  <a
                    href={contactData.socialMedia.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-orange-500 hover:text-white text-slate-700 font-semibold text-xs flex items-center gap-2 transition-colors"
                  >
                    YouTube
                  </a>
                </div>
              </div>
            </div>

            {/* Maps Section */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md space-y-4">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Lokasi Maps Kantor Hasamitra
              </h3>
              <p className="text-xs text-slate-600">
                Jl. Margonda Raya No.19, Kel. Kemiri Muka, Kec. Beji, Kota Depok, Jawa Barat.
              </p>
              <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-200 relative bg-slate-100">
                <iframe
                  title="Lokasi Office Hasamitra Margonda Depok"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.201659972304!2d106.8288!3d-6.368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ec069f1fffff%3A0x1!2sJl.%20Margonda%20Raya%20No.19%2C%20Kemiri%20Muka%2C%20Kec.%20Beji%2C%20Kota%20Depok%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
