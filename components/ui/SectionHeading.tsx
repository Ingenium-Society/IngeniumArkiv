import type { SectionHeadContent } from "@/content/types";

/**
 * The standard section opening: a shimmering mono kicker, a headline, and a
 * supporting line. Used by every section that is not the hero.
 *
 * The kicker uses the same `.text-shimmer` treatment as the hero eyebrow, so
 * section labels read as one family.
 */
export default function SectionHeading({ kicker, title, lead }: SectionHeadContent) {
  return (
    <div className="max-w-[660px]">
      <span className="text-shimmer mb-4 block font-mono text-[11px] tracking-[0.2em] uppercase">
        {kicker}
      </span>
      <h2 className="mb-4 text-[clamp(1.7rem,3.6vw,2.5rem)] leading-[1.12] font-semibold tracking-[-0.02em] text-white">
        {title}
      </h2>
      <p className="text-ink-300">{lead}</p>
    </div>
  );
}
