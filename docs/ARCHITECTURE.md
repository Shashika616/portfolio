# Architecture

A fully static Next.js 16 site with two views of one content model.

```
            ┌──────────── app/data/* (single source of truth) ────────────┐
            │ catalog.ts  experience.ts  profile.ts  filters.ts  types.ts │
            └───────────────┬───────────────────────────────┬─────────────┘
                            │                               │
   /  ── Exhibit intro ──►  Dial dashboard            /profile  Social profile
         (app/components/    (page.tsx + WatchDial +        (profile/page.tsx +
          Exhibit.tsx)        ContentCard + sections/*)      CoverCarousel + feed)
                            │                               │
                            └──── shared: detail/*, ui/* ───┘
```

## Routes

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Shows `Exhibit` until the visitor picks a cover; then the dial dashboard. |
| `/gallery` | `app/gallery/page.tsx` | Reference-style gallery; metadata in `app/gallery/layout.tsx`. |
| reload | `app/lib/navigation.ts` | Inline head script: a reload on any route → `/` (intro), drops query strings, disables scroll restoration. In-app dial links set `introGate.skipNext`. |
| `/profile` | `app/profile/page.tsx` | Client component; metadata in `app/profile/layout.tsx`. |
| `/sitemap.xml`, `/robots.txt` | `app/sitemap.ts`, `app/robots.ts` | Origin from `app/lib/site.ts` (`NEXT_PUBLIC_SITE_URL` → Vercel prod URL → localhost). |
| `/llms.txt` | `public/llms.txt` | Plain-text summary for AI crawlers (GEO). Keep in sync with `catalog.ts`. |

`app/layout.tsx` loads fonts (Instrument Sans, Instrument Serif, Geist Mono), injects Person/ProfilePage JSON-LD, and wraps everything in `GlobalThemeProvider`.

## The Exhibit intro (`Exhibit.tsx`)

Loader under the wordmark: `NameLoader` (letters of the name lift in a wave left→right→left). After a cover is chosen the title card **types itself** (`Typewriter`) and so does the letter (real-time, view follows the caret; Skip completes it).

The sequence **autoplays** like a title sequence (≈1.6s wordmark → `animate(target, 1, 5.6s)` starting at 2.6s). Any wheel, touch or key input stops the autoplay and takes over. After a cover is chosen: cover flips → title card ("The Dial"/"The Profile", pulsing dot) → `Letter.tsx` (scroll-revealed note + signature that writes itself; button turns from "Skip" into the way in) → destination. Hovering a cover lifts it, dims the other and fades a giant serif word in behind.

One motion value `target` (0..1) is moved by wheel (`deltaY/2600`), touch (`dy/900`) and keys (±0.14, End = 1). A critically damped spring (`progress`) smooths it; every element derives from `progress` with `useTransform`, so the sequence is scrubbable and reversible.

| progress | what happens |
|---|---|
| 0 → 0.2 | Wordmark (revealed on mount via blur→sharp) holds, then blurs and scales away. |
| 0.08 → ~0.85 | `VortexCard`s (covers + diagrams, ≤18) travel z −2600 → 700 on a golden-angle spiral, bending on X/Y. |
| 0.7 → 1 | Two `Cover`s fly in from depth; at > 0.9 they become clickable. |

Choosing a cover flips it on its spine (`rotateY ±110°`), a black veil fades in, then `onEnterDial()` or `router.push('/profile')`. Reduced motion jumps straight to the covers. Page never scrolls (`touch-action: none`).

## Dial dashboard (`page.tsx`)

- State: `currentIndex` (section), `cardScrollProgress` (0..1 scroll inside the current card).
- Hand angle = `dialAngle(currentIndex) + cardScrollProgress * DIAL_STEP` → `useSpring` (bounce 0) → `WatchDial` (`rotation` prop).
- Geometry constants in `app/sectionsData.ts`: section *i* sits at `-55 + 22i` degrees.
- Navigation: dial labels; wheel past a card's top/bottom edge (accumulates 180px of intent, 800ms cooldown); `PgUp/PgDn` or `Alt+↑/↓`; mobile sheet. All stand down while a dialog is open (`.modal-scroll-pane` / `[role=dialog]`).
- `ContentCard`: inactive cards are `inert` + `aria-hidden`; transition is a 3D page turn (`.card-page`). The active card gets `.is-active`, which triggers the staggered `rise-in` keyframes on `.section-body > *`.

## Profile view (`profile/page.tsx`)

Cover carousel (`CoverCarousel`: story segments, auto-advance 5.2s, pauses on hover/focus/hidden tab, swipe with velocity projection) → identity block → stats (computed from data) → tabs: Work (filter chips + feed of `WorkPost`s with layout re-flow) · Experience · Certificates · About. Right rail (lg+): Toolbox, Education, Get in touch.

## Profile entrance, gallery and menu

`/profile` opens on a sticky dark masthead (giant serif name that sharpens in and drifts on scroll); the page panel (`main`, rounded top) rises over it. The fixed top bar (`mix-blend-difference`) is **View toggle · name · Menu**: View switches the Work tab between the feed and `WorkGallery` (collage with `[n]` indices, blur-to-sharp tiles, lens cursor, shared-layout expand to a full view → case study). `MenuOverlay` is a full-screen clip-path wipe with serif destinations and the theme palettes.

## Site-wide motion helpers

| File | What |
|---|---|
| `ui/Cursor.tsx` | Dot + dashed halo (spring); grows with a label over links/buttons (`data-cursor="Label"`), turns into a lens with "+" over `data-cursor="view"`. Fine pointers only; off under reduced motion. Mounted in `layout.tsx`. |
| `ui/WordsReveal.tsx` | Word-by-word text: `mode="scroll"` (brightens with scroll, pass `container` for inner scrollers) or `mode="time"` (stagger when in view). |
| `ui/SmartImage.tsx` | Image with a 1:1 theme-glow skeleton until loaded, then blur→sharp. Use for every content image. |
| `profile/loading.tsx` | Route skeleton mirroring the profile layout. |

## Shared pieces

| Component | Responsibility |
|---|---|
| `ui/Modal.tsx` | The only dialog. Portal, scroll lock, Escape (top-most only), focus return, `role=dialog`. |
| `ui/MediaGallery.tsx` | Per-group carousel + full-size preview (nested Modal). |
| `detail/ProjectDetail.tsx` | Case study: cover → intro + links → problem → requirements → solution → features → highlights → SEO/GEO → architecture → media. Exports `Block`, `List`. |
| `ui/ProjectCard.tsx` | `ProjectCard`, `CertificateCard`: `<article>` with one stretched action button. |
| `ui/Reveal.tsx` | `Reveal` (scroll-in, curled print → flat) and `cardPresence` (filter enter/exit). |
| `data/filters.ts` | `WORK_FILTERS` + `availableFilters(items)` (hides empty filters, adds counts). |

## Theming

`ThemeContext` stores the theme id in localStorage via `useSyncExternalStore` (no effect/setState), and writes CSS variables on `:root`: `--accent` (brand colour), `--accent-strong` (AA ≥4.5:1 on white, for primary buttons and accent text), `--accent-gradient` (ornament). Components read the variables, not the theme object, wherever possible.

## Conventions

- Browser-only values: `useSyncExternalStore` (`app/lib/client.ts`), not `useEffect` + `setState` (lint rule `react-hooks/set-state-in-effect`).
- Server-rendered numbers in SVG/transforms are rounded to 2 dp to keep hydration identical.
- Images are plain `<img>` (static export friendly) with `loading="lazy"` except above the fold; `next/image` only for the avatar.
