import { notFound } from "next/navigation";
import PageIntro from "@/components/layout/PageIntro";
import Programs from "@/components/sections/Programs";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/page-meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return pageMetadata("programs", params);
}

export default async function ProgramsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <PageIntro locale={locale} slug="programs" />
      <Programs locale={locale} />
    </>
  );
}
