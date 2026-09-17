import type { SiteContent } from "../types";

export const site = {
  nav: {
    about: "Tentang",
    divisions: "Divisi",
    projects: "Proyek",
    process: "Proses",
    join: "Gabung",
  },
  meta: {
    title: "Ingenium Society — Klub Teknik SMA Global Darussalam Academy",
    description:
      "Klub teknik SMA Global Darussalam Academy. Kami mengubah masalah nyata di sekitar kami menjadi solusi yang dirancang, dibangun, dan diuji sendiri oleh siswa.",
  },
  wip: "Dalam pengembangan",
  notFound: {
    code: "404",
    title: "Halaman tidak ditemukan",
    body: "Alamat yang kamu buka tidak ada di sini. Mungkin ada salah ketik, atau halamannya sudah dipindahkan.",
    cta: "Kembali ke navigasi",
  },
} satisfies SiteContent;
