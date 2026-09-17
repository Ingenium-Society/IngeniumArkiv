/**
 * English first. The order is not cosmetic: it is the order the locale toggle
 * renders in, and `defaultLocale` is where a bare path lands — so `/` now goes
 * to `/en`. Indonesian is still fully built and one click away.
 */
export const locales = ["en", "id"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Builds a locale-prefixed path.
 * `localePath("id")` → `/id` · `localePath("id", "about")` → `/id/about`
 */
export function localePath(locale: Locale, slug?: string): string {
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}
