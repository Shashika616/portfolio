"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Article } from "../data/writing";
import { SmartImage } from "../components/ui/SmartImage";

const EASE = [0.16, 1, 0.3, 1] as const;
/** A few broad topics, so every option fits on one or two rows. */
const TOPICS = ["Architecture", "Security", "AI", "Performance", "Research"];
const date = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/**
 * Pinterest-style board: a masonry of cards with varied heights (image cards,
 * figure cards). Cards arrive blur-to-sharp in a stagger, lift on hover, and
 * re-flow with a layout animation when a topic is chosen.
 */
export function WritingGrid({ articles }: { articles: Article[] }) {
  const topics = useMemo(() => TOPICS.filter((t) => articles.some((a) => a.tags.includes(t))), [articles]);
  const [topic, setTopic] = useState<string | null>(null);
  const shown = topic ? articles.filter((a) => a.tags.includes(topic)) : articles;

  return (
    <LayoutGroup>
      <div role="group" aria-label="Topics" className="flex flex-wrap gap-2 mb-10">
        <button className="chip" aria-pressed={topic === null} onClick={() => setTopic(null)}>All</button>
        {topics.map((t) => (
          <button key={t} className="chip" aria-pressed={topic === t} onClick={() => setTopic(t)}>{t}</button>
        ))}
      </div>

      <motion.ul layout className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
        <AnimatePresence mode="popLayout">
          {shown.map((a, i) => (
            <motion.li
              layout
              key={a.slug}
              className="break-inside-avoid mb-5"
              initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08 + Math.floor(i / 3) * 0.05, ease: EASE }}
            >
              <Card a={a} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </LayoutGroup>
  );
}

function Card({ a }: { a: Article }) {
  return (
    <Link href={`/writing/${a.slug}`} className="group block" data-cursor="Read">
      <motion.article
        whileHover={{ y: -6, rotate: -0.4 }}
        transition={{ type: "spring", bounce: 0, duration: 0.45 }}
        className="rounded-2xl overflow-hidden bg-white ring-1 ring-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow duration-500 group-hover:shadow-[0_24px_48px_-12px_rgba(15,23,42,0.18)]"
      >
        {a.cover ? (
          <div className="relative overflow-hidden bg-slate-100">
            <SmartImage
              src={a.cover}
              alt=""
              className="w-full aspect-[4/3]"
              imgClassName="object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
            {a.stat && (
              <span className="absolute left-3 bottom-3 glass-bar glass-bar--light rounded-xl px-3 py-1.5 text-[13px] text-slate-700">
                <b className="text-slate-900 tabular">{a.stat.value}</b> {a.stat.label}
              </span>
            )}
          </div>
        ) : a.stat ? (
          <div className="px-6 pt-8 pb-6" style={{ background: "color-mix(in srgb, var(--accent) 9%, #fff)" }}>
            <p className="display text-[4.2rem] leading-none tabular" style={{ color: "var(--accent-strong)" }}>{a.stat.value}</p>
            <p className="mt-2 text-[14px] text-slate-600">{a.stat.label}</p>
          </div>
        ) : null}

        <div className="p-5 space-y-3">
          <div className="flex flex-wrap gap-1.5">{a.tags.slice(0, 3).map((t) => <span key={t} className="tag">{t}</span>)}</div>
          <h2 className="display text-[1.6rem] leading-[1.08] text-slate-900 text-balance">{a.title}</h2>
          <p className="text-[14.5px] leading-6 text-slate-600 text-pretty">{a.dek}</p>
          <div className="flex items-center justify-between pt-1">
            <span className="font-mono text-[11.5px] tabular text-slate-500">{date(a.published)} · {a.readMinutes} min</span>
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300 bg-slate-100 group-hover:bg-[var(--accent-strong)] group-hover:text-white text-slate-600">
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
