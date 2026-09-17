"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import {
  DEFAULT_PITCH,
  DEFAULT_YAW,
  LABEL_DX,
  ORIGIN_X,
  ORIGIN_Y,
  PERSPECTIVE,
  PITCH_MAX,
  PITCH_MIN,
  VIEW_X,
  VIEW_Y,
} from "@/lib/machine";

/**
 * Drag-to-orbit for the navigation machine, plus the label overlay that keeps up
 * with it.
 *
 * The scene is a real CSS 3D context, so the browser already knows how to project
 * it — but the labels are flat HTML sitting outside that context, on purpose,
 * because text tilted into an isometric plane is unreadable. So this has to
 * reproduce the browser's projection by hand, and it has to reproduce it
 * *exactly*:
 *
 *     rotateX(pitch) * rotateZ(yaw), then perspective about the view origin
 *
 * `lib/machine.ts` holds the numbers both this and the scene use, so the only
 * thing that can drift is the maths below.
 *
 * The stack is tall and narrow, so the labels go in two columns at each
 * section's own height — the convention an exploded drawing uses, and the only
 * arrangement that cannot collide on a vertical stack. Because every section sits
 * on the axis, its label only ever moves vertically as the view changes; the
 * horizontal offset is fixed, and so is the side it sits on.
 *
 * Two behaviours worth knowing about:
 *
 *   - **A slow turntable.** Left alone, the model turns a full revolution every
 *     `TURNTABLE_PERIOD`. Dragging takes over immediately and the turntable
 *     resumes a few seconds after the pointer is released. Under reduced motion
 *     there is no turntable, and dragging snaps instead of easing.
 *   - **Fine pointers only.** Touch drags would fight page scrolling, and the
 *     scene is hidden below `lg` anyway, so nothing depends on a gesture a phone
 *     cannot perform.
 */
const LERP = 0.09;
const TURNTABLE_PERIOD = 150_000; // ms per revolution
const RESUME_AFTER = 4000; // ms of stillness before the turntable restarts
const DRAG_YAW = 0.4; // degrees per pixel
const DRAG_PITCH = 0.28;

/** Gap between a section's rim and the start of its leader line, in px. */
const LEADER_GAP = 18;
/** Where a leader line stops short of its label, so it does not run under the text. */
const LEADER_INSET = 78;
/** Labels are kept this far inside the scene box, so none can be clipped. */
const LABEL_MARGIN = 10;

const DEG = Math.PI / 180;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export default function MachineOrbit() {
  const anchor = useRef<HTMLSpanElement>(null);
  const overlay = useRef<SVGSVGElement>(null);

  /* The pose has to be correct before the first paint, or the labels would jump
     from their static fallback positions to their projected ones. */
  useLayoutEffect(() => {
    const root = anchor.current?.closest(".machine");
    const stage = root?.querySelector<HTMLElement>(".machine__stage");
    if (!stage) return;
    stage.style.setProperty("--pitch", `${DEFAULT_PITCH}deg`);
    stage.style.setProperty("--yaw", `${DEFAULT_YAW}deg`);
  }, []);

  useEffect(() => {
    const root = anchor.current?.closest(".machine");
    const scene = root?.querySelector<HTMLElement>(".machine__scene");
    const stage = root?.querySelector<HTMLElement>(".machine__stage");
    const svg = overlay.current;
    if (!root || !scene || !stage || !svg) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const ease = reduced ? 1 : LERP;

    const units = Array.from(
      root.querySelectorAll<HTMLElement>("[data-unit]"),
    ).map((el) => {
      const slug = el.dataset.unit ?? "";
      /* A leader line plus a marker dot at the section end — the annotation
         convention an exploded drawing uses, and the only thing tying a label to
         its section once the orbit has moved them apart. */
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("class", "machine__leader");
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("class", "machine__leader-dot");
      dot.setAttribute("r", "3");
      svg.append(line, dot);
      return {
        z: Number(el.dataset.z ?? 0),
        radius: Number(el.dataset.radius ?? 0),
        side: el.dataset.side === "left" ? -1 : 1,
        label: root.querySelector<HTMLElement>(`[data-label="${slug}"]`),
        line,
        dot,
      };
    });

    if (units.length === 0) {
      svg.replaceChildren();
      return;
    }

    let pitch = DEFAULT_PITCH;
    let yaw = DEFAULT_YAW;
    let targetPitch = DEFAULT_PITCH;
    let targetYaw = DEFAULT_YAW;

    let frame = 0;
    let running = false;
    let active = true;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let last = 0;
    let lastInput = 0;

    const draw = () => {
      frame = 0;

      const w = scene.clientWidth;
      const h = scene.clientHeight;
      if (!w || !h) return;

      stage.style.setProperty("--pitch", `${pitch.toFixed(3)}deg`);
      stage.style.setProperty("--yaw", `${yaw.toFixed(3)}deg`);

      const cp = Math.cos(pitch * DEG);
      const sp = Math.sin(pitch * DEG);
      const cz = Math.cos(yaw * DEG);
      const sz = Math.sin(yaw * DEG);

      /* Both origins are the same point by construction (see lib/machine.ts), so
         the projection reduces to `origin + projected * scale`. */
      const ox = ORIGIN_X * w;
      const oy = ORIGIN_Y * h;
      const vx = VIEW_X * w;
      const vy = VIEW_Y * h;

      /* rotateX(pitch) * rotateZ(yaw), in CSS's coordinate space: +x right,
         +y down, +z toward the viewer. */
      const project = (x: number, y: number, z: number) => {
        const rx = x * cz - y * sz;
        const ry = (x * sz + y * cz) * cp - z * sp;
        const rz = (x * sz + y * cz) * sp + z * cp;
        const s = PERSPECTIVE / (PERSPECTIVE - rz);
        return {
          x: vx + (ox + rx - vx) * s,
          y: vy + (oy + ry - vy) * s,
        };
      };

      for (const unit of units) {
        /* The section sits on the axis, so its centre projects straight up or
           down from the origin; the rim point does the same, displaced by the
           radius along the axis the label is on. */
        const centre = project(0, 0, unit.z);
        const rim = project(unit.radius * unit.side, 0, unit.z);

        const lx = ox + unit.side * LABEL_DX * w;
        const half = (unit.label?.offsetHeight ?? 0) / 2;
        const ly = clamp(centre.y, half + LABEL_MARGIN, h - half - LABEL_MARGIN);

        if (unit.label) {
          unit.label.style.left = `${lx.toFixed(2)}px`;
          unit.label.style.top = `${ly.toFixed(2)}px`;
        }

        const dotX = rim.x + unit.side * LEADER_GAP;
        unit.line.setAttribute("x1", dotX.toFixed(2));
        unit.line.setAttribute("y1", rim.y.toFixed(2));
        unit.line.setAttribute("x2", (lx - unit.side * LEADER_INSET).toFixed(2));
        unit.line.setAttribute("y2", ly.toFixed(2));
        unit.dot.setAttribute("cx", dotX.toFixed(2));
        unit.dot.setAttribute("cy", rim.y.toFixed(2));
      }
    };

    const turntabling = (now: number) =>
      !dragging && !reduced && now - lastInput > RESUME_AFTER;

    const tick = (now: number) => {
      frame = 0;
      if (!active) return;

      const dt = last ? Math.min(now - last, 64) : 16;
      last = now;

      if (turntabling(now)) {
        targetYaw += (360 / TURNTABLE_PERIOD) * dt;
      }

      pitch += (targetPitch - pitch) * ease;
      yaw += (targetYaw - yaw) * ease;

      const settled =
        Math.abs(targetPitch - pitch) < 0.01 && Math.abs(targetYaw - yaw) < 0.01;

      if (settled) {
        pitch = targetPitch;
        yaw = targetYaw;
      }

      draw();

      if (!settled || turntabling(now)) {
        frame = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (running || !active) return;
      running = true;
      last = 0;
      frame = requestAnimationFrame(tick);
    };

    const onDown = (event: PointerEvent) => {
      if (!fine || event.button !== 0) return;
      /* The labels sit over the scene and are the real navigation — a press that
         starts on one is a click, not the start of an orbit. */
      if ((event.target as HTMLElement | null)?.closest(".machine__hotspots")) {
        return;
      }
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      lastInput = performance.now();
      scene.setPointerCapture(event.pointerId);
      start();
    };

    const onMove = (event: PointerEvent) => {
      if (!dragging) return;
      targetYaw += (event.clientX - lastX) * DRAG_YAW;
      targetPitch = clamp(
        targetPitch + (event.clientY - lastY) * DRAG_PITCH,
        PITCH_MIN,
        PITCH_MAX,
      );
      lastX = event.clientX;
      lastY = event.clientY;
      lastInput = performance.now();
      start();
    };

    const onUp = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      lastInput = performance.now();
      if (scene.hasPointerCapture(event.pointerId)) {
        scene.releasePointerCapture(event.pointerId);
      }
      start();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active) start();
      },
      { threshold: 0 },
    );
    io.observe(root);

    /* The labels are positioned in pixels, so a resize has to re-project them. */
    const onResize = () => draw();

    if (fine) {
      scene.addEventListener("pointerdown", onDown);
      scene.addEventListener("pointermove", onMove);
      scene.addEventListener("pointerup", onUp);
      scene.addEventListener("pointercancel", onUp);
    }
    window.addEventListener("resize", onResize);

    draw();
    start();

    return () => {
      io.disconnect();
      if (fine) {
        scene.removeEventListener("pointerdown", onDown);
        scene.removeEventListener("pointermove", onMove);
        scene.removeEventListener("pointerup", onUp);
        scene.removeEventListener("pointercancel", onUp);
      }
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
      svg.replaceChildren();
    };
  }, []);

  return (
    <>
      <svg ref={overlay} className="machine__leaders" aria-hidden="true" />
      <span ref={anchor} className="hidden" aria-hidden="true" />
    </>
  );
}
