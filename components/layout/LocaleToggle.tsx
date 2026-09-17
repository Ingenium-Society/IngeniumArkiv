"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

/**
 * Swaps the locale segment while preserving the rest of the path, so
 * /id/projects/attendance-recorder becomes /en/projects/attendance-recorder.
 */
export default function LocaleToggle({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(id|en)(?=\/|$)/, "");

  return (
    <div
      className="flex shrink-0 overflow-hidden rounded-full border border-gold-500/30"
      role="group"
      aria-label="Language"
    >
      {locales.map((code) => {
        const active = code === locale;
        return (
          <Link
            key={code}
            href={`/${code}${rest}`}
            hrefLang={code}
            aria-current={active ? "true" : undefined}
            className={
              "px-3 py-1.5 font-mono text-[11px] tracking-[0.1em] transition-colors duration-200 " +
              (active
                ? "bg-gold-500 font-semibold text-ink-950"
                : "text-ink-300 hover:bg-gold-500/10 hover:text-gold-400")
            }
          >
            {code.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
