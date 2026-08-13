export const contactData = {
  bankName: "Bank Hasamitra Jawa Barat",
  email: "bpr@hasamitrajabar.com",
  phone: "(021) 7780 9988",
  whatsapp: "085772780037",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6285772780037",
  address: "Jl. Margonda Raya No.19, Kel. Kemiri Muka, Kec. Beji, Kota Depok, Jawa Barat",
  defaultMessage: "Halo Hasamitra Jawa Barat, saya ingin mendapatkan informasi mengenai layanan Bank Hasamitra.",
  socialMedia: {
    facebook: "https://facebook.com/hasamitrajabar",
    instagram: "https://www.instagram.com/bprhasamitrajabar/",
    youtube: "https://www.youtube.com/@hasamitrajawabarat",
  },
  getWhatsAppUrl: (customMessage?: string) => {
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6285772780037";
    const msg = customMessage ?? "Halo Hasamitra Jawa Barat, saya ingin mendapatkan informasi mengenai layanan Bank Hasamitra.";
    return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
  },
};
