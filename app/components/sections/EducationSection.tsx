"use client";

import React from "react";
import { motion } from "framer-motion";
import { Section } from "../../types";
import { EDUCATION, COURSEWORK } from "../../data/profile";
import { CountUp } from "../profile/CountUp";
import { SectionHeader } from "./SectionHeader";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Education as editorial rows: year, school in serif, degree, and the GPA counting up. */
export function EducationSection({ sec }: { sec: Section }) {
  return (
    <div className="section-body space-y-12">
      <SectionHeader
        title={sec.title}
        lede="Computer science grounded in theory (algorithms, formal methods, distributed systems and security) and applied through an industrial training placement on production backends."
      />

      <ol className="border-t border-slate-900/80">
        {EDUCATION.map((e, i) => (
          <motion.li
            key={e.school}
            className="grid sm:grid-cols-[7rem_1fr_auto] gap-x-8 gap-y-2 py-7 border-b border-slate-900/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.8, ease: EASE }}
          >
            <span className="font-mono text-[13px] tabular text-slate-500 pt-2">{e.year}</span>
            <div className="space-y-1.5">
              <h3 className="display text-[2rem] sm:text-[2.4rem] leading-[1] text-slate-900">{e.school}</h3>
              <p className="text-[16px] font-medium text-slate-800">{e.degree}</p>
              <p className="text-[14px] leading-6 text-slate-600 max-w-xl text-pretty">{e.detail}</p>
            </div>
            {e.grade && (
              <div className="sm:text-right">
                <CountUp value={e.grade.replace(/^GPA\s*/, "").split(" ")[0]} className="display text-[3rem] leading-none tabular" style={{ color: "var(--accent-strong)" }} />
                <p className="text-[12px] text-slate-500 mt-1">GPA out of 4.0</p>
              </div>
            )}
          </motion.li>
        ))}
      </ol>

      <section className="space-y-4" aria-labelledby="coursework-heading">
        <h3 id="coursework-heading" className="text-[12px] tracking-[0.14em] uppercase text-slate-500">Coursework</h3>
        <ul className="flex flex-wrap gap-1.5">
          {COURSEWORK.map((c) => <li key={c} className="tag">{c}</li>)}
        </ul>
      </section>
    </div>
  );
}
