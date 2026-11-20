"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import type { Threat } from "../../data/types";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Threat model: each risk on the left, an arrow, and what prevents it on the
 * right. The risk appears first, then the arrow draws and the fix slides in.
 */
export function ThreatModel({ threats }: { threats: Threat[] }) {
  return (
    <figure className="rounded-2xl border border-slate-200 bg-[#fbfcfd] p-4 sm:p-6" aria-label="Threat model">
      <div className="hidden sm:grid grid-cols-[1fr_40px_1fr] gap-x-2 mb-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-slate-500">
        <span>Risk</span><span /><span>What prevents it</span>
      </div>
      <ul className="space-y-3">
        {threats.map((t, i) => (
          <li key={t.risk} className="grid sm:grid-cols-[1fr_40px_1fr] gap-2 sm:gap-x-2 items-stretch">
            <motion.div
              className="rounded-lg bg-white ring-1 ring-slate-200 p-3 flex gap-2.5 text-[13.5px] leading-5 text-slate-800"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.55, ease: EASE }}
            >
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              {t.risk}
            </motion.div>
            <div className="hidden sm:flex items-center" aria-hidden>
              <motion.span
                className="block h-[2px] w-full origin-left"
                style={{ background: "var(--accent)" }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 + 0.3, duration: 0.4, ease: EASE }}
              />
            </div>
            <motion.div
              className="rounded-lg p-3 flex gap-2.5 text-[13.5px] leading-5 text-slate-800"
              style={{ background: "color-mix(in srgb, var(--accent) 9%, #fff)", boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--accent) 28%, transparent)" }}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 + 0.45, duration: 0.55, ease: EASE }}
            >
              <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--accent-strong)" }} />
              {t.mitigation}
            </motion.div>
          </li>
        ))}
      </ul>
    </figure>
  );
}
