export const locales = ["id", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "id";

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
