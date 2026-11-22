"use client";

import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence, LayoutGroup, useScroll, useTransform } from "framer-motion";
import { Plus, Minus, ArrowRight, X } from "lucide-react";
import { CATALOG } from "../data/catalog";
import type { ProjectItem } from "../data/types";
import { SmartImage } from "../components/ui/SmartImage";
import { Modal } from "../components/ui/Modal";
import { ProjectDetail } from "../components/detail/ProjectDetail";
import { MenuOverlay } from "../components/MenuOverlay";
import { GlassBar } from "../components/GlassBar";
import { ViewSwitcher } from "../components/ViewSwitcher";
import { takeGalleryMode } from "../lib/navigation";

/**
 * The gallery, after the reference exhibit:
 *   1. a dark stage with a giant spaced wordmark that sharpens in;
 *   2. a white sheet rises over it, opening on two large prints;
 *   3. a loose collage of numbered prints that stay blurred until they enter
 *      the viewport, then come into focus;
 *   4. a fixed bar (View · name · Menu), zoom controls (+ −) at the bottom right,
 *      a lens cursor over prints, and a print that expands into a full view.
 */

const ALL: ProjectItem[] = [...CATALOG.projects, ...CATALOG.researches, ...CATALOG.games];
const imageOf = (p: ProjectItem) =>
  p.cover ?? p.mediaGroups?.flatMap((g) => g.items).find((m) => !/\.(mp4|webm|ogg|mov)$/i.test(m.url))?.url ?? "";
const PRINTS = ALL.filter((p) => imageOf(p));
const HERO = PRINTS.filter((p) => p.featured && p.cover?.startsWith("/work/")).slice(0, 2);
const REST = PRINTS.filter((p) => !HERO.includes(p));

/** Collage rhythm per column count: [column start, span, top offset px], repeating. */
const LAYOUTS: Record<number, [number, number, number][]> = {
  6: [[1, 2, 0], [4, 1, 40], [5, 2, 0], [2, 1, 30], [3, 2, -20], [6, 1, 60], [1, 1, 10], [3, 1, 50], [4, 2, 0], [2, 2, 0], [5, 1, 40], [6, 1, -10]],
  4: [[1, 2, 0], [4, 1, 50], [2, 1, 20], [3, 2, 0], [1, 1, 40], [2, 2, 0], [4, 1, 30], [3, 1, 60]],
  2: [[1, 1, 0], [2, 1, 56]],
  1: [[1, 1, 0]],
};
/** Columns for each zoom step ("+" goes right), per view and screen size. */
const COLUMNS = {
  collage: { wide: [6, 4, 2], narrow: [2, 1, 1] },
  grid: { wide: [4, 3, 2], narrow: [2, 1, 1] },
} as const;
const ZOOM_STEPS = 3;
/** One spring for every print movement: critically damped, unhurried. */
const GLIDE = { type: "spring" as const, bounce: 0, duration: 0.8 };

/** Screenshots and photos fill their frame; diagrams are shown whole. */
const isPhoto = (url: string) => url.startsWith("/work/") || /\.(jpe?g)$/i.test(url) || url.includes("3d-shooter-1");

function useWide() {
  return useSyncExternalStore(
    (cb) => { const mq = window.matchMedia("(min-width: 640px)"); mq.addEventListener("change", cb); return () => mq.removeEventListener("change", cb); },
    () => window.matchMedia("(min-width: 640px)").matches,
    () => true
  );
}

export default function GalleryPage() {
  const [zoom, setZoom] = useState(0);
  const [mode, setMode] = useState<"collage" | "grid">(() => takeGalleryMode() ?? "collage");
  const [active, setActive] = useState<ProjectItem | null>(null);
  const [caseStudy, setCaseStudy] = useState<ProjectItem | null>(null);
  const [menu, setMenu] = useState(false);
  const wide = useWide();
  const cols = COLUMNS[mode][wide ? "wide" : "narrow"][zoom];

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <div className="min-h-dvh bg-[#262626]">
      <GlassBar
        onMenu={() => setMenu(true)}
        lightAfter={0.7}
        left={<ViewSwitcher active={mode} onLocal={(v) => v !== "feed" && setMode(v)} />
        }
      />
      <MenuOverlay open={menu} onClose={() => setMenu(false)} />

      {/* 1. Dark stage */}
      <Stage />

      {/* 2. White sheet */}
      <main className="relative z-10 -mt-[24dvh] bg-white min-h-dvh pb-40">
        <LayoutGroup>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5">
            {HERO.map((p, i) => (
              <Print key={p.name} project={p} index={i} onOpen={setActive} aspect="4 / 3" />
            ))}
          </div>

          {/* 3. Collage / grid. On View or zoom changes every print glides to its
              new place and resizes (shared layout, scale-corrected so nothing
              stretches). In the collage, prints drift at different speeds on scroll. */}
          <div
            className="grid gap-x-5 px-5 pt-16"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, rowGap: mode === "grid" ? 44 : 60 }}
          >
            {REST.map((p, i) => {
              const pattern = LAYOUTS[cols][i % LAYOUTS[cols].length];
              const collage = mode === "collage";
              const style: React.CSSProperties = collage
                ? { gridColumn: cols > 1 ? `${pattern[0]} / span ${pattern[1]}` : undefined, marginTop: cols > 1 ? pattern[2] : 0 }
                : {};
              const aspect = collage ? (pattern[1] > 1 || cols <= 2 ? "4 / 3" : "3 / 4") : "4 / 3";
              // Depth for parallax: wide prints sit nearer, narrow ones further back.
              const drift = collage && cols > 1 ? (pattern[1] > 1 ? 50 : -70) + ((i * 37) % 40) - 20 : 0;
              return (
                <motion.div key={p.name} layout transition={GLIDE} style={style}>
                  <Print project={p} index={i + HERO.length} onOpen={setActive} aspect={aspect} blurUntilSeen showCaption={!collage} drift={drift} />
                </motion.div>
              );
            })}
          </div>

          {/* 4. Expanded print */}
          <AnimatePresence>
            {active && (
              <motion.div
                className="fixed inset-0 z-[60] bg-white flex flex-col lg:flex-row"
                initial={{ backgroundColor: "rgba(255,255,255,0)" }}
                animate={{ backgroundColor: "rgba(255,255,255,1)" }}
                exit={{ backgroundColor: "rgba(255,255,255,0)" }}
                role="dialog"
                aria-modal="true"
                aria-label={active.name}
              >
                <div className="flex-1 min-h-0 p-5 sm:p-10 flex items-center">
                  <motion.button
                    layoutId={`print-${active.name}`}
                    onClick={() => setActive(null)}
                    className="relative w-full h-full max-h-[86dvh] overflow-hidden cursor-zoom-out"
                    transition={{ type: "spring", bounce: 0, duration: 0.7 }}
                    data-cursor="Close"
                  >
                    <SmartImage src={imageOf(active)} alt={active.name} loading="eager" className="w-full h-full" imgClassName="object-contain object-left" />
                  </motion.button>
                </div>
                <motion.aside
                  className="lg:w-[400px] p-6 sm:p-10 flex flex-col justify-end gap-5"
                  initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)", transition: { delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                >
                  <p className="text-xs text-slate-500 tabular">[{PRINTS.indexOf(active) + 1}] {active.category}{active.year ? ` · ${active.year}` : ""}</p>
                  <h2 className="display text-[2.4rem] leading-[1.02] text-slate-900 text-balance">{active.name}</h2>
                  <p className="text-[15px] leading-relaxed text-slate-600 text-pretty">{active.summary ?? active.introduction}</p>
                  <div className="flex gap-2.5">
                    <button className="btn btn-primary" onClick={() => { const p = active; setActive(null); setCaseStudy(p); }}>
                      Case study <ArrowRight className="w-4 h-4" />
                    </button>
                    <button className="btn btn-close btn-icon" onClick={() => setActive(null)} aria-label="Close">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.aside>
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </main>

      {/* Zoom controls: bottom right, and hidden while a print is open (zoom does nothing there). */}
      <div
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex gap-2 mix-blend-difference text-white transition-opacity duration-300 ${active ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        aria-hidden={!!active}
      >
        <button
          onClick={() => setZoom((z) => Math.min(ZOOM_STEPS - 1, z + 1))}
          disabled={zoom === ZOOM_STEPS - 1 || (!wide && zoom >= 1)}
          aria-label="Zoom in"
          className="w-9 h-9 rounded-full border border-current flex items-center justify-center disabled:opacity-30"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0, z - 1))}
          disabled={zoom === 0}
          aria-label="Zoom out"
          className="w-9 h-9 rounded-full border border-current flex items-center justify-center disabled:opacity-30"
        >
          <Minus className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>

      <Modal open={!!caseStudy} onClose={() => setCaseStudy(null)} title={caseStudy?.name ?? ""}>
        {caseStudy && <ProjectDetail project={caseStudy} />}
      </Modal>
    </div>
  );
}

/** Dark stage: giant spaced wordmark, letters sharpen in one by one, then drift away as the sheet rises. */
function Stage() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -160]);
  const opacity = useTransform(scrollY, [0, 700], [1, 0.2]);
  const letters = useMemo(() => "WORK".split(""), []);
  return (
    <div className="sticky top-0 h-dvh overflow-hidden flex items-center justify-center" aria-hidden>
      <motion.div style={{ y, opacity }} className="flex gap-[6vw]">
        {letters.map((l, i) => (
          <motion.span
            key={i}
            className="display uppercase leading-none text-[clamp(7rem,26vw,22rem)]"
            style={{ color: "color-mix(in srgb, var(--accent) 22%, #7a716e)" }}
            initial={{ opacity: 0, filter: "blur(22px)", y: 30 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 1.4, delay: 0.2 + i * 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {l}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

/** One print: bracketed index, image that sharpens when seen, lens cursor, shared-layout expand. */
function Print({
  project,
  index,
  onOpen,
  aspect,
  blurUntilSeen = false,
  showCaption = false,
  drift = 0,
}: {
  project: ProjectItem;
  index: number;
  onOpen: (p: ProjectItem) => void;
  aspect: string;
  blurUntilSeen?: boolean;
  showCaption?: boolean;
  /** Parallax travel in px across the viewport (0 = none). */
  drift?: number;
}) {
  const src = imageOf(project);
  const photo = isPhoto(src);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [drift / 2, -drift / 2]);

  return (
    <motion.figure
      ref={ref}
      layout
      className="relative group"
      style={drift ? { y } : undefined}
      initial={blurUntilSeen ? { filter: "blur(18px)", opacity: 0.6, scale: 1.02 } : { opacity: 0, y: 40 }}
      whileInView={blurUntilSeen ? { filter: "blur(0px)", opacity: 1, scale: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], layout: GLIDE }}
    >
      <motion.span layout="position" transition={GLIDE} className="absolute -top-6 left-0 text-[12px] text-slate-400 tabular">[{index + 1}]</motion.span>
      <motion.button
        layoutId={`print-${project.name}`}
        type="button"
        onClick={() => onOpen(project)}
        data-cursor="view"
        aria-label={`View ${project.name}`}
        className={`block w-full overflow-hidden ${photo ? "bg-slate-100" : "bg-[#f6f7f9] ring-1 ring-slate-200/70"}`}
        style={{ aspectRatio: aspect }}
        transition={GLIDE}
      >
        {/* layout here lets framer counter-scale the image while its frame resizes */}
        <motion.div layout transition={GLIDE} className="w-full h-full">
          <SmartImage
            src={src}
            alt=""
            className={`w-full h-full ${photo ? "" : "p-3"}`}
            imgClassName={`${photo ? "object-cover object-top" : "object-contain"} transition-transform duration-700 group-hover:scale-[1.03]`}
          />
        </motion.div>
      </motion.button>
      {showCaption && (
        <motion.figcaption layout="position" transition={GLIDE} className="mt-2 text-[13px] leading-snug text-slate-600 line-clamp-1">
          {project.name.split(" - ")[0]}
        </motion.figcaption>
      )}
    </motion.figure>
  );
}
