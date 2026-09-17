import { notFound } from "next/navigation";
import Hero from "@/components/sections/Hero";
import NavMachine from "@/components/sections/NavMachine";
import { isLocale } from "@/lib/i18n";

/**
 * The home page is deliberately short: the hero, then the navigation.
 *
 * Every other part of the club lives on its own route — /about, /programs,
 * /divisions, /projects, /join. The site is hub-and-spoke: sub-pages do not link
 * to each other, you come back here and pick the next part.
 *
 * The navigation is an exploded technical diagram of one assembly, five parts,
 * one page each. See components/sections/NavMachine.tsx.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <Hero locale={locale} />
      <NavMachine locale={locale} />
    </>
  );
}
