/**
 * A slowly rotating gold wireframe cube, built entirely from CSS 3D transforms.
 *
 * Six faces with transparent backgrounds and gold borders: because opposite
 * faces share edges, that renders as a clean 12-edge wireframe rather than six
 * separate squares. `transform-style: preserve-3d` on the parent lets the
 * browser depth-sort them, so the near edges correctly occlude the far ones.
 *
 * No JavaScript at all — the rotation is a CSS keyframe. That keeps it off the
 * main thread and means it still turns with JS disabled.
 *
 * Hidden below `lg`, where the hero copy fills the width and the cube would
 * collide with the headline. `prefers-reduced-motion` stops the spin — see
 * globals.css.
 */
export default function WireCube() {
  return (
    <div className="hero-cube" aria-hidden="true">
      <div className="hero-cube__body">
        <span className="hero-cube__face hero-cube__face--front" />
        <span className="hero-cube__face hero-cube__face--back" />
        <span className="hero-cube__face hero-cube__face--right" />
        <span className="hero-cube__face hero-cube__face--left" />
        <span className="hero-cube__face hero-cube__face--top" />
        <span className="hero-cube__face hero-cube__face--bottom" />
        <span className="hero-cube__core" />
      </div>
    </div>
  );
}
