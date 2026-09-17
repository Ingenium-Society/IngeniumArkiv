"use client";

import { useEffect, useRef } from "react";

/**
 * A field of gold dots that brighten and part around the pointer, kick when the
 * pointer moves fast, and ripple outward on click.
 *
 * Adapted from React Bits' "Dot Grid". Differences, all for performance:
 *
 *  - Dots are batched into ~10 alpha buckets, so a frame costs ~10 fills
 *    instead of one per dot (~1000 at a typical hero size).
 *  - The rAF loop stops when nothing is moving, instead of running forever.
 *  - It pauses when the tab is hidden or the canvas scrolls out of view.
 *  - Device pixel ratio is capped at 1.75.
 *  - On touch devices and under `prefers-reduced-motion` it draws the static
 *    field once and never starts a loop — no interaction, no cost.
 *
 * `pointer-events: none` throughout, so it can never intercept a click meant
 * for the hero content.
 */
const GAP = 34;
const RADIUS = 1.7;
const PROXIMITY = 130;
const PUSH = 14;
const DAMPING = 0.88;
const BASE_ALPHA = 0.09;
const ACTIVE_ALPHA = 0.6;
const MAX_DPR = 1.75;
const ALPHA_BUCKETS = 10;
const SHOCK_RADIUS = 260;
const IDLE_FRAMES = 30;

export default function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const interactive = !reduced && !coarse;

    let width = 0;
    let height = 0;
    let count = 0;
    let restX = new Float32Array(0);
    let restY = new Float32Array(0);
    let offX = new Float32Array(0);
    let offY = new Float32Array(0);

    let frame = 0;
    let running = false;
    let idle = 0;
    let visible = true;

    let pointerX = -9999;
    let pointerY = -9999;
    let pointerInside = false;

    let shockX = -9999;
    let shockY = -9999;
    let shockT = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const paths: Path2D[] = [];
      for (let b = 0; b < ALPHA_BUCKETS; b++) paths.push(new Path2D());

      const prox2 = PROXIMITY * PROXIMITY;

      for (let i = 0; i < count; i++) {
        let alpha = BASE_ALPHA;
        const x = restX[i] + offX[i];
        const y = restY[i] + offY[i];

        if (pointerInside) {
          const dx = x - pointerX;
          const dy = y - pointerY;
          const d2 = dx * dx + dy * dy;
          if (d2 < prox2) {
            const d = Math.sqrt(d2) || 1;
            const f = 1 - d / PROXIMITY;
            offX[i] += (dx / d) * PUSH * f * 0.18;
            offY[i] += (dy / d) * PUSH * f * 0.18;
            alpha = BASE_ALPHA + (ACTIVE_ALPHA - BASE_ALPHA) * f * f;
          }
        }

        if (shockT > 0) {
          const sdx = x - shockX;
          const sdy = y - shockY;
          const sd = Math.sqrt(sdx * sdx + sdy * sdy) || 1;
          const band = Math.abs(sd - shockT * SHOCK_RADIUS);
          if (band < 60) {
            const f = (1 - band / 60) * (1 - shockT);
            offX[i] += (sdx / sd) * 26 * f * 0.3;
            offY[i] += (sdy / sd) * 26 * f * 0.3;
            alpha = Math.min(ACTIVE_ALPHA, alpha + f * 0.5);
          }
        }

        offX[i] *= DAMPING;
        offY[i] *= DAMPING;

        const bucket = Math.min(
          ALPHA_BUCKETS - 1,
          Math.max(0, Math.round((alpha / ACTIVE_ALPHA) * (ALPHA_BUCKETS - 1))),
        );
        const path = paths[bucket];
        path.moveTo(x + RADIUS, y);
        path.arc(x, y, RADIUS, 0, Math.PI * 2);
      }

      for (let b = 0; b < ALPHA_BUCKETS; b++) {
        ctx.fillStyle = `rgba(184, 169, 93, ${((b / (ALPHA_BUCKETS - 1)) * ACTIVE_ALPHA).toFixed(3)})`;
        ctx.fill(paths[b]);
      }
    };

    const tick = () => {
      if (shockT > 0) {
        shockT += 0.035;
        if (shockT >= 1) shockT = 0;
      }

      draw();

      const busy = shockT > 0 || pointerInside;
      if (busy) {
        idle = 0;
      } else {
        idle += 1;
        if (idle > IDLE_FRAMES) {
          running = false;
          return;
        }
      }

      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || !interactive || !visible || document.hidden) return;
      running = true;
      idle = 0;
      frame = requestAnimationFrame(tick);
    };

    const resize = () => {
      // offsetWidth/Height are layout sizes, so the hero's parallax transform
      // cannot skew them the way it would skew getBoundingClientRect.
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.ceil(width / GAP) + 1;
      const rows = Math.ceil(height / GAP) + 1;
      count = cols * rows;
      restX = new Float32Array(count);
      restY = new Float32Array(count);
      offX = new Float32Array(count);
      offY = new Float32Array(count);

      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const i = r * cols + c;
          restX[i] = c * GAP + GAP / 2;
          restY[i] = r * GAP + GAP / 2;
        }
      }

      draw();
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
      pointerInside =
        pointerX >= -PROXIMITY &&
        pointerY >= -PROXIMITY &&
        pointerX <= width + PROXIMITY &&
        pointerY <= height + PROXIMITY;
      if (pointerInside) start();
    };

    const onPointerDown = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      shockX = event.clientX - rect.left;
      shockY = event.clientY - rect.top;
      if (shockX < -SHOCK_RADIUS || shockY < -SHOCK_RADIUS) return;
      if (shockX > width + SHOCK_RADIUS || shockY > height + SHOCK_RADIUS) return;
      shockT = 0.001;
      start();
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        if (frame) cancelAnimationFrame(frame);
      }
    };

    const onResize = () => {
      if (frame) cancelAnimationFrame(frame);
      running = false;
      resize();
    };

    resize();

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!visible) {
          running = false;
          if (frame) cancelAnimationFrame(frame);
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    if (interactive) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerdown", onPointerDown, { passive: true });
      window.addEventListener("resize", onResize);
      document.addEventListener("visibilitychange", onVisibility);
    }

    return () => {
      running = false;
      if (frame) cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
