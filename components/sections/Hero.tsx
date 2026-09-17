import type { CSSProperties } from "react";
import Link from "next/link";
import { getHome } from "@/content";
import { localePath, type Locale } from "@/lib/i18n";
import DotField from "@/components/motion/DotField";
import HeroParallax from "@/components/motion/HeroParallax";
import HeroTilt from "@/components/motion/HeroTilt";
import Magnet from "@/components/motion/Magnet";
import Spotlight from "@/components/motion/Spotlight";
import SplitHeadline from "@/components/motion/SplitHeadline";
import WireCube from "@/components/motion/WireCube";
import HeroCircuit from "./HeroCircuit";

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-[15px] w-[15px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

/**
 * Depth in px of translateZ per background layer.
 *
 * Each layer nests as `<depth><parallax><content/></depth>` so the two systems
 * own separate `transform` properties and cannot overwrite each other:
 *
 *   - the depth wrapper holds a fixed `translateZ` plus a compensating `scale`
 *     (a layer pushed back would otherwise render smaller — the scale is
 *     `perspective / (perspective - z)`, inverted)
 *   - the parallax wrapper has its `transform` rewritten on scroll by
 *     components/motion/HeroParallax.tsx
 *
 * The scene is rotated by components/motion/HeroTilt.tsx. Because these layers
 * sit at different Z, that rotation shifts each by a different amount — which
 * is what makes it read as depth rather than a uniform skew.
 */
const PERSPECTIVE = 1500;
const scaleFor = (z: number) => (PERSPECTIVE / (PERSPECTIVE + z)).toFixed(4);

const CIRCUIT_Z = -180;
const DOTS_Z = -90;
const MARK_Z = -60;

export default function Hero({ locale }: { locale: Locale }) {
  const { hero } = getHome(locale);

  return (
    <section className="hero-scene relative flex min-h-[100svh] items-center overflow-hidden">
      <div className="hero-scene__inner" data-tilt-scene>
        {/*
          The two full-bleed layers are oversized by 14% on each edge so neither
          the scroll parallax nor the 3D scale can expose a gap at the top.
        */}
        <div
          data-parallax="0.16"
          className="pointer-events-none absolute inset-x-0 top-[-14%] h-[128%]"
        >
          <div
            className="h-full w-full"
            style={{ transform: `translateZ(${CIRCUIT_Z}px) scale(${scaleFor(CIRCUIT_Z)})` }}
          >
            <HeroCircuit />
          </div>
        </div>

        <div
          data-parallax="0.09"
          className="pointer-events-none absolute inset-x-0 top-[-14%] h-[128%]"
        >
          <div
            className="h-full w-full"
            style={{ transform: `translateZ(${DOTS_Z}px) scale(${scaleFor(DOTS_Z)})` }}
          >
            <DotField />
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0"
          style={{ transform: `translateZ(${MARK_Z}px) scale(${scaleFor(MARK_Z)})` }}
        >
          <span className="hero-mark" data-parallax="0.05" aria-hidden="true" />
        </div>

        <WireCube />

        <HeroParallax />
        <HeroTilt />

        <div
          data-parallax="-0.04"
          className="relative z-[2] mx-auto w-full max-w-[1180px] px-6"
        >
          <div className="max-w-[820px]">
            <span
              className="hero-stagger mb-6 flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] uppercase"
              style={{ "--d": "120ms" } as CSSProperties}
            >
              <span className="block h-px w-[34px] bg-gold-500" aria-hidden="true" />
              <span className="text-shimmer">{hero.eyebrow}</span>
            </span>

            <h1 className="mb-6 text-[clamp(2.4rem,6.4vw,4.6rem)] leading-[1.04] font-semibold tracking-[-0.03em] text-white">
              <SplitHeadline
                label={`${hero.titleLead}${hero.titleAccent}`}
                segments={[
                  { text: hero.titleLead },
                  { text: hero.titleAccent, accent: true },
                ]}
              />
            </h1>

            <p
              className="hero-stagger mb-10 max-w-[620px] text-[clamp(1rem,2vw,1.18rem)] text-ink-200"
              style={{ "--d": "720ms" } as CSSProperties}
            >
              {hero.lead}
            </p>

            {/*
              Real routes, not anchors. The home page is the hero plus the
              navigator and nothing else, so `#join` / `#projects` have no
              target here — those sections live on their own pages.
            */}
            <div
              className="hero-stagger flex flex-wrap items-center gap-3.5"
              style={{ "--d": "860ms" } as CSSProperties}
            >
              <Magnet>
                <Spotlight>
                  <Link
                    href={localePath(locale, "join")}
                    className="inline-flex items-center gap-2.5 rounded-lg bg-gold-500 px-[26px] py-[14px] text-sm font-semibold text-ink-950 transition-colors duration-[250ms] ease-brand hover:bg-gold-400"
                  >
                    {hero.ctaPrimary}
                    <ArrowRight />
                  </Link>
                </Spotlight>
              </Magnet>

              <Magnet padding={70} strength={7}>
                <Spotlight variant="gold">
                  <Link
                    href={localePath(locale, "projects")}
                    className="inline-flex items-center rounded-lg border border-gold-500/35 px-[26px] py-[14px] text-sm font-semibold text-gold-300 transition-colors duration-[250ms] ease-brand hover:border-gold-500 hover:bg-gold-500/8"
                  >
                    {hero.ctaSecondary}
                  </Link>
                </Spotlight>
              </Magnet>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[34px] left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-2.5">
        <span className="font-mono text-[10px] tracking-[0.2em] text-ink-400 uppercase">
          {hero.scroll}
        </span>
        <i className="scroll-cue-line" aria-hidden="true" />
      </div>
    </section>
  );
}
