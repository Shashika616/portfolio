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
    desc: "Authentication, authorisation and password security: OAuth/OIDC, TOTP, row-level security, and research into memory-hard and chaotic hashing.",
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
  { group: "Security", items: ["OAuth 2.0 / OIDC", "SAML 2.0", "WSO2 Identity Server", "Asgardeo", "TOTP", "Row-level security"] },
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
