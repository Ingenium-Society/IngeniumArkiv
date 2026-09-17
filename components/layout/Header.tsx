import Image from "next/image";
import Link from "next/link";
import { getNav, getSite } from "@/content";
import { localePath, type Locale } from "@/lib/i18n";
import LocaleToggle from "./LocaleToggle";
import NavLinks from "./NavLinks";

export default function Header({ locale }: { locale: Locale }) {
  const { pages } = getNav(locale);
  const { wip } = getSite(locale);

  // Built from the same nav content the 3D hub uses, so the header and the hub
  // can never disagree about which pages exist.
  const links: Array<[string, string]> = pages.map((page) => [
    localePath(locale, page.slug),
    page.label,
  ]);

  return (
    <header className="fixed inset-x-0 top-0 z-[90] border-b border-gold-500/15 bg-ink-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] w-full max-w-[1180px] items-center justify-between px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link href={`/${locale}`} aria-label="Ingenium Society Club" className="shrink-0">
            <Image
              src="/logo/logo-lockup-light.png"
              alt="Ingenium Society"
              width={480}
              height={94}
              priority
              className="h-[34px] w-auto"
            />
          </Link>

          {/* The "not finished yet" marker. A chip rather than a banner: it has
              to be on every page, and a full-width strip would push down the
              two hand-tuned offsets the fixed header depends on
              (`pt-[132px]` on sub-pages, `pt-[68px]` on the navigator).
              Hidden below `sm`, where the header has no room for it. */}
          <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-gold-500/30 px-2 py-[3px] font-mono text-[10px] tracking-[0.12em] text-gold-300/90 uppercase sm:inline-flex">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-gold-500 animate-pulse"
            />
            {wip}
          </span>
        </div>

        <NavLinks links={links} />

        <div className="flex items-center gap-3.5">
          <LocaleToggle locale={locale} />
          <button
            type="button"
            aria-label="Menu"
            className="flex flex-col gap-1 p-2 lg:hidden"
          >
            <span className="block h-px w-5 bg-ink-200" />
            <span className="block h-px w-5 bg-ink-200" />
            <span className="block h-px w-5 bg-ink-200" />
          </button>
        </div>
      </div>
    </header>
  );
}
