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
      {/* No lead line: the heading is the whole message on this page, and the
          content file's one-liner is doing duty as the Gabung module subtitle
          on the navigator. See PageIntro's `lead` prop. */}
      <PageIntro locale={locale} slug="join" lead={null} />
      <Join locale={locale} />
    </>
  );
}
