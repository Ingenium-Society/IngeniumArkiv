import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/lib/i18n";

/**
 * Next.js 16 renamed the `middleware` convention to `proxy`.
 *
 * Sends bare paths to the default locale, so `/` lands on the default.
 * Anything already carrying a locale passes straight through — with the locale
 * attached as a request header, because `not-found.tsx` cannot read route
 * params and the 404 has to know which language to render in.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const locale = locales.find(
    (entry) => pathname === `/${entry}` || pathname.startsWith(`/${entry}/`),
  );

  if (!locale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url, 308);
  }

  const headers = new Headers(request.headers);
  headers.set("x-locale", locale);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
