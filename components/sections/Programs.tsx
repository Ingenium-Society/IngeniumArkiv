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

        {/* A ledger, not a card grid: each programme is a row with its number
            hanging in the left margin, which is what separates this page from
            the About objectives it otherwise shares its language with. */}
        <ul className="mt-16 space-y-14">
          {programs.items.map((program, index) => (
            <Reveal key={program.id} as="li" delay={index * 80}>
              <div className="lift-item md:grid md:grid-cols-[104px_minmax(0,1fr)] md:gap-10">
                <span className="draw-rule md:col-span-2" aria-hidden="true" />
                <span className="lift-index mt-6 block font-mono text-[2.6rem] leading-none tracking-[-0.02em] text-ink-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="mt-4 md:mt-6 md:max-w-[620px]">
                  <span className="block font-mono text-[11px] tracking-[0.12em] text-gold-500 uppercase">
                    {program.meta}
                  </span>
                  <h3 className="mt-3 mb-3 text-[1.15rem] font-semibold tracking-[-0.01em] text-white">
                    {program.title}
                  </h3>
                  <p className="text-[14.5px] leading-[1.7] text-ink-300">{program.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
