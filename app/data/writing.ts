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
];

export const findArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);
