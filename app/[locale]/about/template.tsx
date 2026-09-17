import type { ReactNode } from "react";

/**
 * About — a blueprint page.
 *
 * A `template.tsx` rather than a `layout.tsx` on purpose: templates re-mount on
 * every navigation, so the intro animation on `.page--about` replays each time
 * you arrive, which is the whole point. A layout would persist and animate once.
 *
 * One template per route, and no two of them share an animation — the
 * keyframes live in globals.css under "Page identity".
 */
export default function AboutTemplate({ children }: { children: ReactNode }) {
  return <div className="page page--about">{children}</div>;
}
