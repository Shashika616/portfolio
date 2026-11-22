import type { ExperienceItem } from "./types";

/** Work history, newest first. Read by the Experience section and /profile. */
export const EXPERIENCE: ExperienceItem[] = [
  {
    id: "ashirulabs-founder",
    title: "Founder & Software Engineer",
    company: "AshiruLabs",
    duration: "Sep 2026 - Present",
    location: "Colombo, Sri Lanka",
    type: "Founder",
    tech: ["Flutter", "Dart", "Go", "gRPC", "PostgreSQL", "Supabase", "Google Cloud Run", "Next.js 16", "OpenID Connect", "TOTP", "GitHub Actions", "Three.js"],
    overview: "Founded a software product company and built its flagship, TieHere, end to end: the Flutter app on iOS and Android, the Go backend and its operations console, now used by real people.",
    // Real figures only (confirmed by Shashika). Update as the product grows.
    highlights: [
      { value: "31", label: "Production users (Oct 2026)" },
    ],
    description: "I founded AshiruLabs to build and run our own products and to build software for clients the same way. Its first product, TieHere, helps professionals nearby meet in person around one intent. I own it end to end: product decisions, the Flutter app, the Go backend, the database, cloud deployment, security, the admin console and both public websites.",
    challenges: [
      "Every backend change has to keep working with app builds already installed on users' phones, so APIs and auth changes must stay backward compatible.",
      "Running five independently deployed services cost more in infrastructure and operations than a young product needs.",
      "Meeting strangers in person requires trust and safety features that a feed-based app never has to provide.",
      "Operating production safely as a very small team: access control, audit and recovery without a dedicated ops team."
    ],
    achievements: [
      "Shipped TieHere to real users on iOS and Android from a single Flutter codebase.",
      "Rebuilt the backend from five Go microservices into a gateway plus a modular monolith (one Postgres schema per module, in-process event bus), cutting deployables from five services plus Redis and Pub/Sub to two binaries.",
      "Kept every release backward compatible with shipped app builds: API routes and fields are only ever added, and auth changes are checked against the shipped client first.",
      "Built a production admin console (Google OIDC with PKCE plus TOTP, encrypted short-lived sessions, per-request CSP nonce, audited writes with a required reason).",
      "Documented the architecture in 14 decision records and ran recurring security reviews."
    ],
    responsibilities: [
      "Product and architecture: intent-based meetups, a trust ladder from verified credentials, reactive SOS, credits and in-app purchases.",
      "Flutter app for iOS and Android, with environment-specific builds for simulator, emulator and production.",
      "Go API gateway: JWT issuance, per-user rate limiting and REST-to-gRPC translation.",
      "Go modular monolith (auth, meetup, billing, notification, SOS) on PostgreSQL (Supabase), deployed to Google Cloud Run.",
      "Database operations: migrations and backups from GitHub Actions, with connection setup for each environment.",
      "Security: admin API behind service identity, scheduled security checks, privacy-conscious analytics.",
      "Websites: the TieHere brand site (scroll-driven canvas animation) and the AshiruLabs studio site (real-time Three.js scene)."
    ],
    liveLink: "https://ashirulabs.com"
  },
  {
    id: "seefa",
    title: "Software Engineer",
    company: "Seefa Business Solutions",
    duration: "May 2026 - Present",
    location: "Colombo, Sri Lanka",
    tech: [".NET", "AngularJS", "React", "Azure", "Linux VPS", "Coolify", "SSH", "REST APIs", "Authentication", "Authorization", "Audit Logging", "Workflow Automation", "RBAC"],
    overview: "Design and build customer-management and ticket-lifecycle systems: secure authentication, fine-grained permissions, audit logging and automated workflows for 50+ concurrent users.",
    highlights: [
      { value: "99.5%", label: "API uptime" },
      { value: "35%", label: "Faster ticket resolution" },
      { value: "50+", label: "Concurrent users" },
    ],
    description: "I own the engineering of two internal business systems. The first is a customer management application that tracks organisational accounts, commissions, payments and promotion schemes, with secure authentication, fine-grained permission controls and audit logging so every financial transaction is traceable. The second is an end-to-end ticket lifecycle system for product change requests and new features, with automated routing, escalation and role-based assignment.",
    challenges: [
      "Keeping financial transactions fully transparent while meeting strict audit-logging requirements.",
      "Designing ticket routing that scales across change requests of very different complexity.",
      "Building a permission model fine-grained enough for every role without becoming unmanageable."
    ],
    achievements: [
      "Delivered REST APIs serving 50+ concurrent users at 99.5% uptime.",
      "Cut ticket resolution time by 35% with automated routing and escalation.",
      "Faster responses and transparent ticket tracking improved customer satisfaction."
    ],
    responsibilities: [
      "Architect and build the customer management application: accounts, commissions, payments and promotion schemes.",
      "Implement authentication, fine-grained permissions and audit logging.",
      "Build the ticket lifecycle system with automated routing, escalation and role-based assignment.",
      "Design and deliver the REST APIs behind both systems.",
      "Own the production infrastructure: configure and deploy services on Linux VPSs through Coolify and on Azure, and fix incidents directly on the servers over SSH."
    ]
  },
  {
    id: "wso2-internship",
    title: "Software Engineer (Intern)",
    company: "WSO2 LLC",
    duration: "May 2024 - Nov 2024",
    location: "Colombo, Sri Lanka",
    type: "Internship",
    tech: ["WSO2 Identity Server", "Asgardeo", "WSO2 Choreo", "Java", "Spring Boot", "ServiceNow", "JavaScript", "React", "SAML 2.0", "OpenID Connect", "RBAC", "REST APIs", "IAM", "API Management", "Agile"],
    overview: "Implemented enterprise identity and access management for global customers, configuring SSO protocols, and built internal tooling for engineer feedback management.",
    highlights: [
      { value: "100+", label: "Enterprise users on SSO" },
      { value: "40%", label: "Less manual operational overhead" },
    ],
    description: "I worked on enterprise identity and access management. I implemented single sign-on with WSO2 Identity Server and Asgardeo, configuring SAML 2.0 and OpenID Connect for enterprise applications, and supported multi-tenant identity governance with role-based access control for secure federated identity across distributed systems. I also designed and shipped a ServiceNow portal for engineer feedback management.",
    challenges: [
      "Adapting system design as requirements changed during the engagement.",
      "Making SAML 2.0 and OIDC work across enterprise applications with different security requirements.",
      "Managing multi-tenant identity governance with zero downtime during configuration changes.",
      "Keeping authentication flows frictionless without weakening enterprise-grade security."
    ],
    achievements: [
      "Deployed SSO that reduced login friction for 100+ enterprise users across global teams.",
      "Reduced manual operational overhead by 40% with the ServiceNow engineer-feedback portal.",
      "Recognised for mentoring junior team members on IAM concepts and secure coding."
    ],
    responsibilities: [
      "Implemented SSO with WSO2 Identity Server and Asgardeo using SAML 2.0 and OIDC.",
      "Secured APIs with WSO2 Choreo API management.",
      "Supported multi-tenant identity governance with RBAC.",
      "Designed and deployed a ServiceNow portal for engineer feedback, with layered access control.",
      "Built REST APIs, automated notification workflows and dashboards.",
      "Worked with Product, QA, DevOps and Security in sprint planning, code review and production deployments.",
      "Contributed best-practice documentation and mentored junior team members on IAM."
    ]
  }
];
