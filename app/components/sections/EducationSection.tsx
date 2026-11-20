"use client";

import React from "react";
import { Section } from "../../types";
import { EDUCATION, COURSEWORK } from "../../data/profile";
import { SectionHeader } from "./SectionHeader";

export function EducationSection({ sec }: { sec: Section }) {
  return (
    <div className="section-body space-y-10">
      <SectionHeader
        title={sec.title}
        lede="Computer science grounded in theory (algorithms, formal methods, distributed systems and security) and applied through an industrial training placement on production backends."
      />

      <ol className="space-y-4">
        {EDUCATION.map((e) => (
          <li key={e.school} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold tracking-[-0.01em] text-slate-900">{e.school}</h3>
                <p className="text-[15px] text-slate-700">{e.degree}</p>
              </div>
              <div className="flex sm:flex-col sm:items-end gap-2 flex-shrink-0">
                <span className="text-sm text-slate-500 tabular">{e.year}</span>
                {e.grade && <span className="badge badge-client tabular">{e.grade}</span>}
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600 text-pretty max-w-2xl">{e.detail}</p>
          </li>
        ))}
      </ol>

      <section className="space-y-4" aria-labelledby="coursework-heading">
        <h3 id="coursework-heading" className="text-[13px] font-semibold uppercase tracking-[0.06em] text-slate-500">Coursework</h3>
        <ul className="flex flex-wrap gap-1.5">
          {COURSEWORK.map((c) => <li key={c} className="tag">{c}</li>)}
        </ul>
      </section>
    </div>
  );
}
