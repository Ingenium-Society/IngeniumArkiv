import { getHome } from "@/content";
import type { Locale } from "@/lib/i18n";
import Reveal from "@/components/motion/Reveal";

/**
 * Club background and objectives — the first section below the hero.
 *
 * `id="about"` is what the header nav scroll-spy tracks, and `scroll-mt` offsets
 * the anchor jump by the height of the fixed header so the heading is not hidden
 * behind it.
 *
 * Children fade and lift in once on scroll. Each objective's rule then draws in
 * from the left — see `.draw-rule` in globals.css, which keys off the
 * `.reveal.is-in` class this wrapper sets.
 */
export default function About({ locale }: { locale: Locale }) {
  const { about } = getHome(locale);

  return (
    <section
      id="about"
      className="scroll-mt-[68px] border-y border-gold-500/12 bg-ink-900 py-24 md:py-28"
    >
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <div className="grid gap-10 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] md:gap-16">
          {/* The title rides along while the paragraphs scroll past it — the
              layout signature of this page. `self-start` is load-bearing: a
              grid item stretches to the row height by default, and a stretched
              sticky element has no room to travel. */}
          <Reveal className="md:sticky md:top-[104px] md:self-start">
            <span className="text-shimmer mb-4 block font-mono text-[11px] tracking-[0.2em] uppercase">
              {about.kicker}
            </span>
            <h2 className="text-[clamp(1.7rem,3.6vw,2.5rem)] leading-[1.12] font-semibold tracking-[-0.02em] text-white">
              {about.title}
            </h2>
          </Reveal>

          <div className="max-w-[620px] space-y-5 md:border-l md:border-gold-500/12 md:pl-12">
            {about.paragraphs.map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 24)} delay={index * 80}>
                <p className="leading-[1.78] text-ink-300">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <Reveal>
            <h3 className="text-shimmer mb-9 font-mono text-[11px] tracking-[0.2em] uppercase">
              {about.objectivesTitle}
            </h3>
          </Reveal>

          <ul className="grid gap-x-10 gap-y-9 md:grid-cols-2">
            {about.objectives.map((objective, index) => (
              <Reveal key={objective.id} as="li" delay={index * 60}>
                <div className="lift-item">
                  <span className="draw-rule" aria-hidden="true" />
                  <span className="lift-index mt-5 block font-mono text-[11px] tracking-[0.1em] text-ink-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h4 className="mt-2 mb-2 text-[1.05rem] font-semibold tracking-[-0.01em] text-white">
                    {objective.title}
                  </h4>
                  <p className="text-sm leading-[1.7] text-ink-300">{objective.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
