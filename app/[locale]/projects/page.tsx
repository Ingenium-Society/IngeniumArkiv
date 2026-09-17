import { notFound } from "next/navigation";
import PageIntro from "@/components/layout/PageIntro";
import Projects from "@/components/sections/Projects";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/page-meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return pageMetadata("projects", params);
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <PageIntro locale={locale} slug="projects" />
      <Projects locale={locale} />
    </>
  );
}
