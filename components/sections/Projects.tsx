import { getHome, getProjects } from "@/content";
import { accentFor } from "@/lib/divisions";
import type { Locale } from "@/lib/i18n";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * Simple geometric stand-ins for project artwork — a circuit trace for the
 * hardware build, a browser/API pair for the web build. Placeholder for real
 * photography, which the plan calls for in Phase 4.
 */
function ProjectArt({ slug, accent }: { slug: string; accent: string }) {
  return (
    <svg
      viewBox="0 0 560 170"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      <rect width="560" height="170" fill="#1a1f3a" />
      {slug === "attendance-recorder" ? (
        <>
          <g stroke={accent} strokeOpacity="0.34" strokeWidth="1" fill="none">
            <path d="M60 120 h90 l22 -22 h70 l22 22 h96" />
            <path d="M60 60 h120 l22 22 h60" />
            <path d="M340 130 h80 l20 -20 h60" />
          </g>
          <g fill={accent} fillOpacity="0.55">
            <rect x="256" y="92" width="30" height="20" rx="3" />
            <rect x="96" y="112" width="16" height="16" rx="2" />
          </g>
        </>
      ) : (
        <>
          <g stroke={accent} strokeOpacity="0.34" strokeWidth="1" fill="none">
            <rect x="70" y="46" width="150" height="80" rx="6" />
            <path d="M70 70 h150 M100 46 v80" />
            <rect x="270" y="60" width="90" height="60" rx="6" />
            <path d="M220 86 h50" />
          </g>
          <g fill={accent} fillOpacity="0.5">
            <rect x="86" y="82" width="26" height="30" rx="3" />
            <rect x="124" y="94" width="26" height="18" rx="3" />
          </g>
        </>
      )}
    </svg>
  );
}

/**
 * The kickoff projects from Attachment 5 of the proposal.
 *
 * `id="projects"` is the third nav target. Each card takes its accent from its
 * division, via the same `lib/divisions.ts` map the Divisions section uses — so
 * a project and its division always read as the same colour.
 *
 * These are carded rather than rule-topped: the artwork, badges and resource
 * list need a frame, and the stat strip already established panels as part of
 * this design's language.
 */
export default function Projects({ locale }: { locale: Locale }) {
  const { projects: head } = getHome(locale);
  const { items } = getProjects(locale);

  return (
    <section id="projects" className="scroll-mt-[68px] bg-ink-950 py-24 md:py-28">
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <Reveal>
          <SectionHeading kicker={head.kicker} title={head.title} lead={head.lead} />
        </Reveal>

        <ul className="mt-16 grid gap-6 md:grid-cols-2">
          {items.map((project, index) => {
            const accent = accentFor(project.divisionId);
            return (
              <Reveal key={project.slug} as="li" delay={index * 80}>
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gold-500/13 bg-ink-800 transition duration-300 ease-brand hover:-translate-y-1 hover:border-gold-500/30">
                  <div className="h-[170px] shrink-0 bg-ink-700">
                    <ProjectArt slug={project.slug} accent={accent} />
                  </div>

                  <div className="flex flex-1 flex-col p-7">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span
                        className="rounded-full border px-2.5 py-1 font-mono text-[10.5px] tracking-[0.1em] uppercase"
                        style={{ borderColor: `${accent}66`, color: accent }}
                      >
                        {project.division}
                      </span>
                      <span className="rounded-full bg-gold-500/13 px-2.5 py-1 font-mono text-[10.5px] tracking-[0.1em] text-gold-400 uppercase">
                        {project.phase}
                      </span>
                    </div>

                    <h3 className="mb-3 text-[1.25rem] font-semibold tracking-[-0.01em] text-white">
                      {project.title}
                    </h3>
                    <p className="mb-6 text-[14.5px] leading-[1.68] text-ink-300">
                      {project.body}
                    </p>

                    <span className="mb-3 block font-mono text-[10.5px] tracking-[0.16em] text-gold-500 uppercase">
                      {head.featuresLabel}
                    </span>
                    <ul className="mb-6 space-y-2">
                      {project.features.map((feature) => (
                        <li key={feature} className="flex gap-3 text-sm leading-[1.6] text-ink-200">
                          <span
                            className="mt-[7px] block h-1 w-1 shrink-0 rounded-full"
                            style={{ backgroundColor: accent }}
                            aria-hidden="true"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto border-t border-gold-500/12 pt-4">
                      <span className="mb-2 block font-mono text-[10.5px] tracking-[0.16em] text-gold-500 uppercase">
                        {head.resourcesLabel}
                      </span>
                      <p className="font-mono text-[11.5px] leading-[1.8] text-ink-400">
                        {project.resources.join(" · ")}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
