import type { HomeContent } from "../types";

export const home = {
  hero: {
    eyebrow: "SMA Global Darussalam Academy · Yogyakarta",
    titleLead: "From Ideation, ",
    titleAccent: "Into Creations",
    lead: "Klub teknik SMA Global Darussalam Academy. Kami mengubah masalah nyata di sekitar kami menjadi solusi yang dirancang, dibangun, dan diuji sendiri oleh siswa.",
    ctaPrimary: "Gabung klub",
    ctaSecondary: "Lihat proyek",
    scroll: "Gulir",
  },

  stats: [
    { id: "members", value: 23, label: "Anggota aktif" },
    { id: "divisions", value: 4, label: "Divisi teknik" },
    { id: "projects", value: 2, label: "Proyek perdana" },
    { id: "founded", value: 2026, from: 2000, label: "Tahun berdiri" },
  ],

  programs: {
    kicker: "Program",
    title: "Apa yang kami lakukan",
    lead: "Tiga program yang berjalan sepanjang tahun — dari menjangkau sekolah mitra, sampai proyek yang benar-benar diterapkan.",
    items: [
      {
        id: "forge-outreach",
        meta: "Sekali per semester",
        title: "Forge Outreach",
        body: "Mengundang siswa SD dan SMP mitra ke GDA untuk workshop singkat yang dipandu anggota klub: mesin sederhana, robotika sederhana, dasar komputer, dan mekanika kompleks.",
      },
      {
        id: "the-workbench",
        meta: "Dua minggu sekali · Minggu 08.30–11.30",
        title: "The Workbench",
        body: "Anggota mengajukan ide proyek, lalu membentuk kelompok sesuai minat. Setiap kelompok menyusun ruang lingkup bersama Leader dan pembina sebelum mulai membangun.",
      },
      {
        id: "trial-and-iteration",
        meta: "Target 1–2 proyek per semester",
        title: "Trial & Iteration",
        body: "Tim mengembangkan, membuat prototipe, menguji, dan mengulang. Proyek yang memenuhi kriteria dapat diterapkan di sekolah atau diikutsertakan kompetisi. Proyek yang belum sampai implementasi tetap terdokumentasi sebagai pengalaman belajar.",
      },
    ],
  },

  divisions: {
    kicker: "Struktur",
    title: "Empat divisi",
    lead: "Setiap anggota bergabung dengan satu divisi. Divisi boleh berkolaborasi lintas bidang pada proyek yang membutuhkannya.",
    leadLabel: "Kepala divisi",
  },

  projects: {
    kicker: "Proyek",
    title: "Yang sedang kami bangun",
    lead: "Setiap proyek didokumentasikan dari ide sampai hasil akhir — termasuk yang berhenti di tengah jalan.",
    featuresLabel: "Fungsi",
    resourcesLabel: "Kebutuhan",
  },

  join: {
    line: "Pendaftaran dibuka.",
    cta: "Buka formulir pendaftaran",
  },

  about: {
    kicker: "Latar belakang",
    title: "Kenapa klub ini ada",
    paragraphs: [
      "Sebelumnya belum ada wadah resmi bagi siswa yang tertarik pada teknik untuk menyalurkan minat mereka secara terstruktur dan berkelanjutan. Banyak bagian dari lingkungan sekolah yang masih bisa diperbaiki — fasilitas, alat bantu belajar, dan hal-hal lain yang bisa dikembangkan lewat pendekatan teknik.",
      "Ingenium Society Club hadir sebagai wadah itu: tempat siswa mengasah keterampilan teknis melalui satu rangkaian proses, dari menemukan kebutuhan dan merancang solusi sampai menerapkannya langsung di lingkungan sekolah.",
      "Tujuan utama kami adalah belajar teknik lewat proyek nyata. Keberhasilan diukur dari proses dan refleksi yang terdokumentasi, bukan dari apakah setiap proyek selesai diterapkan.",
    ],
    objectivesTitle: "Empat tujuan klub",
    objectives: [
      {
        id: "platform",
        title: "Wadah resmi",
        body: "Menyediakan wadah resmi bagi siswa untuk mengembangkan minat dan keterampilan teknik melalui proyek nyata.",
      },
      {
        id: "implemented",
        title: "Solusi yang dipakai",
        body: "Meningkatkan jumlah solusi atau proyek rancangan siswa yang benar-benar diterapkan di lingkungan sekolah.",
      },
      {
        id: "facilities",
        title: "Perbaikan fasilitas",
        body: "Mengoptimalkan potensi perbaikan fasilitas dan kebutuhan siswa melalui pendekatan teknik yang terstruktur.",
      },
      {
        id: "sustainability",
        title: "Keberlanjutan",
        body: "Membangun struktur organisasi klub yang jelas dan berkelanjutan agar kegiatan tetap berjalan lintas angkatan.",
      },
    ],
  },
} satisfies HomeContent;
