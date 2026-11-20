/**
 * Content model for the portfolio. Everything visible on the site is typed
 * here and lives in the sibling data modules (catalog.ts, experience.ts,
 * profile.ts), so UI components never own copy.
 */

export interface MediaItem {
  url: string;
  label: string;
  buttonText: string;
}

export interface MediaGroup {
  groupTitle: string;
  items: MediaItem[];
}

export type ProjectCategory =
  | 'AI & ML'
  | 'Distributed Systems'
  | 'Monolithic'
  | 'Research'
  | 'Simulation'
  | 'Cloud'
  | 'Security'
  | 'Web Development'
  | 'Mobile';

/**
 * Where a project stands. Shown as a badge so a reader can tell a shipped
 * product from coursework at a glance.
 */
export type ProjectStatus = 'In production' | 'Client work' | 'Prototype' | 'Academic' | 'Personal';

/** Where the thing runs. Drives the platform filters on both views. */
export type Platform = 'Web' | 'Mobile' | 'Backend' | 'Desktop';

export interface ProjectItem {
  name: string;
  platforms?: Platform[];
  /** One outcome-first sentence for cards and the profile feed (≤ ~160 chars). */
  summary?: string;
  category: ProjectCategory;
  status?: ProjectStatus;
  year?: string;
  /** Shown first on /profile and pinned in the feed. */
  featured?: boolean;
  tech: string[];
  introduction: string;
  problemStatement: string;
  requirements: string[];
  solution: string;
  architecture: string;
  /** Drawn architecture diagram for projects without an image diagram. Facts only. */
  architectureDiagram?: ArchitectureDiagram;
  coreFeatures?: string[];
  technicalHighlights?: string[];
  /** Websites only: what the site ships for search engines (SEO) and AI answer engines (GEO). Facts, no ranking claims. */
  searchVisibility?: string[];
  imageUrl?: string;
  /** Hero image (live screenshot or key diagram). Used by the exhibit intro, feed posts and cards. */
  cover?: string;
  /** Public source only. Omit for private/client repositories, never link a 404. */
  githubLink?: string;
  playLink?: string;
  mediaGroups?: MediaGroup[];
  media?: MediaItem[];
}

/** A layered architecture diagram, rendered by detail/ArchitectureDiagram. Tiers read left → right. */
export interface ArchitectureDiagram {
  tiers: { label: string; nodes: string[] }[];
  notes?: string[];
}

export interface CertificateItem {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  description: string;
  skills: string[];
  imageUrl: string;
  verifyLink: string;
}

export interface Catalog {
  projects: ProjectItem[];
  researches: ProjectItem[];
  games: ProjectItem[];
  certificates: CertificateItem[];
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  duration: string;
  location?: string;
  type: 'Founder' | 'Internship' | 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  tech: string[];
  overview: string;
  /** Headline metrics shown large on the card. Use the user's own figures only. */
  highlights?: { value: string; label: string }[];
  description: string;
  challenges: string[];
  achievements: string[];
  responsibilities: string[];
  imageUrl?: string;
  githubLink?: string;
  liveLink?: string;
  mediaGroups?: MediaGroup[];
}
