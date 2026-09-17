import type { ReactNode } from "react";

/**
 * Projects — a scanline page.
 *
 * Re-mounts on navigation so the downward scan replays. See
 * app/[locale]/about/template.tsx for why this is a template and not a layout,
 * and globals.css "Page identity" for the keyframes.
 */
export default function ProjectsTemplate({ children }: { children: ReactNode }) {
  return <div className="page page--projects">{children}</div>;
}
