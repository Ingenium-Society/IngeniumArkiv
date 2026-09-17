/**
 * Intro: two panels part down the middle like a sci-fi door, with the seam
 * charging, a light flare, and the panels sliding away to reveal the hero.
 *
 * Deliberately a **server component with no JavaScript**. A client-only overlay
 * would render after hydration, letting the hero flash on screen first. Being
 * in the initial HTML means the doors are painted before anything else.
 *
 * The whole thing is `pointer-events: none` and ends at `visibility: hidden`,
 * so it cannot block a click even during the second it is visible.
 *
 * Under `prefers-reduced-motion` the doors are never shown at all — see the
 * `.intro` rule in globals.css.
 *
 * Timing lives in globals.css: panels release at 0.3 s, the overlay is hidden
 * at 1.1 s, and `--intro-delay` (600 ms) is when the hero starts animating, so
 * the hero rises while the doors are still parting.
 */
export default function IntroDoors() {
  return (
    <div className="intro" aria-hidden="true">
      <div className="intro__panel intro__panel--left">
        <span className="intro__edge" />
      </div>
      <div className="intro__panel intro__panel--right">
        <span className="intro__edge" />
      </div>
      <span className="intro__seam" />
      <span className="intro__flash" />
    </div>
  );
}
