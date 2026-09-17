/**
 * Geometry for the navigation machine — one source of truth.
 *
 * Both the renderer (`components/sections/NavMachine.tsx`) and the orbit
 * controller (`components/motion/MachineOrbit.tsx`) need these numbers, and the
 * orbit controller has to reproduce the browser's own projection exactly or the
 * labels drift off their sections. Keeping the constants in one file is the only
 * thing stopping the two from disagreeing.
 *
 * See NavMachine.tsx for what the machine *is* and why it is shaped this way.
 */

/**
 * Tooth size, shared by every toothed section.
 *
 * This is what makes the stack a machine rather than five unrelated discs: gears
 * cut to one module are gears that can work together. It is also why the teeth
 * get visibly bigger on the small sections — same module, fewer teeth, larger
 * angular pitch.
 */
export const MODULE = 10;

/** Addendum and dedendum, as multiples of the module. */
const ADDENDUM = 0.42;
const DEDENDUM = 0.54;

/**
 * One section of the barrel.
 *
 * The stack is a **gear cluster**: five components on one shaft whose diameters
 * step down from a flared bell at the bottom to a tapered pinion at the top, so
 * that assembled they form a single stepped barrel. Each is a different *kind*
 * of part — not the same cylinder at five sizes.
 */
export interface Section {
  /** Route slug — also the label key. Must match the order in `nav.ts`. */
  slug: string;
  /** Tip radius at the bottom. For a toothed section this is the tip circle. */
  rBottom: number;
  /** Tip radius at the top. Equal to `rBottom` for a straight section. */
  rTop: number;
  /** Barrel height, in z. */
  height: number;
  /** Height of the section's centre on the assembly axis. */
  z: number;
  /**
   * Teeth. `0` means a plain section. Toothed sections are all cut to `MODULE`,
   * so the tooth *pitch* changes with the count and the small parts visibly read
   * as coarser.
   */
  teeth: number;
  /**
   * Panels around the barrel — the main silhouette control.
   *
   * 40+ reads as a smooth turned cylinder; ~16 reads as a faceted drum; 8 is
   * unmistakably an octagonal prism. Below `PRISM_THRESHOLD` the cap silhouette
   * is drawn as a matching polygon rather than a circle, which is what makes a
   * low count read as a prism instead of a badly drawn cylinder.
   */
  segments: number;
  /**
   * Seconds per revolution.
   *
   * Proportional to the tooth count, which is what a cluster on a single
   * layshaft does: every gear in it meshes with a mate on one parallel shaft, so
   * they all turn the *same* way and the big ones turn slowly. Hence no
   * `reverse` here, unlike a sun-and-planet train.
   */
  period: number;
  /**
   * Which side the label sits on. Alternating keeps same-side labels ~160px
   * apart, which is more than one label is tall.
   */
  side: "left" | "right";
}

/**
 * The stack, bottom to top. Order must match `content/<locale>/nav.ts`.
 *
 * Five silhouettes, none of them a repeat:
 *
 * | # | page      | shape          | how it differs                        |
 * |---|-----------|----------------|---------------------------------------|
 * | 0 | about     | flared bell    | tapered, smooth, bolt circle          |
 * | 1 | programs  | faceted drum   | 16 flat faces, tallest                |
 * | 2 | divisions | toothed disc   | thinnest, wide, 40 teeth              |
 * | 3 | projects  | octagonal boss | 8 faces, unmistakably a prism         |
 * | 4 | join      | tapered pinion | tapers the other way, 14 coarse teeth |
 *
 * `z` and `height` are coupled: the gaps between consecutive sections are
 * 20–32px — enough daylight to keep the exploded reading without letting the
 * stack fall apart into plates. The parts are deliberately chunky (heights are
 * ~1.4× a "to scale" gear): from a steep orbit a thin part reads as a plate no
 * matter how it is shaded. Change one height and check the gap either side of
 * it, then check the stack still fits `ORIGIN_Y` — at `PITCH_MAX` the top of
 * the stack projects to just under the top of a 600px scene.
 */
export const SECTIONS: Section[] = [
  {
    slug: "about",
    rBottom: 240,
    rTop: 196,
    height: 76,
    z: 0,
    teeth: 0,
    segments: 40,
    period: 44,
    side: "right",
  },
  {
    slug: "programs",
    rBottom: 180,
    rTop: 180,
    height: 104,
    z: 114,
    teeth: 0,
    segments: 16,
    period: 40,
    side: "left",
  },
  {
    slug: "divisions",
    rBottom: 148,
    rTop: 148,
    height: 48,
    z: 222,
    teeth: 40,
    segments: 44,
    period: 36,
    side: "right",
  },
  {
    slug: "projects",
    rBottom: 114,
    rTop: 114,
    height: 80,
    z: 306,
    teeth: 0,
    segments: 8,
    period: 24,
    side: "left",
  },
  {
    slug: "join",
    rBottom: 82,
    rTop: 46,
    height: 68,
    z: 404,
    teeth: 14,
    segments: 24,
    period: 14.4,
    side: "right",
  },
];

/** Pitch radius of a toothed section: the tip circle less the addendum. */
export const pitchRadius = (radius: number) => radius - ADDENDUM * MODULE;

/**
 * Radius the *barrel* runs at.
 *
 * On a toothed section that is the root circle — the barrel has to sit inside the
 * teeth or the teeth would have no depth. On a plain section it is a shade under
 * the tip, so the cap's rim still reads as an edge.
 */
export const barrelRadius = (radius: number, teeth: number) =>
  teeth > 0 ? radius - (ADDENDUM + DEDENDUM) * MODULE : radius - 2;

/** Below this many sides the cap silhouette is drawn as a polygon, not a circle. */
export const PRISM_THRESHOLD = 20;

/** Top and bottom of the stack, for the shaft to clear. */
export const STACK_TOP = SECTIONS.reduce(
  (top, s) => Math.max(top, s.z + s.height / 2),
  0,
);
export const STACK_BOTTOM = SECTIONS.reduce(
  (bottom, s) => Math.min(bottom, s.z - s.height / 2),
  0,
);

/* --- heights in the scene --- */

export const GROUND_Z = -110;
/** The shaft runs from below the bell to above the pinion. */
export const SHAFT_Z = STACK_BOTTOM - 18;
export const SHAFT_HEIGHT = STACK_TOP + 48 - SHAFT_Z;

/* --- the camera --- */

/**
 * The pose the scene opens at. PITCH is how far the horizontal plane tips away
 * from the viewer, YAW how far it is turned. These are also the values
 * MachineOrbit.tsx starts from, and it reads them from here rather than from the
 * stylesheet so the two cannot disagree.
 */
export const DEFAULT_PITCH = 52;
export const DEFAULT_YAW = -34;

export const PITCH_MIN = 14;
export const PITCH_MAX = 78;

/**
 * Direction the scene is lit from, as an angle around the barrel: wall panels
 * at this angle carry the lit colour, panels opposite it the shadow colour.
 * NavMachine.tsx bakes the two into each panel; nothing moves at runtime.
 *
 * After the stage's `rotateX(pitch) · rotateZ(yaw)`, a panel normal at angle θ
 * has a viewer-facing component of `sin(θ + yaw) · sin(pitch)`, so the
 * brightest wall would sit dead centre at θ = 90° − yaw. 170° nudges the
 * highlight off to the viewer's left, so the light reads as coming from
 * somewhere rather than straight on.
 */
export const LIGHT_ANGLE = 170;

/**
 * Camera distance. Large on purpose: close to an orthographic technical drawing,
 * so the sections keep their proportions across the whole stack.
 */
export const PERSPECTIVE = 4000;

/**
 * Stage origin and perspective origin, as fractions of the scene box. They are
 * deliberately equal: the projection maths in MachineOrbit.tsx is only short
 * because the vanishing point sits on the assembly axis.
 *
 * The value is constrained from both ends. The stack reaches ~440px above the
 * origin and ~90px below it, so `ORIGIN_Y` has to be high enough that the top
 * clears the box on a short viewport and low enough that the bell clears the
 * bottom on a tall one. 0.72 is the middle of that window.
 */
export const ORIGIN_X = 0.5;
export const ORIGIN_Y = 0.72;
export const VIEW_X = 0.5;
export const VIEW_Y = 0.72;

/**
 * How far the labels sit either side of the axis, as a fraction of the scene
 * width. The stack is tall and narrow, so the labels go in two columns at each
 * section's own height rather than on a ring — which is also the convention an
 * exploded drawing uses.
 */
export const LABEL_DX = 0.34;
