/**
 * Engineering write-ups published at /writing.
 * Facts only: every figure comes from the project's own metrics, load tests
 * or design docs, and anything modelled rather than measured says so.
 * Client work is never written up without the client's permission.
 */

export type Block =
  | { kind: "p"; text: string }
  | { kind: "h"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "table"; caption: string; head: [string, string]; rows: [string, string][] }
  | { kind: "note"; text: string };

export type Article = {
  slug: string;
  title: string;
  dek: string;
  published: string; // ISO date
  readMinutes: number;
  tags: string[];
  body: Block[];
};

export const ARTICLES: Article[] = [
  {
    slug: "tiehere-five-services-to-two",
    title: "Five services to two: running TieHere for about $0 a month",
    dek: "How I collapsed a Go microservice backend into a gateway and a modular monolith, kept every module separable, and what the production numbers look like now.",
    published: "2026-11-22",
    readMinutes: 7,
    tags: ["Architecture", "Go", "Cloud Run", "Cost"],
    body: [
      { kind: "p", text: "TieHere helps professionals nearby meet in person around one intent: a coffee, a meal, networking or mentorship. It is the first product of AshiruLabs, my company, and it has 31 people using it in production on iOS and Android. I own it end to end, from the Flutter app to the database." },
      { kind: "p", text: "This is the story of its backend shrinking from five services, a Redis cache and a Pub/Sub broker to two deployables, and why that was the right call for a young product." },

      { kind: "h", text: "Where it started" },
      { kind: "p", text: "The first backend was five independently deployed Go microservices: auth, meetup, billing, notification and SOS. Each had its own database, Redis sat in front for rate limiting, and the services talked through Pub/Sub. It was a textbook design, and for a product with a few dozen users it was the wrong one." },
      { kind: "list", items: [
        "Every service needed its own deploy, config, secrets and monitoring.",
        "Five always-on services cost money every hour whether anyone was using the app or not.",
        "A single user action could cross the network several times: app to gateway, service to Redis, service to broker, broker to service.",
      ] },

      { kind: "h", text: "The shape now" },
      { kind: "p", text: "Today there are two services on Google Cloud Run: a thin Go API gateway and a Go modular monolith behind it, talking over gRPC. The Flutter app only ever speaks REST to the gateway." },
      { kind: "list", items: [
        "The gateway issues tokens, rate-limits per user in its own memory, and translates REST into gRPC. No network hop to a cache on every request.",
        "The monolith holds the same five modules. Each owns one PostgreSQL schema and exposes one Go interface; there are no foreign keys across schemas (ADR-001).",
        "Modules talk through an in-process event bus instead of a broker, so an event that used to cross the network is now a function call.",
        "One PostgreSQL database on Supabase replaces five, with one schema per module.",
      ] },
      { kind: "p", text: "The point of those rules is that the monolith stays honest. Any module can be lifted back out into its own service on the day it earns one, because nothing reaches into its tables and nothing depends on it except through its interface." },

      { kind: "h", text: "Security boundaries that survived the merge" },
      { kind: "p", text: "Merging services is a good moment to lose a boundary by accident. I kept three on purpose." },
      { kind: "list", items: [
        "Only the gateway holds the token-signing key. The monolith can check who a user is, but it can never mint a token, so a compromised backend cannot forge logins.",
        "Coordinates are rounded before any proximity search (ADR-004), so results never reveal anyone's exact position.",
        "Safety features such as SOS unlock only at higher trust levels, built from a verified phone number and company email.",
      ] },

      { kind: "h", text: "Shipping without breaking phones" },
      { kind: "p", text: "Once real people install an app, the backend no longer controls which client version talks to it. TieHere follows one release rule: API routes and JSON fields are only ever added, never renamed or removed, and any change to token claims is checked against the shipped client before it deploys. Nobody has ever been forced to update. Database backups and migrations run from GitHub Actions, and 14 architecture decision records explain why each major choice was made." },

      { kind: "h", text: "The numbers" },
      { kind: "table", caption: "Production, 1 to 22 November 2026, from Cloud Run metrics", head: ["Measure", "Value"], rows: [
        ["Requests", "13,266 (0.7% of the free tier)"],
        ["Requests per day (last 30 days)", "About 410 on average, peak 1,508"],
        ["CPU used", "About 4,800 vCPU-seconds (2.7% of the free tier)"],
        ["Memory used", "About 3,550 GiB-seconds (1% of the free tier)"],
        ["Median API latency", "37 ms"],
        ["p95 / p99 latency", "533 ms / 952 ms"],
        ["Compute cost", "About $0 a month, inside the free tier"],
      ] },
      { kind: "table", caption: "Load test, one instance on a laptop", head: ["Load", "Result"], rows: [
        ["1,000 requests a second", "100% success, p99 under 4 ms"],
        ["2,000 requests a second", "Stays up; 0.5% turned away as busy and retried by the app"],
        ["Implied capacity", "About 86 million requests a day per instance, up to 8 instances"],
      ] },

      { kind: "h", text: "What it cost me" },
      { kind: "p", text: "The p95 is high for a reason worth being honest about. Both services scale to zero, so with light traffic many requests land on a cold start. That is a cost choice, not slow code: the median is 37 ms. Keeping one instance warm would bring p95 close to the median for roughly $40 to $50 a month, which I will switch on when traffic justifies it." },
      { kind: "p", text: "The saving is also partly a model. The five-service version ran as a separate project, so there is no bill to compare against. Priced at list rates, five always-on instances of about 1 vCPU and 512 MiB each come to roughly $200 to $250 a month. The two scale-to-zero services cost about $0 at today's traffic, with small storage charges of a few dollars at most." },
      { kind: "note", text: "Measured: everything in the production and load-test tables. Estimated: the $200 to $250 a month for the old always-on design." },

      { kind: "h", text: "What I would tell another small team" },
      { kind: "list", items: [
        "Start with a modular monolith and make the module boundaries real: one schema and one interface per module, no shared tables.",
        "Put the things that must never move, like token signing and rate limiting, at the edge.",
        "Treat installed app versions as clients you cannot update, and only ever add to the API.",
        "Measure before you scale. At a few hundred requests a day, the cheapest reliable system is the one that sleeps.",
      ] },
    ],
  },
  {
    slug: "tiehere-admin-console-security",
    title: "Locking down a small team's admin console",
    dek: "The operations console behind TieHere can see members, revenue and safety data. Here is every layer between a browser and a write, and why each one is there.",
    published: "2026-11-22",
    readMinutes: 5,
    tags: ["Security", "OIDC", "Next.js", "Go"],
    body: [
      { kind: "p", text: "Admin consoles are where small products get breached. They are built last, in a hurry, by the same people who built everything else, and they can do far more than any user account. TieHere's console at admin.tiehere.com manages members, promotions, revenue and churn analytics, and keeps a full audit log. I built it assuming someone would eventually try to get in." },

      { kind: "h", text: "The shape" },
      { kind: "p", text: "The console is a Next.js app. It never talks to the database. Every action goes to a private Go admin API, which is the only thing allowed to change data on the console's behalf." },

      { kind: "h", text: "Layer 1: who you are" },
      { kind: "list", items: [
        "Sign-in is Google OpenID Connect with PKCE, so an intercepted authorisation code is useless without the verifier that never leaves the browser session.",
        "Every sign-in also needs a TOTP one-time code. A stolen Google session alone is not enough.",
      ] },

      { kind: "h", text: "Layer 2: how long you stay" },
      { kind: "list", items: [
        "The session lives in an encrypted cookie marked SameSite=Strict, so other sites cannot ride it.",
        "Sessions end after 8 hours at most, and after 30 minutes idle. A console left open on a laptop closes itself.",
      ] },

      { kind: "h", text: "Layer 3: what the page can run" },
      { kind: "p", text: "Every response carries a Content Security Policy with a fresh nonce per request. Scripts without that nonce do not run, which takes most injected-script attacks off the table even if a bug lets markup through." },

      { kind: "h", text: "Layer 4: what reaches the API" },
      { kind: "list", items: [
        "The console signs a token for each call to the admin API, valid for 60 seconds. A leaked token expires before it is useful.",
        "Every write must carry a reason, and is recorded in the audit log with who made it and when.",
      ] },

      { kind: "h", text: "Why the reason field matters most" },
      { kind: "p", text: "The cryptography stops outsiders. The reason field is for insiders and for the future: when a member's credits change or a promotion is edited, the log says why, in the words of the person who did it. That turns an audit log from a list of events into an explanation, and it makes careless changes slightly harder to make." },

      { kind: "h", text: "The checklist" },
      { kind: "table", caption: "TieHere admin console controls", head: ["Threat", "Control"], rows: [
        ["Stolen Google account", "TOTP second factor on every sign-in"],
        ["Intercepted login redirect", "OIDC with PKCE"],
        ["Cross-site request forgery", "SameSite=Strict encrypted session cookie"],
        ["Unattended open session", "30-minute idle and 8-hour absolute timeout"],
        ["Injected script", "Per-request CSP nonce"],
        ["Leaked API token", "60-second lifetime, private API"],
        ["Unexplained change", "Required reason on every audited write"],
      ] },
      { kind: "note", text: "None of these is exotic. The point is that all of them are on, from the first day, on a console used by a very small team." },
    ],
  },
  {
    slug: "voltnexus-no-lost-bookings",
    title: "No lost bookings: the transactional outbox in an EV-charging platform",
    dek: "How VoltNexus keeps a booking and its event in step without distributed transactions, stops one failing service from taking the rest down, and accepts Asgardeo's strict access tokens.",
    published: "2026-11-22",
    readMinutes: 6,
    tags: ["Microservices", "Spring Boot", "RabbitMQ", "IAM"],
    body: [
      { kind: "p", text: "VoltNexus is a microservices platform for EV charging: drivers find and book chargers, station owners manage them, and a grid service watches load. It is a personal project, built to practise the failure modes that hurt real distributed systems. Three of them shaped the design." },

      { kind: "h", text: "Problem 1: the booking saved, the event did not" },
      { kind: "p", text: "When a driver books a charger, the Booking service saves the booking and the Station service must reserve the charger. The naive version saves to the database, then publishes to RabbitMQ. If the process dies between those two steps, the booking exists and the charger is never reserved. A distributed two-phase commit would fix it, at the price of locks across services and a coordinator that becomes the new single point of failure." },
      { kind: "p", text: "VoltNexus uses the transactional outbox instead. The booking and an outbox row describing the event are written in the same local database transaction, so either both exist or neither does. A relay then publishes outbox rows to RabbitMQ and marks them sent. If RabbitMQ is down, rows wait. When it recovers, every event goes out." },
      { kind: "list", items: [
        "Driver books through the gateway with an access token.",
        "Booking service saves the booking and the outbox event in one transaction.",
        "The relay publishes the event; Station service reserves the charger.",
        "The booking is confirmed.",
      ] },
      { kind: "note", text: "The trade-off is that delivery is at least once, so consumers must tolerate seeing the same event twice. That is a far easier problem than losing one." },

      { kind: "h", text: "Problem 2: one slow service drowns the rest" },
      { kind: "p", text: "Everything enters through a reactive Spring Cloud Gateway, which does the cross-cutting work once rather than in every service." },
      { kind: "list", items: [
        "Token-bucket rate limiting backed by Redis absorbs traffic spikes before they reach a service.",
        "Resilience4j circuit breakers open when a downstream service keeps failing, so callers fail fast instead of piling up waiting threads.",
        "Each service owns its own PostgreSQL schema with pooled connections (HikariCP), so one service's queries cannot exhaust another's connections.",
      ] },

      { kind: "h", text: "Problem 3: a token Spring would not accept" },
      { kind: "p", text: "Sign-in uses WSO2 Asgardeo with OAuth 2.0, OpenID Connect and PKCE, and the dashboards differ for drivers and station owners. Asgardeo issues access tokens typed at+jwt, as RFC 9068 specifies. Spring Security's default validator rejected them." },
      { kind: "p", text: "The easy fix would have been to loosen validation. Instead I wrote a custom Nimbus JWT decoder that accepts the at+jwt type and still checks the signature, issuer and expiry on every request. The zero-trust model stays intact; only the type check learned the standard." },

      { kind: "h", text: "A small one: server-rendered Angular and OAuth" },
      { kind: "p", text: "The Angular front end renders on the server, where there is no window and no browser storage. OAuth token handling that touches either crashes server rendering. Guarding that code with isPlatformBrowser checks kept server rendering and the PKCE flow working together." },

      { kind: "h", text: "What I took from it" },
      { kind: "list", items: [
        "Make the database transaction the source of truth and let messaging catch up, rather than trying to make two systems commit together.",
        "Put rate limits and token checks at the edge, once.",
        "When a standard and a library disagree, teach the library the standard instead of weakening the check.",
      ] },
    ],
  },
  {
    slug: "ai-companion-that-survives-outages",
    title: "An AI companion that survives its own model outages",
    dek: "A five-tier model ladder that knows the difference between a hiccup and an empty quota, a recovery probe that climbs back up, and a repair loop that fixes its own code within strict limits.",
    published: "2026-11-22",
    readMinutes: 6,
    tags: ["AI", "LLM", "Python", "Reliability"],
    body: [
      { kind: "p", text: "Most LLM integrations are one API call away from falling over. When the model is busy or the quota runs out, the app shows a raw error and the conversation is gone. I built a desktop AI companion for Windows to see how far graceful degradation could go, and to give it the ability to test and repair its own code." },

      { kind: "h", text: "Not all errors are the same error" },
      { kind: "p", text: "The orchestration layer, called MateBrain, sorts every failure into one of two kinds before deciding what to do." },
      { kind: "table", caption: "How MateBrain classifies model errors", head: ["Error", "Response"], rows: [
        ["Transient: 503, DEADLINE_EXCEEDED", "Retry on the same model; the next attempt will probably work"],
        ["Quota: 429, RESOURCE_EXHAUSTED", "Step down to the next model; retrying would only fail again"],
      ] },
      { kind: "p", text: "Treating both the same is the usual mistake. Retrying a quota error wastes time; stepping down on a transient error gives up quality for nothing." },

      { kind: "h", text: "The ladder, and climbing back up" },
      { kind: "p", text: "There are five Gemini tiers, from 3.5 Flash down to 2.5 Flash Lite. Falling down the ladder is easy. The harder part is not staying at the bottom forever: on a cooldown timer, a recovery probe quietly tries the top tier again. If it answers, the companion is back at full quality; if not, it falls back cleanly and nobody notices." },

      { kind: "h", text: "Keeping a character for hours" },
      { kind: "p", text: "Long sessions drift into generic assistant voice, especially when the model underneath changes tier. A persona layer applies the same constraints to every call, whichever model answers: no markdown, no em dashes, contractions enforced. History is trimmed to the last 24 turns, which keeps context small enough to hold character without bloating every request." },

      { kind: "h", text: "A repair loop with a short leash" },
      { kind: "p", text: "An agent harness watches each reply for a tool call in a strict JSON schema. When one asks for a fix, the repair loop runs the project's test command, and on failure asks the model for a patch, also in a strict JSON schema, scoped to one file. It writes the patch, runs the tests again, and stops after three cycles whether or not the tests pass." },
      { kind: "list", items: [
        "Strict schemas mean the harness never executes free-form text.",
        "One file per patch keeps each change small enough to reason about.",
        "The three-cycle cap stops a confused model from looping forever.",
      ] },

      { kind: "h", text: "A UI that never freezes" },
      { kind: "p", text: "The desktop app is PyQt6 running on a qasync event loop, so streamed tokens repaint the chat as they arrive without blocking the UI thread. A FastAPI WebSocket endpoint exposes the same brain to other clients." },

      { kind: "h", text: "What carries over to production AI" },
      { kind: "list", items: [
        "Classify failures before reacting to them.",
        "Design the way back up, not just the way down.",
        "Give an agent narrow, typed actions and a hard stop.",
      ] },
    ],
  },
  {
    slug: "making-weak-passwords-expensive",
    title: "Making weak passwords expensive to crack: what my research found",
    dek: "My final-year research adds a chaotic-map layer in front of Argon2id. Cracking got 7.3 times slower. Here is what it costs, and what it has not proven yet.",
    published: "2026-11-22",
    readMinutes: 6,
    tags: ["Security", "Research", "Cryptography"],
    body: [
      { kind: "p", text: "People choose passwords they can remember, and memorable passwords are weak. Memory-hard hashes like Argon2, bcrypt and scrypt make each guess more expensive, but they do nothing about how little randomness the password had to begin with. My final-year research asked whether a pre-hashing layer could make a weak password cost much more to crack, without asking anyone to remember more." },

      { kind: "h", text: "The pipeline" },
      { kind: "list", items: [
        "HMAC-SHA256 over the input derives the parameters: how many dimensions to map into (3 to 8) and how many chaotic-map iterations to run (1 to 10).",
        "The characters are swept through chaotic maps (Logistic and Henon), which are deterministic but extremely sensitive to their input.",
        "The values are normalised logarithmically and mixed by a cascading XOR avalanche accumulator.",
        "The result goes into Argon2id (time cost 2, 100 MB of memory), so the final step is still a standard, memory-hard hash.",
      ] },

      { kind: "h", text: "What I measured" },
      { kind: "table", caption: "Pipeline compared with each algorithm on its own", head: ["Compared with", "Result"], rows: [
        ["Argon2", "7.3x slower to crack serially, 7.2x in parallel; entropy preserved (+0.02 bits)"],
        ["bcrypt", "1.9x slower to crack serially, 1.4x in parallel"],
        ["scrypt", "7.9x slower to crack serially, 9.3x in parallel"],
        ["SHA-256", "10,435x slower serially, 4,096x in parallel"],
        ["Avalanche effect", "About 50% of output bits flip, the ideal for a hash"],
      ] },
      { kind: "p", text: "Entropy staying flat is the right result, not a disappointment: the layer adds work for an attacker without adding bias or predictable bits. Precomputation resistance also improves, with a double salt plus the HMAC step." },

      { kind: "h", text: "What it costs" },
      { kind: "table", caption: "The price of the extra work", head: ["Measure", "Result"], rows: [
        ["Time per hash", "0.39 s, against 0.055 s for Argon2 alone"],
        ["Stored hash size", "36.2 KB, against 0.29 KB for Argon2"],
        ["Server performance", "About 10x slower than Argon2 or bcrypt"],
      ] },
      { kind: "p", text: "I designed for sign-in under 200 ms. At 0.39 s the current version misses that target, which is the next thing to fix." },

      { kind: "h", text: "What it has not proven" },
      { kind: "list", items: [
        "There is no formal security proof. Argon2 and bcrypt have one.",
        "The code has not been audited.",
        "Side-channel resistance is untested.",
        "It is more complex to implement than the standard algorithms.",
      ] },
      { kind: "note", text: "So it is research, not a recommendation. Production systems should keep using Argon2id as it is until a scheme like this has a proof and an audit." },

      { kind: "h", text: "Why I would still do it again" },
      { kind: "p", text: "The useful result is the shape of the trade: a several-fold increase in an attacker's cost, bought with server time and storage, while leaving the final hash standard. Knowing exactly what a design costs and what it has not proven is most of the work in security." },
    ],
  },
  {
    slug: "sixty-fps-in-the-browser",
    title: "Holding 60 FPS in a browser shooter without a game engine",
    dek: "Survive Cyber is a first-person shooter in plain Three.js. Sharing geometry cut draw calls by 90% and memory by 65%; pooling removed garbage-collection stutter.",
    published: "2026-11-22",
    readMinutes: 4,
    tags: ["Performance", "Three.js", "WebGL"],
    body: [
      { kind: "p", text: "Survive Cyber is a cyberpunk first-person shooter that runs in the browser with no game engine: a procedural city, two kinds of enemies with their own behaviour, waves that get harder, and explosions. It is playable at survive-cyber.vercel.app. The goal was a steady 60 frames a second on an ordinary laptop." },

      { kind: "h", text: "Draw calls: share everything" },
      { kind: "p", text: "Every unique mesh and material costs the GPU a draw call, and a city is mostly the same buildings repeated. The engine keeps pools of shared geometry and materials, so a hundred warehouses reuse one geometry and one material. That cut draw calls by 90% and memory use by 65%." },

      { kind: "h", text: "Garbage collection: allocate once" },
      { kind: "p", text: "Explosions create and destroy particles constantly, and in JavaScript every throwaway object is future work for the garbage collector, which shows up as a stutter mid-fight. The particle system allocates 70 particles once and recycles them. Explosions cause no garbage-collection pauses." },

      { kind: "h", text: "A loop that cannot explode" },
      { kind: "p", text: "If a frame takes too long, say when the tab was in the background, a naive loop multiplies movement by a huge time step and enemies teleport through walls. The loop clamps each step to at most 0.05 seconds and interpolates movement, so a slow frame stays a slow frame." },

      { kind: "h", text: "Spend the GPU where it shows" },
      { kind: "list", items: [
        "Pixel ratio is fixed at 1.0 and antialiasing is off: on high-density screens these quietly multiply the work per frame.",
        "Scanlines, vignette and chromatic aberration are CSS overlays rather than shader passes.",
        "Every sound is synthesised with the Web Audio API, so there are no audio files to download.",
      ] },

      { kind: "h", text: "The lesson" },
      { kind: "p", text: "None of this needed a clever algorithm. It needed counting: draw calls, allocations, milliseconds per frame. Most performance work is finding what you are doing a hundred times that you could do once." },
    ],
  },
];

export const findArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);
