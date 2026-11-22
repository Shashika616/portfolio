"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, LayoutGroup, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, LayoutDashboard, LayoutGrid, List as ListIcon } from "lucide-react";
import type { Article } from "../data/writing";
import { SmartImage } from "../components/ui/SmartImage";

const EASE = [0.16, 1, 0.3, 1] as const;
/** A few broad topics, so every option fits on one or two rows. */
const TOPICS = ["Architecture", "Security", "AI", "Performance", "Research"];
type View = "collage" | "grid" | "list";
const VIEWS: { id: View; label: string; Icon: typeof LayoutGrid }[] = [
  { id: "collage", label: "Collage", Icon: LayoutDashboard },
  { id: "grid", label: "Grid", Icon: LayoutGrid },
  { id: "list", label: "List", Icon: ListIcon },
];

const date = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** Stable "random" per article, so server and client render the same collage. */
const seed = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

type Shape = "tall" | "short" | "figure" | "quote";
function shapeOf(a: Article, i: number): Shape {
  if (!a.cover) return a.stat ? "figure" : "quote";
  const r = (seed(a.slug) + i) % 5;
  if (r === 0 || r === 3) return "tall";
  if (r === 4 && a.stat) return "figure";
  return "short";
}

export function WritingGrid({ articles }: { articles: Article[] }) {
  const topics = useMemo(() => TOPICS.filter((t) => articles.some((a) => a.tags.includes(t))), [articles]);
  const [topic, setTopic] = useState<string | null>(null);
  const [view, setView] = useState<View>("collage");
  const shown = topic ? articles.filter((a) => a.tags.includes(topic)) : articles;

  return (
    <LayoutGroup>
      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between mb-10">
        <div role="group" aria-label="Topics" className="flex flex-wrap gap-2">
          <button className="chip" aria-pressed={topic === null} onClick={() => setTopic(null)}>All</button>
          {topics.map((t) => (
            <button key={t} className="chip" aria-pressed={topic === t} onClick={() => setTopic(t)}>{t}</button>
          ))}
        </div>
        <ViewSwitch view={view} onChange={setView} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {view === "collage" && (
            <ul className="columns-2 lg:columns-3 gap-4 sm:gap-5">
              <AnimatePresence mode="popLayout">
                {shown.map((a, i) => (
                  <Reveal key={a.slug} i={i} className="break-inside-avoid mb-4 sm:mb-5">
                    <CollageCard a={a} shape={shapeOf(a, i)} />
                  </Reveal>
                ))}
              </AnimatePresence>
            </ul>
          )}
          {view === "grid" && (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {shown.map((a, i) => (
                  <Reveal key={a.slug} i={i} className="h-full"><GridCard a={a} /></Reveal>
                ))}
              </AnimatePresence>
            </ul>
          )}
          {view === "list" && (
            <ul className="border-t border-slate-900/10">
              <AnimatePresence mode="popLayout">
                {shown.map((a, i) => (
                  <Reveal key={a.slug} i={i} className="border-b border-slate-900/10"><ListRow a={a} /></Reveal>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </motion.div>
      </AnimatePresence>
    </LayoutGroup>
  );
}

function ViewSwitch({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  return (
    <div role="radiogroup" aria-label="View" className="glass-bar glass-bar--light self-start rounded-[14px] p-1 inline-flex items-center gap-0.5">
      {VIEWS.map(({ id, label, Icon }) => {
        const on = id === view;
        return (
          <button
            key={id}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(id)}
            className={`relative h-9 px-3 rounded-[10px] inline-flex items-center gap-1.5 text-[14px] font-medium transition-colors ${on ? "" : "text-slate-600 hover:text-slate-900"}`}
            style={on ? { color: "var(--accent-strong)" } : undefined}
          >
            {on && (
              <motion.span
                layoutId="writing-view-pill"
                className="absolute inset-0 rounded-[10px]"
                style={{ backgroundColor: "color-mix(in srgb, var(--accent) 14%, transparent)" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              />
            )}
            <Icon className="relative w-4 h-4" strokeWidth={1.75} />
            <span className="relative">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Reveal({ i, className, children }: { i: number; className?: string; children: React.ReactNode }) {
  return (
    <motion.li
      layout
      className={className}
      initial={{ opacity: 0, y: 28, scale: 0.97, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(6px)" }}
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 0.7, delay: (i % 3) * 0.08 + Math.floor(i / 3) * 0.06, ease: EASE }}
    >
      {children}
    </motion.li>
  );
}

/** Card that tilts toward the pointer with a soft glare, like picking up a print. */
function Tilt({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 220, damping: 22 };
  const rx = useSpring(useTransform(py, [0, 1], [6, -6]), spring);
  const ry = useSpring(useTransform(px, [0, 1], [-7, 7]), spring);
  const gx = useTransform(px, (v) => `${(v * 100).toFixed(1)}%`);
  const gy = useTransform(py, (v) => `${(v * 100).toFixed(1)}%`);
  const glare = useTransform([gx, gy], ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.35), transparent 55%)`);

  const move = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const leave = () => { px.set(0.5); py.set(0.5); };

  return (
    <motion.div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", bounce: 0, duration: 0.45 }}
      className={`relative rounded-2xl overflow-hidden ring-1 ring-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow duration-500 group-hover:shadow-[0_28px_56px_-14px_rgba(15,23,42,0.22)] ${className}`}
    >
      {children}
      <motion.span aria-hidden className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: glare }} />
    </motion.div>
  );
}

function Meta({ a, light = false }: { a: Article; light?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={`font-mono text-[11.5px] tabular ${light ? "text-white/75" : "text-slate-500"}`}>{date(a.published)} · {a.readMinutes} min</span>
      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 transition-colors duration-300 ${light ? "bg-white/20 text-white group-hover:bg-white group-hover:text-slate-900" : "bg-slate-100 text-slate-600 group-hover:bg-[var(--accent-strong)] group-hover:text-white"}`}>
        <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
      </span>
    </div>
  );
}

function CollageCard({ a, shape }: { a: Article; shape: Shape }) {
  const href = `/writing/${a.slug}`;
  if (shape === "tall" && a.cover) {
    return (
      <Link href={href} className="group block" data-cursor="Read">
        <Tilt className="bg-slate-900">
          <SmartImage src={a.cover} alt="" className="w-full aspect-[3/4]" imgClassName="object-cover object-top transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 space-y-3">
            <span className="tag">{a.tags[0]}</span>
            <h2 className="display text-[1.45rem] sm:text-[1.8rem] leading-[1.05] text-white text-balance">{a.title}</h2>
            <Meta a={a} light />
          </div>
        </Tilt>
      </Link>
    );
  }
  if (shape === "figure" && a.stat) {
    return (
      <Link href={href} className="group block" data-cursor="Read">
        <Tilt className="bg-white">
          <div className="px-5 pt-7 pb-5" style={{ background: "color-mix(in srgb, var(--accent) 10%, #fff)" }}>
            <p className="display text-[3.4rem] sm:text-[4.4rem] leading-none tabular" style={{ color: "var(--accent-strong)" }}>{a.stat.value}</p>
            <p className="mt-2 text-[13.5px] text-slate-600">{a.stat.label}</p>
          </div>
          <div className="p-4 sm:p-5 space-y-3">
            <h2 className="display text-[1.3rem] sm:text-[1.5rem] leading-[1.08] text-slate-900 text-balance">{a.title}</h2>
            <Meta a={a} />
          </div>
        </Tilt>
      </Link>
    );
  }
  if (shape === "quote") {
    return (
      <Link href={href} className="group block" data-cursor="Read">
        <Tilt className="bg-slate-900">
          <div className="p-5 sm:p-6 space-y-4">
            <span className="tag">{a.tags[0]}</span>
            <p className="display italic text-[1.4rem] sm:text-[1.7rem] leading-[1.12] text-white text-balance">{a.title}</p>
            <p className="text-[13.5px] leading-6 text-white/70 line-clamp-3">{a.dek}</p>
            <Meta a={a} light />
          </div>
        </Tilt>
      </Link>
    );
  }
  return (
    <Link href={href} className="group block" data-cursor="Read">
      <Tilt className="bg-white">
        {a.cover && (
          <div className="relative overflow-hidden bg-slate-100">
            <SmartImage src={a.cover} alt="" className="w-full aspect-[4/3]" imgClassName="object-cover object-top transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]" />
            {a.stat && (
              <span className="hidden sm:inline absolute left-3 bottom-3 glass-bar glass-bar--light rounded-xl px-2.5 py-1 text-[12.5px] text-slate-700">
                <b className="text-slate-900 tabular">{a.stat.value}</b> {a.stat.label}
              </span>
            )}
          </div>
        )}
        <div className="p-4 sm:p-5 space-y-2.5">
          <h2 className="display text-[1.3rem] sm:text-[1.5rem] leading-[1.08] text-slate-900 text-balance">{a.title}</h2>
          <p className="hidden sm:block text-[14px] leading-6 text-slate-600 line-clamp-3">{a.dek}</p>
          <Meta a={a} />
        </div>
      </Tilt>
    </Link>
  );
}

function GridCard({ a }: { a: Article }) {
  return (
    <Link href={`/writing/${a.slug}`} className="group block h-full" data-cursor="Read">
      <motion.article
        whileHover={{ y: -5 }}
        transition={{ type: "spring", bounce: 0, duration: 0.45 }}
        className="h-full flex flex-col rounded-2xl overflow-hidden bg-white ring-1 ring-slate-200 transition-shadow duration-500 group-hover:shadow-[0_24px_48px_-12px_rgba(15,23,42,0.18)]"
      >
        <div className="relative overflow-hidden" style={{ background: "color-mix(in srgb, var(--accent) 10%, #fff)" }}>
          {a.cover ? (
            <SmartImage src={a.cover} alt="" className="w-full aspect-[16/10]" imgClassName="object-cover object-top transition-transform duration-[900ms] group-hover:scale-[1.06]" />
          ) : (
            <div className="aspect-[16/10] flex flex-col justify-end p-5">
              {a.stat && <p className="display text-[3.2rem] leading-none tabular" style={{ color: "var(--accent-strong)" }}>{a.stat.value}</p>}
              {a.stat && <p className="mt-1 text-[13px] text-slate-600">{a.stat.label}</p>}
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col p-5 gap-3">
          <div className="flex flex-wrap gap-1.5">{a.tags.slice(0, 2).map((t) => <span key={t} className="tag">{t}</span>)}</div>
          <h2 className="display text-[1.45rem] leading-[1.08] text-slate-900 text-balance">{a.title}</h2>
          <p className="text-[14px] leading-6 text-slate-600 line-clamp-3">{a.dek}</p>
          <div className="mt-auto pt-1"><Meta a={a} /></div>
        </div>
      </motion.article>
    </Link>
  );
}

function ListRow({ a }: { a: Article }) {
  return (
    <Link href={`/writing/${a.slug}`} className="group flex items-center gap-4 sm:gap-6 py-5" data-cursor="Read">
      <div className="relative w-20 h-20 sm:w-28 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden ring-1 ring-slate-200" style={{ background: "color-mix(in srgb, var(--accent) 10%, #fff)" }}>
        {a.cover ? (
          <SmartImage src={a.cover} alt="" className="w-full h-full" imgClassName="object-cover object-top transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center display text-[1.6rem] tabular" style={{ color: "var(--accent-strong)" }}>{a.stat?.value}</span>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="font-mono text-[11.5px] tabular text-slate-500">{date(a.published)} · {a.readMinutes} min · {a.tags[0]}</p>
        <h2 className="display text-[1.3rem] sm:text-[1.6rem] leading-[1.1] text-slate-900 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5">{a.title}</h2>
        <p className="hidden sm:block text-[14px] leading-6 text-slate-600 line-clamp-1">{a.dek}</p>
      </div>
      <ArrowUpRight className="w-5 h-5 flex-shrink-0 text-slate-400 transition-all duration-300 group-hover:rotate-45 group-hover:text-[var(--accent-strong)]" />
    </Link>
  );
}
