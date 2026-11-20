"use client";

import React, { useState } from "react";
import { ArrowRight, Download } from "lucide-react";
import { PROFILE, FOCUS_AREAS } from "../../data/profile";
import { CATALOG } from "../../data/catalog";
import type { ProjectItem } from "../../data/types";
import { Modal } from "../ui/Modal";
import { ProjectDetail } from "../detail/ProjectDetail";

const FEATURED = [...CATALOG.projects, ...CATALOG.researches].filter((p) => p.featured);

export function WelcomeSection({ onNavigate }: { onNavigate?: (sectionId: string) => void }) {
  const [open, setOpen] = useState<ProjectItem | null>(null);

  return (
    <div className="section-body space-y-12">
      <header className="space-y-5 max-w-3xl">
        <h1 className="display text-[2.9rem] sm:text-[4.25rem] text-slate-900 text-balance">
          I build systems that hold up in{" "}
          <em className="italic" style={{ color: "var(--accent-strong)" }}>production</em>, not just in demos.
        </h1>
        <p className="text-lg leading-relaxed text-slate-600 text-pretty">{PROFILE.headline}</p>
        <div className="flex flex-wrap gap-3 pt-1">
          <button className="btn btn-primary" onClick={() => onNavigate?.("projects")}>
            See all work <ArrowRight className="w-4 h-4" />
          </button>
          <a className="btn btn-secondary" href={PROFILE.cv} download>
            <Download className="w-4 h-4" /> Download CV
          </a>
        </div>
      </header>

      <section className="space-y-4" aria-labelledby="featured-heading">
        <h2 id="featured-heading" className="text-[13px] font-semibold uppercase tracking-[0.06em] text-slate-500">Featured work</h2>
        <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white overflow-hidden">
          {FEATURED.map((p) => (
            <li key={p.name}>
              <button
                type="button"
                onClick={() => setOpen(p)}
                className="group w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors"
              >
                <span className="flex-1 min-w-0 space-y-1.5">
                  <span className="display block text-[1.5rem] leading-none text-slate-900">{p.name.split(" - ")[0]}</span>
                  <span className="block text-sm leading-6 text-slate-600 text-pretty">{p.summary}</span>
                </span>
                <ArrowRight className="w-4 h-4 mt-1 flex-shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-700" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-5" aria-labelledby="focus-heading">
        <h2 id="focus-heading" className="text-[13px] font-semibold uppercase tracking-[0.06em] text-slate-500">What I work on</h2>
        <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-7">
          {FOCUS_AREAS.map((f) => (
            <div key={f.title} className="space-y-1.5">
              <dt className="text-base font-semibold text-slate-900 pb-2 border-b border-slate-100">{f.title}</dt>
              <dd className="text-sm leading-6 text-slate-600 text-pretty pt-1">{f.desc}</dd>
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
