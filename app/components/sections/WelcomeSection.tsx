"use client";

import { CvButton } from "../ui/CvPicker";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { PROFILE, FOCUS_AREAS } from "../../data/profile";
import { CATALOG } from "../../data/catalog";
import type { ProjectItem } from "../../data/types";
import { Modal } from "../ui/Modal";
import { ProjectDetail } from "../detail/ProjectDetail";
import { SectionHeader } from "./SectionHeader";

const EASE = [0.16, 1, 0.3, 1] as const;
const FEATURED = [...CATALOG.projects, ...CATALOG.researches].filter((p) => p.featured);

/** Welcome, set like the profile cover: headline, then the lead stories as numbered cover lines. */
export function WelcomeSection({ onNavigate }: { onNavigate?: (sectionId: string) => void }) {
  const [open, setOpen] = useState<ProjectItem | null>(null);

  return (
    <div className="section-body space-y-12">
      <SectionHeader title="Welcome" lede={PROFILE.headline} />

      <p className="display italic text-[2rem] sm:text-[2.6rem] leading-[1.02] text-slate-900 max-w-3xl text-balance">
        I build systems that hold up in <span style={{ color: "var(--accent-strong)" }}>production</span>, not just in demos.
      </p>

      <div className="flex flex-wrap gap-3">
        <button className="btn btn-primary" onClick={() => onNavigate?.("projects")}>
          See all work <ArrowRight className="w-4 h-4" />
        </button>
        <CvButton className="btn btn-secondary">
          <Download className="w-4 h-4" /> Download CV
        </CvButton>
      </div>

      <section aria-labelledby="lead-heading" className="space-y-3">
        <h3 id="lead-heading" className="text-[12px] tracking-[0.14em] uppercase text-slate-500">In this issue</h3>
        <ol className="divide-y divide-slate-900/10 border-y border-slate-900/10">
          {FEATURED.map((p, i) => (
            <motion.li
              key={p.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.08, duration: 0.7, ease: EASE }}
            >
              <button type="button" onClick={() => setOpen(p)} data-cursor="Read" className="group w-full flex items-baseline gap-4 py-3.5 text-left">
                <span className="font-mono text-[12px] tabular" style={{ color: "var(--accent-strong)" }}>{String(i + 1).padStart(2, "0")}</span>
                <span className="display text-[1.45rem] sm:text-[1.75rem] leading-tight text-slate-900 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                  {p.coverline ?? p.name.split(" - ")[0]}
                </span>
                <ArrowRight className="ml-auto w-4 h-4 flex-shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[var(--accent-strong)]" />
              </button>
            </motion.li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="focus-heading" className="space-y-3">
        <h3 id="focus-heading" className="text-[12px] tracking-[0.14em] uppercase text-slate-500">What I work on</h3>
        <dl className="grid sm:grid-cols-2 border-t border-slate-900/10">
          {FOCUS_AREAS.map((f, i) => (
            <div key={f.title} className={`py-5 border-b border-slate-900/10 ${i % 2 === 0 ? "sm:pr-8" : "sm:pl-8 sm:border-l"}`}>
              <dt className="display text-[1.6rem] leading-tight text-slate-900">{f.title}</dt>
              <dd className="mt-2 text-[14px] leading-6 text-slate-600 text-pretty">{f.desc}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.name ?? ""}>
        {open && <ProjectDetail project={open} />}
      </Modal>
    </div>
  );
}
