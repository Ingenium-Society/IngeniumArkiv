"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * A radial highlight that follows the cursor inside its bounds.
 *
 * Adapted from React Bits' "Spotlight Card". Same idea and a similar default
 * glow colour, but implemented with two CSS custom properties (`--mx` / `--my`)
 * updated from a rAF-throttled pointer listener — no React state, so the cursor
 * never triggers a re-render.
 *
 * The glow itself is a `::after` pseudo-element defined in globals.css, so the
 * effect costs one element and no paint outside the button.
 *
 * Inert on touch devices and under `prefers-reduced-motion`.
 */
export default function Spotlight({
  children,
  className = "",
  variant = "light",
}: {
  children: ReactNode;
  className?: string;
  /** `light` for the solid gold button, `gold` for the outlined one. */
  variant?: "light" | "gold";
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const apply = () => {
      frame = 0;
      el.style.setProperty("--mx", `${x.toFixed(1)}px`);
      el.style.setProperty("--my", `${y.toFixed(1)}px`);
    };

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    el.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      el.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <span
      ref={ref}
      className={`spotlight ${variant === "gold" ? "spotlight--gold" : ""} ${className}`}
    >
      {children}
    </span>
  );
}
