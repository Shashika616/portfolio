"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useVelocity, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ProjectItem } from "../../data/types";
import { availableFilters, WORK_FILTERS } from "../../data/filters";
import { SmartImage } from "../ui/SmartImage";

const EASE = [0.16, 1, 0.3, 1] as const;
// Same six-point polygon in both states so it interpolates; notches ≈ 18px on a 300×225 print.
const PLATE_OPEN = "polygon(6% 0%, 100% 0%, 100% 92%, 94% 100%, 0% 100%, 0% 8%)";
const PLATE_CLOSED = "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)";
const imageOf = (p: ProjectItem) =>
  p.cover ?? p.mediaGroups?.flatMap((g) => g.items).find((m) => !/\.(mp4|webm|ogg|mov)$/i.test(m.url))?.url;

/**
 * Table of contents for the issue. Every project is a numbered line; on
 * hover a print of it floats beside the cursor, trailing on a spring and
 * tilting with how fast the pointer moves. Filters are the issue's sections.
 */
export function ContentsIndex({ items, onOpen }: { items: ProjectItem[]; onOpen: (p: ProjectItem) => void }) {
  const [filterId, setFilterId] = useState("all");
  const [hover, setHover] = useState<ProjectItem | null>(null);
  const filters = useMemo(() => availableFilters(items), [items]);
  const shown = useMemo(() => items.filter(WORK_FILTERS.find((f) => f.id === filterId)?.test ?? (() => true)), [items, filterId]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { bounce: 0, duration: 0.5 });
  const sy = useSpring(y, { bounce: 0, duration: 0.5 });
  const vx = useVelocity(sx);
  const rotate = useTransform(vx, [-1600, 0, 1600], [-10, 0, 10], { clamp: true });

  return (
    <section id="contents" className="px-5 sm:px-10 py-20 sm:py-28 scroll-mt-20" onPointerMove={(e) => { x.set(e.clientX); y.set(e.clientY); }}>
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <motion.h2
          className="display text-[clamp(3rem,9vw,7rem)] leading-[0.85] text-slate-900"
          initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
        >
          Contents
        </motion.h2>
        <div className="flex flex-wrap gap-2 lg:max-w-[60%] lg:justify-end" aria-label="Sections of this issue">
          {filters.map((f) => (
            <button key={f.id} className="chip" aria-pressed={filterId === f.id} onClick={() => setFilterId(f.id)}>
              {f.label}
              <span className="ml-1.5 text-[11px] opacity-60 tabular">{f.count}</span>
            </button>
          ))}
        </div>
      </div>

      <ol className="border-t border-slate-900/80" onMouseLeave={() => setHover(null)}>
        <AnimatePresence initial={false} mode="popLayout">
          {shown.map((p, i) => {
            const img = imageOf(p);
            return (
              <motion.li
                key={p.name}
                layout="position"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
                transition={{ duration: 0.5, ease: EASE, delay: Math.min(i, 8) * 0.03 }}
                className="border-b border-slate-900/12"
              >
                <button
                  type="button"
                  onClick={() => onOpen(p)}
                  onMouseEnter={() => setHover(p)}
                  onFocus={() => setHover(null)}
                  data-cursor="Read"
                  className="group w-full grid grid-cols-[2.5rem_1fr_auto] sm:grid-cols-[3.5rem_1fr_11rem_4rem_1.5rem] items-center gap-3 sm:gap-6 py-4 sm:py-5 text-left"
                >
                  <span className="font-mono text-[12px] text-slate-500 tabular">{String(i + 1).padStart(2, "0")}</span>
                  <span className="display text-[1.45rem] sm:text-[2.1rem] leading-[1.05] text-slate-900 transition-[transform,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 group-hover:text-[var(--accent-strong)] text-balance">
                    {p.name.split(" - ")[0]}
                  </span>
                  <span className="hidden sm:block text-[13px] text-slate-500">{p.category}</span>
                  <span className="hidden sm:block text-[13px] text-slate-500 tabular">{p.year ?? ""}</span>
                  {img ? (
                    <span className="sm:hidden w-14 h-10 overflow-hidden rounded-sm">
                      <SmartImage src={img} alt="" className="w-full h-full" imgClassName="object-cover object-top" />
                    </span>
                  ) : (
                    <ArrowUpRight className="sm:hidden w-4 h-4 text-slate-400" />
                  )}
                  <ArrowUpRight className="hidden sm:block w-5 h-5 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent-strong)]" />
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>

      {/* Floating print that follows the pointer (fine pointers only) */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-30 hidden [@media(pointer:fine)]:block"
        style={{ x: sx, y: sy, rotate }}
      >
        <AnimatePresence>
          {hover && imageOf(hover) && (
            // Drop shadow lives on the wrapper: the plate's clip-path would cut a box-shadow off.
            <motion.div
              key={hover.name}
              className="ml-8 -mt-28 w-[300px] [filter:drop-shadow(0_24px_40px_rgba(15,23,42,0.28))]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              {/* The site's "machined plate" shape (chamfered top-left and bottom-right), grown from the centre. */}
              <motion.div
                className="aspect-[4/3] overflow-hidden bg-white"
                initial={{ clipPath: PLATE_CLOSED }}
                animate={{ clipPath: PLATE_OPEN }}
                exit={{ clipPath: PLATE_CLOSED, transition: { duration: 0.18 } }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <SmartImage src={imageOf(hover)!} alt="" loading="eager" className="w-full h-full" imgClassName="object-cover object-top" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
