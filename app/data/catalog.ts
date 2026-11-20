import type { Catalog } from "./types";

/**
 * Every project, research piece, game and certificate shown on the site.
 * Both views (the watch-dial dashboard and /profile) read from here.
 * See docs/CONTENT.md for how to add an entry.
 */
export const CATALOG: Catalog = {
  researches: [
    { 
      name: "Plot Based Chaotic Hashing Pipeline", 
      cover: "/hash-pipeline/graph-hash.png",
      featured: true,
      summary: "Final-year research: chaotic-map pre-hashing that expands low-entropy passwords before Argon2id, raising brute-force cost without asking users to remember more.",
      status: "Academic",
      category: "Research",
      tech: ["HMAC-SHA256", "Argon2id", "Python", "Chaotic Maps", "LaTeX"],
      imageUrl: "",
      introduction: "An academic investigation into expanding low-entropy password strings into high-dimensional, chaotic manifolds to increase computational complexity against attacks, freeing users from having to memorize complex passwords.",
      problemStatement: "Users naturally choose simple, memorable, low-entropy passwords and frequently reuse them, making compromised credentials the leading vector for data breaches. Traditional memory-hard hashing functions (like Argon2, bcrypt, scrypt) increase computational costs for attackers but do not alter the underlying weak structure or low entropy of the password itself.",
      requirements: [
        "Dynamically expand low-entropy source strings without increasing user cognitive load or memorization bounds.",
        "Achieve a measurable increase in computational complexity against highly parallelized GPU/ASIC brute-force clusters.",
        "Ensure strict deterministic stability across variable dimensions (D = 3-8) and chaotic map iterations (I = 1-10).",
        "Preserve absolute Shannon entropy characteristics without introducing predictable bits or mathematical bias arrays.",
        "Maintain transactional authentication throughput execution bounds strictly within < 200ms limits."
      ],
      solution: "Engineered a deterministic, multi-dimensional pre-hashing transformation layer that maps character inputs into continuous space using custom chaotic functions (Logistic/Henon maps) before traditional salting pipelines.",
      architecture: "Ingests inputs via an initial HMAC-SHA256 token array to dynamically derive spatial dimensions and iterative mapping indices. Values are swept through chaotic manifold matrices, normalized, amplified using a cascading XOR avalanche accumulator, and passed downstream into hard memory-lane Argon2id execution blocks.",
      githubLink: "https://github.com/Shashika616/Research_Hashing_Pipeline.git",
      mediaGroups: [
        {
          groupTitle: "System Architecture",
          items: [
            { url: "/hash-pipeline/graph-hash.png", label: "Solution Architecture", buttonText: "View Architectural Diagram" }
          ]
        },
        {
          groupTitle: "Performance Analysis",
          items: [
            { url: "/hash-pipeline/time-comparison.png", label: "Time Complexity Comparison", buttonText: "View Comparison Table" },
            { url: "/hash-pipeline/stat-comparison.png", label: "Statistical Comparison", buttonText: "View Comparison Table" }
          ]
        },
        {
          groupTitle: "Practical Analysis",
          items: [
            { url: "/hash-pipeline/prac-dep.png", label: "Practical Dependency Analysis", buttonText: "View Comparison Table" }
          ]
        }
      ]
    },
    { 
      name: "Medical Image Processing", 
      architectureDiagram: {
        "tiers": [
          {
            "label": "Input",
            "nodes": [
              "Multi-slice CT volumes",
              "TorchIO intensity rescaling",
              "Random spatial crops + augmentation"
            ]
          },
          {
            "label": "Encoder",
            "nodes": [
              "3D convolution blocks",
              "Max-pooling down to bottleneck"
            ]
          },
          {
            "label": "Decoder",
            "nodes": [
              "ConvTranspose3D upsampling",
              "Residual skip connections"
            ]
          },
          {
            "label": "Output",
            "nodes": [
              "Voxel-wise liver + tumour masks",
              "Joint Dice + Cross-Entropy loss"
            ]
          }
        ],
        "notes": [
          "Patch-based sampling keeps full-resolution 3D volumes within local GPU memory."
        ]
      },
      cover: "/medical-image/tumor1.jpg",
      summary: "3D U-Net that segments liver and tumour volumes from CT scans, using patch-based sampling to fit volumetric data on local hardware.",
      status: "Academic",
      category: "AI & ML",
      tech: ["PyTorch", "3D U-Net", "TorchIO", "PyTorch Lightning", "Medical Imaging"],
      introduction: "Saving Time, Saving Lives: Automated 3D Liver Tumor Segmentation: A deep learning medical imaging study focused on building high-precision convolutional networks for volumetric pixel segmentation of liver structures and tumor masses from CT imagery.",
      problemStatement: "Manual segmentation of liver and tumor volumes from CT scans by radiologists is highly time-intensive, slow, and prone to inter-observer variability. Furthermore, tumors vary widely in size, shape, and location, rendering classical rule-based image processing ineffective.",
      requirements: [
        "Automate volumetric, voxel-wise identification of unpredictable tumor geometry, bounds, and arbitrary edge masses.",
        "Process high-density 3D medical arrays natively without experiencing devastating spatial data drops or downsampling artifacts.",
        "Implement adaptive patch-focused sampling paradigms to counteract severe physical memory allocations on local hardware.",
        "Bypass structural overfitting trends and optimize semantic segmentation accuracy metrics across low-contrast scans."
      ],
      solution: "Developed a robust volumetric 3D U-Net pipeline capable of computing dense continuous slice extractions through deep encoder-decoder paths driven by dynamic multi-phase learning configurations.",
      architecture: "Processes raw multi-slice CT inputs using TorchIO intensity rescaling, random spatial crops, and structural augmentations. Data is routed down a deep 3D convolutional encoder path, downsampled via deep max-pooling bottleneck layers, upscaled using trainable ConvTranspose3D channels, and converged via residual skip connections under a joint Dice-CrossEntropy loss function optimization loop.",
      githubLink: "https://colab.research.google.com/drive/12NcQTbb8J7l2kdB7Rxb_Q9PuANjlIzpo?usp=sharing#scrollTo=LUDdiSL4ROOu",
      mediaGroups: [
        {
          groupTitle: "CT Scan Samples",
          items: [
            { url: "/medical-image/tumor1.jpg", label: "3D-CT Scan Sample", buttonText: "View Sample Scan" },
            { url: "/medical-image/tumor2.jpg", label: "3D-CT Scan Slice Sample", buttonText: "View Sample Scan" }
          ]
        },
        {
          groupTitle: "Model Results",
          items: [
            { url: "/medical-image/tumor3.mp4", label: "Scan Capture of the CNN", buttonText: "View Capture" },
            { url: "/medical-image/confusion-matrix1.jpg", label: "Confusion Matrix", buttonText: "View Matrix Result" }
          ]
        }
      ]
    }
  ],
  projects: [
    {
      name: "AshiruLabs - Studio Website with a Real-Time 3D Scene",
      architectureDiagram: {
        "tiers": [
          {
            "label": "Content",
            "nodes": [
              "Sections tagged as stations",
              "All copy in content/site.ts"
            ]
          },
          {
            "label": "Scroll loop",
            "nodes": [
              "Keyframes measured from sections",
              "Eases figure to target pose",
              "Writes readout to DOM directly"
            ]
          },
          {
            "label": "Scene",
            "nodes": [
              "Three.js (lazy-loaded chunk)",
              "Figure + staircase"
            ]
          }
        ],
        "notes": [
          "Lenis smooths wheel on desktop; touch keeps native momentum; static scene under reduced motion."
        ]
      },
      searchVisibility: [
        "Organization and SoftwareApplication structured data (JSON-LD), so search and AI answer engines read the company and its product as entities, not just text.",
        "Canonical URL, Open Graph and Twitter metadata, and a generated Open Graph image for clean link previews.",
        "Generated sitemap.xml and robots.txt from the same single content file as the copy.",
        "All content is server-rendered and readable without WebGL, so crawlers and assistive tech get the full page."
      ],
      summary: "Company site where scrolling walks a 3D figure up a staircase, one landing per section, rendered live in Three.js and kept fully readable without WebGL.",
      cover: "/work/ashirulabs.jpg",
      category: "Web Development",
      platforms: ["Web"],
      year: "2026",
      tech: ["Next.js 16", "Three.js", "Lenis", "TypeScript", "WebGL"],
      introduction: "The website for AshiruLabs (ashirulabs.com), a software product company in Sri Lanka that builds its own products, like TieHere, and builds software for clients. The hero is a real-time 3D scene: a figure climbs a staircase as you scroll, pausing on a landing for each section.",
      problemStatement: "A studio site has to show craft rather than claim it, but heavy 3D can easily cost load time, accessibility and mobile performance, and scroll-driven scenes tend to drift out of sync with the content as copy changes.",
      requirements: [
        "Real-time 3D hero that stays fast and responsive on mobile.",
        "Scroll position drives the scene without the scene ever drifting out of sync with the copy.",
        "Every word readable without WebGL; a static scene under reduced motion.",
        "No invented clients, metrics or testimonials: every claim lives in one content file."
      ],
      solution: "One animation loop maps scroll position to a point on the staircase through keyframes measured from the sections themselves, so editing copy can never desync the climb. The figure eases toward that point at a walking pace, the instrument readout is written straight to the DOM with no per-frame React renders, and the WebGL scene loads as a separate chunk after first paint.",
      architecture: "Next.js App Router page with sections tagged as stations → a single scroll loop computing the target pose → the Three.js scene (loaded lazily) renders the figure and stairs. Lenis smooths wheel input on desktop and is skipped on touch and under reduced motion. All copy and contact details live in content/site.ts.",
      githubLink: "https://github.com/Shashika616/AshiruLabs",
      playLink: "https://ashirulabs.com"
    },
    {
      name: "TieHere - Proximity App for Professionals to Meet in Person",
      architectureDiagram: {
        "tiers": [
          {
            "label": "Client",
            "nodes": [
              "Flutter app (Android, iOS)",
              "REST over HTTPS"
            ]
          },
          {
            "label": "Edge",
            "nodes": [
              "Go API gateway",
              "JWT issuance (holds signing key)",
              "Per-user rate limiting",
              "REST → gRPC"
            ]
          },
          {
            "label": "Core",
            "nodes": [
              "Go modular monolith",
              "auth · meetup · billing · notification · SOS",
              "In-process event bus"
            ]
          },
          {
            "label": "Data",
            "nodes": [
              "PostgreSQL on Supabase",
              "One schema per module, no cross-schema FKs"
            ]
          }
        ],
        "notes": [
          "Gateway and monolith run as two services on Google Cloud Run.",
          "Operations: Next.js admin console → private Go admin API (OIDC + TOTP, audited writes)."
        ]
      },
      searchVisibility: [
        "Brand site ships FAQPage structured data: each question and answer is machine-readable, the format AI answer engines and rich results quote directly (GEO).",
        "MobileApplication and Organization structured data describe the app and its maker as entities.",
        "Open Graph and Twitter metadata for link previews; product copy kept in one source of truth so the site never claims what the app doesn't ship."
      ],
      platforms: ["Mobile", "Backend", "Web"],
      cover: "/work/tiehere.jpg",
      summary: "A live product: Flutter app, Go API gateway and modular monolith over gRPC, Postgres on Supabase, Cloud Run, and a hardened admin console.",
      category: "Distributed Systems",
      status: "In production",
      year: "2026",
      featured: true,
      tech: ["Flutter", "Dart", "Go", "gRPC", "PostgreSQL (Supabase)", "Google Cloud Run", "Next.js 16", "OpenID Connect + PKCE", "TOTP 2FA"],
      introduction: "TieHere, the flagship product of AshiruLabs, helps professionals nearby meet in person around one specific intent: a coffee, a meal, networking, mentorship and more. It ships to real users on Android and iOS, with a brand site at tiehere.com and an operations console at admin.tiehere.com.",
      problemStatement: "Professional networks optimise for feeds and follower counts, not for meeting. Meeting a stranger in person also needs trust signals and safety features a feed never had to provide. And once real users are on the app, every backend change has to keep working with builds already installed on their phones.",
      requirements: [
        "Match people by proximity and intent without revealing anyone's exact location.",
        "Grade trust from verified credentials (phone, company email) and gate safety features behind a minimum trust level.",
        "Run a credits economy and in-app purchases from day one.",
        "Keep every backend change backward compatible with shipped app builds; never force an update.",
        "Give a small team a secure operations console for members, meetups, revenue and audit."
      ],
      solution: "Built first as five independently deployed Go microservices, then rebuilt as a modular monolith behind a thin API gateway. One Postgres database holds one schema per module (auth, meetup, billing, notification, SOS) with no cross-schema foreign keys, and an in-process event bus replaces Pub/Sub, so deploying means two binaries instead of five services plus Redis. The gateway issues JWTs, rate-limits per user and translates REST to gRPC. Fourteen architecture decision records capture the trade-offs.",
      architecture: "Flutter client → REST → Go API gateway (JWT issuance, per-user rate limiting, REST-to-gRPC translation) → Go modular monolith (auth, meetup, billing, notification and SOS modules, each owning a Postgres schema and exposing one Go interface, with cross-module events on an in-process bus) → PostgreSQL on Supabase. Services run on Google Cloud Run. A separate private admin API serves the Next.js admin console.",
      coreFeatures: [
        "Intent-based meetups (coffee, meal, networking, mentorship and more) discovered by proximity.",
        "Trust ladder built from verified credentials, with safety features reserved for higher trust levels.",
        "Reactive SOS with trusted contacts.",
        "Credits and in-app purchases, with account deletion and account claim flows.",
        "Admin console: member management, promotions, revenue and churn analytics, and a full audit log."
      ],
      technicalHighlights: [
        "Every module can be lifted back out into its own service: isolated schemas, no cross-schema foreign keys, one Go interface per module (ADR-001).",
        "Viewer coordinates are quantised before use so proximity search never exposes an exact location (ADR-004).",
        "The gateway holds the signing key and mints tokens; the monolith authenticates but never sees the private key.",
        "Backward-compatibility discipline: API routes and JSON fields are only ever added, and auth-claim changes are checked against the shipped client before deploy.",
        "Admin console security: Google OIDC with PKCE plus TOTP, encrypted SameSite=Strict session cookies (8 h max, 30 min idle), per-request CSP nonce, 60-second signed tokens to the admin API, and a required reason on every audited write.",
        "Brand site renders a scroll-driven particle 'film' on a single canvas, frame by frame, with no video file to download."
      ],
      githubLink: "https://github.com/Shashika616/Professional-Meetups",
      playLink: "https://tiehere.com"
    },
    {
      name: "Enterprise Ticket Management System",
      architectureDiagram: {
        "tiers": [
          {
            "label": "Surfaces",
            "nodes": [
              "Client portal",
              "Agent & developer workspace",
              "Admin console"
            ]
          },
          {
            "label": "Application",
            "nodes": [
              "Next.js 16 App Router",
              "Server Actions",
              "Auth, sessions & storage behind providers"
            ]
          },
          {
            "label": "Data access",
            "nodes": [
              "Typed DAL (Drizzle + postgres.js)",
              "ESLint-enforced import boundaries"
            ]
          },
          {
            "label": "Database",
            "nodes": [
              "PostgreSQL 16",
              "Row-level security policies",
              "pgTAP-tested"
            ]
          }
        ],
        "notes": [
          "Supabase in production, Docker locally; runs fully offline for development and tests."
        ]
      },
      platforms: ["Web"],
      summary: "Ticketing platform with client portal, agent workspace and admin console, secured by Postgres row-level security and mandatory 2FA; 435 unit tests, 19 E2E specs.",
      category: "Web Development",
      status: "Client work",
      year: "2026",
      featured: true,
      tech: ["Next.js 16", "React 19", "TypeScript (strict)", "PostgreSQL 16", "Supabase", "Drizzle ORM", "Playwright", "pgTAP", "Tailwind CSS 4"],
      introduction: "A client request and ticket management system for a software services company: one Next.js monolith serving three surfaces. Clients raise and track requests, agents and developers work them under SLA policies, and admins manage staff, clients, categories, templates and audit.",
      problemStatement: "A services company needs one place where clients raise requests and staff resolve them, with strict separation so no client can ever see another client's data, and with authentication strong enough for an admin console that controls everything.",
      requirements: [
        "Three role-scoped surfaces (client portal, agent workspace, admin console) in one deployable.",
        "Invite-only accounts with single-use, 7-day invite tokens; passwords of 12+ characters checked against breached-password data.",
        "Mandatory TOTP for admins and leads, enforced on every request rather than only at sign-in.",
        "Tenant isolation enforced in the database itself, not just in application code.",
        "SLA policies with first-response targets communicated to the client."
      ],
      solution: "Built a single Next.js 16 monolith (App Router, Server Actions) over PostgreSQL with row-level security. All database access goes through a data-access layer, and ESLint boundary rules enforce the architecture: the portal can only import its own DAL, components never import the DAL or providers, and raw HTML rendering is confined to one sanitising component.",
      architecture: "Next.js App Router with Server Actions → typed data-access layer (Drizzle + postgres.js) → PostgreSQL 16 with row-level security policies (Supabase in production, Docker locally). Authentication, sessions and file storage sit behind provider interfaces, so the whole system also runs fully offline for development and tests.",
      coreFeatures: [
        "Client portal: per-type request forms with attachments and autosaved drafts, confirmation emails with the first-response target, reply, confirm and reopen.",
        "Agent and developer workspace: assignment, work log and submit-for-review flow.",
        "Admin console: staff, clients, categories, SLA policies, templates, settings and audit.",
        "Password or magic-link sign-in, breached-password check (HIBP k-anonymity), rate limiting and sign-out-everywhere."
      ],
      technicalHighlights: [
        "435 unit and authorisation-matrix tests; 95% statement and 93% branch coverage on domain and authorisation code.",
        "38 pgTAP assertions verify the row-level security policies directly in Postgres.",
        "19 Playwright end-to-end specs, including IDOR and role-scope checks, an accessibility scan with zero axe violations, and the mobile portal.",
        "TypeScript strict mode with noUncheckedIndexedAccess; dependency audit clean."
      ]
    },
    {
      name: "AI Data Analyst for a Bakery Business",
      architectureDiagram: {
        "tiers": [
          {
            "label": "Interface",
            "nodes": [
              "Chat UI",
              "Answers as table + chart + the SQL used",
              "Export to HTML / CSV"
            ]
          },
          {
            "label": "Routing",
            "nodes": [
              "Analytics question",
              "Production question"
            ]
          },
          {
            "label": "Engines",
            "nodes": [
              "LLM text-to-SQL (read-only)",
              "Deterministic production planner"
            ]
          },
          {
            "label": "Data",
            "nodes": [
              "SQL Server",
              "8 curated read-only views"
            ]
          }
        ],
        "notes": [
          "Single figures and totals are written by code, never by the model.",
          "“How much should we bake” always goes to the planner, never the AI."
        ]
      },
      platforms: ["Web"],
      summary: "Managers ask questions in plain English and get answers, charts and the SQL behind them, from read-only views, with a production planner the AI cannot override.",
      category: "AI & ML",
      status: "Client work",
      year: "2026",
      tech: ["Python", "LLM text-to-SQL", "Microsoft SQL Server", "T-SQL", "JavaScript", "Docker"],
      introduction: "A web application for the managers of a multi-outlet bakery business to ask questions about production, sales, waste, stock and transfers in plain English, and to get a production plan for the coming days, all answered from the company's own database.",
      problemStatement: "Managers need answers from operational data without writing SQL, but a language model that guesses numbers, or can touch the data, is not acceptable for decisions about what to produce and send to each outlet.",
      requirements: [
        "Answer plain-English questions from the database, never from the model's own knowledge.",
        "Give the AI read-only access to a small, curated set of views.",
        "Make every number that could be got wrong (single figures, totals over many rows) come from code, not from the model.",
        "Plan production per item per outlet from what actually sold, with a buffer for waste."
      ],
      solution: "Built a chat engine that turns each question into SQL over eight purpose-built read-only views, runs it, and answers with a table, a chart where useful, and the SQL it used. Production questions are always routed to a deterministic planner rather than the model.",
      architecture: "Chat UI → question routing (analytics vs. production planning) → LLM-generated SQL constrained to eight read-only views → SQL Server → answers composed by code for figures and totals, with the model limited to wording. Sessions survive expiry without losing the unsent question, and conversations export to HTML or CSV."
    },
    {
      name: "Offline-First Field Sales App",
      architectureDiagram: {
        "tiers": [
          {
            "label": "Device",
            "nodes": [
              "Flutter app (phone & tablet)",
              "Local database: every screen reads/writes here"
            ]
          },
          {
            "label": "Sync",
            "nodes": [
              "Sync engine",
              "Queues changes offline",
              "Syncs exactly once"
            ]
          },
          {
            "label": "API",
            "nodes": [
              "ASP.NET Core (.NET 8)",
              "Maps onto existing schema"
            ]
          },
          {
            "label": "Back office",
            "nodes": [
              "Existing SQL Server database",
              "Unaltered: no parallel system"
            ]
          }
        ]
      },
      platforms: ["Mobile", "Backend"],
      summary: "Flutter app for about 20 field sales reps that works fully offline and syncs exactly once, built over the company's existing SQL Server back office without altering it.",
      category: "Mobile",
      status: "Client work",
      year: "2026",
      tech: ["Flutter", "Dart", "ASP.NET Core (.NET 8)", "Microsoft SQL Server", "Offline sync", "Docker"],
      introduction: "An Android app (phone and tablet) for a building-materials distributor's field sales reps, who cover hardware, tile and bathware shops across southern and central Sri Lanka. Reps check in, visit customers, take orders, record returns, collect payments, register new shops and close the day with a cash declaration.",
      problemStatement: "Reps work standing in shops, often one-handed, in bright sunlight and with weak or no signal. Paper and phone calls to the back office lose orders and cause double entry, and any new system has to land data in the tables the office already works from.",
      requirements: [
        "Every screen reads and writes the device; only the sync engine talks to the server.",
        "Never lose an order, payment or return, and never let a rep enter something twice because they could not tell whether it was sent.",
        "Write into the existing back-office database without altering it: no parallel system, no re-keying.",
        "Usable one-handed, in sunlight, on phones and 10-inch tablets."
      ],
      solution: "An offline-first Flutter client with a local store and a dedicated sync engine, talking to an ASP.NET Core API that maps directly onto the existing SQL Server schema. Requirements, data model and delivery plan are specified in more than 40 documents before and alongside the build.",
      architecture: "Flutter app (local database, sync engine) ⇄ ASP.NET Core API ⇄ existing Microsoft SQL Server back-office database. Daily rhythm modelled end to end: GPS and battery check-in, visits, orders, returns, collections, no-sale reasons, new-customer registration and day-end declaration."
    },
    {
      name: "Healthy Meal Pre-Ordering App and Backend",
      architectureDiagram: {
        "tiers": [
          {
            "label": "Client",
            "nodes": [
              "Flutter app",
              "Android & iOS, one codebase",
              "27-screen Figma design"
            ]
          },
          {
            "label": "Backend",
            "nodes": [
              "NestJS modular monolith",
              "7 modules, one Node process",
              "Modules talk only through events"
            ]
          },
          {
            "label": "Data",
            "nodes": [
              "PostgreSQL (database per module)",
              "Redis"
            ]
          }
        ],
        "notes": [
          "Separately deployed fork of the web backend; shared-code changes are additive only, so web behaviour never changes."
        ]
      },
      platforms: ["Mobile", "Backend"],
      summary: "Cross-platform Flutter app built from a 27-screen Figma design, on a NestJS modular-monolith backend fork that adds mobile support without changing web behaviour.",
      category: "Mobile",
      status: "Client work",
      year: "2026",
      tech: ["Flutter", "Dart", "NestJS", "Node.js", "PostgreSQL", "Redis", "Google Sign-In", "Docker"],
      introduction: "The customer mobile app for a healthy pre-ordered meals service in Sri Lanka, targeting Android and iOS from one codebase, together with the mobile backend it runs on.",
      problemStatement: "The business already had a live web platform. The mobile app needed its own backend changes without putting web customers at risk, and had to run identically on Android and iOS.",
      requirements: [
        "Implement the 27-screen Figma mobile design on Android and iOS from one codebase.",
        "Support mobile without altering anything web customers already depend on.",
        "Run the full stack locally for development and device testing."
      ],
      solution: "Built the Flutter app and maintain a separately deployed fork of the NestJS backend. Upstream changes are pulled in through a fetch-only remote, and every change to shared code is additive (new routes, new fields), verified against the web endpoints before release.",
      architecture: "Flutter client → NestJS modular monolith: one Node process with seven modules, each owning its own database and communicating only through events, so any module can be lifted into its own deployment later. PostgreSQL and Redis run in Docker locally."
    },
    {
      name: "Modern Womenswear Storefront",
      architectureDiagram: {
        "tiers": [
          {
            "label": "Pages",
            "nodes": [
              "Home: 120-frame canvas film",
              "Shop: filter & sort",
              "Product: statically generated",
              "Checkout"
            ]
          },
          {
            "label": "Domain",
            "nodes": [
              "Catalogue with O(1) slug index",
              "Pure cart reducer",
              "zod schemas"
            ]
          },
          {
            "label": "Server",
            "nodes": [
              "POST /api/orders",
              "Validation + rate limiting",
              "Server-confirmed order reference"
            ]
          }
        ],
        "notes": [
          "Domain code is framework-free and shared by client and server."
        ]
      },
      searchVisibility: [
        "Every product page is statically generated at build time (generateStaticParams): fast, fully crawlable HTML for each piece in the catalogue.",
        "Clean, readable URLs per product (/product/[slug]) and filterable collection URLs (/shop?c=dresses)."
      ],
      platforms: ["Web"],
      cover: "/work/storefront.jpg",
      summary: "Storefront prototype with a scroll-scrubbed 120-frame canvas film, GSAP and Lenis motion, statically generated product pages and a validated order API.",
      category: "Web Development",
      status: "Prototype",
      year: "2026",
      tech: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "GSAP ScrollTrigger", "Lenis", "Zod"],
      introduction: "A prototype storefront for a modern womenswear label: a cinematic home page, a filterable shop, product pages and a checkout with Cash on Delivery or bank transfer.",
      problemStatement: "A small fashion label needs a store that feels like the brand, not a template, while staying fast on mobile and simple to run without a full e-commerce platform.",
      requirements: [
        "Scroll-driven brand storytelling that stays smooth on mobile.",
        "Fast, statically generated product pages with size guide and sticky mobile buy bar.",
        "A checkout that confirms orders on the server and validates every input."
      ],
      solution: "Framework-free domain code (catalogue with O(1) slug index, a pure cart reducer, zod validation schemas) shared by client and server, with scroll motion handled by GSAP ScrollTrigger and Lenis and a 120-frame canvas sequence in place of video.",
      architecture: "Next.js App Router: static product pages generated at build time, client cart state from a pure reducer with safe storage parsing, and a POST /api/orders endpoint with zod validation and rate limiting that returns a server-confirmed order reference."
    },
    {
      name: "VoltNexus - Cloud-Native EV Charging Microservices Platform",
      platforms: ["Web", "Backend"],
      cover: "/ev/evArch.png",
      featured: true,
      summary: "Event-driven EV-charging platform: Spring Cloud Gateway, RabbitMQ with the transactional outbox, and Asgardeo OAuth via a custom JWT decoder.",
      status: "Personal",
      category: "Distributed Systems",
      tech: ["Java 19", "Spring Boot 4", "Spring Cloud Gateway", "Angular 17+", "PostgreSQL (Supabase)", "Redis (Upstash)", "RabbitMQ (CloudAMQP)", "Resilience4j", "WSO2 Asgardeo"],
      introduction: "A scalable, secure, and event-driven microservices platform for managing EV charging stations, user bookings, and real-time grid load balancing. It features a modern, SSR-safe Angular frontend and a robust, reactive API Gateway to ensure high availability and seamless user experiences.",
      problemStatement: "Traditional EV charging management systems often rely on monolithic architectures that create centralized bottlenecks, lack real-time grid load awareness, and struggle with fragmented user experiences. Managing distributed charging infrastructure requires high availability, strict role-based access control (RBAC), and resilient inter-service communication, which traditional setups fail to provide efficiently without risking cascading failures or data inconsistency.",
      requirements: [
        "Implement secure, decentralized authentication and fine-grained RBAC (Driver vs. Station Owner) using WSO2 Asgardeo and OAuth 2.0/OIDC protocols.",
        "Build a resilient, reactive API Gateway to centralize cross-cutting concerns like routing, Redis-backed rate limiting, and circuit breaking to protect downstream microservices.",
        "Ensure eventual data consistency across distributed, decoupled services (Station, Booking, Grid) without relying on fragile distributed two-phase commits (2PC).",
        "Develop a modern, responsive Angular frontend with Server-Side Rendering (SSR) safeguards and seamless PKCE authentication flows to prevent hydration errors."
      ],
      solution: "Architected a distributed microservices ecosystem using Spring Boot, where a Spring Cloud Gateway centralizes security and resilience patterns. Solved complex IAM integration challenges by building a custom low-level Nimbus JWT decoder to seamlessly enforce WSO2 Asgardeo's strict RFC 9068 (`at+jwt`) token standards within Spring Security. Utilized RabbitMQ and the Transactional Outbox Pattern to guarantee message delivery and data consistency across independent PostgreSQL databases, while an Angular frontend provides a secure, role-aware user experience.",
      coreFeatures: [
        "Secure OAuth 2.0/OIDC Authentication with PKCE flow and custom JWT validation pipeline for Asgardeo's `at+jwt` tokens.",
        "Dynamic Role-Based Access Control (RBAC) rendering distinct, secure dashboards for Drivers (view/book chargers) and Station Owners (manage infrastructure).",
        "Event-Driven Booking System utilizing RabbitMQ and the Transactional Outbox Pattern for guaranteed eventual consistency and decoupled service communication.",
        "Resilient API Gateway with token-bucket rate limiting (Redis) and Resilience4j circuit breakers to prevent cascading failures during peak traffic.",
        "Real-time Grid Load Monitoring service to optimize charger availability and prevent grid overload."
      ],
      technicalHighlights: [
        "Custom Nimbus JWT Decoder: Bypassed Spring Security's default strict validator to seamlessly accept and cryptographically validate WSO2 Asgardeo's RFC 9068 compliant `at+jwt` access tokens without compromising the zero-trust security model.",
        "Transactional Outbox Pattern: Implemented to decouple the Booking and Station services, ensuring 100% message delivery via RabbitMQ and eliminating the need for fragile distributed database locks.",
        "Reactive Spring Cloud Gateway: Centralized CORS policies, JWT validation, and Redis-backed rate limiting, significantly reducing downstream service overhead and improving the overall security posture.",
        "SSR-Safe Angular Frontend: Utilized `isPlatformBrowser` checks to prevent `window is not defined` crashes during OAuth2 token hydration in Angular 17+ Server-Side Rendering environments."
      ],
      architecture: "Client requests originate from an SSR-safe Angular application, which handles the OAuth2 PKCE flow with WSO2 Asgardeo. Authenticated requests are routed through a reactive Spring Cloud Gateway, which validates the custom JWT, enforces Redis-backed rate limiting, and applies Resilience4j circuit breakers. The Gateway routes traffic to decoupled Spring Boot microservices (Station, Booking, Grid). These services communicate asynchronously via RabbitMQ using the Transactional Outbox Pattern to guarantee eventual consistency, while persisting domain-specific data to isolated PostgreSQL schemas (via Supabase) with optimized HikariCP connection pooling.",
      githubLink: "https://github.com/Shashika616/ev-charging-system", 
      mediaGroups: [
        {
          groupTitle: "Architecture & Design",
          items: [
            { url: "/ev/evArch.png", label: "End-to-End System Architecture", buttonText: "View Architecture Diagram" },
            { url: "/ev/evFlow.png", label: "End-to-End System Flow and Highlights", buttonText: "View Flow and Highlights" }
          ]
        }
      ]
    },
    {
      name: "Self-Healing AI Desktop Companion with Multi-Tier Model Orchestration",
      platforms: ["Desktop"],
      cover: "/AIComp/AIcomparch.png",
      summary: "Desktop AI companion with a 5-tier Gemini fallback ladder and an agent loop that runs tests and patches its own code.",
      status: "Personal",
      category: "AI & ML",
      tech: ["Python", "PyQt6", "qasync", "Google Gemini API", "FastAPI", "WebSocket"],
      introduction: "A personal AI desktop companion for Windows built around an engineered persona, a resilient multi-tier model orchestration layer, and an agent harness that can autonomously test and repair its own code. The assistant holds a consistent character across long sessions while streaming responses through a non-blocking PyQt6 UI, and degrades gracefully under model quota pressure without breaking the conversation.",
      problemStatement: "Single-model AI integrations are brittle: a quota exhaustion or transient outage on one model kills the entire experience, and most implementations either crash or surface raw error messages to the user. Long-running desktop AI companions also tend to drift into generic assistant tone over extended sessions, and fixing code failures typically requires a human in the loop rather than the system diagnosing and repairing itself.",
      requirements: [
        "Engineer a persistent, consistent persona that doesn't drift into generic assistant tone over long sessions.",
        "Build a fault-tolerant model orchestration layer that survives transient errors and quota exhaustion without breaking the conversation.",
        "Keep the desktop UI fully responsive during long streaming AI responses, with no blocking or stutter.",
        "Give the assistant an agent harness that can recognize a tool-call intent and autonomously test, diagnose, and repair its own code."
      ],
      solution: "Architected a PyQt6 desktop shell driven by a qasync event loop so all model calls stream asynchronously without blocking the UI thread. A persona engine enforces tone and formatting constraints on every call into MateBrain, which holds a trimmed conversation history and selects a model from a 5-tier Gemini fallback ladder, classifying errors as transient or quota-based to decide between a same-tier retry, tier escalation, or a scheduled recovery probe back to the top tier. An agent harness inspects each reply for a structured JSON tool-call schema; when detected, it hands off to a repair loop engine that runs a test command, requests an isolated JSON code patch on failure, writes it to disk, and re-verifies for up to three cycles.",
      coreFeatures: [
        "Persona engine enforcing tone, contraction usage, and formatting rules independent of the underlying model tier.",
        "5-tier Gemini fallback chain (3.5-flash down to 2.5-flash-lite) with automatic escalation and scheduled recovery probing.",
        "Agent harness that parses structured JSON replies as tool-call triggers rather than displaying raw JSON to the user.",
        "Self-healing repair loop that runs tests, patches the failing file, and re-verifies automatically, capped at 3 cycles.",
        "Async streaming chat bubble UI rendered via qasync for a non-blocking desktop experience.",
        "FastAPI WebSocket bridge exposing the same brain to external callers alongside the desktop app."
      ],
      technicalHighlights: [
        "Persona layer uses negative prompt constraints (no markdown, no em-dashes, contractions enforced) plus a 24-turn history trim to hold character over long sessions.",
        "Error-aware retry logic distinguishes transient server errors (503, DEADLINE_EXCEEDED) from quota exhaustion (429, RESOURCE_EXHAUSTED) and routes each down a different recovery path.",
        "Recovery probe pattern: the system tentatively re-tries the top-tier model on a cooldown timer and falls back cleanly if it's still unavailable, rather than staying degraded indefinitely.",
        "Agent harness and repair loop engine constrain tool-call and patch output to strict JSON schemas, making automated file writes safe to execute without human review of each step.",
        "Windows-specific rendering fix: identified and removed QGraphicsDropShadowEffect on a frameless translucent top-level window after tracing it to UpdateLayeredWindowIndirect repaint failures."
      ],
      architecture: "A PyQt6 frameless avatar window and chat overlay run on a qasync event loop, so streamed model output repaints the UI without blocking. User input reaches MateBrain, which applies persona constraints, holds trimmed history, and selects a model from its 5-tier Gemini ladder, escalating or retrying based on classified error type and periodically probing back to the top tier. An agent harness inspects each reply; a structured JSON trigger hands control to the repair loop engine, which runs the target test command as a subprocess, requests an isolated JSON-constrained code patch on failure, writes it back to disk, and re-tests up to 3 times. A parallel FastAPI WebSocket endpoint exposes the same brain for external or future web-based access.",
      githubLink: "https://github.com/Shashika616/AI-Companion",
      mediaGroups: [
        {
          groupTitle: "Architecture & Design",
          items: [
            { url: "/AIComp/AIcomparch.png", label: "End-to-End System Architecture", buttonText: "View Architecture Diagram" },
            { url: "/AIComp/AIcompflow.png", label: "End-to-End System Flow and Highlights", buttonText: "View Flow and Highlights" }
          ]
        }
      ]
    },
    {
      name: "AlgoTrack - Self-Paced DSA and System Design Diary", 
      platforms: ["Web"],
      cover: "/work/algotrack.jpg",
      summary: "Study diary for DSA and system design: Next.js, Supabase auth enforced in middleware, Drizzle over Postgres. Live on Vercel.",
      status: "Personal",
      category: "Monolithic",
      tech: ["Next.js (App Router)", "TypeScript", "Supabase", "PostgreSQL", "Drizzle ORM", "Tailwind CSS"],
      introduction: "A centralized platform for developers to master Data Structures, Algorithms, and System Design concepts at their own pace. AlgoTrack combines problem-solving tools with integrated personal journaling, allowing users to save solutions and document key learning insights for long-term knowledge retention.",
      problemStatement: "Popular coding platforms often focus solely on immediate problem resolution and speed, lacking robust features for personal reflection and progressive learning documentation. Developers frequently struggle to track their unique learning curve, revise difficult concepts, and consolidate diverse educational notes alongside their direct code solutions.",
      requirements: [
        "Implement seamless, secure user authentication managing private access to personal dashboards and sensitive problem data.",
        "Develop a responsive, data-driven interface using Next.js Server Components and Edge Middleware for optimized page delivery and auth state management.",
        "Design and optimize a relational database schema (Postgres) to store structured problem details, user code submissions, and associated personal learning notes efficiently."
      ],
      solution: "Leveraged Next.js (App Router) for an SEO-friendly frontend and API layer, strictly managed by dynamic middleware to enforce page protection based on active Supabase authentication sessions. The data layer utilizes Drizzle ORM to interface with Supabase (PostgreSQL), storing categorized problems. User submissions map code solutions and associated Markdown-formatted learning diary entries to unique user IDs, ensuring complete data privacy and personalized progress tracking.",
      coreFeatures: [
        "Authentication (Supabase Auth) with protected dashboard routes access restricted via Next.js Edge Middleware.",
        "Categorized Problem Library (DSA and System Design) with search/filter capabilities and difficulty ratings.",
        "Personalized Solution Notebook: Save code solutions (with language syntax highlighting) directly linked to specific problems.",
        "Integrated Learning Diary: Rich text editor (Markdown support) for adding personal notes, reflections, and key takeaways for each solved problem.",
        "Progress Dashboard visualizing completion metrics, difficulty breakdown, and recent study activity."
      ],
      technicalHighlights: [
        "Next.js App Router utilization with Server Components for direct DB fetching and dynamic middleware for instant, uncircumventable auth redirection (Dashboard/Problems paths).",
        "Drizzle ORM for type-safe database interactions and structured querying of the Supabase-hosted PostgreSQL instance.",
        "Optimized API route structure utilizing server-side validation and dynamic SQL queries to handle complex relationship mapping between users, solutions, and problems."
      ],
      architecture: "Processes client requests through Next.js Edge Middleware, instantly validating session integrity via Supabase Auth before allowing access to protected dashboard paths or dynamic API routes. Page rendering is optimized using Server Components where possible, minimizing client bundle size. When modifying data, API endpoints interface with the backend PostgreSQL database using Drizzle ORM, ensuring type-safe operations for CRUD actions on user solutions and personal learning diary entries. The unified storage (Supabase/Postgres) ensures ACID compliance for consistent data handling across the entire user lifecycle.",
      githubLink: "https://github.com/Shashika616/algotrack", 
      playLink: "https://algotrack-seven.vercel.app/",
      mediaGroups: [
        {
          groupTitle: "Architecture & Design",
          items: [
            { url: "/algotrack/algotrack-arc.png", label: "System Architecture", buttonText: "View Architecture" }
          ]
        } 
      ]
    },
    {
      name: "Nova - AI-Powered Interactive Knowledge Book with Real-Time Streaming",
      platforms: ["Web", "Backend"],
      cover: "/AI-ENC/AI-ENC-ARCH.png",
      summary: "LLM answers presented as an animated book, streamed from FastAPI to React over Supabase-authenticated endpoints.",
      status: "Personal",
      category: "AI & ML",
      tech: ["React", "TypeScript", "FastAPI", "Python", "Supabase", "PostgreSQL", "Groq API", "JWT Authentication", "REST API", "Streaming Responses", "GitHub Actions", "AWS"],
      introduction: "Nova is an AI-powered interactive knowledge platform that transforms traditional AI conversations into a digital encyclopedia experience. Instead of a conventional chat interface, users explore AI-generated content through an animated book interface featuring real-time response streaming, topic-based navigation, and intelligent content discovery. The application combines a modern React frontend with a FastAPI backend, Supabase authentication, and LLM-powered knowledge generation to deliver an immersive learning experience.",
      problemStatement: "Traditional AI chat applications present responses as linear conversations that become difficult to revisit, organize, or explore further. Users often lose context between topics, receive generic interfaces with limited engagement, and experience delays while waiting for complete AI responses before any content is displayed.",
      requirements: [
        "Design an immersive digital book interface that makes AI-generated knowledge easier to consume than traditional chat applications.",
        "Implement secure authentication and authorization using Supabase Auth and JWT validation.",
        "Stream AI responses in real time to improve perceived performance and user experience.",
        "Provide contextual topic suggestions that encourage continuous knowledge exploration.",
        "Develop a scalable backend architecture capable of integrating multiple LLM providers in the future.",
        "Prepare the application for cloud deployment using CI/CD pipelines and AWS infrastructure."
      ],
      solution: "Architected a multi-tier full-stack application where a React frontend communicates with a FastAPI backend through authenticated REST and streaming endpoints. Users authenticate through Supabase Authentication before requesting AI-generated knowledge from the backend. The backend constructs optimized prompts, communicates with the Groq LLM API, streams generated content back to the client in real time, and enriches each response with contextual suggestions to support continuous exploration. The system is designed with modular service layers, allowing future integration of additional LLM providers without impacting frontend functionality.",
      coreFeatures: [
        "Interactive digital encyclopedia interface with realistic page-based reading experience.",
        "Real-time AI response streaming for incremental content rendering.",
        "Secure user registration, login, and JWT-based authorization using Supabase Authentication.",
        "Prompt engineering layer that generates structured educational content across multiple knowledge levels.",
        "Context-aware suggestion engine for continuous topic exploration.",
        "Persistent reading history and chapter-based navigation.",
        "Modular AI service abstraction supporting future multi-model integration.",
        "Cloud-ready architecture with automated deployment pipeline using GitHub Actions and AWS."
      ],
      technicalHighlights: [
        "Implemented streaming HTTP responses using FastAPI StreamingResponse to reduce response latency and improve user experience.",
        "Designed a layered backend architecture separating routing, services, authentication, prompt generation, and AI provider integrations for maintainability.",
        "Integrated Supabase Authentication with backend JWT validation to secure protected API endpoints.",
        "Built reusable API abstraction layers in the React frontend for authentication and knowledge services.",
        "Designed extensible AI provider architecture enabling future support for multiple LLM vendors without major architectural changes.",
        "Prepared the application for automated cloud deployments using GitHub Actions and AWS infrastructure."
      ],
      architecture: "The React frontend provides an interactive digital book experience where authenticated users request AI-generated knowledge. Requests pass through an API abstraction layer before reaching FastAPI controllers responsible for authentication, validation, and orchestration. The knowledge service constructs optimized prompts and communicates with the Groq LLM API, streaming generated content back through FastAPI StreamingResponse endpoints. Supabase Authentication manages user identity while PostgreSQL stores application data. The modular service architecture separates authentication, prompt engineering, AI integration, and business logic to simplify maintenance and future expansion. The application is designed for automated deployment through GitHub Actions into AWS infrastructure.",
      githubLink: "https://github.com/Shashika616/nova",
      mediaGroups: [
        {
          groupTitle: "Architecture & Design",
          items: [
            { url: "/AI-ENC/AI-ENC-ARCH.png", label: "System Architecture", buttonText: "View Architecture" }
          ]
        }
      ]
    },
    { 
      name: "Compiler Arena - Tactical web game running on an underlying compiler engine", 
      platforms: ["Web"],
      cover: "/work/compiler.jpg",
      summary: "Puzzle game driven by a handwritten lexer, LL(1) parser and semantic analyser: players write the commands that move them.",
      status: "Personal",
      category: "Monolithic",
      tech: ["JavaScript", "Compilers", "Game Development", "CS Theory"],
      introduction: "A full-stack tactical puzzle game engine powered by a deterministic 4-stage compiler pipeline. Players write custom domain-specific language commands to navigate enemies with mathematically-defined hitbox patterns, transforming abstract compiler theory into interactive gameplay.",
      problemStatement: "Game AI damage systems typically use hardcoded spatial logic instead of composable algorithms, while compiler education remains disconnected from practical applications. Standard approaches lack real-time feedback mechanisms that visualize the complete compilation process from tokenization through execution.",
      requirements: [
        "Construct a true Abstract Syntax Tree (AST) via handwritten lexer and recursive-descent parser without external parsing libraries.",
        "Engineer 5 distinct enemy archetypes with unique damage zone geometries computed dynamically based on spatial distance metrics and type-specific algorithms.",
        "Deliver precise error feedback with character-level offsets and maintain O(n) linear time complexity across tokenization, parsing, and semantic analysis phases."
      ],
      solution: "Built a single-pass, deterministic compiler frontend coupled with a state-driven game engine. The lexer tokenizes input into keywords/directions/identifiers; the LL(1) recursive-descent parser generates structured AST nodes; the semantic analyzer validates sequences against game rules; the executor mutates state and computes hitbox intersections per enemy type with cumulative damage stacking.",
      coreFeatures: [
        "Handwritten recursive-descent lexer and parser producing clean AST without regex or external dependencies.",
        "5 enemy types with distinct spatial models: Goblin (X±1), Orc (3×3), Troll (X±2), Drake (ortho±1/diag±2), Demon (5×5).",
        "Real-time CSS Grid visualization with dynamic hitbox overlays updating after each compiled command.",
        "Grid bounds validation enforcing 0–15 coordinate limits; cumulative damage from overlapping enemy hitboxes.",
        "4 progressive difficulty levels scaling from 2 enemies (pedagogical) to 6 enemies (expert multi-threat navigation)."
      ],
      technicalHighlights: [
        "O(n) single-pass tokenization and O(n) recursive-descent parsing with explicit error messages containing exact character offsets.",
        "Type-based enemy damage zone dispatch using functional pattern matching; hitbox calculations leverage Euclidean distance metrics.",
        "Immutable-pattern state updates: each command triggers full grid re-evaluation and re-render without mutable intermediate objects."
      ],
      architecture: "Processes source code through a single-pass tokenization stream, validating structure against a strict context-free grammar before mapping nodes into a traversable AST. The executor interprets this tree sequentially, computing enemy hitboxes dynamically based on type and position, applying damage via set intersection, and enforcing grid boundaries before each state mutation. CSS Grid rendering layer visualizes danger zones as real-time background overlays.",
      githubLink: "https://github.com/Shashika616/compiler-game.git",
      playLink: "https://compiler-game.vercel.app/",
      mediaGroups: [
        {
          groupTitle: "Architecture & Design",
          items: [
            { url: "/Compiler/arch.png", label: "High Level System Architecture", buttonText: "View Architectural Diagram" }
          ]
        }
      ]
    },
    {
      name: "TELCOM App for a Distributed Environment",
      platforms: ["Backend", "Mobile"],
      cover: "/sricare/sricare-arc.png",
      summary: "Telecom self-care backend split into six services, with RabbitMQ events, Redis caching and WebSocket support chat.",
      category: "Distributed Systems",
      tech: ["Node.js", "Express.js", "Flutter", "MongoDB", "Redis", "RabbitMQ", "Microservices", "REST APIs", "WebSockets", "Docker"],
      introduction: "A cloud-native telecommunications self-care platform built on a distributed microservices architecture. The system provides customers with a unified digital experience for account management, billing, payments, service activation, notifications, and real-time support while demonstrating scalable backend engineering patterns used in modern telecom platforms.",
      problemStatement: "Traditional telecom applications often rely on tightly coupled backend systems where high-volume operations such as billing generation, notifications, and customer requests compete for the same resources. This creates scalability limitations, service dependency failures, and performance degradation during peak usage periods. The challenge was to design a fault-tolerant distributed platform where individual business capabilities could scale independently while maintaining fast communication between services.",
      requirements: [
        "Design an independently scalable microservices architecture replacing a tightly coupled monolithic backend.",
        "Implement asynchronous event-driven communication between services to prevent blocking operations during high traffic workloads.",
        "Provide a unified API access layer for multiple client applications including Flutter mobile applications and web clients.",
        "Maintain low-latency data access using distributed caching mechanisms.",
        "Support real-time customer communication through persistent WebSocket connections.",
        "Ensure secure authentication, request routing, and centralized service management."
      ],
      solution: "Built a distributed telecommunications platform using a microservices architecture with a Node.js/Express API Gateway acting as the central communication layer. Business capabilities were separated into independent services including User Management, Billing, Payment Processing, Service Provisioning, Notification Handling, and Customer Chat. RabbitMQ was integrated as an asynchronous message broker to enable event-driven workflows, while Redis provided distributed caching and session management. MongoDB was used for scalable document-based persistence across services.",
      coreFeatures: [
        "API Gateway architecture providing centralized authentication, request routing, and service communication management.",
        "Independent microservices for user lifecycle management, billing operations, payments, service activation, notifications, and customer support.",
        "RabbitMQ-powered event-driven communication allowing services to react asynchronously to billing, payment, and provisioning events.",
        "Redis distributed caching layer for optimized session handling, queue management, and high-speed temporary data access.",
        "Real-time customer support chat system using WebSocket communication with Redis-backed session management.",
        "MongoDB persistence layer optimized for high-volume telecom data such as customer records, billing history, transactions, and conversations.",
        "Flutter-based customer application providing access to telecom self-service operations."
      ],
      technicalHighlights: [
        "Designed a stateless microservices backend allowing individual services to scale independently without affecting other business modules.",
        "Implemented asynchronous publish-subscribe messaging patterns to prevent notification workloads from blocking critical payment and billing operations.",
        "Applied distributed caching strategies using Redis to reduce database load and improve response times.",
        "Created REST-based service communication standards with clearly separated business responsibilities.",
        "Implemented event-driven workflows where payment success events trigger downstream service activation and customer notifications.",
        "Used WebSocket-based bidirectional communication for low-latency customer support interactions."
      ],
      architecture: "Follows a layered distributed architecture consisting of Flutter/Web clients, API Gateway, core microservices, message broker, caching layer, and persistent storage. Client requests are routed through the Node.js/Express API Gateway, which communicates with independent backend services. Synchronous operations use REST APIs, while asynchronous business events flow through RabbitMQ queues using producer-consumer patterns. Redis manages distributed cache states and active sessions, while MongoDB stores persistent business data. The architecture enables fault isolation, horizontal scalability, and independent service deployment.",
      githubLink: "https://github.com/Shashika616/sri-care-backend",
      mediaGroups: [
        {
          groupTitle: "System Architecture",
          items: [
            { url: "/sricare/sricare-arc.png", label: "High Level System Architecture", buttonText: "View Architecture" }
          ]
        }
      ]
    },
    {
      name: "Digital Gate Pass and Visitor Management System",
      platforms: ["Web", "Backend"],
      cover: "/rup/main1.png",
      summary: "Replaced paper logbooks at Sri Lanka Rupavahini Corporation with role-based portals for staff, gate security and admins.",
      category: "Monolithic",
      tech: ["Node.js", "Express.js", "React", "MongoDB", "REST APIs", "Postman", "Figma", "GitHub"],
      introduction: "A digital gate pass and visitor management solution designed for the Sri Lanka Rupavahini Corporation. The platform streamlines organizational entry/exit operations by introducing a secure web-based system that replaces manual logbooks and paperwork for guests, staff members, administrators, and security gate staff.",
      problemStatement: "The primary challenge lies in the absence of a digital tracking system, resulting in a heavy reliance on manual processes accompanied by extensive paperwork. This approach consumes a significant amount of time, demands substantial human effort, and causes operational inefficiencies. Specific pain points include limited external access to visitation details, a lack of automated entry/exit tracking mechanisms, constraints in managing guest reservations, and the physical storage space required for manual record management.",
      requirements: [
        "Handle secure user registration and multi-role authentication for various system actors.",
        "Develop independent interface modules for users/staff, security gate personnel, and system administrators.",
        "Automate the submission, evaluation, and management of guest visitation and appointment requests.",
        "Implement real-time entry and exit tracking for tracking users, staff, and associated vehicles at the security gate.",
        "Enable self-service profile management allowing authorized users to securely modify their information.",
        "Provide analytical reporting tools for administrators and staff to generate and download date-based or monthly activity reports."
      ],
      solution: "Developed a centralized digital gate pass management system featuring a decoupled full-stack architecture. The frontend web portals were constructed using React to deliver dedicated, responsive dashboards for administrators, security guards, and corporate staff. The backend API layer was engineered using Node.js and Express.js to orchestrate request routing, authentication workflows, and gate check-in/out logic, while MongoDB served as the scalable document persistence layer for real-time visitor records, historical logs, and user credentials.",
      coreFeatures: [
        "Role-based dashboards providing customized access environments for Guest Users, Staff, Gate Security, and Administrators.",
        "Digital appointment workflow supporting online submission and automated approval tracking for corporate visit requests.",
        "Real-time gate module enabling security personnel to instantly record, verify, and monitor vehicle and individual check-ins and check-outs.",
        "Asynchronous password recovery mechanism issuing secure password reset links directly to user emails.",
        "Dynamic reporting engine supporting date-specific activity searches, calendar views, and downloadable monthly staff activity reports.",
        "Interactive UI layouts designed comprehensively in Figma to ensure optimal workflow UX for non-technical gate staff."
      ],
      technicalHighlights: [
        "Transitioned physical logistical operations into a structured multi-tier web application, eliminating paper reliance and local storage bottlenecks.",
        "Designed a secure role-based access control (RBAC) middleware architecture to protect administrative and internal operational fields.",
        "Engineered robust document schemas in MongoDB capable of handling varying structural requirements of external individuals, educational groups, and staff vehicles.",
        "Conducted rigorous backend verification and endpoint validation utilizing Postman to secure consistent API delivery.",
        "Created date-based and search-indexed database queries to optimize report generation performance and calendar views."
      ],
      architecture: "Follows a classic client-server architecture model structured over an internal network or cloud layout. The presentation tier is built using React to provide real-time updates and seamless interactions across separate staff, admin, and gate panels. Client requests are dispatched via HTTPS REST APIs to a stateless Node.js/Express backend server. This logic tier handles core session validation, workflow automation, and reporting processing before executing transactions against a persistent MongoDB instance. The architecture effectively separates business capabilities, ensuring fault isolation and clean service boundaries.",
      githubLink: "https://github.com/Shashika616/Rupavahini-gatepass-and-visitormgt-system-backend.git",
      mediaGroups: [
        {
          groupTitle: "System Architecture",
          items: [
            { url: "/rup/rup-arc.png", label: "High Level System Architecture", buttonText: "View Architectural Diagram" }
          ]
        },
        {
          groupTitle: "Wireframes",
          items: [
            { url: "/rup/wire1.png", label: "Wireframe", buttonText: "View Wireframe" },
            { url: "/rup/wire2.png", label: "Wireframe", buttonText: "View Wireframe" },
            { url: "/rup/wire3.png", label: "Wireframe", buttonText: "View Wireframe" },
            { url: "/rup/wire4.png", label: "Wireframe", buttonText: "View Wireframe" },
            { url: "/rup/wire5.png", label: "Wireframe", buttonText: "View Wireframe" }
          ]
        },
        {
          groupTitle: "Application Overview",
          items: [
            { url: "/rup/main1.png", label: "Overview", buttonText: "View Image" },
            { url: "/rup/main2.png", label: "Overview", buttonText: "View Image" },
            { url: "/rup/main3.png", label: "Overview", buttonText: "View Image" },
            { url: "/rup/main4.png", label: "Overview", buttonText: "View Image" },
            { url: "/rup/main5.png", label: "Overview", buttonText: "View Image" }
          ]
        }
      ]
    }
  ],
  games: [
    {
      name: "Survive Cyber - Cyberpunk Urban FPS Simulator",
      platforms: ["Web"],
      cover: "/neon-overdrive/3d-shooter-1.png",
      summary: "Browser FPS in plain Three.js: procedural city, state-machine enemies and pooled particles, built to hold 60 FPS. Playable online.",
      status: "Personal",
      category: "Monolithic",
      tech: ["Three.js", "WebGL 2.0", "JavaScript ES6", "Procedural Generation", "AI State Machines", "Web Audio API"],
      introduction: "A cyberpunk-themed 3D first-person shooter that combines procedural city generation with wave-based combat mechanics. Players navigate a neon-drenched urban landscape, engaging enemy AI through an immersive combat loop featuring real-time hit detection, particle effects, and dynamic difficulty scaling.",
      problemStatement: "Traditional browser-based 3D shooters either rely on heavy game engines (Unity/Unreal) or sacrifice performance for visual fidelity. Web-native implementations often suffer from poor optimization, lack of procedural content, and simplistic AI behavior. The challenge is building a responsive, high-performance FPS experience entirely in vanilla JavaScript with Three.js that maintains 60 FPS while delivering engaging combat mechanics and dynamic environments.",
      requirements: [
        "Implement a full 3D rendering pipeline using Three.js with optimized WebGL settings (pixel ratio 1.0, antialiasing disabled) to maintain 60 FPS performance.",
        "Engineer a procedural city generation system with 4 distinct building types (skyscrapers, residential, cyber towers, warehouses) and weighted random distribution.",
        "Design 2 enemy archetypes (CHASER and RANGED) with unique AI behavior, attack patterns, and difficulty scaling across progressive waves.",
        "Build a complete HUD system with health segments, ammo display, radar, crosshair, and wave tracking using pure CSS/HTML overlays.",
        "Implement a pool-based particle system for explosions and hit effects with zero garbage collection pressure."
      ],
      solution: "Built a monolithic Three.js-based game engine with integrated ECS-lite architecture. The system features procedural city generation with collision-optimized AABB structures, a state-machine driven AI system with 3 behavioral states (CHASE/HURT/ATTACK), and a wave-based difficulty scaler. Performance is optimized through geometry pooling, material reuse, and fixed pixel ratio rendering. The game loop uses delta-clamping to prevent physics explosions while maintaining deterministic behavior.",
      coreFeatures: [
        "Procedural city generation with 4 building types (Skyscraper 40%, Residential 30%, Cyber Tower 20%, Warehouse 10%) and collision-optimized AABB structures.",
        "2 enemy archetypes with distinct AI: CHASER (8.5 speed, 65 HP, melee) and RANGED (5.2 speed, 50 HP, projectile attacks with 30 unit range).",
        "Wave-based difficulty scaling: kill requirement = 5 + (wave × 3), enemy speed increases by 0.35 per wave, spawn interval decreases from 2.5s to 0.6s.",
        "Dynamic HUD with 20-segment health bar, ammo display (30 rounds mag + 90 reserve), 160px radar with enemy tracking, and real-time score/kill tracking.",
        "Pool-based particle system (70 particles) for explosions and impacts with zero garbage collection and deterministic performance.",
        "CRT post-processing effects (scanlines, vignette, chromatic aberration) implemented in pure CSS for zero GPU overhead."
      ],
      technicalHighlights: [
        "ECS-lite architecture with shared geometry/material pools reducing draw calls by 90% and memory usage by 65%.",
        "AI state machine with 3 behavioral states: CHASE (default), HURT (0.08s stun animation), ATTACK (cooldown-based with 1.2s melee / 1.8s ranged intervals).",
        "Pool-based particle system with 70 pre-allocated instances enabling explosion effects without garbage collection pressure.",
        "Delta-clamped game loop preventing physics explosions (max delta 0.05s) with interpolated movement for smooth 60 FPS gameplay.",
        "Radar system with conic gradient sweep and enemy tracking within 110 unit radius, color-coded by enemy type.",
        "Custom Web Audio synthesizer generating laser, explosion, hurt, and pickup sounds without external audio files."
      ],
      architecture: "The game follows a monolithic architecture with integrated subsystems: Three.js handles the 3D rendering pipeline with optimized WebGL settings (pixel ratio 1.0, antialiasing disabled). The ECS-lite entity manager tracks all game objects with pooled resources for performance. The AI system uses a state machine pattern with 3 behavioral states. The procedural city generator builds a 600×600 unit environment with 4 building types and pre-calculated collision structures. The game loop processes physics (gravity, velocity, collision detection), AI behavior, particle systems, and HUD updates in a single update cycle. UI overlays are rendered via CSS/HTML with real-time DOM updates for the HUD, while the radar uses a 2D canvas overlay. The system employs delta-clamping to maintain deterministic physics and prevent frame-rate dependent behavior.",
      githubLink: "https://github.com/Shashika616/survive-cyber.git",
      playLink: "https://survive-cyber.vercel.app/",
      mediaGroups: [
        {
          groupTitle: "Architecture & Design",
          items: [
            { url: "/neon-overdrive/3d-shooter-arc.png", label: "Game Architecture Diagram", buttonText: "View System Architecture" }
          ]
        },
        {
          groupTitle: "Gameplay Optimization Architecture",
          items: [
            { url: "/neon-overdrive/3d-shooter-df.png", label: "Data Flow", buttonText: "View Data Flow Diagram" },
            { url: "/neon-overdrive/3d-shooter-mem.png", label: "Memory Allocation", buttonText: "View Memory Flow" }
          ]
        },
        {
          groupTitle: "Gameplay",
          items: [
            { url: "/neon-overdrive/3d-shooter-1.png", label: "Gameplay Captures", buttonText: "View Gameplay" },
            { url: "/neon-overdrive/3d-shooter-2.png", label: "Gameplay Captures", buttonText: "View Gameplay" },
            { url: "/neon-overdrive/3d-shooter-3.png", label: "Gameplay Captures", buttonText: "View Gameplay" },
            { url: "/neon-overdrive/3d-shooter-4.png", label: "Gameplay Captures", buttonText: "View Gameplay" }
          ]
        }
      ]
    }
  ],
  certificates: [
    {
      name: "WSO2 Certified Associate Identity & Access Management",
      issuer: "WSO2",
      date: "2024",
      credentialId: "CID-04598722",
      description: "Validates a foundational understanding of Identity and Access Management (IAM) principles and architectures. Demonstrates knowledge in B2B Customer IAM (CIAM), identity federation, single sign-on, and implementing modern, secure passwordless authentication mechanisms.",
      skills: ["Identity and Access Management", "B2B CIAM", "Identity Federation", "Passwordless Authentication"],
      imageUrl: "/certificates/wso2-cert.png",
      verifyLink: "https://certification.wso2.com/certificate/CID-04598722"
    },
    {
      name: "UI/UX For Beginners",
      issuer: "Great Learning Academy",
      date: "2024",
      credentialId: "CID-EFRFFYBX",
      description: "Introduces the foundational workflows and methodologies of user interface and user experience design. Covers core principles of layout design, color theory, user interaction, and best practices for creating intuitive, responsive digital layouts.",
      skills: ["UI/UX", "State Management", "UI Design", "Best Practices", "User Interaction", "Color Combinations", "Layouts"],
      imageUrl: "/certificates/ui-cert.png",
      verifyLink: "https://www.mygreatlearning.com/certificate/EFRFFYBX"
    },
    {
      name: "Cloud Computing Basics",
      issuer: "Mind Luster",
      date: "2024",
      credentialId: "CID-16720390740",
      description: "Demonstrates a baseline understanding of core cloud architecture, deployment models (Public, Private, Hybrid), and service categories (IaaS, PaaS, SaaS). Covers fundamental concepts of cloud security, infrastructure compliance, and cross-platform capabilities.",
      skills: ["Cloud Technologies", "Cloud Concepts", "Cloud Services", "Security", "Compliance"],
      imageUrl: "/certificates/cloud-cert.jpg",
      verifyLink: "https://www.mindluster.com/student/certificate/16720390740"
    },
    {
      name: "React JS Tutorial",
      issuer: "Great Learning",
      date: "2024",
      credentialId: "CID-NOBYYSZB",
      description: "Validates essential frontend development skills utilizing the React framework. Demonstrates practical knowledge of JSX syntax, component life cycles, state management, and modern ES6+ JavaScript features used to build dynamic web applications.",
      skills: ["JSX", "Core React Concepts", "Component Management", "JavaScript Essentials", "Modern JavaScript Features"],
      imageUrl: "/certificates/react-cert.png",
      verifyLink: "https://www.mygreatlearning.com/certificate/NOBYYSZB"
    },
    {
      name: "JavaScript Development Techniques",
      issuer: "Mind Luster",
      date: "2024",
      credentialId: "CID-16720393707",
      description: "Validates proficiency in programming logic and modern scripting techniques using JavaScript. Covers foundational core features, advanced ES6+ development paradigms, and introduces modern typing and syntax extensions like TypeScript and JSX.",
      skills: ["JS Basics", "JS Features", "JSX", "TypeScript"],
      imageUrl: "/certificates/js-cert.jpg",
      verifyLink: "https://www.credly.com/badges/security-plus"
    }
  ]
};
