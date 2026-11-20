"use client";

import React, { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { emphasize } from "../../lib/emphasize";
import { Section } from "../../types";
import { EXPERIENCE } from "../../data/experience";
import type { ExperienceItem } from "../../data/types";
import { Modal } from "../ui/Modal";
import { ExperienceDetail } from "../detail/ExperienceDetail";
import { SectionHeader } from "./SectionHeader";

export function ExperienceSection({ sec }: { sec: Section }) {
  const [open, setOpen] = useState<ExperienceItem | null>(null);

  return (
    <div className="section-body space-y-8">
      <SectionHeader title={sec.title} lede="What I built, what I owned, and the results." />

      <ol className="relative space-y-5 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
        {EXPERIENCE.map((item, i) => (
          <li key={item.id} className="relative pl-8">
            {/* Timeline marker: a dial tick, longer and accented for the current role. */}
            <span
              aria-hidden
              className="absolute top-[30px] h-[2px] rounded-[1px]"
              style={{ left: i === 0 ? 0 : 3, width: i === 0 ? 16 : 10, background: i === 0 ? "var(--accent)" : "#94a3b8" }}
            />
            <ExperienceCard item={item} onOpen={() => setOpen(item)} />
          </li>
        ))}
      </ol>

      <Modal open={!!open} onClose={() => setOpen(null)} title={open ? `${open.title}, ${open.company}` : ""}>
        {open && <ExperienceDetail item={open} />}
      </Modal>
    </div>
  );
}

export function ExperienceCard({ item, onOpen }: { item: ExperienceItem; onOpen: () => void }) {
  return (
    <article className="accent-card group relative w-full bg-white rounded-2xl border p-5 sm:p-7 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-6">
        <div>
          <h3 className="display text-[2rem] sm:text-[2.25rem] leading-[1.02] text-slate-900">{item.title}</h3>
          <p className="text-[16px] text-slate-800 mt-1.5 font-medium">
            {item.company}
            {item.location && <span className="text-slate-500 font-normal"> · {item.location}</span>}
          </p>
        </div>
        <div className="flex sm:flex-col sm:items-end gap-2 text-sm text-slate-500 flex-shrink-0">
          <span className="tabular">{item.duration}</span>
          <span className="badge badge-neutral">{item.type}</span>
        </div>
      </header>

      <p className="text-[15px] leading-7 text-slate-700 text-pretty">{item.overview}</p>

      {item.highlights?.length ? (
        <dl className={`grid grid-cols-1 gap-px bg-slate-200/70 rounded-xl overflow-hidden ring-1 ring-slate-200/70 ${item.highlights.length === 1 ? "sm:max-w-xs" : item.highlights.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
          {item.highlights.map((h) => (
            <div key={h.label} className="bg-white px-4 py-4">
              <dt className="sr-only">{h.label}</dt>
              <dd className="display text-[2rem] leading-none tabular" style={{ color: "var(--accent-strong)" }}>{h.value}</dd>
              <dd className="mt-2 text-[13px] leading-5 text-slate-600">{h.label}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="grid lg:grid-cols-2 gap-x-8 gap-y-6">
        <section>
          <h4 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-slate-500 mb-3">Impact</h4>
          <ul className="space-y-2.5">
            {item.achievements.map((a) => (
              <li key={a} className="flex gap-3 text-[14.5px] leading-6 text-slate-800">
                <span aria-hidden className="mt-[11px] w-3 h-[2px] flex-shrink-0" style={{ background: "var(--accent)" }} />
                <span className="text-pretty">{emphasize(a)}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h4 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-slate-500 mb-3">What I did</h4>
          <ul className="space-y-2.5">
            {item.responsibilities.map((r) => (
              <li key={r} className="flex gap-3 text-[14.5px] leading-6 text-slate-700">
                <span aria-hidden className="mt-[11px] w-2 h-[2px] flex-shrink-0 bg-slate-400" />
                <span className="text-pretty">{emphasize(r)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
        {item.tech.map((t) => <li key={t} className="tag">{t}</li>)}
      </ul>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button type="button" onClick={onOpen} className="btn btn-secondary btn-sm" data-cursor="Read">
          Challenges and full story <ArrowRight className="w-4 h-4" />
        </button>
        {item.liveLink && (
          <a href={item.liveLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
            Visit <ArrowUpRight className="w-4 h-4" />
          </a>
        )}
      </div>
    </article>
  );
}
