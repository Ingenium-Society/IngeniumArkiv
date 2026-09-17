"use client";

import { useEffect, useRef } from "react";

/**
 * Tilts the hero's 3D scene toward the pointer.
 *
 * Sets `--tx` / `--ty` (degrees) on the `[data-tilt-scene]` element inside the
 * nearest `<section>`. The CSS turns those into `rotateX` / `rotateY`, which —
 * combined with `perspective` on the section and `translateZ` depths on the
 * background layers — produces real parallax between the layers, not just a
 * uniform skew.
 *
 * The value is **lerped** toward the target each frame rather than snapped, so
 * the scene drifts after the cursor and settles instead of jittering. The rAF
 * loop stops once it has caught up, so an idle page costs nothing.
 *
 * Angles are deliberately small (5° / 3.2°). More than that and the headline
 * starts to look bent rather than placed in space.
 *
 * Skipped entirely on coarse pointers and under `prefers-reduced-motion`.
 */
const MAX_Y = 5;
const MAX_X = 3.2;
const EASE = 0.085;

export default function HeroTilt() {
  const anchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = anchor.current;
    if (!node) return;

    const section = node.closest("section");
    const scene = section?.querySelector<HTMLElement>("[data-tilt-scene]");
    if (!section || !scene) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let frame = 0;
    let running = false;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;

    const write = () => {
      scene.style.setProperty("--tx", `${x.toFixed(3)}deg`);
      scene.style.setProperty("--ty", `${y.toFixed(3)}deg`);
    };

    const tick = () => {
      x += (targetX - x) * EASE;
      y += (targetY - y) * EASE;

      const settled = Math.abs(targetX - x) < 0.01 && Math.abs(targetY - y) < 0.01;
      if (settled) {
        x = targetX;
        y = targetY;
        write();
        running = false;
        return;
      }

      write();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      // Outside the hero — including once it has scrolled away — ease back level.
      if (!inside) {
        targetX = 0;
        targetY = 0;
        start();
        return;
      }

      const nx = (event.clientX - rect.left) / rect.width;
      const ny = (event.clientY - rect.top) / rect.height;
      targetY = (nx - 0.5) * 2 * MAX_Y;
      targetX = (0.5 - ny) * 2 * MAX_X;
      start();
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <span ref={anchor} className="hidden" aria-hidden="true" />;
}
