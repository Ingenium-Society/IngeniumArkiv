import Link from "next/link";
import { getNav } from "@/content";
import { localePath, type Locale } from "@/lib/i18n";

/**
 * Heading block shared by every sub-page: a return link, the page title, and a
 * one-line lead.
 *
 * The return link matters. The site is deliberately hub-and-spoke — sub-pages
 * do not link to each other — so without it the only way back to the navigator
 * would be the browser's back button, which is easy to lose after a couple of
 * hops or a refresh.
 *
 * `pt-[132px]` clears the 68px fixed header plus breathing room.
 *
 * `lead` overrides the content file's one-liner. Pass `null` to drop it
 * entirely: on /join the heading *is* the message ("Pendaftaran"), and the
 * body text there also has to double as the Gabung module's subtitle on the
 * navigator, so the two cannot be the same string.
 */
export default function PageIntro({
  locale,
  slug,
  lead,
}: {
  locale: Locale;
  slug: string;
  lead?: string | null;
}) {
  const { hub, pages } = getNav(locale);
  const page = pages.find((entry) => entry.slug === slug);
  if (!page) return null;

  const text = lead === undefined ? page.body : lead;

  return (
    <header className="border-b border-gold-500/12 bg-ink-950 pt-[132px] pb-16">
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <Link
          href={localePath(locale)}
          className="mb-10 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-ink-400 uppercase transition-colors duration-200 hover:text-gold-400"
        >
          <svg
            viewBox="0 0 16 16"
            className="h-[14px] w-[14px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            <path d="M13 8H3M7 4L3 8l4 4" />
          </svg>
          {hub.back}
        </Link>

        <h1 className="mb-4 text-[clamp(2rem,5vw,3.2rem)] leading-[1.08] font-semibold tracking-[-0.025em] text-white">
          {page.title}
        </h1>
        {text ? (
          <p className="max-w-[620px] text-[clamp(1rem,2vw,1.15rem)] text-ink-200">
            {text}
          </p>
        ) : null}
      </div>
    </header>
  );
}
