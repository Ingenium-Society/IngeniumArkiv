/**
 * Hero background: a gold grid, a soft radial lift, and three circuit traces
 * that draw themselves on load (see `.trace` / `.node` in globals.css).
 *
 * Pure CSS animation — no JS, so this stays a server component and costs
 * nothing on the main thread.
 */
export default function HeroCircuit() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id="hero-grid" width="64" height="64" patternUnits="userSpaceOnUse">
          <path
            d="M64 0H0V64"
            fill="none"
            stroke="#b8a95d"
            strokeOpacity="0.065"
            strokeWidth="1"
          />
        </pattern>
        <radialGradient id="hero-glow" cx="52%" cy="38%" r="58%">
          <stop offset="0%" stopColor="#b8a95d" stopOpacity="0.11" />
          <stop offset="60%" stopColor="#2a2f55" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#0b0e1c" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1440" height="900" fill="url(#hero-grid)" />
      <rect width="1440" height="900" fill="url(#hero-glow)" />

      <g
        fill="none"
        stroke="#b8a95d"
        strokeOpacity="0.42"
        strokeWidth="1.5"
        strokeLinejoin="miter"
      >
        <path className="trace" d="M-20 628 H392 L448 572 H742 L798 628 H1460" />
        <path className="trace trace-2" d="M-20 286 H248 L304 230 H628 L684 286 H900" />
        <path className="trace trace-3" d="M1460 418 H1104 L1048 474 H806" />
      </g>

      <g fill="#b8a95d">
        <circle className="node" cx="742" cy="572" r="4" />
        <circle className="node" cx="628" cy="230" r="4" />
        <circle className="node" cx="806" cy="474" r="4" />
      </g>
    </svg>
  );
}
