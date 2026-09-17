import Image from "next/image";
import Link from "next/link";
import { getNav } from "@/content";
import { localePath, type Locale } from "@/lib/i18n";
import LocaleToggle from "./LocaleToggle";
import NavLinks from "./NavLinks";

export default function Header({ locale }: { locale: Locale }) {
  const { pages } = getNav(locale);

  // Built from the same nav content the 3D hub uses, so the header and the hub
  // can never disagree about which pages exist.
  const links: Array<[string, string]> = pages.map((page) => [
    localePath(locale, page.slug),
    page.label,
  ]);

  return (
    <header className="fixed inset-x-0 top-0 z-[90] border-b border-gold-500/15 bg-ink-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] w-full max-w-[1180px] items-center justify-between px-6">
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
