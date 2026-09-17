import type { Locale } from "@/lib/i18n";
import { site as siteId } from "./id/site";
import { site as siteEn } from "./en/site";
import { home as homeId } from "./id/home";
import { home as homeEn } from "./en/home";
import { divisions as divisionsId } from "./id/divisions";
import { divisions as divisionsEn } from "./en/divisions";
import { projects as projectsId } from "./id/projects";
import { projects as projectsEn } from "./en/projects";
import { nav as navId } from "./id/nav";
import { nav as navEn } from "./en/nav";

/**
 * Static maps rather than dynamic `import()` — the bundler can see every
 * branch, and adding a locale is a compile error until it is registered here.
 */
const site = { id: siteId, en: siteEn } as const;
const home = { id: homeId, en: homeEn } as const;
const divisions = { id: divisionsId, en: divisionsEn } as const;
const projects = { id: projectsId, en: projectsEn } as const;
const nav = { id: navId, en: navEn } as const;

export const getSite = (locale: Locale) => site[locale];
export const getHome = (locale: Locale) => home[locale];
export const getDivisions = (locale: Locale) => divisions[locale];
export const getProjects = (locale: Locale) => projects[locale];
export const getNav = (locale: Locale) => nav[locale];
