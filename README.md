# Shashika Fernando: Portfolio

Personal portfolio with two views of the same work:

- **The exhibit** (`/`): a cinematic intro. Scroll pulls a vortex of real system screenshots out of the dark, then two covers let you choose how to explore.
- **The Dial** (`/?view=dial`): an instrument-style dashboard. A watch hand tracks which section you're in and how far you've read.
- **The Profile** (`/profile`): a social-profile view with a cover carousel of live systems and a filterable feed of case studies.

Built with Next.js 16, React 19, Tailwind CSS 4 and framer-motion. Fully static.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (stop the dev server first; they share .next/)
npm run lint
```

## Edit content

All content is in `app/data/`. See [docs/CONTENT.md](docs/CONTENT.md).

## Docs

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): how it's put together.
- [docs/DESIGN.md](docs/DESIGN.md): colour, type, buttons, labels, motion.
- [docs/CONTENT.md](docs/CONTENT.md): adding projects, roles, covers and filters.

## Deploy

Any static host; on Vercel the canonical URL is picked up automatically. Elsewhere set `NEXT_PUBLIC_SITE_URL` (used by the sitemap, robots.txt, Open Graph and structured data).
