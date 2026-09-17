import type { CSSProperties } from "react";
import { getDivisions, getHome } from "@/content";
import { accentFor } from "@/lib/divisions";
import type { Locale } from "@/lib/i18n";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * The club's four engineering divisions.
 *
 * `id="divisions"` is what the header nav scroll-spy tracks, so this is the
 * second live nav target after About.
 *
 * Each division tints its own hairline and head label with an accent from
 * lib/divisions.ts. The rule colour is passed as `--rule` / `--rule-hover`
 * rather than inline `background-color`, so the hover brightening in
 * globals.css still applies.
 *
 * Only division heads are named — see the privacy note on `DivisionContent`
 * in content/types.ts. No member roster is published anywhere.
 */
export default function Divisions({ locale }: { locale: Locale }) {
  const { divisions: head } = getHome(locale);
  const { items } = getDivisions(locale);

  return (
    <section
      id="divisions"
      className="scroll-mt-[68px] border-t border-gold-500/12 bg-ink-900 py-24 md:py-28"
    >
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <Reveal>
          <SectionHeading kicker={head.kicker} title={head.title} lead={head.lead} />
        </Reveal>

        {/* A board of framed cards rather than rule-topped items: each division
            gets a panel, a thick accent spine, and a ghost numeral. The accent
            still arrives as `--rule` / `--rule-hover` so the shared hover
            brightening keeps working. */}
        <ul className="mt-16 grid gap-6 md:grid-cols-2">
          {items.map((division, index) => {
            const accent = accentFor(division.id);
            return (
              <Reveal key={division.id} as="li" delay={index * 70}>
                <div
                  className="lift-item division-card"
                  style={
                    {
                      "--rule": `${accent}2e`,
                      "--rule-hover": `${accent}99`,
                      "--accent": accent,
                    } as CSSProperties
                  }
                >
                  <span className="draw-rule" aria-hidden="true" />
                  <span className="lift-index division-card__numeral" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 mb-2 text-[1.15rem] font-semibold tracking-[-0.01em] text-white">
                    {division.name}
                  </h3>
                  <span
                    className="mb-3 block font-mono text-[11px] tracking-[0.1em] uppercase"
                    style={{ color: accent }}
                  >
                    {head.leadLabel} · {division.lead}
                  </span>
                  <p className="text-[14.5px] leading-[1.7] text-ink-300">{division.body}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
