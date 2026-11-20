"use client";

import React from "react";
import { motion } from "framer-motion";
import { SECTIONS } from "../../sectionsData";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Editorial heading for every dial section, matching /profile: an issue line
 * (position on the dial · section), a large serif title that rises out of a
 * blur, and one short lede.
 */
export function SectionHeader({ title, lede }: { title: string; lede?: string }) {
  const i = SECTIONS.findIndex((s) => title.toLowerCase().startsWith(s.title.toLowerCase()));
  const section = SECTIONS[i];
  return (
    <header className="space-y-5">
      <div className="flex items-center justify-between gap-4 border-y border-slate-900/80 py-2 text-[11px] tracking-[0.14em] uppercase text-slate-600">
        <span className="tabular">{i >= 0 ? `${String(i + 1).padStart(2, "0")} / ${String(SECTIONS.length).padStart(2, "0")}` : ""}</span>
        <span>{section?.subtitle ?? ""}</span>
      </div>
      <motion.h2
        className="display text-[3.2rem] sm:text-[4.6rem] leading-[0.88] text-slate-900 text-balance"
        initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        {title}
      </motion.h2>
      {lede && <p className="max-w-2xl text-base sm:text-[17px] leading-relaxed text-slate-600 text-pretty">{lede}</p>}
    </header>
  );
}
