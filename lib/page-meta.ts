import { getNav } from "@/content";
import { isLocale } from "./i18n";

/**
 * Builds `generateMetadata` output for a sub-page from its nav entry, so the
 * five page files do not each repeat the locale guard and lookup.
 */
export async function pageMetadata(
  slug: string,
  params: Promise<{ locale: string }>,
) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const page = getNav(locale).pages.find((entry) => entry.slug === slug);
  return page ? { title: page.title, description: page.body } : {};
}
