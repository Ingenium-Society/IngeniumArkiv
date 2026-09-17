import type { HomeContent } from "../types";

export const home = {
  hero: {
    eyebrow: "SMA Global Darussalam Academy · Yogyakarta",
    titleLead: "From Ideation, ",
    titleAccent: "Into Creations",
    lead: "The engineering club of SMA Global Darussalam Academy. We turn real problems around us into solutions designed, built, and tested by students.",
    ctaPrimary: "Join the club",
    ctaSecondary: "See projects",
    scroll: "Scroll",
  },

  stats: [
    { id: "members", value: 28, label: "Active members" },
    { id: "divisions", value: 4, label: "Engineering divisions" },
    { id: "projects", value: 2, label: "Kickoff projects" },
    { id: "founded", value: 2026, from: 2000, label: "Founded" },
  ],

  programs: {
    kicker: "Programme",
    title: "What we do",
    lead: "Three programmes running through the year — from reaching partner schools to projects that actually ship.",
    items: [
      {
        id: "forge-outreach",
        meta: "Once a term",
        title: "Forge Outreach",
        body: "Inviting partner elementary and junior high students to GDA for short, hands-on workshops led by club members: simple machines, simple robotics, computer fundamentals, and complex mechanics.",
      },
      {
        id: "the-workbench",
        meta: "Biweekly · Sunday 08.30–11.30",
        title: "The Workbench",
        body: "Members pitch project ideas, then form groups around the ones that gain interest. Each group scopes its project with the Leader and advisor before building.",
      },
      {
        id: "trial-and-iteration",
        meta: "Target 1–2 projects per semester",
        title: "Trial & Iteration",
        body: "Teams develop, prototype, test, and iterate. Projects meeting the criteria may be implemented in school or entered into competitions. Projects that never reach implementation are still documented as engineering learning.",
      },
    ],
  },

  divisions: {
    kicker: "Structure",
    title: "Four divisions",
    lead: "Every member joins one division. Divisions may collaborate across fields on projects that need it.",
    leadLabel: "Head of division",
  },

  projects: {
    kicker: "Projects",
    title: "What we're building",
    lead: "Every project is documented from idea to outcome — including the ones that stall halfway.",
    featuresLabel: "What it does",
    resourcesLabel: "Needs",
  },

  join: {
    line: "We are open.",
    focus:
      "We are especially looking for members for the BioTech division. If you are drawn to biology, health, or lab work, that is where we need you.",
    deadlineLabel: "Deadline",
    deadline: "Friday 18 September 2026, 7:00 AM",
    contactLabel: "Questions? Get in touch:",
    cta: "Open the registration form",
  },

  about: {
    kicker: "Background",
    title: "Why this club exists",
    paragraphs: [
      "There has been no official platform for students interested in engineering to channel that interest in a structured, sustainable way. Many parts of the school environment could still be improved — facilities, learning tools, and other things an engineering approach could develop.",
      "Ingenium Society Club is that platform: a place for students to hone technical skills through one continuous process, from identifying a need and designing a solution to implementing it directly in the school environment.",
      "Our main objective is learning engineering through practical projects. Success is measured by the documented process and reflection each project produces — not by whether every project is fully implemented.",
    ],
    objectivesTitle: "Four objectives",
    objectives: [
      {
        id: "platform",
        title: "An official platform",
        body: "Provide an official platform for students to develop their interest and skills in engineering through real projects.",
      },
      {
        id: "implemented",
        title: "Solutions that get used",
        body: "Increase the number of student-designed solutions or projects actually implemented within the school environment.",
      },
      {
        id: "facilities",
        title: "Better facilities",
        body: "Optimise the potential for improving facilities and student needs through a structured engineering approach.",
      },
      {
        id: "sustainability",
        title: "Sustainability",
        body: "Establish a clear, sustainable club structure so activities continue across year groups.",
      },
    ],
  },
} satisfies HomeContent;
