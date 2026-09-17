import type { ProjectsContent } from "../types";

export const projects = {
  items: [
    {
      slug: "attendance-recorder",
      title: "Attendance Recorder",
      division: "Mechatronics",
      divisionId: "mechatronics",
      phase: "Prototipe",
      body: "Pencatat kehadiran berbasis RFID/NFC yang menggantikan pemeriksaan manual saat apel asrama.",
      features: [
        "Pembaca kartu RFID/NFC terhubung ke satu mikrokontroler pusat",
        "Kehadiran berbasis PIN sebagai cadangan bila kartu gagal terbaca",
        "Data bertimestamp langsung dikirim ke Google Sheet lewat Wi-Fi",
      ],
      resources: [
        "ESP32 / Arduino Wi-Fi",
        "Modul RFID RC522 & tag kartu siswa",
        "Layar OLED & buzzer",
        "Casing cetak 3D / rakitan sendiri",
        "Power bank / adaptor 12V",
        "Kit soldering & kabel jumper",
      ],
    },
    {
      slug: "house-website",
      title: "House Website",
      division: "Software & AI",
      divisionId: "software-ai",
      phase: "Desain",
      body: "Platform terpusat untuk poin, musim, riwayat, dan acara antar rumah asrama.",
      features: [
        "Papan peringkat langsung, diatur per musim dan semester",
        "Riwayat acara dan catatan poin dari musim-musim sebelumnya",
        "Input poin berbasis peran: prefek mencatat, siswa hanya melihat",
        "Galeri yang menampilkan acara tiap rumah",
      ],
      resources: [
        "React + Vite + TypeScript",
        "FastAPI",
        "Supabase (Postgres + autentikasi)",
        "Cloudinary",
        "Vercel / Netlify & Render / Railway",
      ],
    },
  ],
} satisfies ProjectsContent;
