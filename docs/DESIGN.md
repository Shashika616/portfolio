# Design system

Two moods, one language: a **cinematic black exhibit** at the door, then **light, readable rooms** (dial and profile) that share its type, motion and imagery.

## Colour

Five themes (`app/context/ThemeContext.tsx`), each defining:

| Token | Use |
|---|---|
| `--accent` (`fillColor`) | Brand colour: strokes, ticks, progress, tints, focus rings, selection. |
| `--accent-strong` (`strongColor`) | AA (≥4.5:1 on white). Primary button fill, accent text. |
| `--accent-gradient` | Conic gradient. **Ornament only**: avatar ring, exhibit stage light, progress hairline, dial cover. |

| Theme | accent | strong |
|---|---|---|
| Aurora | `#3b82f6` | `#2563eb` |
| Violet | `#ff007f` | `#be185d` |
| Emerald | `#10b981` | `#047857` |
| Fire Red | `#f97316` | `#c2410c` |
| Monochrome | `#000000` | `#0f172a` |

Neutrals: slate scale; page `#f8fafc` / `#f4f6f9`; exhibit stage `#060607`. Screenshots are never tinted; overlays on imagery are neutral black scrims only.

## Type

| Role | Face | Class |
|---|---|---|
| Display (names, section titles, card titles) | Instrument Serif 400 (+ italic) | `.display` (tracking −0.02em, leading 0.98) |
| Interface / body | Instrument Sans | default `font-sans` |
| Numerals, indices, code | Geist Mono | `font-mono` + `.tabular` |

Section labels inside cards: 13px semibold uppercase, tracking 0.06em, slate-500.

## Buttons: colour follows purpose

| Class | When |
|---|---|
| `.btn .btn-primary` | The one main action in a view (Email me, Explore, Open live, View CV). |
| `.btn .btn-secondary` | Supporting actions (Download CV, Live, Clear filters). **Theme tint** (accent 10% fill, accent border and text), never plain white. |
| `.btn .btn-github` / `.btn-linkedin` | Links to GitHub repos/profile and LinkedIn, in their brand colours (#181717, #0a66c2). |
| `.btn .btn-ghost` | Quiet actions (close, nav links, feed action bar). |
| sizes | `.btn-sm` (36px), default (44px), `.btn-lg` (52px); `.btn-icon` for square. |

All lift 1px on hover (primary/secondary/brand add a coloured glow) and scale to 0.97 on press. Never fill a button with a gradient.

## Labels: the "machined plate"

Every label shares one custom shape: a tinted plate with the top-left and bottom-right corners chamfered (`clip-path`), like an engraved index plate. No leading dots, no generic pills.

- `.tag`: tech stack (neutral).
- `.badge` + `.badge-client` / `.badge-neutral`: category, role type, GPA.
- `.chip` (+ `aria-pressed="true"`): filters; selected = accent tint + 2px accent underline.

List bullets and timeline markers are **dial ticks** (short 2px bars), not dots.

## Cards

`<article class="accent-card">`: white, hairline border, soft offset shadow; hover/focus-within lifts 2px and picks up an accent-tinted border and shadow. One stretched action button per card. Project cards lead with a 16:9 cover image that slowly pushes in on hover.

## Motion (the exhibit vocabulary)

| Moment | Motion |
|---|---|
| Intro wordmark | Lines rise out of blur(12px), staggered, expo-out 1.1s. |
| Intro vortex | Screenshots spiral out of depth (z −2600 → 700), bending like prints. Scroll-scrubbed. |
| Choosing a view | Magazine cover flips on its spine (rotateY ±110°), veil to black. |
| Dial section change | Page turn: passed card swings on its left spine, next waits folded on its right; blur 8px. 950ms expo-out. |
| Section arrival | Blocks rise from a curl (perspective rotateX 14° + blur) in a 80ms stagger (CSS `rise-in`). |
| Scroll-in (profile) | `Reveal`: curled print (rotateX 16°) → flat and sharp. |
| Filtering | Layout re-flow; cards enter/exit with scale, blur and a slight rotateY. |
| Cover carousel | Cross-fade + slow 6s push-in; story segments fill; swipe uses velocity projection. |
| Springs | Critically damped (`bounce: 0`) everywhere unless a gesture carried momentum. |
| Intro | Autoplays; input takes over. Cover hover: lift + dim other + giant serif word. Title card + letter between rooms. |
| Cursor | Dot + dashed halo; label ring over controls; lens over images. |
| Text | `WordsReveal`: words brighten with scroll (letter) or resolve in sequence. |
| Loading | Skeletons shaped 1:1 like the content, tinted and swept in `--accent` with a soft accent glow (`.skeleton`, `.skeleton-glow`, `.skeleton-dark`). Never grey. Images sharpen in from blur when they arrive. |
| Gallery | Collage tiles sharpen into focus; click expands with shared layout. Menu wipes down (clip-path) and its items rise from blur. |

Reduced motion: global CSS rule kills animations/transitions; `MotionConfig reducedMotion="user"` for framer; the exhibit jumps straight to the covers; the carousel stops auto-advancing.

## Browser surfaces

Selection, scrollbars, caret and focus rings are themed from `--accent` in `globals.css`. Focus is always visible (`:focus-visible` 2px accent outline).
