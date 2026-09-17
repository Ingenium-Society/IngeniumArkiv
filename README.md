# Ingenium Society — Website

Public website for **Ingenium Society Club**, the engineering club of SMA Global Darussalam Academy.

Static, bilingual (Indonesian / English), deployed to Vercel.

---

## Status

**Phase 2 — multi-page.** The site is hub-and-spoke now: a short home page and five separate pages.
Nothing scrolls between sections any more.

| Route | Content |
|---|---|
| `/[locale]` | Hero + the 3D navigation hub. Nothing else. |
| `/[locale]/about` | Background, objectives, stat strip |
| `/[locale]/programs` | The three programmes |
| `/[locale]/divisions` | The four divisions |
| `/[locale]/projects` | The kickoff projects |
| `/[locale]/join` | How to join |

Sub-pages deliberately do **not** link to each other — you come back to the hub to pick the next one.
Each carries a back link regardless, so nobody is stranded by a refresh or a couple of hops.

> A complete draft of the home-page sections was built and then **parked** at
> `../parked/home-page/` — see `../parked/home-page/README-PARKED.md`. It is reference material,
> not part of the build. Nothing in `website/` imports from it.

See `../docs/WEBSITE-BUILD-PLAN.md` for the full plan.

---

## Running it

```bash
pnpm install
pnpm dev
```

Then open <http://localhost:3000>. If port 3000 is busy, Next.js picks the next free port and prints
it — check the terminal output.

```bash
pnpm build     # production build
pnpm start     # serve the production build
```

### Package manager

This project uses **pnpm**. `pnpm-lock.yaml` is committed; `package-lock.json` is not.

`npm install` also works on a normal machine, but note that npm's bin-linking step was blocked by
the tooling sandbox on the machine where this was scaffolded — that is an environment quirk, not a
problem with the project. If you hit anything odd, use pnpm.

---

## How the code is organised

```
app/
  [locale]/            route tree — one branch, two languages
    layout.tsx         root layout: fonts, <html lang>, header, scroll progress
    page.tsx           home — renders <Hero />
  globals.css          design tokens (@theme) + hero animations
components/
  layout/              Header, NavLinks, PageIntro, LocaleToggle, ScrollProgress
  motion/              IntroDoors, SplitHeadline, DotField, Magnet, Spotlight,
                       HeroParallax, HeroTilt, Reveal, InViewGroup, CountUp
  sections/            Hero, HeroCircuit, NavHub, StatStrip, Programs,
                       Divisions, Projects, About, Join
  ui/                  SectionHeading
app/[locale]/
  page.tsx             home — hero + hub
  about|programs|divisions|projects|join/page.tsx
content/
  types.ts             THE CONTRACT — every locale must satisfy these interfaces
  id/  en/             site.ts, home.ts, nav.ts, divisions.ts, projects.ts
  index.ts             typed lookup: getSite / getHome / getNav / getDivisions / getProjects
lib/
  i18n.ts              locale list, type guard, localePath()
  divisions.ts         division id → accent colour
  page-meta.ts         shared generateMetadata for the five sub-pages
proxy.ts               redirects `/` to `/id`  (Next 16 renamed `middleware` to `proxy`)
public/logo/           logo assets, dark-background variants
```

---

## Editing content

Content lives in `content/` as typed TypeScript. **No CMS, no database.**

1. Open `content/id/home.ts` and `content/en/home.ts`
2. Change the strings
3. Open a pull request — Vercel builds a preview URL you can look at before merging
4. Merge to `main` → automatic production deploy

### Why the types matter

`content/types.ts` defines every field. Both locale files declare `satisfies HomeContent`. If you
add a field to the interface, **the build fails in both languages** until both are filled in.

That is the point. It turns a missing translation into a build error instead of a blank heading
that a visitor discovers.

### Adding a new field

```ts
// 1. content/types.ts
export interface HeroContent {
  // ...
  subtitle: string;        // <- add here
}

// 2. content/id/home.ts  AND  content/en/home.ts
export const home = {
  hero: {
    // ...
    subtitle: "...",       // <- build fails until both exist
  },
} satisfies HomeContent;
```

---

## Bilingual routing

- Indonesian is canonical, at `/id`
- English is at `/en`
- `/` redirects to `/id` via `proxy.ts`
- The header toggle swaps only the locale segment, preserving the rest of the path

`generateStaticParams` in `app/[locale]/layout.tsx` prerenders both locales at build time.

---

## Design tokens

Defined once in `app/globals.css` under `@theme`, consumed as Tailwind utilities
(`bg-ink-950`, `text-gold-500`, `border-gold-500/15`).

Colours were **sampled from the club logo**, not invented:

| Token | Hex | Role |
|---|---|---|
| `ink-950` | `#0B0E1C` | page background |
| `ink-600` | `#2A2F55` | brand navy (logo primary) |
| `gold-500` | `#B8A95D` | brand gold (logo accent) |
| `ink-100` | `#E8E9F2` | primary text |

Fonts: **Space Grotesk** (display), **Inter** (body), **JetBrains Mono** (labels, figures) —
self-hosted via `next/font`, no external requests.

---

## Motion rules

Follow these or the site will get slow:

1. Animate **`transform` and `opacity` only** — never `width`, `height`, `top`, `left`, `filter`
2. 200–400 ms for UI feedback, 600–900 ms for scroll reveals
3. Stagger children by 60–80 ms; more than 8 items reads as slow
4. Reveal once — never re-animate on every scroll pass
5. Always keep `prefers-reduced-motion` working

Budget: first-load JS ≤ 150 KB gzipped, LCP ≤ 2.0 s on 4G, Lighthouse mobile ≥ 90.

---

## Animations

Adapted from [React Bits](https://reactbits.dev), rewritten to fit the rules above. All of them are
transform/opacity only, and none add a dependency.

| Component | Where | What it does | Cost |
|---|---|---|---|
| `motion/IntroDoors` | Home | Two panels part down the middle like a sci-fi door — seam charges, light flares, panels slide away. **Server-rendered, zero JS.** | 0 KB |
| `motion/WireCube` | Hero | Rotating gold wireframe cube — six transparent faces whose shared edges read as a 12-edge wireframe. **Pure CSS, no JS.** | 0 KB |
| `motion/HeroTilt` | Hero | Tilts the hero's 3D scene toward the pointer by setting `--tx` / `--ty`. Lerped toward the target each frame and stops when settled. | ~1.5 KB |
| `motion/SplitHeadline` | Hero | Splits the headline into per-word, per-character spans that stagger in. **Server-rendered** — no JS, no hydration flash, works with JS disabled. | 0 KB |
| `motion/DotField` | Hero | Canvas field of gold dots that brighten and part around the pointer, kick on fast movement, and ripple on click. | ~4 KB |
| `motion/Magnet` | Hero | Pulls the CTA buttons toward the cursor within a `padding` radius. | ~2 KB |
| `motion/Spotlight` | Hero | Radial glow that follows the cursor inside each CTA. Sets `--mx` / `--my` from a rAF-throttled listener — no React state, so the cursor never re-renders. | ~1.5 KB |
| `motion/HeroParallax` | Hero | Translates any `data-parallax="<speed>"` layer inside the hero by `scrollY * speed`, clamped to ±110 px. Positive lags (reads as further away), negative leads. | ~1.5 KB |
| `motion/Reveal` | Any | Fades and lifts its children once, when they scroll into view. `as` prop so it can render a `li` or `article`. | ~1 KB |
| `motion/CountUp` | Stats | Counts up once on scroll. **Server-renders the final value** so the figure is right without JS; resets to 0 in a layout effect, before paint, so there is no visible jump. | ~1 KB |
| CSS only | Hero | Eyebrow shimmer (animated gradient clipped to text) and a slow drift on the watermark mark. | 0 KB |

**Parallax layer speeds**, back to front: circuit `0.16`, dot field `0.09`, watermark `0.05`, content
`-0.04`. The two full-bleed layers are oversized by 14% on each edge so a downward offset can never
expose a gap at the top of the hero.

### Hero 3D scene

The hero is a CSS 3D scene: `perspective: 1500px` on the section, `preserve-3d` on the inner, and a
`translateZ` depth per background layer (circuit `-180`, dot field `-90`, watermark `-60`). `HeroTilt`
rotates the inner toward the pointer, and because those layers sit at different depths they shift by
different amounts — that difference is what reads as depth rather than a flat skew.

**Three systems write `transform` in the hero, so each owns a different element.** Nesting is
deliberate, not incidental:

```
<section .hero-scene>              perspective
  <div .hero-scene__inner>         rotateX/rotateY from HeroTilt
    <div [data-parallax]>          transform rewritten on scroll
      <div style="translateZ…">    fixed depth + compensating scale
        <HeroCircuit />
```

Two things to preserve if you touch this:

- **Each layer pushed back needs a compensating `scale`**, or it renders smaller. The factor is
  `perspective / (perspective - z)`, inverted — hence `scale(1.1364)` at `z: -180`.
- **No `will-change: transform` on `.hero-scene__inner`.** Layer promotion can force `preserve-3d` to
  compute to `flat`, which silently collapses every `translateZ` below it and leaves a flat hero.
  This was removed on purpose.

Angles are deliberately small (5° / 3.2°); beyond that the headline starts to look bent rather than
placed in space.

### Intro sequencing

The doors open on load, so every hero entrance animation is offset by `--intro-delay` (600 ms) —
otherwise the whole hero would play out unseen behind them. That variable is used in `.hero-stagger`
(via the per-element `--d`), `.split-char`, `.trace`, `.node` and `.text-shimmer`.

600 ms is deliberate: the panels release at 300 ms and finish at 950 ms, so the hero rises *while*
they are still parting rather than waiting for them to finish.

Timeline: seam charges 0–0.62 s · panels slide 0.30–0.95 s · overlay hidden at 1.10 s.

**The intro plays once per session, not on every load.** A small inline script in the layout runs
during HTML parsing — before the intro element exists — and adds `intro-seen` to `<html>` if the flag
is already in `sessionStorage`. The CSS then hides the doors on the first paint, so there is no flash.
It also drops `--intro-delay` to `0`; otherwise the hero would sit waiting 600 ms for doors that never
open. `sessionStorage` throws in some privacy modes, so the script is wrapped in `try/catch` — in that
case the intro simply plays every time.

Because that script mutates `<html>` **before React hydrates**, `<html>` carries
`suppressHydrationWarning`. Without it React logs a hydration mismatch for a class it never rendered.
Same pattern Next.js documents for pre-hydration theme scripts. **Do not remove that prop without also
removing the script.** It suppresses this element only, not its children, so a genuine mismatch
elsewhere is still reported.

To make the intro play on every load instead, delete the `<script>` block in
`app/[locale]/layout.tsx`, the `suppressHydrationWarning` prop, and the `.intro-seen` rules in
`globals.css`.

**`translate` vs `transform`:** the watermark's centring offset uses the CSS `translate` property, not
`transform`, so the parallax can drive `transform` without the two fighting. Same trick on its idle
drift animation.

**Deliberate deviations from React Bits:**

- **No GSAP.** Their Split Text requires `gsap` + `@gsap/react` (~50 KB) for what a CSS keyframe and
  a `--i` custom property do here.
- **No blur.** Their Split Text animates `filter: blur()`. That repaints every character and stutters
  on mid-range phones, so it is left out.
- **No `background-clip` on the headline.** Their Shiny Text is applied to the eyebrow instead, where
  the element has clean bounds. Clipping the headline would need `overflow: hidden` on an element
  whose characters animate from below, which risks cutting the comma's descender.
- **Idle-aware.** `DotField` stops its rAF loop when nothing is moving, and pauses when the tab is
  hidden or the canvas scrolls out of view. `HeroParallax` pauses when the hero leaves the viewport.
- **Accessible.** The split markup is `aria-hidden`; a `sr-only` span carries the real sentence, so
  screen readers read the headline, not 29 separate letters. The shimmer falls back to flat gold
  where `background-clip: text` is unsupported, so the label can never render invisible.

**Reduced motion / touch:** `prefers-reduced-motion: reduce` disables all of it — the headline shows
immediately, the dot field renders once statically, the parallax is skipped entirely, and the shimmer
falls back to flat gold. `Magnet`, `Spotlight` and the pointer interaction in `DotField` also switch
off on coarse pointers, so nothing depends on a hover a phone cannot perform.

---

## Shared section styles

Three utility classes in `globals.css` carry the page's repeating treatments. Use them rather than
re-inventing per section:

| Class | Effect |
|---|---|
| `.draw-rule` | A hairline that draws in from the left when its `Reveal` wrapper enters the viewport. Keys off `.reveal.is-in`. Colour is overridable with `--rule` / `--rule-hover`, which is how the Divisions section tints each rule with its own accent. |
| `.lift-item` | Lifts 4 px on hover, with a surface supplied by an expanded `::before` — so it never shifts text or the grid. |
| `.lift-index` | The numbered index inside a `.lift-item`; turns gold on hover. |

Used by the About objectives, the Programs items and the Divisions grid. `.text-shimmer` (above) does
the same job for section kickers.

**Division accent colours** live in `lib/divisions.ts`, keyed by division id, not in `content/` — they
are presentation, not language data. They are deliberately muted, since the page is otherwise strictly
navy and gold, and appear only on each division's hairline and head label.

---

## Navigation

Two navigations, both built from the same `content/<locale>/nav.ts`:

- **Header nav** — plain route links. Active state comes from the pathname (`aria-current="page"`),
  not a scroll-spy.
- **The 3D hub** (`sections/NavHub.tsx`) — the signature way through the site. A gyroscope core above a
  fan of five page modules, each rotated and pushed back in proportion to its distance from centre, so
  the row reads as an arc.

Because both read the same content file, the header and the hub cannot disagree about which pages
exist. **Adding a page is one entry in `content/{id,en}/nav.ts` plus a route folder** — both pick it up.

### Two hard constraints in the hub

**Nothing above a `translateZ` element may carry `transform` or partial `opacity`.** Either forces
`transform-style: preserve-3d` to compute to `flat`, which silently collapses the entire fan. That is
why:

- the modules' scroll reveal **cannot use `Reveal`** (which puts transform + opacity on a wrapper).
  `motion/InViewGroup` adds an `is-in` class instead, and the transition lives on the module itself —
  an element's own opacity does not flatten its own transform
- `Reveal` is used only on the hub's heading, which is flat text

**The modules are real `<Link>` elements**, not canvas hit-testing — keyboard-focusable, announced
properly, and functional with JavaScript disabled. A WebGL object would have been prettier and unusable.

Below `lg` the fan cannot fit, so the modules fall back to a plain vertical list with no 3D. The header
nav is hidden below `lg` too, and **the menu button is still not wired up** — there is no mobile menu.

### Hub-and-spoke

Sub-pages deliberately do **not** link to each other; you return to the hub and pick the next one.
`PageIntro` carries a back link on every sub-page regardless, because relying on the browser back
button after a refresh is a good way to strand someone.

---

## Known follow-ups

- Logo assets are **raster PNGs derived from a raster source**. Get the original **SVG** for crisp
  retina rendering and a proper favicon.
- `NEXT_PUBLIC_SITE_URL` is unset — metadata falls back to `http://localhost:3000`. Set it on
  Vercel once the deployment URL exists.
- Vercel project should be created under the **club email**, not a personal account.
