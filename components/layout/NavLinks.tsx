"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Header navigation.
 *
 * This used to be a scroll-spy for on-page anchors. Now that every destination
 * is its own route, the active state comes from the pathname instead — no
 * IntersectionObserver, no scroll listener.
 *
 * Active styling is the same as before: gold text plus a persistent underline.
 * Hidden below `lg`, where the nav collapses to the menu button.
 */
export default function NavLinks({ links }: { links: Array<[string, string]> }) {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-7 lg:flex">
      {links.map(([href, label]) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={
              "group relative py-1 text-sm transition-colors duration-200 " +
              (isActive ? "text-gold-400" : "text-ink-200 hover:text-gold-400")
            }
          >
            {label}
            <span
              aria-hidden="true"
              className={
                "absolute inset-x-0 bottom-0 h-px origin-left bg-gold-500 transition-transform duration-300 ease-brand " +
                (isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100")
              }
            />
          </Link>
        );
      })}
    </nav>
  );
}
