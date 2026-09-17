import { getHome } from "@/content";
import type { Locale } from "@/lib/i18n";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * The club's three running programmes, from Attachment 3 of the proposal.
 *
 * Laid out with the same visual language as the About objectives — a hairline
 * that draws in on reveal, a numbered index, and a hover lift — rather than as
 * boxed cards, so the page keeps one treatment instead of three.
 *
 * `id="programs"` is here for future deep links; no nav item points at it yet.
 */
export default function Programs({ locale }: { locale: Locale }) {
  const { programs } = getHome(locale);

  return (
    <section id="programs" className="scroll-mt-[68px] bg-ink-950 py-24 md:py-28">
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <Reveal>
          <SectionHeading
            kicker={programs.kicker}
            title={programs.title}
            lead={programs.lead}
          />
        </Reveal>

        <ul className="mt-16 grid gap-x-10 gap-y-10 md:grid-cols-3">
          {programs.items.map((program, index) => (
            <Reveal key={program.id} as="li" delay={index * 80}>
              <div className="lift-item">
                <span className="draw-rule" aria-hidden="true" />
                <span className="lift-index mt-5 block font-mono text-[11px] tracking-[0.1em] text-ink-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-4 block font-mono text-[11px] tracking-[0.12em] text-gold-500 uppercase">
                  {program.meta}
                </span>
                <h3 className="mt-3 mb-3 text-[1.15rem] font-semibold tracking-[-0.01em] text-white">
                  {program.title}
                </h3>
                <p className="text-[14.5px] leading-[1.7] text-ink-300">{program.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
