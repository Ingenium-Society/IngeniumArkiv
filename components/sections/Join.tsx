import { getHome } from "@/content";
import type { Locale } from "@/lib/i18n";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * The closing section: how to join, and who to ask.
 *
 * `id="join"` gives the hero's "Join the club" CTA a real destination — it had
 * been pointing at nothing since the page was first assembled.
 *
 * Rendered as an `<ol>` because the steps are genuinely sequential (register,
 * then choose, then turn up), and it reuses the same rule / index / hover-lift
 * language as Programs and the About objectives.
 *
 * The closing line deliberately points at people rather than an address: the
 * club has no published email yet, and inventing one would be worse than saying
 * "ask at school".
 */
export default function Join({ locale }: { locale: Locale }) {
  const { join } = getHome(locale);

  return (
    <section id="join" className="scroll-mt-[68px] bg-ink-950 py-24 md:py-28">
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <Reveal>
          <SectionHeading kicker={join.kicker} title={join.title} lead={join.lead} />
        </Reveal>

        <ol className="mt-16 grid gap-x-10 gap-y-10 md:grid-cols-3">
          {join.steps.map((step, index) => (
            <Reveal key={step.id} as="li" delay={index * 80}>
              <div className="lift-item">
                <span className="draw-rule" aria-hidden="true" />
                <span className="lift-index mt-5 block font-mono text-[11px] tracking-[0.1em] text-ink-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 mb-2 text-[1.15rem] font-semibold tracking-[-0.01em] text-white">
                  {step.title}
                </h3>
                <p className="text-[14.5px] leading-[1.7] text-ink-300">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={240}>
          <p className="mt-14 border-t border-gold-500/12 pt-6 font-mono text-[12px] tracking-[0.06em] text-ink-400">
            {join.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
