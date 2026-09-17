import { getHome } from "@/content";
import type { Locale } from "@/lib/i18n";
import Reveal from "@/components/motion/Reveal";

/**
 * The closing section: one line, and the door.
 *
 * It used to explain the three steps of joining (register, choose a division,
 * start at the Workbench) and end with "find a club officer at school". All of
 * that is gone: registration is handled by a Google Form, so anything the
 * section said about *how* to join was a second, staler copy of the form's own
 * questions. One line and one button is the whole job.
 *
 * `id="join"` is kept — the hero's "Join the club" CTA and any older anchor
 * link still land here.
 */
const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScDdQ9sgTB9ppZ4rEGNMncRH-ioNnXCF_Reky9T-BQDToB51w/viewform";

export default function Join({ locale }: { locale: Locale }) {
  const { join } = getHome(locale);

  return (
    <section id="join" className="scroll-mt-[68px] bg-ink-950 py-24 md:py-28">
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <Reveal>
          <h2 className="max-w-[660px] text-[clamp(1.7rem,3.6vw,2.5rem)] leading-[1.12] font-semibold tracking-[-0.02em] text-white">
            {join.line}
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <a
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2.5 rounded-lg bg-gold-500 px-[26px] py-[14px] text-sm font-semibold text-ink-950 transition-colors duration-[250ms] ease-brand hover:bg-gold-400"
          >
            {join.cta}
            {/* The arrow says "this leaves the site" as much as it says "go" —
                the form opens in a new tab. */}
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
          </a>
        </Reveal>
      </div>
    </section>
  );
}
