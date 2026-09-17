import type { ReactNode } from "react";

/**
 * Programmes — a ledger page.
 *
 * Re-mounts on navigation so the left-to-right intro replays. See
 * app/[locale]/about/template.tsx for why this is a template and not a layout,
 * and globals.css "Page identity" for the keyframes.
 */
export default function ProgramsTemplate({ children }: { children: ReactNode }) {
  return <div className="page page--programs">{children}</div>;
}
