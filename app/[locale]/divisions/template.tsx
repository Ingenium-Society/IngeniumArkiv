import type { ReactNode } from "react";

/**
 * Divisions — an iris page.
 *
 * Re-mounts on navigation so the circular reveal replays. See
 * app/[locale]/about/template.tsx for why this is a template and not a layout,
 * and globals.css "Page identity" for the keyframes.
 */
export default function DivisionsTemplate({ children }: { children: ReactNode }) {
  return <div className="page page--divisions">{children}</div>;
}
