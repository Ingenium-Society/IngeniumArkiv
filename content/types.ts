/**
 * The contract every locale must satisfy.
 *
 * Both `content/id/*` and `content/en/*` declare `satisfies` against these
 * interfaces. Add a field here and the build fails in BOTH locales until both
 * are filled in. That is deliberate — it is the whole reason content lives in
 * typed TypeScript instead of MDX or a CMS.
 */

export interface NavContent {
  about: string;
  divisions: string;
  projects: string;
  process: string;
  join: string;
}

export interface SiteContent {
  nav: NavContent;
  meta: {
    title: string;
    description: string;
  };
  /**
   * Short marker shown in the header while the site is unfinished. Deliberately
   * a site-level string rather than a per-page one: the whole site is in
   * development, not a section of it.
   */
  wip: string;
  /** The 404 page. */
  notFound: {
    /** Large numeral or short label — "404". */
    code: string;
    title: string;
    body: string;
    /** Label of the link back to the navigator. */
    cta: string;
  };
}

export interface HeroContent {
  /** Small mono label above the headline. */
  eyebrow: string;
  /** Headline text before the gold accent. Keep the trailing space. */
  titleLead: string;
  /** The gold-accented tail of the headline. */
  titleAccent: string;
  lead: string;
  ctaPrimary: string;
  ctaSecondary: string;
  /** Label under the animated scroll indicator. */
  scroll: string;
}

/** One of the club's stated objectives, from the proposal. */
export interface ObjectiveContent {
  id: string;
  title: string;
  body: string;
}

export interface AboutContent {
  kicker: string;
  title: string;
  paragraphs: string[];
  objectivesTitle: string;
  objectives: ObjectiveContent[];
}

/** A headline figure in the stat strip below the hero. */
export interface StatContent {
  id: string;
  /** Number the counter animates to. */
  value: number;
  /** Where the counter starts. Defaults to 0. */
  from?: number;
  label: string;
}

/** A section heading: small mono kicker, headline, supporting line. */
export interface SectionHeadContent {
  kicker: string;
  title: string;
  lead: string;
}

/** One of the club's three running programmes. */
export interface ProgramContent {
  id: string;
  /** Small mono line above the title — cadence, timing, target. */
  meta: string;
  title: string;
  body: string;
}

/**
 * One of the club's four engineering divisions.
 *
 * Privacy note: `lead` names a student office-holder. Only division heads are
 * named — there is no general member roster anywhere on the site, and no class
 * years or contact details. To publish divisions without names, empty `lead`
 * in both locales and drop the `leadLabel` row in Divisions.tsx.
 */
export interface DivisionContent {
  /** Stable key. Also selects the accent colour — see lib/divisions.ts */
  id: string;
  name: string;
  /** Head of division. */
  lead: string;
  /** One line describing the division's remit. */
  body: string;
}

export interface DivisionsContent {
  items: DivisionContent[];
}

/** A club project, from Attachment 5 of the proposal. */
export interface ProjectContent {
  slug: string;
  title: string;
  /** Division name, for the badge. */
  division: string;
  /** Division id — selects the accent colour via lib/divisions.ts. */
  divisionId: string;
  /** Engineering phase, e.g. Prototype / Design. */
  phase: string;
  /** One line on what it is. */
  body: string;
  /** Bullet list of what it does. */
  features: string[];
  /** Parts and services it needs, shown as a compact inline list. */
  resources: string[];
}

export interface ProjectsContent {
  items: ProjectContent[];
}

export interface JoinContent {
  /** The single line the section carries. */
  line: string;
  /** What the club is short of — the one ask on the page. */
  focus: string;
  /** Label above the contact list. */
  contactLabel: string;
  /** Label of the button that opens the registration form. */
  cta: string;
}

/** A destination page in the 3D navigation hub. */
export interface NavPageContent {
  id: string;
  /** Route segment under the locale, e.g. "about" → /id/about */
  slug: string;
  /** Short label — module heading and header nav. */
  label: string;
  /** Full page heading. */
  title: string;
  /** One line: the module subtitle, and the page's lead paragraph. */
  body: string;
}

export interface NavHubContent {
  kicker: string;
  title: string;
  lead: string;
  /** Small line under the modules explaining how to move between pages. */
  hint: string;
  /** Instruction for orbiting the 3D model with the pointer. */
  drag: string;
  /** Return-link label shown on every sub-page. */
  back: string;
}

export interface NavHubContentSet {
  hub: NavHubContent;
  pages: NavPageContent[];
}

export interface HomeContent {
  hero: HeroContent;
  stats: StatContent[];
  programs: SectionHeadContent & { items: ProgramContent[] };
  divisions: SectionHeadContent & { leadLabel: string };
  projects: SectionHeadContent & {
    featuresLabel: string;
    resourcesLabel: string;
  };
  join: JoinContent;
  about: AboutContent;
}
