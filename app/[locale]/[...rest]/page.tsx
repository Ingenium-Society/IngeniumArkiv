import { notFound } from "next/navigation";

/**
 * Catches every unmatched path inside a locale and hands it to the 404.
 *
 * This exists because of how Next resolves not-found boundaries: a
 * `not-found.tsx` in a segment renders when `notFound()` is *thrown inside that
 * segment*, but an unmatched URL is resolved against the **root** not-found —
 * which this project has no way to style, since the only layout that imports
 * globals.css lives at `app/[locale]/`. A root `not-found.tsx` would therefore
 * render with no stylesheet and no header at all.
 *
 * Matching the URL into the locale segment first makes the existing
 * `app/[locale]/not-found.tsx` reachable, and it then renders *inside* the
 * locale layout — so the 404 keeps the header, the locale, and the site's
 * styles. The middleware sends every locale-less path into the default locale,
 * so `/anything` lands here too.
 *
 * Nothing is rendered here on purpose: `notFound()` throws before this returns.
 */
export default function CatchAll() {
  notFound();
}
