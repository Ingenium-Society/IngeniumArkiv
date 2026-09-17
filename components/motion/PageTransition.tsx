"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * The page-to-page transition layer.
 *
 * Every route swap plays one short sweep over the viewport, and the sweep is
 * **different per destination** — a downward wipe into the home page, a
 * left-to-right one into About, three bands into Programmes, an iris into
 * Divisions, a scanline into Projects, a centre curtain into Join. See
 * `data-variant` in globals.css.
 *
 * Four deliberate properties:
 *
 *   - **It never intercepts a click.** The overlay is `pointer-events: none`
 *     and navigation is left entirely to `next/link`. The alternative — holding
 *     the click, playing an exit animation, then routing — buys a true exit
 *     transition at the cost of owning navigation, and a bug there breaks the
 *     whole site. The sweep therefore plays *over* the arriving page rather
 *     than covering its departure, which is also why every page carries its own
 *     intro animation: the sweep masks the swap, the intro sells the arrival.
 *   - **It does not fire on the first load.** That moment belongs to the door
 *     intro in the same layout; two overlays at once is a mess. `data-armed`
 *     is set only once the pathname has actually changed, and the CSS only
 *     carries an `animation` when it is.
 *   - **`key={pathname}` restarts it.** React remounts the element on every
 *     route change, so the sweep replays with no JS animation bookkeeping.
 *   - **Reduced motion removes it.** The reduced-motion block in globals.css
 *     sets `display: none`, rather than relying on the global 0.001ms trick,
 *     which would still flash a full-viewport panel for a frame.
 */
const VARIANTS: Record<string, string> = {
  about: "about",
  programs: "programs",
  divisions: "divisions",
  projects: "projects",
  join: "join",
};

export default function PageTransition() {
  const pathname = usePathname();

  /* The pathname this component first rendered with. A ref, not state: it must
     not trigger a render, and it must match between server and client so the
     initial HTML is identical on both. */
  const initial = useRef(pathname);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (pathname !== initial.current) setArmed(true);
  }, [pathname]);

  /* /id/about → "about"; /id → "home". The locale is always the first segment,
     so the variant is the second one, if there is one. A second segment that is
     not a known page is a 404, and gets the glitch sweep. */
  const segment = pathname.split("/").filter(Boolean)[1] ?? "";
  const variant = VARIANTS[segment] ?? (segment ? "lost" : "home");

  return (
    <div
      key={pathname}
      className="page-transition"
      data-variant={variant}
      data-armed={armed ? "on" : undefined}
      aria-hidden="true"
    >
      <span className="page-transition__panel" />
      <span className="page-transition__edge" />
    </div>
  );
}
