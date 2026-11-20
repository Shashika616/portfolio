"use client";

import { CvButton } from "../ui/CvPicker";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mail, Download } from "lucide-react";
import { PROFILE } from "../../data/profile";
import type { ProjectItem } from "../../data/types";
import { GithubIcon, LinkedinIcon } from "../ui/BrandIcons";

const EASE = [0.16, 1, 0.3, 1] as const;
// Chamfered top-left and bottom-right (≈38px on the square portrait). Same six points
// in both states so the wipe interpolates; the hidden state sits on the bottom edge.
const PORTRAIT_PLATE = "polygon(7% 0%, 100% 0%, 100% 93%, 93% 100%, 0% 100%, 0% 7%)";
const PORTRAIT_PLATE_HIDDEN = "polygon(7% 100%, 100% 100%, 100% 100%, 93% 100%, 0% 100%, 0% 100%)";

/**
 * The profile as a magazine cover: a masthead that rises letter by letter,
 * a full-length portrait that wipes up into view, cover lines that tease the
 * lead stories (each opens its case study), and the issue details.
 */
export function CoverSpread({ stories, onOpen, stats }: { stories: ProjectItem[]; onOpen: (p: ProjectItem) => void; stats: { n: number; label: string }[] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Parallax moves the whole portrait column (photo, ticks, caption), so nothing is cropped or overlapped.
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const mastY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section ref={ref} id="cover" className="relative min-h-[100dvh] pt-24 pb-14 px-5 sm:px-10 overflow-hidden">
      {/* Masthead */}
      <motion.h1 style={{ y: mastY }} className="display uppercase leading-[0.8] tracking-[-0.03em] text-[clamp(4.5rem,19vw,17rem)] text-slate-900 flex overflow-hidden" aria-label="Profile">
        {"Profile".split("").map((ch, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="inline-block"
            initial={{ y: "105%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1.1, delay: 0.1 + i * 0.06, ease: EASE }}
          >
            {ch}
          </motion.span>
        ))}
      </motion.h1>

      {/* Issue line */}
      <motion.div
        className="mt-3 flex flex-wrap items-center justify-between gap-3 border-y border-slate-900/80 py-2 text-[12px] tracking-[0.12em] uppercase text-slate-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        <span>Vol. 02</span>
        <span>2024–2026</span>
        <span>{PROFILE.location}</span>
      </motion.div>

      <div className="mt-8 grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left: name, standfirst, cover lines, actions */}
        <div className="lg:col-span-7 space-y-8 order-2 lg:order-1">
          <motion.div initial={{ opacity: 0, y: 20, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.55, duration: 1, ease: EASE }}>
            <p className="display italic text-[clamp(2.4rem,5.5vw,4.4rem)] leading-[0.95] text-slate-900">{PROFILE.name}</p>
            <p className="mt-3 text-[17px] leading-relaxed text-slate-700 max-w-xl text-pretty">{PROFILE.headline}</p>
          </motion.div>

          <ol className="divide-y divide-slate-900/10 border-y border-slate-900/10">
            {stories.map((p, i) => (
              <motion.li
                key={p.name}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.85 + i * 0.1, duration: 0.8, ease: EASE }}
              >
                <button
                  type="button"
                  onClick={() => onOpen(p)}
                  data-cursor="Read"
                  className="group w-full flex items-baseline gap-4 py-3.5 text-left"
                >
                  <span className="font-mono text-[12px] tabular" style={{ color: "var(--accent-strong)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="display text-[1.55rem] sm:text-[1.8rem] leading-tight text-slate-900 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                    {p.coverline ?? p.name.split(" - ")[0]}
                  </span>
                </button>
              </motion.li>
            ))}
          </ol>

          <motion.div className="flex flex-wrap items-center gap-2.5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.7, ease: EASE }}>
            <a href={`mailto:${PROFILE.email}`} className="btn btn-primary"><Mail className="w-4 h-4" /> Email me</a>
            <CvButton className="btn btn-secondary"><Download className="w-4 h-4" /> CV</CvButton>
            <a href={PROFILE.links.github} target="_blank" rel="noopener noreferrer" className="btn btn-github btn-icon" aria-label="GitHub"><GithubIcon className="w-[18px] h-[18px]" /></a>
            <a href={PROFILE.links.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-linkedin btn-icon" aria-label="LinkedIn"><LinkedinIcon className="w-[18px] h-[18px]" /></a>
          </motion.div>

          <motion.p className="flex flex-wrap gap-x-6 gap-y-1 text-[13px] text-slate-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
            {stats.map((s) => (
              <span key={s.label}><span className="display text-[1.35rem] text-slate-900 tabular mr-1">{s.n}</span>{s.label}</span>
            ))}
          </motion.p>
        </div>

        {/* Right: portrait with a wipe reveal, parallax, and a dial-tick "barcode" */}
        <motion.div style={{ y: portraitY }} className="lg:col-span-5 order-1 lg:order-2 relative">
          <motion.div
            className="relative aspect-square overflow-hidden bg-slate-200"
            // The site's "machined plate" shape; the reveal rises from the bottom edge into it.
            initial={{ clipPath: PORTRAIT_PLATE_HIDDEN }}
            animate={{ clipPath: PORTRAIT_PLATE }}
            transition={{ duration: 1.4, delay: 0.25, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.img
              src={PROFILE.portrait}
              alt={`Portrait of ${PROFILE.name}`}
              // Square frame for a square photo: the whole picture shows, nothing zoomed or cropped.
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.25, ease: EASE }}
            />
          </motion.div>
          <div aria-hidden className="absolute -left-4 top-6 bottom-6 w-3 hidden lg:flex flex-col justify-between">
            {Array.from({ length: 31 }, (_, i) => (
              <motion.span
                key={i}
                className="block h-px"
                style={{ width: i % 5 === 0 ? 12 : 6, background: i % 5 === 0 ? "var(--accent)" : "#94a3b8" }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9 + i * 0.02, duration: 0.4 }}
              />
            ))}
          </div>
          <motion.p
            className="mt-3 text-[12px] text-slate-500 text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            {PROFILE.title}, photographed in {PROFILE.location.split(",")[0]}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
