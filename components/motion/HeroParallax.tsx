"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-linked parallax for the hero layers.
 *
 * Each element carrying `data-parallax="<speed>"` inside the nearest `<section>`
 * is translated by `scrollY * speed`, clamped to ±max.
 *
 * Positive speed makes a layer lag behind the page — it drifts down as you
 * scroll, which reads as "further away". Negative makes it lead. Layers are
 * staggered so the circuit sits furthest back and the content nearest.
 *
 * Layers that cover the whole hero (the circuit and dot field) are given extra
 * height in Hero.tsx so translating them cannot expose a gap at the top edge.
 *
 * Transform only — no layout is touched. Skipped entirely under
 * `prefers-reduced-motion`, and paused while the hero is off screen.
 */
export default function HeroParallax({ max = 110 }: { max?: number }) {
  const anchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = anchor.current;
    if (!node) return;

    const root = node.closest("section");
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layers = Array.from(
      root.querySelectorAll<HTMLElement>("[data-parallax]"),
    ).filter((layer) => Number(layer.dataset.parallax) !== 0);

    if (layers.length === 0) return;

    let frame = 0;
    let active = true;

    const update = () => {
      frame = 0;
      if (!active) return;

      const y = window.scrollY;
      for (const layer of layers) {
        const speed = Number(layer.dataset.parallax);
        if (!speed) continue;
        const offset = Math.max(-max, Math.min(max, y * speed));
        layer.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active) schedule();
      },
      { threshold: 0 },
    );
    io.observe(root);

    update();
    window.addEventListener("scroll", schedule, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [max]);

  return <span ref={anchor} className="hidden" aria-hidden="true" />;
}
