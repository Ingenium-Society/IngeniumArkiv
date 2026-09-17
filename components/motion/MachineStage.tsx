"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { animate, stagger, type Target } from "animejs";

/**
 * Drives the entrance of the navigation machine in sections/NavMachine.tsx.
 *
 * Choreography, in order:
 *   1. the barrel is collapsed onto the axis — every section pulled down to the
 *      flange, before the first paint
 *   2. on scroll into view, the sections rise into their places in the stack,
 *      staggered from the bottom up, while the ground plane fades in
 *   3. once settled, each section breathes a few pixels along the axis, out of
 *      phase with its neighbours
 *
 * The turning of the sections is *not* here — that is a CSS keyframe on the SVG,
 * because it never stops and the compositor handles it for free. See `gear-spin`
 * in globals.css.
 *
 * **Transform only, except on the ground.** `opacity` below 1 is a grouping
 * property: it forces `transform-style` to compute to `flat`, and a flattened
 * section loses its barrel — the whole stack would go flat and papery for the
 * duration of the entrance. So the only thing that fades is the ground plane,
 * which is a leaf with nothing of its own to flatten. Same trap the hero
 * documents around `will-change`.
 *
 * The CSS holds the **settled** state, not the collapsed one, so the machine is
 * already correct with JavaScript disabled and under reduced motion. That is why
 * the collapse is replayed in a layout effect rather than written into the
 * stylesheet — and why this bails out *before* touching anything when reduced
 * motion is on. Same reasoning as CountUp's reset-to-zero.
 */
const useSafeLayoutEffect =
  typeof document !== "undefined" ? useLayoutEffect : useEffect;

const COLLAPSED_SCALE = 0.25;
const COLLAPSED_Z = -140;

/** A section's resting height on the assembly axis, from its own markup. */
const zOf = (el?: Target) =>
  Number((el as HTMLElement | undefined)?.dataset?.z ?? 0);

export default function MachineStage() {
  const anchor = useRef<HTMLSpanElement>(null);

  useSafeLayoutEffect(() => {
    const root = anchor.current?.closest("section");
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    for (const el of root.querySelectorAll<HTMLElement>("[data-unit]")) {
      el.style.transform = `translate3d(0px, 0px, ${COLLAPSED_Z}px) scale(${COLLAPSED_SCALE})`;
    }
    for (const layer of root.querySelectorAll<HTMLElement>("[data-fade]")) {
      layer.style.opacity = "0";
    }
  }, []);

  useEffect(() => {
    const root = anchor.current?.closest("section");
    if (!root) return;

    const units = Array.from(root.querySelectorAll<HTMLElement>("[data-unit]"));
    if (units.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const fades = Array.from(root.querySelectorAll<HTMLElement>("[data-fade]"));

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        animate(fades, {
          opacity: [0, 1],
          duration: 900,
          ease: "outQuad",
        });

        animate(units, {
          /* Explicit from→to pairs. Reading a composed transform back out of the
             DOM is the fragile part of animating it, so it is avoided. */
          translateZ: [COLLAPSED_Z, zOf],
          scale: [COLLAPSED_SCALE, 1],
          duration: 1150,
          delay: stagger(120, { start: 240 }),
          ease: "outExpo",
          onComplete: () => {
            animate(units, {
              translateZ: (el?: Target, index?: number) => [
                zOf(el),
                zOf(el) + 6 + (index ?? 0) * 1.5,
              ],
              scale: 1,
              duration: (el?: Target, index?: number) => 5200 + (index ?? 0) * 700,
              direction: "alternate",
              loop: true,
              ease: "inOutSine",
            });
          },
        });
      },
      { threshold: 0.2 },
    );

    io.observe(root);
    return () => io.disconnect();
  }, []);

  return <span ref={anchor} className="hidden" aria-hidden="true" />;
}
