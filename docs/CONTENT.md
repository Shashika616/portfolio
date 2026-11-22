# Editing content

Everything visible lives in `app/data/`. Both views (dial and `/profile`) update automatically.

## Add a project

Add an object to the right array in `app/data/catalog.ts` (`projects`, `researches` or `games`). Order = display order; put `featured: true` on the few you want first.

```ts
{
  name: "Product Name - What It Is",          // text before " - " is the short title
  summary: "One outcome-first sentence (≤160 chars).",
  coverline: "Featured only: the outcome in a few words, why it matters (not internals like counts or refactors).",
  pullQuote: "Featured only: one sentence pairing the engineering with its business outcome.",
  cover: "/work/product.jpg",                 // live screenshot or key diagram
  category: "Web Development",                // see ProjectCategory in types.ts
  platforms: ["Web", "Backend"],              // drives the Websites/Mobile/Backend/Desktop filters
  status: "Client work",                      // NOT shown on screen; drives the Live / Client work filters
  year: "2026",
  featured: true,
  tech: ["Next.js 16", "PostgreSQL"],
  introduction: "...", problemStatement: "...", requirements: ["..."],
  solution: "...", architecture: "...",
  coreFeatures: ["..."], technicalHighlights: ["..."],
  searchVisibility: ["..."],                  // websites only: SEO/GEO facts (structured data, sitemap…)
  githubLink: "https://github.com/...",       // PUBLIC repos only
  playLink: "https://...",                    // live URL, only if it returns 200
  mediaGroups: [{ groupTitle: "Architecture", items: [{ url: "/x/arch.png", label: "...", buttonText: "..." }] }],
}
```

Rules:
- **Client projects are anonymous**: describe the business ("a bakery business", "a building-materials distributor"), no client name in any field, no repo/live link, no screenshot that shows their brand.
- Facts only. Pull them from the project's own README/docs. If a number isn't in the source, leave it out.
- Then add one line to `public/llms.txt` under "Selected work".

## Cover screenshots

1440×900 capture, saved as JPEG (~75% quality, ≤1440px wide) to `public/work/<slug>.jpg`. On macOS: `sips -s format jpeg -s formatOptions 76 -Z 1440 in.png --out public/work/slug.jpg`. Crop out headers that show a client's brand. TieHere uses its dark theme.

## Roles, education, profile

- Roles: `app/data/experience.ts` (newest first). `achievements` are shown first ("Impact"); keep metrics exactly as the user supplied them.
- Name, headline, about, links, CV path: `PROFILE` in `app/data/profile.ts`. Focus areas: `FOCUS_AREAS`. Skills: `SKILLS`. Education/coursework: `EDUCATION`, `COURSEWORK`.
- Certificates: `certificates` array in `catalog.ts`.

## Filters

`app/data/filters.ts` → `WORK_FILTERS`. Each has `id`, `label`, `test(project)`. Filters with zero matches are hidden automatically.

## Sections of the dial

`app/sectionsData.ts`: title + plain-language subtitle (shown in the mobile sheet). Adding a section also needs a renderer in `ContentCard.tsx`; the dial spacing (22°) fits up to 7 sections.

## Articles (`/writing`)

Add an entry to `ARTICLES` in `app/data/writing.ts` (blocks: `p`, `h`, `list`, `table`, `note`). The route, sitemap and JSON-LD pick it up; add a line to `public/llms.txt`. Every figure must be measured, or labelled as an estimate in the text. Client systems are written up only with the client's permission.

## Open items (ask the user)

- **Senakra** (RAG business assistant for a motor-parts business): add once the user supplies facts/repo. Anonymous client project.
- WSO2 internship text previously said both "100+" and "1000+" enterprise users; only "100+" is used now. Confirm.
- The JavaScript certificate's verify link points to a Credly "security-plus" badge, which looks like a placeholder. Confirm the real URL.
