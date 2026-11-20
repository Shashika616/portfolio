"use client";

import React from "react";
import { motion } from "framer-motion";
import type { SequenceFlow } from "../../data/types";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Request flow as a sequence diagram: one lane per actor, steps top to
 * bottom. Each arrow draws itself in turn, so the request visibly travels
 * through the system. Self-steps (an actor checking something) draw as a
 * small loop. Narrow screens fall back to a numbered list.
 */
export function SequenceDiagram({ flow }: { flow: SequenceFlow }) {
  const n = flow.actors.length;
  const lane = (i: number) => `${((i + 0.5) / n) * 100}%`;
  const ROW = 58; // room for two-line labels above each arrow

  return (
    <figure className="rounded-2xl border border-slate-200 bg-[#fbfcfd] p-4 sm:p-6 overflow-hidden" aria-label={`Request flow: ${flow.title}`}>
      <figcaption className="text-[13px] font-semibold text-slate-900 mb-4">{flow.title}</figcaption>

      {/* Wide: lanes and arrows */}
      <div className="hidden md:block">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0,1fr))` }}>
          {flow.actors.map((a) => (
            <div key={a} className="px-1">
              <p className="badge badge-neutral mx-auto w-fit text-center">{a}</p>
            </div>
          ))}
        </div>
        <div className="relative mt-3" style={{ height: flow.steps.length * ROW + 44 }}>
          {flow.actors.map((a, i) => (
            <span key={a} aria-hidden className="absolute top-0 bottom-0 w-px border-l border-dashed border-slate-300" style={{ left: lane(i) }} />
          ))}
          {flow.steps.map((s, i) => {
            const top = 40 + i * ROW;
            const self = s.from === s.to;
            const left = Math.min(s.from, s.to);
            const right = Math.max(s.from, s.to);
            const toRight = s.to >= s.from;
            const delay = 0.3 + i * 0.32;
            if (self) {
              return (
                <motion.div
                  key={i}
                  className="absolute flex items-center gap-2"
                  style={{ top, left: lane(s.from) }}
                  initial={{ opacity: 0, x: -6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay, duration: 0.5, ease: EASE }}
                >
                  <svg width="28" height="26" viewBox="0 0 28 26" aria-hidden>
                    <path d="M1 4 H20 a5 5 0 0 1 0 10 H6" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M9 10.5 L5 14 L9 17.5" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[12px] text-slate-700 bg-[#fbfcfd] pr-1 whitespace-nowrap">{s.label}</span>
                </motion.div>
              );
            }
            return (
              <div key={i} className="absolute" style={{ top, left: lane(left), width: `calc(${lane(right)} - ${lane(left)})` }}>
                <motion.p
                  className="text-[12px] text-slate-700 text-center leading-[1.2] px-2 mb-1 line-clamp-2 -translate-y-full absolute inset-x-0 -top-1"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: delay + 0.15, duration: 0.4 }}
                >
                  <span className="font-mono text-slate-400 mr-1 tabular">{i + 1}</span>{s.label}
                </motion.p>
                <motion.div
                  className="relative h-[2px]"
                  style={{ background: "var(--accent)", transformOrigin: toRight ? "left" : "right" }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay, duration: 0.45, ease: EASE }}
                >
                  <svg className={`absolute top-1/2 -translate-y-1/2 ${toRight ? "-right-[2px]" : "-left-[2px] rotate-180"}`} width="9" height="10" viewBox="0 0 9 10" aria-hidden>
                    <path d="M1 1 L8 5 L1 9" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Narrow: numbered steps */}
      <ol className="md:hidden space-y-2.5">
        {flow.steps.map((s, i) => (
          <motion.li
            key={i}
            className="flex gap-3 text-[13px] leading-5"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: EASE }}
          >
            <span className="font-mono text-slate-400 tabular w-4">{i + 1}</span>
            <span>
              <span className="font-semibold text-slate-900">{flow.actors[s.from]}</span>
              <span style={{ color: "var(--accent-strong)" }}> {s.from === s.to ? "↻" : "→"} </span>
              {s.from !== s.to && <span className="font-semibold text-slate-900">{flow.actors[s.to]}</span>}
              <span className="block text-slate-600">{s.label}</span>
            </span>
          </motion.li>
        ))}
      </ol>
    </figure>
  );
}
