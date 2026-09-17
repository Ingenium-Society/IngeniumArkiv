"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Pulls its child toward the cursor when the pointer comes within `padding` of
 * it, and releases smoothly on exit.
 *
 * Adapted from React Bits' "Magnet". Same `padding` / `strength` semantics
 * (higher strength = less movement), and the same active/inactive transitions.
 *
 * The base position is measured once per approach, not every frame — measuring
 * a transformed element would let the button drift toward the cursor and reduce
 * its own pull.
 *
 * Does nothing on touch devices or under `prefers-reduced-motion`.
 */
export default function Magnet({
  children,
  padding = 90,
  strength = 5,
  className = "",
}: {
  children: ReactNode;
  /** Distance in px around the element that activates the pull. */
  padding?: number;
  /** Higher values reduce the movement. */
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let frame = 0;
    let base: DOMRect | null = null;
    let pointerX = 0;
    let pointerY = 0;

    const apply = () => {
      frame = 0;

      const rect = base ?? (base = el.getBoundingClientRect());
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = pointerX - cx;
      const dy = pointerY - cy;
      const reach = Math.max(rect.width, rect.height) / 2 + padding;

      if (Math.hypot(dx, dy) < reach) {
        el.style.transition = "transform 0.3s ease-out";
        el.style.transform = `translate3d(${(dx / strength).toFixed(2)}px, ${(dy / strength).toFixed(2)}px, 0)`;
      } else if (el.style.transform !== "translate3d(0, 0, 0)" && el.style.transform !== "") {
        el.style.transition = "transform 0.5s ease-in-out";
        el.style.transform = "translate3d(0, 0, 0)";
        base = null;
      } else {
        base = null;
      }
    };

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [padding, strength]);

  return (
    <span
      ref={ref}
      className={`inline-flex will-change-transform ${className}`}
      style={{ transform: "translate3d(0, 0, 0)" }}
    >
      {children}
    </span>
  );
}
