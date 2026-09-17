import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import Header from "@/components/layout/Header";
import ScrollProgress from "@/components/layout/ScrollProgress";
import { getSite } from "@/content";
import { isLocale, locales } from "@/lib/i18n";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

const jbmono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jbmono",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const { meta } = getSite(locale);

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: meta.title,
    description: meta.description,
    icons: { icon: "/logo/favicon.png" },
    alternates: {
      canonical: `/${locale}`,
      languages: { id: "/id", en: "/en" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    /*
     * suppressHydrationWarning: the inline script in <body> adds `intro-seen`
     * to this element during HTML parsing, before React hydrates. React then
     * finds a class it did not render and would log a mismatch. The class is
     * intentional and must survive, so the difference is suppressed here —
     * this is the same pattern Next.js documents for pre-hydration theme
     * scripts. It applies to this element only, not to children.
     */
    <html
      lang={locale}
      className={`${inter.variable} ${grotesk.variable} ${jbmono.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/*
          Runs during HTML parsing, before the intro element exists — so a
          returning visitor gets the `intro-seen` class on <html> in time for
          the CSS to hide the doors on first paint. A React state check would
          run after hydration and flash them first.

          First visit sets the flag; later visits in the same tab read it.
          Wrapped in try/catch because sessionStorage throws in some privacy
          modes — in that case the intro simply plays every time.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('ingenium-intro-seen')){document.documentElement.classList.add('intro-seen')}else{sessionStorage.setItem('ingenium-intro-seen','1')}}catch(e){}",
          }}
        />
        {/* Scroll-reveal hides content until JS runs, and the About rules only
            draw in on the `is-in` class. Without this, a visitor with
            JavaScript disabled would see a blank page and no rules.

            The exploded navigation is not in here: its settled state is the
            plain CSS state, so it is already correct with JS off. */}
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              "<style>.reveal{opacity:1 !important;transform:none !important}.draw-rule{transform:none !important}</style>",
          }}
        />
        <ScrollProgress />
        <Header locale={locale} />
        <main>{children}</main>
      </body>
    </html>
  );
}
