import { notFound } from "next/navigation";
import PageIntro from "@/components/layout/PageIntro";
import Join from "@/components/sections/Join";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/page-meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return pageMetadata("join", params);
}

export default async function JoinPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <PageIntro locale={locale} slug="join" />
      <Join locale={locale} />
    </>
  );
}
