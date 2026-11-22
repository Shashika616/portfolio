@AGENTS.md

# Portfolio: working notes for Claude

Shashika Fernando's portfolio. Next.js 16 (App Router, Turbopack) · React 19 · Tailwind 4 · framer-motion 12 · lucide-react. Static, no backend.
Remote: `origin` → https://github.com/Shashika616/portfolio.git (branch `main`).

**Read these before scanning the code. They are kept current so you don't have to rediscover the structure:**

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): routes, component map, state and motion model, where every concern lives.
- [docs/CONTENT.md](docs/CONTENT.md): how to add/edit a project, role, certificate, cover image or filter.
- [docs/DESIGN.md](docs/DESIGN.md): design system (tokens, themes, buttons, "machined plate" labels, type, motion rules).

## Map (one line each)

| Path | What |
|---|---|
| `app/page.tsx` | `/`: Exhibit intro → dial dashboard. In-app "The Dial" links skip the intro via `introGate` (memory only); **any reload restarts at the intro** (`RESTART_ON_RELOAD_SCRIPT` in `app/lib/navigation.ts`). |
| `app/gallery/page.tsx` | `/gallery`: reference-style gallery (dark WORK stage → white sheet → numbered collage, blur until seen, zoom ±, lens, expand). |
| `app/profile/page.tsx` | `/profile`: an editorial issue (Cover → Contents → Features → Career → Colophon) built from `app/components/profile/*`, on the site palette (no custom paper colour). |
| `app/components/Exhibit.tsx` | Cinematic black intro that **autoplays**: wordmark → screenshot vortex → two covers → title card → `Letter.tsx` → destination. |
| `app/components/MenuOverlay.tsx`, `Letter.tsx` | Full-screen menu; typed letter between the title card and the room. |
| `app/components/ui/{Typewriter,NameLoader,Cursor,SmartImage,WordsReveal}.tsx` | Real-time typing; name wave loader; custom cursor; skeleton images; word reveals. |
| `app/components/WatchDial.tsx` | Dial navigation: `variant="desktop"` instrument, `variant="mobile"` sheet. |
| `app/components/ContentCard.tsx` | One section card per dial position; page-turn transition; scroll progress feeds the hand. |
| `app/components/sections/*` | The six dial sections. All copy comes from `app/data/*`. |
| `app/components/detail/*` | Case-study renderers (project / experience / certificate), shared by both views. |
| `app/components/ui/*` | Modal, MediaGallery, ProjectCard, CoverCarousel, Reveal, BrandIcons. |
| `app/data/*` | **All content.** `catalog.ts` (work), `experience.ts`, `profile.ts`, `filters.ts`, `types.ts`. |
| `app/context/ThemeContext.tsx` | 5 colour themes; writes `--accent`, `--accent-strong`, `--accent-gradient` to `:root`. |
| `app/globals.css` | Tokens, button system, labels, `.display` serif, motion keyframes, reduced-motion. |
| `app/lib/*` | `client.ts` (useIsClient, useQueryFlag), `site.ts` (SITE_URL). |
| `cv/` | Three role-targeted ATS CVs plus a complete one with photo (HTML sources + PDFs). Published copies + ZIP in `public/cv/`; every "Download CV" button opens `CvPicker` (pick one, several, or all). See `cv/README.md`. |
| `public/work/*.jpg` | Live-site screenshots used as covers. `public/llms.txt` for AI crawlers. |

## Rules that matter

- **Content lives in `app/data/`, never in components.** Both views read the same data.
- **Client work is anonymous.** Never name clients (titles, copy, links, covers, llms.txt). Own companies (TieHere, AshiruLabs) may be named. Client projects get no repo/live link and no branded screenshot.
- **No instruction/how-to copy** ("scroll to…", "choose how…", keyboard tips). Controls name their action; that's enough.
- **No sideways-scrolling rows** for options: tabs and filters wrap or use an equal grid so every option is visible.
- **No status labels on screen** ("In production", "Client work", "Pinned"). `status` stays in data only to drive filters.
- **No invented claims.** Facts come from the project's own repo/docs. Unknown → ask the user.
- **Colour follows purpose:** `.btn-primary` (one per view), `.btn-secondary`, `.btn-ghost`, `.chip`. Gradients are ornament only, never button fills. Theme colours are the brand, keep them.
- **Labels use the chamfered "machined plate" shape** (`.tag`, `.badge`, `.chip`). No leading dots on labels.
- **Motion vocabulary = the exhibit:** blur-to-sharp reveals, curled "prints" that flatten, page turns, critically damped springs. Respect `prefers-reduced-motion` (global CSS rule + `MotionConfig reducedMotion="user"`).
- **Don't run `npm run build` while `npm run dev` is running**: they share `.next/` and the dev server will serve stale CSS. Stop dev, build, then `rm -rf .next` before restarting dev.
- Custom classes that must yield to Tailwind utilities go in `@layer components` (an unlayered rule beats every utility, e.g. `.skeleton { position: relative }` silently overrode `absolute`).
- Every content image uses `SmartImage` (theme skeleton + blur-in). Loading states are theme-tinted skeletons, never grey.
- Round any computed SVG/transform numbers rendered on the server (`toFixed(2)`) to avoid hydration mismatches.

## Checks

```bash
npx tsc --noEmit -p .   # types
npm run lint            # must be 0 problems
npm run build           # static: /, /profile, /sitemap.xml, /robots.txt
```
