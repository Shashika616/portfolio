"use client";

import React from "react";
import { motion } from "framer-motion";
import { CAPABILITIES } from "../../data/profile";
import { CountUp } from "./CountUp";

const EASE = [0.16, 1, 0.3, 1] as const;

/** "What I bring": six capabilities, each with real, sourced figures that count up into view. */
export function Capabilities({ compact = false }: { compact?: boolean }) {
  return (
    <section aria-labelledby="bring-heading" className="space-y-6">
      <h3 id="bring-heading" className={compact ? "text-[13px] font-semibold uppercase tracking-[0.06em] text-slate-500" : "display text-[2.2rem] sm:text-[2.6rem] leading-none text-slate-900"}>
        What I bring
      </h3>
      <div className={`grid gap-3 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {CAPABILITIES.map((c, i) => (
          <motion.article
            key={c.title}
            className="rounded-2xl bg-white ring-1 ring-slate-200 p-5 flex flex-col gap-4"
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: EASE }}
          >
            <div className="space-y-1.5">
              <h4 className="text-[16px] font-semibold text-slate-900">{c.title}</h4>
              <p className="text-[14px] leading-6 text-slate-600 text-pretty">{c.statement}</p>
            </div>
            <dl className="mt-auto grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
              {c.evidence.map((e) => (
                <div key={e.label}>
                  <dt className="sr-only">{e.label}</dt>
                  <dd><CountUp value={e.value} className="display text-[2rem] leading-none tabular" style={{ color: "var(--accent-strong)" }} /></dd>
                  <dd className="mt-1 text-[12px] leading-4 text-slate-500">{e.label}</dd>
                </div>
              ))}
            </dl>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
