import type { ProjectsContent } from "../types";

export const projects = {
  items: [
    {
      slug: "attendance-recorder",
      title: "Attendance Recorder",
      division: "Mechatronics",
      divisionId: "mechatronics",
      phase: "Prototyping",
      body: "RFID/NFC attendance recording that replaces manual roll-call at residential assemblies.",
      features: [
        "RFID/NFC card reader linked to a single central microcontroller",
        "PIN-based attendance as a fallback when a card fails to read",
        "Timestamped records sent straight to a Google Sheet over Wi-Fi",
      ],
      resources: [
        "ESP32 / Arduino Wi-Fi",
        "RC522 RFID modules & student ID tags",
        "OLED display & buzzer",
        "3D-printed or DIY casing",
        "Power bank / 12V adapter",
        "Soldering kit & jumper wires",
      ],
    },
    {
      slug: "house-website",
      title: "House Website",
      division: "Software & AI",
      divisionId: "software-ai",
      phase: "Design",
      body: "A central platform for house points, seasons, history and events.",
      features: [
        "Live leaderboard, organised by season and term",
        "History log of past events and point records",
        "Role-based point entry: prefects log, students view only",
        "Gallery showcasing each house's events",
      ],
      resources: [
        "React + Vite + TypeScript",
        "FastAPI",
        "Supabase (Postgres + authentication)",
        "Cloudinary",
        "Vercel / Netlify & Render / Railway",
      ],
    },
  ],
} satisfies ProjectsContent;
