export interface ManagementMember {
  id: string;
  name: string;
  fullName: string;
  position: string;
  category: "commissioner" | "director";
  photo: string;
  profileImage: string;
  profileImageAlt: string;
  bio: string[];
}

export const managementMembers: ManagementMember[] = [
  {
    id: "yonggris",
    name: "YONGGRIS",
    fullName: "Dr. Ir. Yonggris, MM",
    position: "Komisaris Utama",
    category: "commissioner",
    photo: "/images/profil/pak-yonggris.jpg",
    profileImage: "/images/company-profile/company-profile-pak-yonggris.png",
    profileImageAlt: "Company Profile Dr. Ir. Yonggris, MM - Komisaris Utama",
    bio: [
      "Warga Negara Indonesia, dilahirkan di Ujung Pandang, 12 Juni 1966. Menyelesaikan pendidikan terakhir Strata-3 (S3) pada Fakultas Ekonomi Universitas Hasanuddin tahun 2018 dengan gelar Doktor. Beliau adalah sosok entrepreneur yang berjiwa sosial, tetapi kecakapan dan pemahaman tentang keuangan dan Lembaga perbankan tidak bisa diragukan.",
      "Sebagai Komisaris Utama, Beliau telah mengantongi sertifikat kompetensi Komisaris dari Lembaga Sertifikasi Profesi - Lembaga Keuangan Mikro (LSP-LKM) Certif. Reputasi Bapak Yonggris sebagai sosok yang humanis dan sosial menjadi tokoh masyarakat Makassar dan Sulawesi Selatan secara umum, terlebih lagi dikalangan masyarakat Tionghoa.",
      "Beliau adalah Ketua Persatuan Umat Budha Indonesia (PERMABUDHI) Propinsi Sulawesi Selatan, aktif sebagai Pengurus di Forum Komunikasi Umat Beragama (FKUB), Pengurus di Forum Koordinasi Pencegahan Terorisme (FKPT) dan beragam aktivitas sosial kemasyarakatan lainnya. Beliau juga aktif menjadi pembicara dan narasumber pada beberapa event-event seminar dan forum diskusi. Bahkan kerap mengisi siaran mimbar spiritual agama Budha di media televisi dan/atau media lainnya.",
    ],
  },
  {
    id: "igp",
    name: "I GUSTI PUTU GUNAWAN",
    fullName: "Drs. I Gusti Putu Gunawan, MM",
    position: "Komisaris",
    category: "commissioner",
    photo: "/images/profil/i-gusti-putu.jpg",
    profileImage: "/images/company-profile/company-profile-igp.png",
    profileImageAlt: "Company Profile Drs. I Gusti Putu Gunawan, MM - Komisaris",
    bio: [
      "Lahir di Singaraja-Bali pada tanggal 21 Juli 1960. Meraih gelar Magister Manajemen dari Universitas Trilogi Jakarta tahun 2013. Memulai karir perbankan di Bank Duta sejak 1987 sebagai Senior Clerk – Urusan Pelaksana Pengawasan. Pada 1989 s.d 1990 mengikuti pendidikan Officer Development Program (ODP) Bank Duta Angkatan XII.",
      "Pada 1990 s.d 1991 menjabat sebagai Assistant Manager – SKAI. Pada 1991 s.d 1993 menjabat sebagai Manager – Credit ADM And Control Group. Pada 1993 s.d 1995 menjabat sebagai Manager – Full Time Counterpart \"Credit Improvement Project PT Bank Duta\". Pada 1995 s.d 1997 menjabat sebagai Senior Manager – Urusan Supervisi Kredit. Pada 1997 s.d 1999 menjabat sebagai Assistant Vice President – Group Bisnis Komersial. Pada 1999 s.d 2000 menjabat sebagai Assistant Vice President – Risk Management Div.",
      "Bergabung di PT Bank Yudha Bhakti sejak tahun 2004 menjabat sebagai Ka. Dept. Akuntansi & Risk Management. Tahun 2004 s.d 2009 menjabat sebagai Ka. Satker Manajemen Risiko. Pada 2009 s.d 2012 menjabat sebagai Ka. Divisi Perencanaan & Akuntansi. Pada 2012 s.d 2016 menjabat sebagai Divisi Operasi & Umum.",
    ],
  },
  {
    id: "ketut",
    name: "KETUT SUGIATA",
    fullName: "Ketut Sugiata, SE",
    position: "Direktur Utama",
    category: "director",
    photo: "/images/profil/ketut.jpg",
    profileImage: "/images/company-profile/company-profile-pak-ketut.png",
    profileImageAlt: "Company Profile Ketut Sugiata, SE - Direktur Utama",
    bio: [
      "Lahir di Buleleng, Bali pada tanggal 14 Agustus 1967. Berkarir di BPR Hasa Mitra, Makassar sejak awal BPR berdiri tahun 2005 sampai Agustus 2018 dengan posisi yang dijabat diantaranya sebagai analis kredit dari tahun 2005 s.d 2009, sebagai Kepala Kantor Kas dari tahun 2009 s.d 2012, menjabat sebagai Manager HRD pada tahun 2013, kemudian pada tahun 2013 s.d 2014 sebagai Pjs Manager Kredit, Kepala Kantor Cabang Daya Tahun 2014, Kepala Kantor Cabang Bone dari tahun 2014 s.d 2017, sebagai Kepala Kantor Cabang Gowa dari tahun 2017 s.d 2018.",
      "Pernah bekerja di Bank Perniagaan dari tahun 1989 s.d 1993 sebagai petugas administrasi tabungan. Menyelesaikan pendidikan S-1 Program studi Manajemen di STIEM Bongaya, Makassar tahun 2012.",
    ],
  },
  {
    id: "budi",
    name: "PRIM BUDI SUSANTO",
    fullName: "Prim Budi Susanto SE, MM",
    position: "Direktur",
    category: "director",
    photo: "/images/profil/prim-budi.jpg",
    profileImage: "/images/company-profile/company-profil-pak-budi.png",
    profileImageAlt: "Company Profile Prim Budi Susanto SE, MM - Direktur",
    bio: [
      "Lahir di Klaten, tanggal 28 Oktober 1963. Berkarir di BPR Hasa Mitra, Makassar sejak tahun 2012 sampai Juli 2019 dengan beberapa posisi yang pernah dijabat antara lain; Manager bisnis tahun 2012 s.d tahun 2013, Manager Umum & SDM tahun 2014 s.d 2019.",
      "Mengawali karir di PT Bank Duta tahun 1990 s.d 1992, dengan jabatan terakhir sebagai Kepala kantor Kas. Pada tahun 1993 s.d 2000 bergabung di Bank Putera Multikarsa (likuidasi) dengan jabatan terakhir sebagai Deputy Branch Manager. BPPN tahun 2000 s.d 2001 jabatan kuasa kas.",
      "PT Kalla Intikarsa (kalla Grup) 2002 s.d 2003 HRD Manager. Mall GTC Makassar (lippo Grup) 2003 s.d 2010 jabatan Property Manager. PT Ramayana Lestari Sentosa 2010 s.d 2012 jabatan Property Manager.",
    ],
  },
];

export const commissioners = managementMembers.filter(
  (m) => m.category === "commissioner"
);

export const directors = managementMembers.filter(
  (m) => m.category === "director"
);
