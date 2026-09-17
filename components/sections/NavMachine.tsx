import type { CSSProperties } from "react";
import Link from "next/link";
import { getNav } from "@/content";
import { localePath, type Locale } from "@/lib/i18n";
import {
  PRISM_THRESHOLD,
  SECTIONS,
  LIGHT_ANGLE,
  SHAFT_HEIGHT,
  SHAFT_Z,
  barrelRadius,
  pitchRadius,
} from "@/lib/machine";
import MachineOrbit from "@/components/motion/MachineOrbit";
import MachineStage from "@/components/motion/MachineStage";

/* ---------------------------------------------------------------------------
   The machine — a gear cluster

   Five components on one shaft, one per page, stepped down from a flared bell to
   a small pinion so that assembled they form a single barrel. An exploded view
   of one part, not five parts that happen to be near each other.

   This is a real arrangement: a *cluster* (or layshaft) gear. Every gear on it
   meshes with a mate on one parallel shaft, which is why they all turn the same
   way, why the big ones turn slowly, and why they cannot mesh with *each other*
   — coaxial gears never can. The shared `MODULE` in lib/machine.ts is what makes
   them a set.

   **Each section is a different shape, not the same shape at a different size.**
   Four levers do the work, all set in lib/machine.ts:

   | lever          | gives you                                       |
   |----------------|-------------------------------------------------|
   | `rBottom/rTop` | a taper — a bell, a cone, or a straight barrel  |
   | `segments`     | a smooth cylinder, a faceted drum, an octagon   |
   | `teeth`        | a toothed rim, or a plain one                   |
   | the cap art    | bolt circles, spline slots, lightening holes    |

   `segments` is the one that matters most, because it changes the *silhouette*
   rather than the detail — and below `PRISM_THRESHOLD` the cap is drawn as a
   polygon to match, or a low count reads as a badly drawn cylinder instead of a
   prism.
--------------------------------------------------------------------------- */

/** Points evenly spaced on a circle, first one at 12 o'clock. */
function ring(count: number, radius: number, phase = 0) {
  return Array.from({ length: count }, (_, i) => {
    const a = ((360 / count) * i + phase) * (Math.PI / 180);
    return [Math.cos(a) * radius, Math.sin(a) * radius] as const;
  });
}

/** A polygon's `points` attribute, for a prism's silhouette. */
const polygonPoints = (sides: number, radius: number) =>
  ring(sides, radius)
    .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");

/**
 * A cap's outer silhouette: a circle on a turned section, a polygon on a prism.
 * Drawing a circle on an octagonal barrel is the single thing that makes a low
 * `segments` value look like a mistake rather than a decision.
 */
function Silhouette({ radius, sides }: { radius: number; sides: number }) {
  if (sides >= PRISM_THRESHOLD) return <circle className="section__line" r={radius} />;
  return <polygon className="section__line" points={polygonPoints(sides, radius)} />;
}

/**
 * A section's SVG box. The CSS box is set from the same expression, so one
 * viewBox unit stays one pixel and the radii below can be read as pixels.
 */
const sectionBox = (radius: number) => radius * 2.2;

/**
 * The barrel of a section: `segments` flat panels arranged around the axis.
 *
 * This is the piece that turns a disc into a machine part. An opaque wall does
 * two things a pair of flat outlines cannot: it hides the far side of the
 * assembly, and it makes the section's **lower rim** visible as the boundary
 * between the part and the background.
 *
 * Two details are easy to get wrong and both are load-bearing:
 *
 *   - **Panel orientation.** The panel's width has to run *tangentially* and its
 *     normal *radially*, which is what the `rotateZ(90deg)` before the
 *     `rotateX(90deg)` is for. Without it the panels become radial blades — a
 *     cage of fins with gaps between them, which looks almost right on a dark
 *     background and occludes nothing.
 *   - **Taper.** A tapered section's panels lean, so the barrel runs from
 *     `rBottom` to `rTop` instead of sitting at the mean radius with a step at
 *     each cap.
 *
 * Every panel is cut to the *wider* of the two ends. Trimming them to a trapezoid
 * instead — narrow at the narrow end — looks more correct on paper and is wrong
 * in practice: it opens a sawtooth of gaps along the rim. Letting the panels
 * overlap at the narrow end costs nothing, because they are opaque and there is
 * no gap left to see through.
 */
/* --- wall shading --------------------------------------------------------- */

/* The wall's shadow and lit colours, either side of the old flat rgb(26,31,58).
   The lit end sits *above* the cap fill on purpose: a cylinder's side faces the
   light more directly than its top, and a wall that can never outshine the cap
   reads as a void between plates — the flatness the whole shading pass exists
   to kill. The rim is a separate, gold-tinted edge colour, toward the cap
   stroke, for the bright line where the wall meets the top cap. */
const WALL_DARK = [24, 29, 54] as const;
const WALL_LIT = [68, 76, 132] as const;
const WALL_EDGE = [172, 164, 124] as const;

/** 0.28–1: how lit a panel at `angle` is, cosine about LIGHT_ANGLE, floored so
    the shadow side stays present rather than going black. */
function wallLight(angle: number) {
  const lit = 0.5 + 0.5 * Math.cos(((angle - LIGHT_ANGLE) * Math.PI) / 180);
  return 0.28 + 0.72 * lit;
}

const cssRgb = (c: readonly number[]) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`;

/**
 * The three colours of one wall panel, from its angle around the barrel.
 *
 * A flat wall was the one cue the scene was missing: the caps read as solid
 * plates but the barrel between them read as nothing, because every panel was
 * the same near-black. Three stops sell the volume:
 *
 *   - `lo` / `hi` — the wall body, cosine-shaded about the light and lifted
 *     toward the top edge, which is what a vertical surface under a high
 *     light does;
 *   - `rim` — a narrow gold edge at the very top, proportional to how lit the
 *     panel is. A bright line under the cap is the single strongest "this has
 *     thickness" cue a turned part has.
 *
 * On the faceted sections (16 and 8 panels) the per-face step is exactly how a
 * machined drum should catch light, so this helps the prisms most.
 */
function wallColors(angle: number) {
  const t = wallLight(angle);
  const shade = (bias: number) => {
    const u = Math.min(1, Math.max(0, t + bias));
    return WALL_DARK.map((d, i) => Math.round(d + (WALL_LIT[i] - d) * u));
  };
  /* The rim fades out on the shadow side instead of ringing the whole barrel —
     a rim that is bright all the way round reads as a outline, not a light. */
  const rim = shade(0.08).map((v, i) =>
    Math.round(v + (WALL_EDGE[i] - v) * t * 0.8),
  );
  return { lo: cssRgb(shade(-0.06)), hi: cssRgb(shade(0.08)), rim: cssRgb(rim) };
}

function Barrel({
  rBottom,
  rTop,
  height,
  segments,
}: {
  rBottom: number;
  rTop: number;
  height: number;
  segments: number;
}) {
  const half = Math.PI / segments;
  const wBottom = 2 * rBottom * Math.tan(half);
  const wTop = 2 * rTop * Math.tan(half);
  const width = Math.max(wBottom, wTop);
  const rMean = (rBottom + rTop) / 2;

  /* rotateY() takes the *negated* angle: a positive value rotates the panel's
     top away from the axis, and a section that narrows upward needs its top
     leaning in. */
  const lean = (-Math.atan2(rBottom - rTop, height) * 180) / Math.PI;
  const slant = Math.hypot(height, rBottom - rTop);

  return (
    <>
      {Array.from({ length: segments }).map((_, i) => {
        const a = (360 / segments) * i;
        const c = wallColors(a);
        return (
          <i
            key={i}
            className="cylinder__panel"
            style={
              {
                "--a": `${a.toFixed(3)}deg`,
                "--w": `${width.toFixed(2)}px`,
                "--h": `${slant.toFixed(2)}px`,
                "--r": `${rMean.toFixed(2)}px`,
                "--lean": `${lean.toFixed(3)}deg`,
                /* The element's bottom edge maps to the top of the stack after
                   rotateX(90deg) — see the transform comment in globals.css —
                   so --c-rim is the last stop of the gradient. */
                "--c-lo": c.lo,
                "--c-hi": c.hi,
                "--c-rim": c.rim,
              } as CSSProperties
            }
          />
        );
      })}
    </>
  );
}

/**
 * A closed outline for a gear: trapezoidal teeth around a pitch circle.
 *
 * Not a true involute — at this size the difference is invisible, and what
 * actually sells a gear is that its teeth are evenly cut at a consistent pitch,
 * not that the flanks are mathematically correct.
 */
function gearPath(teeth: number, radius: number) {
  const ra = radius; // tip circle
  const rd = barrelRadius(radius, teeth);
  const step = 360 / teeth;
  const halfTooth = step * 0.27; // angular half-thickness at the pitch circle
  const tipHalf = halfTooth * 0.6;

  const at = (r: number, deg: number) => {
    const a = (deg * Math.PI) / 180;
    return `${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`;
  };

  const points: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const c = i * step;
    points.push(at(rd, c - halfTooth));
    points.push(at(ra, c - tipHalf));
    points.push(at(ra, c + tipHalf));
    points.push(at(rd, c + halfTooth));
  }
  return `M${points.join("L")}Z`;
}

/* --- the five caps -------------------------------------------------------- */

/** 0 · about — a flared bell. A bolt circle inside radial ribs. */
function BellFace({ radius }: { radius: number }) {
  const box = sectionBox(radius);
  return (
    <svg viewBox={`${-box / 2} ${-box / 2} ${box} ${box}`} className="section__svg">
      <circle className="section__fill" r={radius} />
      <circle className="section__line" r={radius} />
      <circle className="section__line section__line--faint" r={radius - 16} />
      {ring(12, 88).map(([x, y], i) => {
        const a = (360 / 12) * i * (Math.PI / 180);
        return (
          <line
            key={i}
            className="section__line section__line--faint"
            x1={x}
            y1={y}
            x2={Math.cos(a) * (radius - 34)}
            y2={Math.sin(a) * (radius - 34)}
          />
        );
      })}
      <circle className="section__line" r="88" />
      <circle className="section__line section__line--faint" r="66" strokeDasharray="3 8" />
      {ring(10, radius - 42).map(([x, y], i) => (
        <circle key={i} className="section__line" cx={x} cy={y} r="8" />
      ))}
    </svg>
  );
}

/**
 * 1 · programs — a faceted drum. Sixteen flat faces with a spline slot cut down
 * each one; the slots are what stop a low polygon count reading as a tessellation
 * mistake.
 */
function DrumFace({ radius, sides }: { radius: number; sides: number }) {
  const box = sectionBox(radius);
  return (
    <svg viewBox={`${-box / 2} ${-box / 2} ${box} ${box}`} className="section__svg">
      <polygon className="section__fill" points={polygonPoints(sides, radius)} />
      <Silhouette radius={radius} sides={sides} />
      {ring(sides, radius * 0.94).map(([x, y], i) => {
        const a = (360 / sides) * i * (Math.PI / 180);
        return (
          <line
            key={i}
            className="section__line section__line--faint"
            x1={x}
            y1={y}
            x2={Math.cos(a) * radius * 0.78}
            y2={Math.sin(a) * radius * 0.78}
          />
        );
      })}
      <circle className="section__line" r={radius * 0.62} />
      <circle className="section__line" r="34" />
    </svg>
  );
}

/** 2 · divisions — a thin toothed disc: the only section with a full gear rim. */
function DiscFace({ radius, teeth }: { radius: number; teeth: number }) {
  const box = sectionBox(radius);
  const rp = pitchRadius(radius);
  return (
    <svg viewBox={`${-box / 2} ${-box / 2} ${box} ${box}`} className="section__svg">
      <path className="section__body" d={gearPath(teeth, radius)} />
      <circle className="section__line section__line--faint" r={rp} strokeDasharray="7 9" />
      <circle className="section__line" r="56" />
      <circle className="section__line" r="24" />
      {ring(6, radius * 0.62).map(([x, y], i) => (
        <circle key={i} className="section__line" cx={x} cy={y} r="14" />
      ))}
    </svg>
  );
}

/** 3 · projects — an octagonal boss, bolted down. */
function PrismFace({ radius, sides }: { radius: number; sides: number }) {
  const box = sectionBox(radius);
  return (
    <svg viewBox={`${-box / 2} ${-box / 2} ${box} ${box}`} className="section__svg">
      <polygon className="section__fill" points={polygonPoints(sides, radius)} />
      <Silhouette radius={radius} sides={sides} />
      <circle
        className="section__line section__line--faint"
        r={radius * 0.86}
        strokeDasharray="3 8"
      />
      <circle className="section__line" r="46" />
      <circle className="section__line" r="26" />
      {ring(sides, radius * 0.68).map(([x, y], i) => (
        <circle key={i} className="section__line" cx={x} cy={y} r="9" />
      ))}
    </svg>
  );
}

/**
 * 4 · join — a tapered pinion. Coarse teeth and a keyway: the one asymmetric mark
 * in the whole stack, and without it a turning section reads as static.
 */
function PinionFace({ radius, teeth }: { radius: number; teeth: number }) {
  const box = sectionBox(radius);
  const rp = pitchRadius(radius);
  return (
    <svg viewBox={`${-box / 2} ${-box / 2} ${box} ${box}`} className="section__svg">
      <path className="section__body" d={gearPath(teeth, radius)} />
      <circle className="section__line section__line--faint" r={rp} strokeDasharray="6 8" />
      <circle className="section__line" r="30" />
      <circle className="section__line" r="17" />
      <path className="section__line" d="M-6 -30 L-6 -17 L6 -17 L6 -30" />
    </svg>
  );
}

/** A heavy foundation flange. It is decorative, but gives the stack a convincing load path. */
function FoundationFace({ radius }: { radius: number }) {
  const box = sectionBox(radius);
  return (
    <svg viewBox={`${-box / 2} ${-box / 2} ${box} ${box}`} className="section__svg section__svg--foundation">
      <circle className="section__fill" r={radius} />
      <circle className="section__line" r={radius} />
      <circle className="section__line section__line--faint" r={radius - 15} />
      <circle className="section__line" r={radius - 32} />
      <circle className="section__line section__line--faint" r={radius - 64} strokeDasharray="10 12" />
      {ring(18, radius - 24, 10).map(([x, y], i) => (
        <circle key={i} className="section__bolt" cx={x} cy={y} r="3.5" />
      ))}
    </svg>
  );
}

/** One face per section, in stack order. */
const FACES = SECTIONS.map((section, index) => {
  /* The art is always drawn at the section's largest radius; each cap scales it
     down to its own — see `--fr` in the markup. */
  const r = Math.max(section.rBottom, section.rTop);
  const { slug, teeth, segments } = section;
  if (index === 0) return <BellFace key={slug} radius={r} />;
  if (index === 1) return <DrumFace key={slug} radius={r} sides={segments} />;
  if (index === 2) return <DiscFace key={slug} radius={r} teeth={teeth} />;
  if (index === 3) return <PrismFace key={slug} radius={r} sides={segments} />;
  return <PinionFace key={slug} radius={r} teeth={teeth} />;
});

/**
 * Fallback label positions, as a fraction of the box. Used only if JavaScript
 * never runs — in which case the machine is static and approximate placement is
 * fine. MachineOrbit.tsx overwrites these before the first paint.
 */
const STATIC_LABEL = SECTIONS.map((section) => ({
  x: section.side === "left" ? 0.16 : 0.84,
  y: 0.72 - section.z * 0.00115,
}));

/**
 * The navigation, as an exploded gear cluster.
 *
 * The scene is a real CSS 3D context — `perspective` on the scene, `preserve-3d`
 * on the stage — so the browser does the projection and the depth sorting, and
 * orbiting is a genuine change of viewing angle rather than a skew.
 *
 * Two things this deliberately does *not* do:
 *
 *   - **No opacity on the stage or on a section.** `opacity` below 1 is a
 *     grouping property: it forces `transform-style` to compute to `flat`, which
 *     would collapse the barrels and the depth ordering of the whole stack. The
 *     entrance is a scale and a rise, driven from MachineStage.tsx, which touches
 *     transform only.
 *   - **No `will-change: transform` on the stage.** Layer promotion can do the
 *     same thing for the same reason. The hero already carries this scar.
 *
 * The art is inline SVG rendered on the server and the labels are real `<Link>`
 * elements in a flat overlay, so keyboard and screen reader users get a normal
 * list and nothing needs JavaScript to be *visible*. The scene itself is
 * `aria-hidden` — the labels carry the meaning.
 */
export default function NavMachine({ locale }: { locale: Locale }) {
  const { hub, pages } = getNav(locale);

  return (
    <section className="nav-machine relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-[68px]">
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <h1 className="sr-only">{hub.title}</h1>
        <p className="sr-only">{hub.lead}</p>

        <div className="machine">
          {/* Decorative — the hotspot list below is the real navigation. */}
          <div className="machine__scene" aria-hidden="true">
            {/* One gradient, shared by every cap. Defined once and referenced as
                `url(#machine-cap-sheen)` from globals.css — per-SVG copies would
                be twelve identical <defs> blocks and an id collision waiting to
                happen. Zero-sized and absolutely positioned, never display:none:
                old WebKit drops url() references into hidden SVGs. */}
            <svg width="0" height="0" style={{ position: "absolute" }}>
              <defs>
                {/* Turned-metal sheen: the highlight sits off-centre, toward the
                    light, instead of dead centre like a lens flare. The dimmed
                    bottom caps inherit it through their own opacity. */}
                <radialGradient id="machine-cap-sheen" cx="42%" cy="38%" r="72%">
                  <stop offset="0%" stopColor="rgb(56, 63, 110)" />
                  <stop offset="55%" stopColor="rgb(44, 50, 92)" />
                  <stop offset="100%" stopColor="rgb(33, 38, 72)" />
                </radialGradient>
              </defs>
            </svg>
            <div className="machine__stage">
              <div className="machine__ground" data-fade />
              <div className="machine__orbit-rings" data-fade aria-hidden="true" />
              {/* The shaft's length and start come from lib/machine.ts like
                  every other size — it used to be hardcoded in globals.css,
                  which meant any change to the stack's heights left it poking
                  out of the pinion or buried in the bell. */}
              <i
                className="machine__shaft"
                style={
                  {
                    "--shaft-z": `${SHAFT_Z}px`,
                    "--shaft-h": `${SHAFT_HEIGHT}px`,
                  } as CSSProperties
                }
              />

              <div
                className="machine__section machine__plinth"
                data-base
                style={
                  {
                    "--size": `${sectionBox(278)}px`,
                    "--z": "-66px",
                    "--face": "13px",
                    "--period": "70s",
                  } as CSSProperties
                }
              >
                <div className="machine__component">
                  <Barrel rBottom={276} rTop={266} height={26} segments={44} />
                  <div className="section__face section__face--top" style={{ "--fr": 1 } as CSSProperties}>
                    <FoundationFace radius={278} />
                  </div>
                  <div
                    className="section__face section__face--bottom"
                    style={{ "--fr": 0.985 } as CSSProperties}
                  >
                    <FoundationFace radius={278} />
                  </div>
                </div>
              </div>

              {SECTIONS.map((section, index) => {
                const rMax = Math.max(section.rBottom, section.rTop);
                return (
                  <div
                    key={section.slug}
                    className="machine__section"
                    data-unit={section.slug}
                    data-side={section.side}
                    data-radius={rMax}
                    data-z={section.z}
                    /* Below the prism threshold the barrel is a polygon, and a
                       polygon with no edges between its faces reads as a
                       badly-drawn cylinder. The attribute turns the facet
                       outlines on; see globals.css. */
                    data-facets={
                      section.segments < PRISM_THRESHOLD ? "on" : undefined
                    }
                    style={
                      {
                        "--size": `${sectionBox(rMax)}px`,
                        "--z": `${section.z}px`,
                        "--face": `${section.height / 2}px`,
                        "--period": `${section.period}s`,
                      } as CSSProperties
                    }
                  >
                    <div className="machine__component" data-component={section.slug}>
                      <Barrel
                        rBottom={barrelRadius(section.rBottom, section.teeth)}
                        rTop={barrelRadius(section.rTop, section.teeth)}
                        height={section.height}
                        segments={section.segments}
                      />
                      <div
                        className="section__face section__face--top"
                        style={{ "--fr": section.rTop / rMax } as CSSProperties}
                      >
                        {FACES[index]}
                      </div>
                      <div
                        className="section__face section__face--bottom"
                        style={{ "--fr": section.rBottom / rMax } as CSSProperties}
                      >
                        {FACES[index]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Before the labels in the DOM, so the leader lines sit under them. */}
          <MachineOrbit />

          <ul className="machine__hotspots">
            {pages.map((page, index) => {
              const spot = STATIC_LABEL[index] ?? { x: 0.5, y: 0.5 };
              return (
                <li
                  key={page.id}
                  className="machine__hotspot"
                  data-label={page.slug}
                  data-side={SECTIONS[index]?.side ?? "right"}
                  style={
                    {
                      left: `${spot.x * 100}%`,
                      top: `${spot.y * 100}%`,
                    } as CSSProperties
                  }
                >
                  <Link
                    href={localePath(locale, page.slug)}
                    className="machine__link"
                    data-hotspot={page.slug}
                  >
                    <span className="machine__link-head">
                      <span className="machine__index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="machine__dot" aria-hidden="true" />
                    </span>
                    <span className="block text-[15px] font-semibold tracking-[-0.01em] text-white">
                      {page.label}
                    </span>
                    <span className="block text-[12.5px] leading-[1.45] text-ink-400">
                      {page.body}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="machine__hint text-center font-mono text-[10px] tracking-[0.22em] text-ink-400 uppercase">
          {hub.hint} · {hub.drag}
        </p>
      </div>

      <MachineStage />
    </section>
  );
}
