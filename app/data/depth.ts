import type { SecurityModel, LowLevelDesign, ArchitectureDiagram } from "./types";

/**
 * Threat models and low-level design per project, keyed by the project's
 * `name` in catalog.ts and merged in there. Every line comes from the
 * project's own code, migrations or ADRs; where the code accepts a risk,
 * the entry says so. Client systems stay anonymous.
 */
export const DEPTH: Record<string, { security?: SecurityModel; lowLevel?: LowLevelDesign; architectureDiagram?: ArchitectureDiagram }> = {
  "TieHere - Proximity App for Professionals to Meet in Person": {
    architectureDiagram: {
      tiers: [
        { label: "Clients", nodes: ["Flutter app (iOS, Android)", "Next.js admin console", "Brand site (tiehere.com)"] },
        { label: "Edge", nodes: ["Go API gateway (Cloud Run)", "Signs JWTs (only key holder)", "Per-user rate limit, body cap", "REST to gRPC"] },
        { label: "Core", nodes: ["Go modular monolith (Cloud Run)", "auth, meetup, billing, notification, SOS, support, analytics", "Admission control (48 in flight)", "In-process event bus", "Outbox pollers"] },
        { label: "Data and vendors", nodes: ["PostgreSQL + PostGIS (Supabase), schema per module", "FCM push, SMS and email", "App Store and Play billing"] },
      ],
      notes: [
        "Admin console talks only to a private Go admin API (Google OIDC + TOTP, audited writes).",
        "Push notifications leave through a durable Postgres outbox; cache updates use the in-process bus.",
      ],
    },
    security: {
      assets: [
        "Members' locations, phone numbers and verified company emails",
        "Sessions: 15-minute access tokens and rotating refresh tokens",
        "SOS alerts and trusted contacts",
        "Credits balances and store purchases",
        "The admin console and its audit log",
      ],
      boundaries: [
        "Phone to gateway: public internet, REST over HTTPS",
        "Gateway to monolith: gRPC; only the gateway holds the token-signing key",
        "Monolith to PostgreSQL: one pool, one schema per module",
        "Monolith to vendors: SMS, email, push and store-receipt APIs",
        "Admin console to a private admin API: Google sign-in plus TOTP",
      ],
      threats: [
        { stride: "Spoofing", threat: "Someone guesses a 6-digit sign-in code by firing many requests in parallel.", control: "An attempt is spent atomically before the code is even compared: the UPDATE only succeeds while attempts < 5, so Postgres, not application code, decides how many guesses exist. Codes come from crypto/rand and only their SHA-256 hash is stored.", where: "modules/auth/verification.go (ClaimAttempt), otp.go" },
        { stride: "Spoofing", threat: "A stolen refresh token is replayed.", control: "Refresh tokens rotate on every use and are stored hashed. Presenting one that was already used is treated as theft and ends that whole session.", where: "modules/auth/service_session.go" },
        { stride: "Spoofing", threat: "A token minted for one purpose is accepted for another.", control: "Access tokens are RS256 with a required audience claim and a 15-minute lifetime that is a code constant, not an environment setting.", where: "platform/jwt/signer.go" },
        { stride: "Elevation of privilege", threat: "A compromised backend forges sessions.", control: "The private signing key exists only in the gateway. The monolith can verify identity but can never mint a token.", where: "ADR-001 §6, gateway/" },
        { stride: "Elevation of privilege", threat: "A new or unverified account uses safety features against others.", control: "SOS and similar features require trust level 2, built from a verified phone and company email. Every trust-level write reads the user row FOR UPDATE first, so two concurrent changes cannot race.", where: "ADR-003, auth repository (FOR UPDATE)" },
        { stride: "Information disclosure", threat: "Someone narrows down a member's exact home or office.", control: "Last known locations are stored at 3 decimal places (about 110 m). Exact meetup coordinates are released only to people inside the 50 km browse radius who may join.", where: "platform/geo (StoredPrecision), ADR-004" },
        { stride: "Tampering", threat: "Bad coordinates (NaN, out of range) reach an SOS maps link sent to a real contact.", control: "Every location entry point validates latitude and longitude through one shared package before use.", where: "platform/geo" },
        { stride: "Tampering", threat: "A retried request creates a duplicate meetup or chat message.", control: "Meetup creation takes an Idempotency-Key, checked under the host's schedule lock inside the create transaction. Chat messages carry a client request id with a unique index.", where: "meetups.sql (GetMeetupByCreationKey), uq_meetup_messages_request" },
        { stride: "Repudiation", threat: "An admin changes a member's data and nobody can say why.", control: "Every admin write requires a reason and is recorded with who and when in the audit log.", where: "ADR-014, modules/admin" },
        { stride: "Denial of service", threat: "A spike or retry storm exhausts the database pool and the whole instance stops serving.", control: "Admission control lets at most 48 requests run at once; one that cannot start within 250 ms gets 'busy, try again' with Retry-After. Sign-in, session refresh, SOS, account deletion and health checks are never shed.", where: "platform/loadshed" },
        { stride: "Denial of service", threat: "One stuck query in one module starves every module of connections.", control: "Postgres itself aborts any statement after 10 s (statement_timeout on the connection), backed by a 10 s per-RPC deadline in the monolith.", where: "platform/db (StatementTimeout), logging/deadline.go" },
        { stride: "Denial of service", threat: "A caller floods the API or cycles keys to grow the limiter's memory.", control: "Per-user and per-route fixed-window rate limits at the gateway, with a cap on tracked keys that drops the oldest.", where: "platform/ratelimit" },
        { stride: "Denial of service", threat: "An SMS or email vendor outage slows every SOS alert.", control: "A circuit breaker per alert channel fails fast once a vendor is known to be down, instead of paying the full timeout per contact.", where: "platform/breaker, auth/sos" },
      ],
    },
    lowLevel: {
      concurrency: [
        "Go services on Cloud Run. The gateway serves REST and calls the monolith over gRPC; each request runs on its own goroutine.",
        "Admission control is a buffered channel used as a semaphore (48 slots, 250 ms wait), applied as a gRPC interceptor.",
        "The rate limiter, circuit breaker and feature flags are small mutex-guarded structs, hand-written rather than pulled in as dependencies.",
        "Background outbox pollers run on their own goroutines and wake through a one-slot channel; both servers shut down gracefully within 10 s.",
        "The in-process event bus is synchronous on purpose: no goroutines, no channels. A handler error or panic is recovered and logged, never failing the request that published it.",
      ],
      data: [
        "PostgreSQL on Supabase with one schema per module (auth, meetup, billing, support, admin, analytics, ops) and no foreign keys across schemas.",
        "One pgx pool of 20 connections, shared by every module, with a 10 s server-side statement timeout.",
        "Type-safe queries generated by sqlc; 51 versioned migrations, each with a rollback.",
        "Proximity search uses PostGIS ST_DWithin on geography with a 50 km radius.",
        "Invariants live in the schema: CHECK constraints on enums and lengths, self-report and self-block prevented by CHECK, partial unique indexes so a member has one open report per person.",
        "Hot paths are indexed for their exact query shape, such as the moderation queue on (status, created_at DESC).",
      ],
      routines: [
        { name: "outbox.Poller", detail: "Claims due rows with FOR UPDATE SKIP LOCKED, so two instances get disjoint batches and a crashed claimer releases its rows automatically. Per-row leases are renewed before delivery; failures back off and dead-letter after 10 attempts." },
        { name: "eventbus.Publish", detail: "Runs subscribers synchronously after the business write commits. Losing an event is accepted only because every topic feeds an idempotent cache upsert, with backfill commands to rebuild the caches." },
        { name: "verifyAndConsumeCode", detail: "Spends an OTP attempt with an atomic UPDATE before comparing the code, closing a race where 100 parallel guesses each saw the same attempt count." },
        { name: "SOS trigger", detail: "Serialised per user with a transaction-scoped Postgres advisory lock, then fans out to trusted contacts through per-channel circuit breakers." },
      ],
      tradeoffs: [
        "Push notifications, the one topic whose loss would be permanent and user-visible, use a durable Postgres outbox. Everything else uses the lighter in-process bus.",
        "Outbox delivery is at least once by design: a duplicate 'request accepted' push is preferred to ever losing one.",
        "The rate limiter is in memory for zero network hops, behind a Limiter interface so a shared store can be swapped in when the gateway scales out, with no call-site changes.",
      ],
    },
  },
  "VoltNexus - Cloud-Native EV Charging Microservices Platform": {
    security: {
      assets: [
        "Driver and station-owner accounts (WSO2 Asgardeo identities)",
        "Bookings and charger reservations",
        "Grid-zone load figures that drive price surges",
      ],
      boundaries: [
        "Angular app to Spring Cloud Gateway: public internet, OAuth 2.0 bearer tokens",
        "Gateway to Station, Booking and Grid services: internal network",
        "Services to RabbitMQ, Redis and PostgreSQL: managed cloud tiers",
      ],
      threats: [
        { stride: "Spoofing", threat: "A forged, expired or wrongly typed token reaches the API.", control: "The gateway validates every token's signature against Asgardeo's published keys with a custom Nimbus processor that accepts RFC 9068 at+jwt tokens without relaxing the signature, issuer or expiry checks. Sign-in uses PKCE.", where: "api-gateway/config/SecurityConfig.java" },
        { stride: "Elevation of privilege", threat: "A driver manages chargers, or a station owner acts as a driver.", control: "Roles from the token are mapped to Spring authorities; managing chargers requires STATION_OWNER and bookings require an authenticated user.", where: "SecurityConfig.java (hasRole), ChargerController (@PreAuthorize)" },
        { stride: "Tampering", threat: "A booking is saved but the charger is never reserved because the process died before publishing.", control: "The booking and its outbox event are written in one local transaction; a scheduled publisher sends pending events to RabbitMQ every 5 seconds.", where: "BookingService.createBooking, scheduler/OutboxPublisher.java" },
        { stride: "Tampering", threat: "A redelivered message reserves a charger or adds grid load twice.", control: "Consumers record each event id in processed_events (primary key) and skip duplicates; a concurrent duplicate hits the key, is caught and acknowledged.", where: "event/BookingEventListener.java, model/ProcessedEvent.java" },
        { stride: "Denial of service", threat: "A traffic spike overwhelms the services.", control: "Redis-backed token-bucket rate limiting at the gateway: 100 requests a second, burst 100.", where: "api-gateway application.yml (RequestRateLimiter)" },
        { stride: "Denial of service", threat: "One slow or failing service ties up the gateway and cascades.", control: "Resilience4j circuit breakers per route open at a 50% failure rate over 10 calls, wait 10 s, then let 3 trial calls through; calls time out after 3 s and fall back.", where: "application.yml (circuitbreaker, timelimiter), FallbackController" },
        { stride: "Denial of service", threat: "A poison message is retried forever and blocks the queue.", control: "Failed messages are rejected without requeue and routed to a dead-letter exchange.", where: "RabbitMQConfig (x-dead-letter-exchange)" },
      ],
    },
    lowLevel: {
      concurrency: [
        "Spring Cloud Gateway is reactive (non-blocking Netty); the services are Spring Boot with a thread per request.",
        "Outbox publishers run on Spring's scheduler every 5 seconds inside one transaction per batch.",
        "RabbitMQ consumers acknowledge manually: ack after the work and the processed-event row are saved, nack without requeue on failure.",
      ],
      data: [
        "Each service owns its own PostgreSQL schema on Supabase; services share no tables.",
        "outbox_events (status PENDING, PUBLISHED or FAILED) in Booking and Grid; processed_events keyed by event id in each consumer.",
        "The charger list is cached in Redis (@Cacheable) and evicted on every charger update.",
        "HikariCP connection pooling per service.",
      ],
      routines: [
        { name: "BookingService.createBooking", detail: "@Transactional: save the booking, serialise a BOOKING_CONFIRMED event with the charger's power, save it to the outbox. Both or neither." },
        { name: "GridCalculationService.processNewBookingLoad", detail: "Adds the charger's kW to the zone's load; above 80% of transformer capacity it writes a PRICE_SURGE event (1.5x) to the outbox in the same transaction." },
        { name: "BookingEventListener", detail: "Idempotent consumer: skip if the event id was processed, update the charger and evict the cache, record the id, then ack." },
      ],
      tradeoffs: [
        "At-least-once delivery with idempotent consumers instead of distributed transactions (no two-phase commit).",
        "Events that fail to publish are kept as FAILED rows, never dropped, so nothing is silently lost.",
      ],
    },
  },
  "Enterprise Ticket Management System": {
    architectureDiagram: {
      tiers: [
        { label: "Surfaces", nodes: ["Client portal", "Agent and developer workspace", "Admin"] },
        { label: "Next.js 16", nodes: ["proxy.ts: CSP nonce, session refresh", "Server Actions: requireUser, requirePermission, zod", "Pure domain: lifecycle, priority, SLA"] },
        { label: "Data access", nodes: ["Drizzle DAL", "withContext: one transaction, RLS context set", "Postgres-backed rate limits", "Audit and ticket events"] },
        { label: "Platform", nodes: ["PostgreSQL, RLS on every table (Supabase)", "Private storage, 60 s signed URLs", "Supabase Auth, email", "pg_cron SLA tick each minute"] },
      ],
    },
    security: {
      assets: [
        "Each client organisation's tickets, comments and attachments",
        "Internal notes, work logs and review submissions that clients must never see",
        "Accounts, including admin and lead accounts that can reassign and close work",
        "Invoicing and outstanding-settlement records",
      ],
      boundaries: [
        "Browser to Next.js Server Actions and route handlers",
        "App to PostgreSQL as a restricted role (app_rw) with row-level security on",
        "App to private object storage through short-lived signed URLs",
        "Supabase Auth for sessions; outbound email for magic links and resets",
      ],
      threats: [
        { stride: "Information disclosure", threat: "A client reads another client's tickets by changing an id in the URL (IDOR).", control: "Every business table carries org_id with row-level security. Each request runs in one transaction that first sets app.user_id, app.org_id and app.role, so Postgres filters rows even if application code has a bug. Hidden rows return 404 and write an access_denied audit row.", where: "lib/dal/db.ts (withContext), migration 0001: 84 policies on 33 tables" },
        { stride: "Information disclosure", threat: "A client sees internal comments, work logs or the in-review status.", control: "Filtered twice: in the data-access layer and again in RLS policies. Database tests and end-to-end tests try to read across clients and must fail.", where: "db/policies/tests/rls.sql (pgTAP), tests/e2e IDOR specs" },
        { stride: "Spoofing", threat: "Credential stuffing or a reused breached password.", control: "Passwords of 12+ characters are checked against known breaches through HaveIBeenPwned's k-anonymity API. Sign-in is rate-limited per account and per IP. TOTP is mandatory for admin and lead.", where: "lib/auth/pwned.ts, lib/ratelimit, lib/actions/auth.ts" },
        { stride: "Spoofing", threat: "A mail scanner opens a magic link and signs the user in on its behalf.", control: "Magic-link pages require a click instead of consuming the token on load; tokens are stored only as SHA-256 hashes; the response never reveals whether an email exists.", where: "lib/actions/auth.ts, lib/auth/local.ts" },
        { stride: "Elevation of privilege", threat: "A client submits fields reserved for staff, such as priority or assignee.", control: "Every input is parsed by a strict zod schema per role; unknown fields are rejected. Developers cannot resolve, close, reassign or change priority.", where: "lib/schemas, lib/authz" },
        { stride: "Tampering", threat: "A malicious file is uploaded disguised as a document.", control: "Extension allowlist, MIME type sniffed from the bytes on the server, 25 MB cap, private bucket, downloads forced as attachments with nosniff and signed URLs valid for 60 seconds.", where: "app/api/attachments, lib/storage (SIGNED_URL_TTL_SECONDS)" },
        { stride: "Tampering", threat: "Injected script in comments or ticket text.", control: "Per-request CSP nonce with strict-dynamic, Markdown rendered through rehype-sanitize, and raw HTML rendering banned in the codebase.", where: "proxy.ts, next.config.ts (HSTS, X-Frame-Options DENY)" },
        { stride: "Tampering", threat: "Two people change the same ticket at once and one silently overwrites the other.", control: "Tickets carry a version; an update applies only where the version still matches, otherwise the user gets a conflict.", where: "lib/dal/tickets.ts (expectedVersion)" },
        { stride: "Repudiation", threat: "Someone denies changing a ticket, or history is edited afterwards.", control: "Every mutation writes ticket_events and audit_log rows, and the app role has UPDATE and DELETE revoked on both, so history is append-only even to the app.", where: "migration 0001 (REVOKE UPDATE, DELETE ON ticket_events, audit_log)" },
        { stride: "Denial of service", threat: "Spam tickets, comments or login attempts.", control: "Postgres-backed rate limits per scope: login (account and IP), magic link, password reset, ticket creation, comments, work logs and submissions.", where: "lib/ratelimit/provider.ts" },
      ],
    },
    lowLevel: {
      concurrency: [
        "Next.js Server Actions on serverless functions, each holding a single pooled connection through Supabase's transaction pooler (prepared statements off).",
        "Every data access runs inside one transaction with the RLS context set with set_config(..., true), so the context cannot leak to the next request on a reused connection.",
        "Optimistic concurrency on tickets through a version column; review decisions re-read the submission under lock.",
        "A minute-level SLA job is scheduled by pg_cron in the database, because the hosting plan's own cron runs only daily.",
      ],
      data: [
        "Drizzle ORM over postgres.js; migrations are plain SQL so the system can move from Supabase to the company's own Postgres.",
        "RLS policies read current_setting('app.org_id'), not a vendor-specific auth function, which keeps them portable.",
        "Ticket status, priority (impact x urgency) and SLA rules are pure functions and data, unit-tested apart from the UI.",
      ],
      routines: [
        { name: "withContext(ctx, fn)", detail: "Opens a transaction, sets app.user_id, app.org_id and app.role transaction-locally, then runs the data access. There is no other path to business tables." },
        { name: "Ticket transition", detail: "Validates the move against the lifecycle (new, open, in progress, in review, resolved, closed), checks the version, writes the ticket and a ticket_events row in the same transaction." },
      ],
      tradeoffs: [
        "Rate limits live in Postgres instead of Redis: one less service to run, at the cost of a database write per check.",
      ],
    },
  },
  "Offline-First Field Sales App": {
    architectureDiagram: {
      tiers: [
        { label: "Android device", nodes: ["Flutter app", "SQLCipher database", "Keystore secrets", "Outbox with local negative ids"] },
        { label: "Sync engine", nodes: ["Event-driven: launch, resume, reconnect", "Serial push by priority", "Paged pull by cursor", "Backoff with jitter"] },
        { label: "ASP.NET Core API", nodes: ["JWT auth, PBKDF2 hashing", "Rate limits: login, sync", "Idempotency guard per write", "Range locks for numbering"] },
        { label: "Back office", nodes: ["Existing SQL Server database", "Additive changes only", "Back-office system unchanged"] },
      ],
    },
    security: {
      assets: [
        "Orders, returns and cash and cheque collections taken in the field",
        "Customer and debtor data from the company's back office",
        "Reps' locations during working hours",
        "Credentials and tokens on a phone that could be lost or stolen",
      ],
      boundaries: [
        "Rep's Android phone (offline most of the day) to the ASP.NET Core API",
        "API to the existing SQL Server database shared with the back-office system",
      ],
      threats: [
        { stride: "Information disclosure", threat: "A lost phone exposes customer data and the day's takings.", control: "The on-device database is encrypted with SQLCipher. Its key, the access token and the offline-login verifier live only in Android Keystore-backed secure storage, never in plain preferences or the database file.", where: "mobile/lib/core/db/secure_store.dart, sqflite_sqlcipher" },
        { stride: "Spoofing", threat: "Password guessing against rep or customer logins.", control: "Passwords are hashed with PBKDF2-HMAC-SHA256 at 210,000 iterations (OWASP's 2023 figure) with a 128-bit salt and constant-time comparison. Logins are limited to 10 a minute per caller, with a 15-minute lockout.", where: "Infrastructure/Auth/Pbkdf2PasswordHasher.cs, RateLimitPolicies.cs, AuthOptions" },
        { stride: "Tampering", threat: "A retried upload on a flaky connection creates a duplicate order or payment.", control: "Each record gets a client reference once, on the device. The server claims it inside the same database transaction as the business insert, so a retry replays the original answer instead of writing twice.", where: "Application/Abstractions/IIdempotencyGuard.cs, dbo.MobileIdempotency" },
        { stride: "Tampering", threat: "Two writes allocate the same order or customer number.", control: "Numbers are allocated as MAX + 1 under UPDLOCK and HOLDLOCK inside the transaction, so concurrent writers serialise on the range.", where: "IOrderWriteRepository, CustomerWriteService, DayEndService" },
        { stride: "Tampering", threat: "A device with a wrong clock back-dates location records.", control: "Timestamps more than 10 minutes ahead of the server are rejected.", where: "RepLocationWriteService (MaxClockAhead)" },
        { stride: "Denial of service", threat: "Twenty reps reconnecting at once flood the API.", control: "Sync is token-bucket limited per rep (120 burst, 60 a minute). Retries after a 5xx back off 30 s, 1 m, 4 m, 16 m, 32 m up to 60 m, each with 20% jitter.", where: "RateLimitPolicies.cs (Sync), mobile/lib/core/sync/backoff.dart" },
        { stride: "Repudiation", threat: "A rep disputes a day-end cash and cheque total.", control: "Day close is recorded once per rep per date under lock, with the totals, location and battery level at close.", where: "DayEndService, SalesRepLocation, DayEndRecords" },
      ],
    },
    lowLevel: {
      concurrency: [
        "The phone's outbox is pushed strictly serially, by priority then insertion order, so a new customer always reaches the server before an order placed against it.",
        "Sync is event-driven, not polled: on launch or resume, when connectivity returns, and on demand. 'Saved on the device' is shown as a success state, not an error.",
        "Server writes run in explicit transactions; contended allocations use SQL Server range locks (UPDLOCK, HOLDLOCK).",
      ],
      data: [
        "The existing production SQL Server database is used as it is: three new tables and four new columns, all additive, and the back office reads none of them.",
        "On the phone, an encrypted SQLite database mirrors the reference data and holds the outbox; first-run setup downloads everything in one call and falls back to a resumable, cursor-paged pull on weak signal.",
        "Records created offline get negative local ids; when the server answers, every reference is rewritten to the server's key in one local transaction, so an order and its lines never disagree.",
      ],
      routines: [
        { name: "IdempotencyGuard.ClaimAsync", detail: "Claim the client reference, insert the business row, mark the claim complete, commit. A retry finds the completed claim and gets the original key back." },
        { name: "PushWorker", detail: "Sends due outbox entries one at a time. 422 marks the entry for a person to review, 401 pauses sending until the rep signs in online, 429 and 5xx back off with jitter." },
        { name: "rekey", detail: "Replaces a local placeholder key with the server's key in every column that holds it, inside one transaction." },
      ],
      tradeoffs: [
        "Additive-only schema changes so the back-office system keeps working untouched.",
        "Serial push over parallel push, because ordering between related records matters more than raw speed.",
      ],
    },
  },
  "Healthy Meal Pre-Ordering App and Backend": {
    architectureDiagram: {
      tiers: [
        { label: "Clients", nodes: ["Flutter app (iOS, Android)", "Web storefront", "Management dashboard"] },
        { label: "NestJS modular monolith", nodes: ["auth, customer, menu, inventory", "order, dispatch, promotion, payment", "finance, reports, notification", "Global validation whitelist"] },
        { label: "Coordination", nodes: ["Advisory lock per service date", "Row locks: orders, promotions, dispatch", "In-process event bus"] },
        { label: "Data and services", nodes: ["PostgreSQL", "Redis: login attempt counters", "Image host", "Google sign-in"] },
      ],
    },
    security: {
      assets: [
        "Customer accounts, addresses and order history",
        "Kitchen stock for each service date",
        "Promotion codes with usage limits",
        "Management accounts that run kitchens, dispatch and finance",
      ],
      boundaries: [
        "Flutter app (Android, iOS) to the NestJS API over HTTPS",
        "API to PostgreSQL and Redis",
        "API to Google for sign-in and to the image host",
      ],
      threats: [
        { stride: "Spoofing", threat: "Password guessing against customer or management logins.", control: "Passwords are hashed with bcrypt (cost 12). Failed logins are counted per identifier in Redis: 5 attempts per 15 minutes.", where: "modules/auth/auth.service.ts, shared/redis/rate-limiter.service.ts" },
        { stride: "Spoofing", threat: "A stolen refresh token is used to stay signed in.", control: "Refresh tokens are stored only as SHA-256 hashes and are single-use: each refresh revokes the old token and issues a new pair. Expired or revoked tokens are refused.", where: "auth.service.ts (refresh, revoke)" },
        { stride: "Tampering", threat: "A client sends extra fields to change prices or another user's data.", control: "A global validation pipe whitelists every DTO, stripping any property not declared. Line prices are snapshotted from the menu on the server, never taken from the client.", where: "main.ts (ValidationPipe whitelist), order/cart.service.ts" },
        { stride: "Tampering", threat: "Two customers both buy the last portion, or a promotion is redeemed past its limit.", control: "Checkouts for one service date are serialised with a transaction-scoped Postgres advisory lock, and stock is re-checked inside it. The promotion row is locked FOR UPDATE inside the checkout, so usage limits cannot be read twice at once.", where: "order/order.service.ts (pg_advisory_xact_lock), order/promotion.service.ts" },
        { stride: "Tampering", threat: "Two staff move the same order through different states at once.", control: "Order status transitions and dispatch take a pessimistic write lock on the order row inside a transaction.", where: "order.service.ts, order/dispatch.service.ts (pessimistic_write)" },
        { stride: "Elevation of privilege", threat: "A customer token is used on management endpoints.", control: "Management sign-in and refresh check the user's role and active status on every refresh, separately from customer sessions.", where: "auth.service.ts (refreshManagement), shared/security/jwt-auth.guard.ts" },
      ],
    },
    lowLevel: {
      concurrency: [
        "NestJS on Node.js's event loop; database work runs in explicit TypeORM transactions.",
        "Contended resources are serialised in the database, not in memory: an advisory lock per service date for checkout, row locks for promotions, orders and dispatch. This stays correct with several API instances.",
        "Side effects such as notifications go through an in-process event bus, keeping modules decoupled without a broker.",
      ],
      data: [
        "PostgreSQL with modules for auth, customer, menu, inventory, order, payment, finance, notification and reports.",
        "Inventory is derived from committed order lines, so there is no separate counter to drift out of step.",
        "The mobile backend is a fork of the web platform's modular monolith that adds mobile endpoints without changing web behaviour.",
      ],
      routines: [
        { name: "Checkout", detail: "Open a transaction, take the advisory lock for the service date, re-check the chosen kitchen's remaining stock, lock and apply the promotion, write the order and lines, commit." },
        { name: "Refresh", detail: "Hash the presented token, find it, refuse if revoked or expired, revoke it, issue a new access and refresh pair." },
      ],
      tradeoffs: [
        "Database-level locking over an in-memory queue, so correctness holds no matter how many API instances run.",
      ],
    },
  },
  "Modern Womenswear Storefront": {
    architectureDiagram: {
      tiers: [
        { label: "Build", nodes: ["Static product pages (generateStaticParams)", "120-frame film, immutable cache"] },
        { label: "Browser", nodes: ["Scroll-scrubbed canvas (GSAP, Lenis)", "Cart in the browser"] },
        { label: "Order route", nodes: ["Same-origin and content-type check", "Rate limit, 16 KB cap, honeypot", "zod validation"] },
        { label: "Server domain", nodes: ["Prices from the catalogue only", "Order creation (server-only)"] },
      ],
    },
    security: {
      assets: [
        "Customer names, phone numbers and delivery addresses",
        "Order totals and the product catalogue's prices",
      ],
      boundaries: [
        "Browser to a statically generated site on a CDN",
        "Browser to one server route that accepts orders",
      ],
      threats: [
        { stride: "Tampering", threat: "A shopper edits prices in the browser before checking out.", control: "The server rebuilds every order from its own catalogue and ignores any price sent by the browser; if an item is no longer available the order is refused.", where: "lib/server/orders.ts (priceCart)" },
        { stride: "Tampering", threat: "Another site submits orders on a visitor's behalf (CSRF).", control: "The order route accepts only same-origin requests with a JSON content type.", where: "app/api/orders/route.ts (isSameOrigin)" },
        { stride: "Tampering", threat: "Malformed or hostile input in the checkout form.", control: "A zod schema validates every field, strips control characters, collapses whitespace and caps each length; the body itself is capped at 16 KB.", where: "lib/validation.ts, MAX_BODY_BYTES" },
        { stride: "Denial of service", threat: "Bots flood the order endpoint.", control: "10 orders per 10 minutes per IP with Retry-After, plus a hidden honeypot field: a bot that fills it gets a success reply and no order is created.", where: "lib/server/rateLimit.ts, orderRequestSchema.website" },
        { stride: "Information disclosure", threat: "The site is framed or injected into to steal customer details.", control: "Content Security Policy, HSTS with preload, X-Frame-Options DENY, and no-store caching on order responses.", where: "next.config.ts (securityHeaders)" },
      ],
    },
    lowLevel: {
      data: [
        "Product pages are generated at build time (generateStaticParams) and served from the CDN.",
        "The 120-frame product film is served with a one-year immutable cache; product images use stale-while-revalidate.",
        "Server-only modules are marked 'server-only', so order and rate-limit code can never be bundled into the browser.",
      ],
      routines: [
        { name: "POST /api/orders", detail: "Same-origin check, content type, rate limit, size cap, parse, validate, honeypot, then price the cart from the catalogue and create the order." },
      ],
    },
  },
  "Self-Healing AI Desktop Companion with Multi-Tier Model Orchestration": {
    lowLevel: {
      concurrency: [
        "qasync runs Python's asyncio loop inside Qt's event loop, so model calls and the UI share one thread without blocking each other.",
        "Responses are an async generator: each streamed chunk is appended to the chat and the coroutine yields to the event loop, which lets Qt repaint between chunks.",
        "A FastAPI WebSocket endpoint streams the same responses to other clients, sending thinking and idle states around each answer.",
      ],
      routines: [
        { name: "MateBrain.get_response_stream", detail: "Streams from the current model. On a quota error (429) it moves to the next model in the ordered list and continues the same answer; the UI's avatar reflects which tier is active." },
        { name: "process_thought", detail: "Sets the thinking state, streams chunks into the chat bubble, and always restores the idle state in a finally block, even if the stream fails." },
      ],
      tradeoffs: [
        "Ordered by daily quota: the highest-allowance model first, smaller ones as backups, so normal use rarely reaches the fallbacks.",
      ],
    },
  },
  "AI Data Analyst for a Bakery Business": {
    architectureDiagram: {
      tiers: [
        { label: "Browser", nodes: ["HTML + vanilla JS", "Answers stream stage by stage (NDJSON)"] },
        { label: "Routing (no AI)", nodes: ["Rule-based intent check", "Planner route: zero AI calls", "Chat route: scope check, vocabulary grounding"] },
        { label: "Text to SQL", nodes: ["Vanna + ChromaDB, local ONNX embeddings", "LLM chain: Groq, Gemini, Anthropic, custom", "Extract, then sqlglot AST guard", "One repair attempt on error"] },
        { label: "Data", nodes: ["Executor: timeout, 10,000-row cap", "SQL Server: 8 read-only views", "Raw tables DENYed", "Totals and charts computed in code"] },
      ],
      notes: [
        "One FastAPI process; no broker, no worker, no external vector service.",
        "A typical chat question costs one or two AI calls and never more than three; a planning question costs none.",
      ],
    },
    security: {
      assets: [
        "Live sales, production, waste and stock data in the bakery's ERP database",
        "The ERP itself, which must never be written to by the assistant",
        "Managers' accounts and the question history",
      ],
      boundaries: [
        "Manager's browser to the assistant app",
        "Assistant to an LLM provider: only the question and the database's view and column names cross",
        "Assistant to the ERP's SQL Server through a dedicated read-only account",
      ],
      threats: [
        { stride: "Tampering", threat: "A prompt or a model mistake produces SQL that changes data (DELETE, UPDATE, DROP).", control: "Every statement is parsed into a syntax tree with sqlglot and rejected unless it is a single SELECT over allowed views. The executor accepts only a ValidatedSQL object that nothing but the guard can create, so unvalidated SQL reaching the database is impossible by construction.", where: "sql/guard.py (SqlGuard.validate), db/executor.py" },
        { stride: "Elevation of privilege", threat: "The guard is bypassed and the account's own rights are used.", control: "The database account can SELECT only 8 reporting views. Every base table carries an explicit DENY on SELECT, INSERT, UPDATE and DELETE, generated from the catalogue so no table is missed and no later role grant can widen it.", where: "sql_create_readonly_user.sql" },
        { stride: "Information disclosure", threat: "Business data is sent to a third-party AI provider.", control: "The model is shown only view and column names. Results are formatted, totalled and charted in code, so data rows never go to the provider.", where: "ARCHITECTURE.md §3, nlq/answer_format.py" },
        { stride: "Tampering", threat: "The model states a wrong figure or invents quantities to bake.", control: "No number shown to a user is produced by the model. Single values and totals over 25 rows are computed in code, and every planning question goes to a deterministic planner.", where: "nlq/pipeline.py, planning/" },
        { stride: "Denial of service", threat: "A runaway query slows the ERP the business runs on.", control: "Statement timeout of 30 s, a 10,000-row cap, at most 12 joins and 5 unions, and a cap on SQL length.", where: "db/executor.py, sql/guard.py" },
        { stride: "Spoofing", threat: "Password guessing against manager accounts.", control: "Argon2id password hashing (PBKDF2 at 600,000 rounds as the fallback), 5 attempts then a 15-minute lockout, and sessions that end after 30 idle minutes.", where: "auth/service.py" },
        { stride: "Repudiation", threat: "A disputed answer cannot be traced to the query behind it.", control: "Managers can see the SQL behind every answer, and each executed statement is written to an audit log.", where: "guard.py defence layer 5, review/" },
      ],
    },
    lowLevel: {
      data: [
        "Reads only from 8 reporting views over the ERP's SQL Server, through a pooled pyodbc connection with the timeout set per connection.",
        "Frequently needed facts, such as the latest trading date, are computed once and cached; the SQL anchor pass substitutes them so a 0.3 s MAX(date) scan becomes a constant.",
        "Item names are resolved against the real item list before SQL is written, so the model is given exact spellings.",
      ],
      routines: [
        { name: "SqlGuard.validate", detail: "Parse to an AST, require one SELECT, check every table against the allowed views, enforce join, union and length caps, then return ValidatedSQL." },
        { name: "Executor.execute", detail: "Run validated SQL with the connection timeout, fetch at most 10,000 + 1 rows to detect truncation, coerce types, return a typed result." },
        { name: "Deterministic routing", detail: "Questions are routed to the chat pipeline or the production planner by rules, not by a model, so routing adds no latency and cannot hallucinate." },
      ],
      tradeoffs: [
        "Defence in depth, outermost first: the AST guard, the database account's DENY rules, the statement timeout, the row cap and the audit log. Any one can fail and the others still hold.",
      ],
    },
  },
  "TELCOM App for a Distributed Environment": {
    security: {
      assets: ["Customer accounts and plans", "Bills and payment transactions", "Chat conversations with support agents"],
      boundaries: ["Clients to the API gateway", "Gateway to internal services", "Services to RabbitMQ, Redis and MongoDB"],
      threats: [
        { stride: "Spoofing", threat: "A caller reaches a service with a forged identity.", control: "The gateway verifies the JWT once, then forwards the user id and role with a shared gateway secret; services accept identity headers only when that secret matches, and otherwise verify the token themselves.", where: "api-gateway/src/middleware/authMiddleware.js, services/*/middleware/authMiddleware.js" },
        { stride: "Information disclosure", threat: "Customer passwords are exposed if the user database leaks.", control: "Passwords are salted and hashed with bcrypt before they are stored.", where: "user-service/src/models/userModel.js" },
        { stride: "Denial of service", threat: "A billing run produces thousands of notifications at once and overwhelms the providers.", control: "Notifications go through a Redis-backed Bull queue whose worker sends them steadily in the background, logging each result.", where: "notification-service/src/queues/notificationQueue.js" },
      ],
    },
    lowLevel: {
      concurrency: [
        "Every service is a stateless Node.js process, so instances can be added behind the gateway.",
        "Slow work leaves the request path: domain events go to a RabbitMQ topic exchange and are acknowledged after processing; notifications are jobs on a Bull queue with a background worker.",
        "Live chat keeps one Socket.IO connection per customer; waiting customers sit in a Redis list (RPUSH to join, LPOP for the next free agent) so queue order survives a restart.",
      ],
      data: [
        "Each service owns its own MongoDB database: users, bills, transactions, packages, chat sessions and messages, notification logs.",
        "The notification service binds to billing.generated, payment.success and service.activated.",
      ],
      routines: [
        { name: "eventConsumer", detail: "Asserts the durable topic exchange, binds an exclusive queue to the three routing keys, turns each event into notification jobs, then acks." },
        { name: "queueManager", detail: "Adds a customer to the agent queue, reports their position, pops the next customer for a free agent, and removes a customer who leaves." },
      ],
    },
  },
  "AI Knowledge Book - Interactive Encyclopedia with Real-Time Streaming": {
    architectureDiagram: {
      tiers: [
        { label: "Client", nodes: ["React + TypeScript (Vite)", "Book-style reader that renders tokens as they arrive"] },
        { label: "FastAPI", nodes: ["Auth dependency on every route", "Prompt builder (topic, level)", "/stream: StreamingResponse", "Suggestion service"] },
        { label: "Services", nodes: ["Groq: llama-3.1-8b-instant", "Supabase Auth", "Supabase Postgres: knowledge_pages"] },
      ],
    },
    security: {
      assets: ["User accounts", "Saved knowledge pages", "The LLM provider key and its quota"],
      boundaries: ["Browser to the FastAPI backend", "Backend to Supabase and to Groq"],
      threats: [
        { stride: "Spoofing", threat: "An anonymous caller uses the API and spends the LLM quota.", control: "Every generation and streaming route depends on get_current_user, which validates the bearer token with Supabase Auth before any model call.", where: "app/core/auth.py, api/routes/stream.py" },
        { stride: "Tampering", threat: "Malformed or oversized requests reach the prompt builder.", control: "Request bodies are typed Pydantic models, and each completion is capped at 2,000 tokens.", where: "api/routes/stream.py (StreamRequest), services/llm/llm_service.py" },
        { stride: "Information disclosure", threat: "Another site calls the API from a visitor's browser.", control: "CORS allows only the app's own origins.", where: "app/middleware/cors.py" },
        { stride: "Information disclosure", threat: "The provider key leaks to the browser.", control: "The Groq key stays on the server; the browser only ever talks to the backend.", where: "services/llm/groq_client.py, core/config.py" },
      ],
    },
    lowLevel: {
      concurrency: [
        "The stream route returns a generator wrapped in StreamingResponse; FastAPI runs it in its thread pool, so a long answer never blocks the event loop for other users.",
        "Each chunk is written to the response as soon as the provider sends it, so the first words appear in well under a second.",
      ],
      routines: [
        { name: "POST /stream", detail: "Authenticate, build the prompt from topic and level, open a streaming completion, and yield each content delta to the client as plain text." },
        { name: "LLMService", detail: "One place that talks to the provider (generate and stream), so adding another model means changing one module, not the routes." },
      ],
    },
  },
  "AlgoTrack - Self-Paced DSA and System Design Diary": {
    architectureDiagram: {
      tiers: [
        { label: "Browser", nodes: ["Next.js App Router pages", "Dashboard, problems, notes, daily logs"] },
        { label: "Edge", nodes: ["middleware.ts: session refresh", "Protected routes redirect", "CORS allowlist for /api"] },
        { label: "Route handlers", nodes: ["problems, topics, notes, solution panels", "daily logs, dashboard", "music: tracks, playlists, preferences"] },
        { label: "Supabase", nodes: ["Postgres via Drizzle ORM", "Auth", "Storage for uploads"] },
      ],
    },
    security: {
      assets: ["Each user's notes, solutions and progress", "Uploaded audio files"],
      boundaries: ["Browser to the edge middleware", "Route handlers to Supabase"],
      threats: [
        { stride: "Spoofing", threat: "A signed-out visitor opens the dashboard or calls the API.", control: "Authentication is enforced twice: the edge middleware refreshes the session and redirects protected pages, and every route handler calls auth.getUser() before touching data.", where: "src/middleware.ts, src/app/api/*/route.ts" },
        { stride: "Information disclosure", threat: "One user reads another user's notes or playlists.", control: "Every query is scoped by the signed-in user's id in its WHERE clause.", where: "src/app/api (eq(table.userId, user.id))" },
        { stride: "Information disclosure", threat: "Another website calls the API from a visitor's browser.", control: "API routes answer cross-origin requests only for an allowlist of the app's own origins, including preflight.", where: "src/middleware.ts (CORS)" },
      ],
    },
    lowLevel: {
      data: [
        "PostgreSQL schema managed by Drizzle migrations; user-owned tables carry a user id.",
        "Large files go to Supabase Storage from the server, with clear errors when a file is too large, so uploads work on serverless hosting.",
      ],
    },
  },
};
