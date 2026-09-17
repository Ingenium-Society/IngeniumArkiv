import { notFound } from "next/navigation";
import PageIntro from "@/components/layout/PageIntro";
import Divisions from "@/components/sections/Divisions";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/page-meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return pageMetadata("divisions", params);
}

export default async function DivisionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <PageIntro locale={locale} slug="divisions" />
      <Divisions locale={locale} />
    </>
  );
}
