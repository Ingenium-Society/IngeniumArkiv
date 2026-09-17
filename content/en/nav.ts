import type { NavHubContentSet } from "../types";

export const nav = {
  hub: {
    kicker: "Navigation",
    title: "Where to?",
    lead: "Every part of this club has its own page. To move between them, come back here first, then pick the next module.",
    hint: "Click a module to open its page",
    drag: "Drag to rotate the model",
    back: "Back to navigation",
  },
  pages: [
    {
      id: "about",
      slug: "about",
      label: "About",
      title: "About the club",
      body: "Background, objectives, and the numbers.",
    },
    {
      id: "programs",
      slug: "programs",
      label: "Programmes",
      title: "Club programmes",
      body: "Three programmes that run through the year.",
    },
    {
      id: "divisions",
      slug: "divisions",
      label: "Divisions",
      title: "Engineering divisions",
      body: "Four divisions and who leads them.",
    },
    {
      id: "projects",
      slug: "projects",
      label: "Projects",
      title: "Projects in flight",
      body: "What we're building this semester.",
    },
    {
      id: "join",
      slug: "join",
      label: "Join",
      title: "How to join",
      body: "How to sign up and what's expected.",
    },
  ],
} satisfies NavHubContentSet;
