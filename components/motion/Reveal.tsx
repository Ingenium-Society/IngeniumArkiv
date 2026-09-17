"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Fades and lifts its children once, the first time they scroll into view.
 *
 * Same approach as the hero's motion: IntersectionObserver plus a CSS
 * transition on `transform` and `opacity` only, no animation library.
 *
 * `delay` staggers siblings — keep it under ~8 items, past that it reads as
 * slow rather than impressive.
 *
 * `as` lets it render as a `li` or `article` so it can sit inside lists and
 * grids without producing invalid markup.
 *
 * Note: children start at `opacity: 0`, so the root layout carries a
 * `<noscript>` rule that forces them visible when JavaScript is off.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article" | "section";
}) {
  // Cast to a single tag so the ref type resolves; the node is used generically.
  const Tag = as as "div";
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? "is-in" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
