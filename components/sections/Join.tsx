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

/**
 * Who to write to. A constant rather than content, for the same reason as the
 * form URL: these are the same in both locales. The last one is the club's own
 * address — the three before it are individual officers, listed so that a
 * question reaches a person rather than a shared inbox nobody owns.
 */
const CONTACTS = [
  "rakha.alfarrasy@gdajogja.sch.id",
  "haidar.nasirodin@gdajogja.sch.id",
  "arya.rahadian@gdajogja.sch.id",
  "rauf.akmal@gdajogja.sch.id",
  "societyingenium@gmail.com",
];

export default function Join({ locale }: { locale: Locale }) {
  const { join } = getHome(locale);

  return (
    <section id="join" className="scroll-mt-[68px] bg-ink-950 py-24 md:py-28">
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <Reveal>
          <h2 className="mx-auto max-w-[660px] text-center text-[clamp(1.7rem,3.6vw,2.5rem)] leading-[1.12] font-semibold tracking-[-0.02em] text-white">
            {join.line}
          </h2>
        </Reveal>

        {/* The one ask on the page. Tinted with the BioTech division's own
            accent, so it reads as a division notice rather than a second
            headline — see `--color-div-bt` in the design tokens. */}
        <Reveal delay={100}>
          <p className="join-focus mx-auto mt-8 max-w-[620px] text-center">{join.focus}</p>
        </Reveal>

        {/* The closing date, immediately above the button: the most urgent fact
            on the page, and the last thing read before acting on it. */}
        <Reveal delay={140}>
          <div className="mt-9 flex justify-center">
            <span className="join-deadline">
              <span className="join-deadline__label">{join.deadlineLabel}</span>
              <span className="join-deadline__value">{join.deadline}</span>
            </span>
          </div>
        </Reveal>

        {/* Centred by the flex wrapper rather than by inherited `text-align`,
            so the button's position does not depend on a rule in the stylesheet. */}
        <Reveal delay={180}>
          <div className="mt-6 flex justify-center">
            <a
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-lg bg-gold-500 px-[26px] py-[14px] text-sm font-semibold text-ink-950 transition-colors duration-[250ms] ease-brand hover:bg-gold-400"
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
          </div>
        </Reveal>

        <Reveal delay={220}>
          <div className="join-contacts">
            <span className="join-contacts__label">{join.contactLabel}</span>
            <ul className="join-contacts__list">
              {CONTACTS.map((email) => (
                <li key={email}>
                  <a href={`mailto:${email}`} className="join-contacts__link">
                    {email}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
