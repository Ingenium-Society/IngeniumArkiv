"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSite } from "@/content";
import { defaultLocale, isLocale, localePath } from "@/lib/i18n";

/**
 * The 404, as a page rather than a fallback.
 *
 * It was Next's built-in — "404: This page could not be found." with no header,
 * no navigation and no way back — which is a poor ending for a site whose whole
 * idea is that you navigate between pages. This one keeps the site's chrome
 * (the layout wraps it), carries its own `.page--lost` identity and intro, and
 * offers the one useful action: back to the navigator.
 *
 * A **client** component for one reason: `not-found.tsx` is not handed the
 * route params, so the locale cannot be read from props. `usePathname()` gives
 * it directly, and the component is still server-rendered on first paint.
 *
 * The middleware sends every locale-less path into the default locale, so
 * `/anything` arrives here as `/id/anything` — this catches typos at the root
 * as well as inside a locale.
 */
export default function NotFound() {
  const pathname = usePathname();
  const first = pathname.split("/").filter(Boolean)[0] ?? "";
  const locale = isLocale(first) ? first : defaultLocale;
  const { notFound } = getSite(locale);

  return (
    <div className="page page--lost">
      <section className="relative flex min-h-[100svh] items-center pt-[68px]">
        <div className="mx-auto w-full max-w-[1180px] px-6">
          <div className="max-w-[620px]">
            {/* A watermark, not a headline — the eye should land on the
                sentence first and the numeral second. */}
            <span className="page-lost__code" aria-hidden="true">
              {notFound.code}
            </span>

            <h1 className="mt-6 mb-4 text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-white">
              {notFound.title}
            </h1>
            <p className="mb-8 leading-[1.75] text-ink-300">{notFound.body}</p>

            <Link
              href={localePath(locale)}
              className="inline-flex items-center gap-2.5 rounded-lg bg-gold-500 px-[26px] py-[14px] text-sm font-semibold text-ink-950 transition-colors duration-[250ms] ease-brand hover:bg-gold-400"
            >
              {notFound.cta}
              <svg
                viewBox="0 0 16 16"
                className="h-[15px] w-[15px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M13 8H3M7 4L3 8l4 4" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
