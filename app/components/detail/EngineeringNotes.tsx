"use client";

import React from "react";
import { motion } from "framer-motion";
import { Gauge, ShieldCheck, Leaf, FlaskConical, Wrench, TrendingUp } from "lucide-react";
import type { EngineeringNotes as Notes } from "../../data/types";
import { emphasize } from "../../lib/emphasize";

const PANELS: { key: keyof Notes; title: string; Icon: typeof Gauge }[] = [
  { key: "impact", title: "Impact", Icon: TrendingUp },
  { key: "security", title: "Security", Icon: ShieldCheck },
  { key: "performance", title: "Performance", Icon: Gauge },
  { key: "resources", title: "Resources saved", Icon: Leaf },
  { key: "testing", title: "Testing", Icon: FlaskConical },
  { key: "maintenance", title: "Maintenance", Icon: Wrench },
];

/** Six labelled panels answering how the system performs, stays safe, saves resources, is tested and maintained, and what it achieved. */
export function EngineeringNotes({ notes }: { notes: Notes }) {
  const panels = PANELS.filter((p) => notes[p.key]?.length);
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {panels.map(({ key, title, Icon }, i) => (
        <motion.section
          key={key}
          className="rounded-xl bg-white ring-1 ring-slate-200 p-4 sm:p-5"
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <h4 className="flex items-center gap-2.5 text-[14px] font-semibold text-slate-900 mb-3">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--accent) 12%, #fff)", color: "var(--accent-strong)" }}>
              <Icon className="w-4 h-4" />
            </span>
            {title}
          </h4>
          <ul className="space-y-2">
            {notes[key]!.map((n) => (
              <li key={n} className="flex gap-2.5 text-[14px] leading-6 text-slate-700">
                <span aria-hidden className="mt-[11px] w-2.5 h-[2px] flex-shrink-0" style={{ background: "var(--accent)" }} />
                <span className="text-pretty">{emphasize(n)}</span>
              </li>
            ))}
          </ul>
        </motion.section>
      ))}
    </div>
  );
}
