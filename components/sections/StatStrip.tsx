import { getHome } from "@/content";
import type { Locale } from "@/lib/i18n";
import CountUp from "@/components/motion/CountUp";
import Reveal from "@/components/motion/Reveal";

/**
 * Headline figures, directly under the hero.
 *
 * Sits on `ink-950` so it reads as a continuation of the hero, with `ink-900`
 * tiles inside the panel. The 1px gaps between tiles show the gold-tinted grid
 * background through as hairline dividers — no extra border elements needed.
 *
 * No section border of its own: the About section below already carries a
 * top border, and doubling them would show as a 2px line.
 */
export default function StatStrip({ locale }: { locale: Locale }) {
  const { stats } = getHome(locale);

  return (
    <section className="bg-ink-950 py-16">
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <Reveal>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-gold-500/12 bg-gold-500/12 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.id} className="bg-ink-900 px-6 py-8">
                <dd className="mb-2 font-mono text-[clamp(1.9rem,4vw,2.6rem)] leading-none text-gold-500">
                  <CountUp to={stat.value} from={stat.from} />
                </dd>
                <dt className="text-[13px] text-ink-300">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
