import type { NavHubContentSet } from "../types";

export const nav = {
  hub: {
    kicker: "Navigasi",
    title: "Mau ke mana?",
    lead: "Setiap bagian klub ini punya halamannya sendiri. Untuk berpindah, kembali ke halaman ini dulu, lalu pilih modul berikutnya.",
    hint: "Klik modul untuk membuka halamannya",
    drag: "Seret untuk memutar model",
    back: "Kembali ke navigasi",
  },
  pages: [
    {
      id: "about",
      slug: "about",
      label: "Tentang",
      title: "Tentang klub",
      body: "Latar belakang, tujuan, dan angka-angka klub.",
    },
    {
      id: "programs",
      slug: "programs",
      label: "Program",
      title: "Program klub",
      body: "Tiga program yang berjalan sepanjang tahun.",
    },
    {
      id: "divisions",
      slug: "divisions",
      label: "Divisi",
      title: "Divisi teknik",
      body: "Empat divisi dan kepala divisinya.",
    },
    {
      id: "projects",
      slug: "projects",
      label: "Proyek",
      title: "Proyek berjalan",
      body: "Yang sedang kami bangun semester ini.",
    },
    {
      id: "join",
      slug: "join",
      label: "Gabung",
      title: "Pendaftaran",
      /* The page hides this line — see PageIntro's `lead` prop. It survives as
         the subtitle under the Gabung module on the 3D navigator, so it has to
         describe the page, not the three steps it used to list. */
      body: "Pendaftaran lewat formulir online.",
    },
  ],
} satisfies NavHubContentSet;
