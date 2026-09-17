import type { ReactNode } from "react";

/**
 * Join — a centred page.
 *
 * Re-mounts on navigation so the focus-in intro replays. See
 * app/[locale]/about/template.tsx for why this is a template and not a layout,
 * and globals.css "Page identity" for the keyframes.
 */
export default function JoinTemplate({ children }: { children: ReactNode }) {
  return <div className="page page--join">{children}</div>;
}
