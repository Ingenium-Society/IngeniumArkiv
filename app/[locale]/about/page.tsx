import { notFound } from "next/navigation";
import PageIntro from "@/components/layout/PageIntro";
import About from "@/components/sections/About";
import StatStrip from "@/components/sections/StatStrip";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/page-meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return pageMetadata("about", params);
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <PageIntro locale={locale} slug="about" />
      <About locale={locale} />
      <StatStrip locale={locale} />
    </>
  );
}
