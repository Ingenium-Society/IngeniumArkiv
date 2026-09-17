"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Counts up to `to` once, when it first scrolls into view.
 *
 * The **server renders the final value**, so the figure is correct with
 * JavaScript disabled. On the client the value is reset to `from` in a layout
 * effect — before the browser paints — which avoids the visible jump from the
 * final number down to zero and back up.
 *
 * `useLayoutEffect` warns during server rendering, so the server branch falls
 * back to `useEffect`; that branch never runs anyway.
 */
const useSafeLayoutEffect =
  typeof document !== "undefined" ? useLayoutEffect : useEffect;

export default function CountUp({
  to,
  from = 0,
  duration = 1300,
}: {
  to: number;
  from?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useSafeLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setValue(from);
  }, [from]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let start: number | null = null;

    const step = (now: number) => {
      if (start === null) start = now;
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (p < 1) frame = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        frame = requestAnimationFrame(step);
        io.disconnect();
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [to, from, duration]);

  return <span ref={ref}>{value}</span>;
}
