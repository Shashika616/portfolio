"use client";

import React from "react";
import { motion } from "framer-motion";
import type { ArchitectureDiagram as Diagram } from "../../data/types";

/**
 * Layered architecture diagram rendered from data (catalog.ts →
 * `architectureDiagram`). Tiers read left → right on wide screens and top →
 * bottom on phones; connectors are drawn in the theme accent. Tiers arrive
 * one after another like prints laid on a table.
 */
export function ArchitectureDiagram({ diagram, title }: { diagram: Diagram; title: string }) {
  const n = diagram.tiers.length;
  return (
    <figure className="rounded-2xl border border-slate-200 bg-[#fbfcfd] p-4 sm:p-6 overflow-hidden" aria-label={`${title} architecture diagram`}>
      <div
        className="grid gap-y-7 md:gap-y-0 md:gap-x-4 md:items-stretch"
        style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
      >
        {diagram.tiers.map((tier, i) => (
          <motion.div
            key={tier.label}
            className="relative col-span-full md:col-span-1 flex md:flex-col"
            initial={{ opacity: 0, y: 16, rotateX: 12, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformPerspective: 1000 }}
          >
            <div className="flex-1 md:px-2 space-y-2">
              <p className="badge badge-neutral">{tier.label}</p>
              <ul className="space-y-1.5">
                {tier.nodes.map((node, j) => (
                  <motion.li
                    key={node}
                    className="rounded-lg bg-white ring-1 ring-slate-200 px-3 py-2 text-[13px] leading-snug text-slate-800 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                    initial={{ opacity: 0, y: -10, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                    transition={{ type: "spring", bounce: 0, duration: 0.6, delay: 0.25 + i * 0.22 + j * 0.08 }}
                  >
                    {node}
                  </motion.li>
                ))}
              </ul>
            </div>
            {i < n - 1 && <Connector />}
          </motion.div>
        ))}
      </div>
      {diagram.notes?.length ? (
        <figcaption className="mt-4 pt-4 border-t border-slate-200/70 space-y-1">
          {diagram.notes.map((note) => (
            <p key={note} className="text-xs leading-5 text-slate-600 flex gap-2.5">
              <span aria-hidden className="mt-[9px] w-2.5 h-[2px] flex-shrink-0" style={{ background: "var(--accent)" }} />
              {note}
            </p>
          ))}
        </figcaption>
      ) : null}
    </figure>
  );
}

/**
 * Link between tiers: a dashed line whose dashes stream toward the next tier
 * (data in flight), ending in an arrowhead. Horizontal on md+, vertical on phones.
 */
function Connector() {
  return (
    <>
      <span aria-hidden className="hidden md:block absolute top-1/2 -right-[14px] -translate-y-1/2 z-10">
        <svg width="28" height="14" viewBox="0 0 28 14" className="overflow-visible">
          <line x1="1" y1="7" x2="22" y2="7" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" className="diagram-flow" />
          <path d="M19 3 23.5 7 19 11" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span aria-hidden className="md:hidden absolute left-6 -bottom-[22px] z-10">
        <svg width="14" height="22" viewBox="0 0 14 22" className="overflow-visible">
          <line x1="7" y1="1" x2="7" y2="17" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" className="diagram-flow" />
          <path d="M3 14 7 18.5 11 14" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </>
  );
}
