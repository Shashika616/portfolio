/**
 * Identity, about, education and contact copy. Shared by the dial dashboard
 * sections and the /profile view. Keep claims factual: if a number or title
 * changes, change it here and both views follow.
 */

export const PROFILE = {
  name: "Shashika Fernando",
  fullName: "W Shashika Madhushan Fernando",
  title: "Software Engineer",
  headline: "Software engineer building secure, distributed and AI-driven systems, from research prototypes to products in production.",
  location: "Colombo, Sri Lanka",
  email: "shashikauda@gmail.com",
  avatar: "/pic.jpeg",
  portrait: "/file.png",
  cv: "/ShashikaFernandoCV.pdf",
  links: {
    github: "https://github.com/Shashika616",
    linkedin: "https://www.linkedin.com/in/shashika-fernando-5399062b5/",
  },
  about: [
    "I'm a software engineer who builds secure, intelligent and scalable systems for real-world problems. My work spans cybersecurity research, distributed systems, AI and system design, and I care as much about how a system is architected and tested as about what it does.",
    "Outside engineering I play sport, write music and analyse games. The same habits carry over: practice, rhythm and a clear read of the situation.",
  ],
} as const;

/** What I work on. Shown as the four focus areas on Welcome/About and /profile. */
export const FOCUS_AREAS = [
  {
    title: "Distributed systems & backend",
    desc: "Gateways, event-driven services and modular monoliths designed to stay reliable, observable and easy to split or merge as they grow.",
  },
  {
    title: "Security & identity",
    desc: "Single sign-on, authorisation and data isolation: OAuth 2.0 / OIDC, SAML, MFA, multi-tenant isolation with PostgreSQL RLS, and research into stronger password hashing.",
  },
  {
    title: "Applied AI",
    desc: "LLM applications that stay grounded in data, model fallback and self-repair loops, and deep-learning work in medical imaging.",
  },
  {
    title: "Product engineering",
    desc: "Shipping and maintaining real products across Flutter and the web, with backward-compatible releases and tested, documented decisions.",
  },
] as const;

export const SKILLS: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["TypeScript", "Go", "Java", "Python", "Dart", "C#", "SQL"] },
  { group: "Backend", items: ["Spring Boot", "Node.js", "NestJS", "FastAPI", "ASP.NET Core", "gRPC", "RabbitMQ", "Redis"] },
  { group: "Frontend & mobile", items: ["Next.js", "React", "Angular", "Flutter", "Tailwind CSS", "Three.js"] },
  { group: "Data & cloud", items: ["PostgreSQL", "Supabase", "SQL Server", "MongoDB", "Google Cloud Run", "Docker", "Vercel"] },
  { group: "Security & identity", items: ["SSO (OAuth 2.0 / OIDC, SAML 2.0)", "WSO2 Identity Server", "Asgardeo", "MFA (TOTP)", "RBAC", "PostgreSQL Row-Level Security (RLS)", "Multi-tenant data isolation", "Argon2id"] },
  { group: "Architecture", items: ["API gateways", "Modular monoliths", "Microservices", "Event-driven design", "Transactional outbox", "Circuit breakers & rate limiting", "Offline-first sync", "Backward-compatible APIs"] },
  { group: "AI & testing", items: ["LLM text-to-SQL", "Multi-model fallback", "Agent loops", "PyTorch (3D U-Net)", "Playwright E2E", "pgTAP", "Unit & authorisation testing"] },
];

export const EDUCATION = [
  {
    school: "University of Ruhuna",
    degree: "BCS (Hons) in Computer Science",
    year: "2026",
    grade: "GPA 3.87 / 4.0",
    detail: "Focus on systems architecture, databases, cryptography and AI, with a mandatory industrial training placement building production backend systems.",
  },
  {
    school: "Ananda College, Colombo 10",
    degree: "GCE Advanced Level, Physical Science",
    year: "2019",
    grade: undefined,
    detail: "Combined Mathematics, Physics and Chemistry.",
  },
] as const;

export const COURSEWORK = [
  "Data Structures & Algorithms", "Distributed Systems", "Software Architecture", "Design Patterns",
  "Data & Network Security", "Compiler Design", "Automata Theory", "Formal Verification",
  "Predicate Calculus", "Discrete Mathematics", "Operating Systems", "Computer Systems",
  "Database Management", "Relational Models", "Data Warehousing & Data Mining", "Neural Networks & AI",
  "Computer Graphics & Image Processing", "Internet Services & Protocols", "OOSD & OOP",
  "Algebra", "Project Management", "E-Commerce & Professional Practice",
];

/**
 * What I bring: capability statements, each backed by real, sourced figures
 * (from experience.ts, catalog.ts and the user's own notes). Shown at the top
 * of Experience (dial) and Career (/profile). Never add a figure without a source.
 */
export const CAPABILITIES: { title: string; statement: string; evidence: { value: string; label: string }[] }[] = [
  {
    title: "Ship and run real products",
    statement: "I take products from idea to production and keep them running for real users, across mobile, web and backend.",
    evidence: [
      { value: "31", label: "production users on TieHere (Oct 2026)" },
      { value: "2", label: "live company sites: tiehere.com, ashirulabs.com" },
    ],
  },
  {
    title: "Reliable, efficient backends",
    statement: "I design services that stay up under load and cost less to run.",
    evidence: [
      { value: "99.5%", label: "API uptime for 50+ concurrent users (Seefa)" },
      { value: "5 → 2", label: "deployables after consolidating TieHere's backend" },
    ],
  },
  {
    title: "Security and identity",
    statement: "I build authentication, access control and data separation that hold up, and I prove it with tests.",
    evidence: [
      { value: "100+", label: "enterprise users moved to single sign-on (WSO2)" },
      { value: "38", label: "database tests proving each client only sees their own data (PostgreSQL RLS)" },
    ],
  },
  {
    title: "Quality you can measure",
    statement: "I test what matters and keep systems maintainable with documented decisions.",
    evidence: [
      { value: "435", label: "tests on one platform, 95% coverage of access-control code" },
      { value: "14", label: "architecture decision records on TieHere" },
    ],
  },
  {
    title: "Faster teams and operations",
    statement: "I automate the busywork so teams resolve issues faster.",
    evidence: [
      { value: "35%", label: "faster ticket resolution (Seefa)" },
      { value: "40%", label: "less manual operational overhead (WSO2)" },
    ],
  },
  {
    title: "Research and applied AI",
    statement: "I turn research into working systems, from password security to medical imaging and grounded AI analysts.",
    evidence: [
      { value: "3.87", label: "GPA out of 4.0, BCS (Hons) Computer Science" },
      { value: "8", label: "read-only views an AI analyst is confined to, so it can't change data" },
    ],
  },
];

/** Role-targeted CVs (sources in /cv, copies served from /public/cv). */
export const CVS = [
  { id: "general", role: "Complete", focus: "Every role and project in one CV, for any software engineering role", file: "/cv/Shashika_Fernando_CV.pdf" },
  { id: "swe", role: "Software Engineer", focus: "Backend, distributed systems, security and full-stack product work", file: "/cv/Shashika_Fernando_Software_Engineer_CV.pdf" },
  { id: "ai", role: "AI Engineer", focus: "Grounded LLM systems, agent loops, multi-model fallback and deep learning", file: "/cv/Shashika_Fernando_AI_Engineer_CV.pdf" },
  { id: "sre", role: "Site Reliability Engineer", focus: "Uptime, failure handling, CI/CD, backups and production security", file: "/cv/Shashika_Fernando_Site_Reliability_Engineer_CV.pdf" },
] as const;
export const CV_BUNDLE = "/cv/Shashika_Fernando_CVs.zip";
