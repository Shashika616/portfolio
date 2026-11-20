import type { ProjectItem } from "./types";
import { CATALOG } from "./catalog";

/**
 * Work filters shared by the dial's Projects section and the /profile feed,
 * so both views slice the work the same way. A filter only renders when at
 * least one item matches, so no chip ever leads to an empty grid.
 */
export interface WorkFilter {
  id: string;
  label: string;
  test: (p: ProjectItem) => boolean;
}

export const WORK_FILTERS: WorkFilter[] = [
  { id: "all", label: "All", test: () => true },
  { id: "live", label: "Live", test: (p) => p.status === "In production" || !!p.playLink },
  { id: "web", label: "Websites", test: (p) => !!p.platforms?.includes("Web") },
  { id: "mobile", label: "Mobile apps", test: (p) => !!p.platforms?.includes("Mobile") },
  { id: "backend", label: "Backend & distributed", test: (p) => !!p.platforms?.includes("Backend") || p.category === "Distributed Systems" },
  { id: "ai", label: "AI & ML", test: (p) => p.category === "AI & ML" },
  { id: "desktop", label: "Desktop", test: (p) => !!p.platforms?.includes("Desktop") },
  { id: "client", label: "Client work", test: (p) => p.status === "Client work" },
  { id: "research", label: "Research", test: (p) => CATALOG.researches.includes(p) },
  { id: "games", label: "Games", test: (p) => CATALOG.games.includes(p) || p.name.startsWith("Compiler Arena") },
];

/** Filters that match at least one item in `items`, with counts. */
export function availableFilters(items: ProjectItem[]) {
  return WORK_FILTERS.map((f) => ({ ...f, count: items.filter(f.test).length })).filter((f) => f.count > 0);
}
