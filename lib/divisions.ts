/**
 * Division accent colours.
 *
 * Presentation, not content — deliberately kept out of `content/` so those files
 * stay language data only. Muted on purpose: the page is otherwise strictly navy
 * and gold, so these appear only on the hairline above each division and on its
 * head label. Falls back to brand gold for any id without an accent.
 */
const DIVISION_ACCENT: Record<string, string> = {
  "software-ai": "#4fa3d1",
  "aerospace-mechanical": "#e07a4a",
  mechatronics: "#7fb069",
  "biotech-environmental": "#4fbf9f",
};

export function accentFor(id: string): string {
  return DIVISION_ACCENT[id] ?? "#b8a95d";
}
