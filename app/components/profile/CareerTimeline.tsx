"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ExperienceItem } from "../../data/types";
import { emphasize } from "../../lib/emphasize";
import { CountUp } from "./CountUp";
import { Capabilities } from "./Capabilities";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Career as a dial-style timeline: the spine draws itself as you scroll,
 * each role sits on a tick, and its figures count up as they come into view.
 */
export function CareerTimeline({
  roles,
  onOpen,
  embedded = false,
}: {
  roles: ExperienceItem[];
  onOpen: (r: ExperienceItem) => void;
  /** Inside a dial card: no own heading/capabilities/padding; the spine draws on view (the card, not the window, scrolls). */
  embedded?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  const draw = useSpring(scrollYProgress, { bounce: 0, duration: 0.4 });
  const inView = useInView(ref, { once: true, amount: 0.05 });

  return (
    <section ref={ref} id={embedded ? undefined : "career"} className={embedded ? "" : "px-5 sm:px-10 py-20 sm:py-28 scroll-mt-20"}>
      {!embedded && <motion.h2
        className="display text-[clamp(3rem,9vw,7rem)] leading-[0.85] text-slate-900 mb-14"
        initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: EASE }}
      >
        Career
      </motion.h2>}

      {!embedded && <div className="mb-20"><Capabilities /></div>}

      <div className="relative pl-10 sm:pl-16">
        {/* Spine: a faint track and an accent line that draws with scroll */}
        <span aria-hidden className="absolute left-3 sm:left-5 top-1 bottom-1 w-px bg-slate-900/12" />
        <motion.span aria-hidden className="absolute left-3 sm:left-5 top-1 bottom-1 w-[2px] -ml-px origin-top" style={embedded ? { background: "var(--accent)" } : { scaleY: draw, background: "var(--accent)" }}
          initial={embedded ? { scaleY: 0 } : undefined}
          animate={embedded && inView ? { scaleY: 1 } : undefined}
          transition={{ duration: 2.2, ease: EASE }} />

        <ol className="space-y-20">
          {roles.map((r, i) => (
            <motion.li
              key={r.id}
              className="relative"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <span aria-hidden className="absolute -left-10 sm:-left-16 top-5 h-[2px]" style={{ width: i === 0 ? 30 : 20, marginLeft: 6, background: i === 0 ? "var(--accent)" : "#94a3b8" }} />
              <div className="grid lg:grid-cols-12 gap-6 lg:gap-10">
                <div className="lg:col-span-4 space-y-2">
                  <p className="font-mono text-[12px] tabular text-slate-500">{r.duration}{r.type ? ` · ${r.type}` : ""}</p>
                  <h3 className="display text-[2.4rem] sm:text-[2.8rem] leading-[0.95] text-slate-900">{r.title}</h3>
                  <p className="text-[16px] font-medium text-slate-800">{r.company}</p>
                  {r.location && <p className="text-sm text-slate-500">{r.location}</p>}
                </div>
                <div className="lg:col-span-8 space-y-6">
                  <p className="text-[17px] leading-relaxed text-slate-700 text-pretty">{r.overview}</p>
                  {r.highlights?.length ? (
                    <dl className="flex flex-wrap gap-x-10 gap-y-4">
                      {r.highlights.map((h) => (
                        <div key={h.label}>
                          <dt className="sr-only">{h.label}</dt>
                          <dd><CountUp value={h.value} className="display text-[3.2rem] leading-none tabular" style={{ color: "var(--accent-strong)" }} /></dd>
                          <dd className="mt-1 text-[13px] text-slate-600 max-w-[14rem]">{h.label}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                  <ul className="space-y-2.5">
                    {r.achievements.slice(0, 4).map((a) => (
                      <li key={a} className="flex gap-3 text-[15px] leading-7 text-slate-800">
                        <span aria-hidden className="mt-[13px] w-3 h-[2px] flex-shrink-0" style={{ background: "var(--accent)" }} />
                        <span className="text-pretty">{emphasize(a)}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="btn btn-secondary btn-sm" onClick={() => onOpen(r)}>
                    Full story <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
