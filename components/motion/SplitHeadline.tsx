import { Fragment, type CSSProperties } from "react";

export interface HeadlineSegment {
  text: string;
  /** Renders in brand gold. */
  accent?: boolean;
}

/**
 * Splits a headline into per-word, per-character spans so CSS can stagger them
 * individually. Adapted from React Bits' "Split Text", with three deliberate
 * changes:
 *
 *  1. It renders on the **server** — no JS, no hydration flash, and the
 *     animation still runs with JavaScript disabled.
 *  2. It animates `transform` + `opacity` only. React Bits' version also
 *     animates `filter: blur()`, which forces a repaint per character and
 *     stutters on mid-range phones. The README motion rules rule it out.
 *  3. Accessibility is built in: the visual split is `aria-hidden` and a
 *     visually-hidden copy carries the real sentence, so assistive tech reads
 *     "We learn engineering by building", not a stream of letters.
 *
 * Words are `inline-block` (lines can still break between them) while characters
 * inside a word are `nowrap` — that stops a word splitting mid-way, which a
 * naive character split does.
 */
export default function SplitHeadline({
  segments,
  label,
  className = "",
}: {
  segments: HeadlineSegment[];
  /** Plain-text version of the whole headline, for assistive tech. */
  label: string;
  className?: string;
}) {
  let index = 0;

  return (
    <span className={className}>
      <span className="sr-only">{label}</span>

      <span aria-hidden="true">
        {segments.map((segment, segmentIndex) => {
          // A trailing space in content is a separator between segments, not a
          // word. Without the filter it becomes a zero-width span, which adds a
          // second gap on top of the one rendered between segments.
          const words = segment.text.split(" ").filter(Boolean);

          const body = words.map((word, wordIndex) => (
            <Fragment key={wordIndex}>
              {wordIndex > 0 && " "}
              <span className="split-word">
                {Array.from(word).map((char, charIndex) => {
                  const i = index++;
                  return (
                    <span
                      key={charIndex}
                      className="split-char"
                      style={{ "--i": i } as CSSProperties}
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
            </Fragment>
          ));

          return (
            <Fragment key={segmentIndex}>
              {segmentIndex > 0 && " "}
              {segment.accent ? <em className="not-italic text-gold-500">{body}</em> : body}
            </Fragment>
          );
        })}
      </span>
    </span>
  );
}
