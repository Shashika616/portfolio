"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const SECTIONS = [
  { id: "cover", label: "Cover" },
  { id: "contents", label: "Contents" },
  { id: "features", label: "Features" },
  { id: "career", label: "Career" },
  { id: "colophon", label: "Colophon" },
];

const IDLE_MS = 1500;

/**
 * Section index on the right edge, on a small glass panel (same material as
 * the top bar: light glass, dark glass over the dark colophon). Ticks are
 * drawn like the dial's; the current section's tick is long and labelled.
 * It fades away 1.5s after scrolling stops and returns on scroll, hover or
 * keyboard focus. Large screens only.
 */
export function IssueIndex() {
  const [active, setActive] = useState("cover");
  const [awake, setAwake] = useState(true);
  const [held, setHeld] = useState(false); // hovered or focused
  const timer = useRef<number | null>(null);

  // Which section is in view.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5] }
    );
    SECTIONS.forEach((s) => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  // Wake on scroll, sleep after IDLE_MS of no scrolling.
  useEffect(() => {
    const sleepLater = () => {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setAwake(false), IDLE_MS);
    };
    const onScroll = () => { setAwake(true); sleepLater(); };
    sleepLater();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const visible = awake || held;
  const dark = active === "colophon";

  return (
    <motion.nav
      aria-label="Sections of this issue"
      className={`glass-bar ${dark ? "glass-bar--dark" : "glass-bar--light"} group/index hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-1 py-3 pl-3 pr-2.5 rounded-2xl transition-[background-color,color,box-shadow,border-color] duration-500`}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 12, filter: visible ? "blur(0px)" : "blur(4px)" }}
      transition={{ duration: visible ? 0.3 : 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      {SECTIONS.map((s) => {
        const on = s.id === active;
        return (
          <button
            key={s.id}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
            aria-current={on ? "true" : undefined}
            className="flex items-center gap-3 h-7 px-1.5 rounded-lg"
            data-cursor={s.label}
          >
            <span className={`text-[11px] tracking-[0.14em] uppercase transition-[opacity,max-width] duration-300 overflow-hidden whitespace-nowrap ${on ? "opacity-100 max-w-[6rem]" : "opacity-0 max-w-0 group-hover/index:opacity-60 group-hover/index:max-w-[6rem]"}`}>
              {s.label}
            </span>
            <motion.span
              className="block h-[2px] rounded-full"
              animate={{ width: on ? 26 : 12, opacity: on ? 1 : 0.45 }}
              style={{ background: on ? "var(--accent)" : "currentColor" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            />
          </button>
        );
      })}
    </motion.nav>
  );
}
