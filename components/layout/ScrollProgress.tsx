"use client";

import { useEffect, useRef } from "react";

/**
 * Thin gold progress bar pinned to the top of the viewport.
 * rAF-throttled so scrolling stays on the compositor.
 */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const el = bar.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[100] h-0.5" aria-hidden="true">
      <div ref={bar} className="h-full w-0 bg-gold-500" />
    </div>
  );
}
