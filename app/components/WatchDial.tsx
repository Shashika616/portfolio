"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, MotionValue, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import { DialViewToggle } from "./DialViewToggle";
import { THEMES, useGlobalTheme } from "../context/ThemeContext";
import { Section } from "../types";
import { DIAL_START, DIAL_STEP, dialAngle } from "../sectionsData";

interface WatchDialProps {
  variant: "desktop" | "mobile";
  sections: Section[];
  currentIndex: number;
  /** Smoothed hand angle in degrees (spring-driven in page.tsx). */
  rotation: MotionValue<number>;
  jumpToSection: (index: number) => void;
}

// ---------- Dial geometry (desktop) ----------
const SIZE = 448;            // px, the dial disc (28rem)
const C = SIZE / 2;          // centre
const R_EDGE = 219;          // outer hairline
const R_TICK = 204;          // tick ring outer radius
const R_ARC = 211;           // progress arc radius
const R_INNER = 150;         // inner hairline
const LABEL_R = 240;         // label distance from centre
const HAND_LEN = 196;

const rad = (deg: number) => (deg * Math.PI) / 180;
const polar = (r: number, deg: number) => [C + r * Math.cos(rad(deg)), C + r * Math.sin(rad(deg))] as const;

function arcPath(r: number, from: number, to: number) {
  const [x0, y0] = polar(r, from);
  const [x1, y1] = polar(r, to);
  const large = to - from > 180 ? 1 : 0;
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

export default function WatchDial(props: WatchDialProps) {
  return props.variant === "desktop" ? <DesktopDial {...props} /> : <MobileNav {...props} />;
}

/* ===================================================================== */
/* Desktop: a flat instrument face, half-docked on the left edge.         */
/* ===================================================================== */

function DesktopDial({ sections, currentIndex, rotation, jumpToSection }: WatchDialProps) {
  const last = sections.length - 1;
  const spanEnd = dialAngle(last) + DIAL_STEP; // hand can travel one step past the last section while scrolling it
  const span = spanEnd - DIAL_START;

  // Progress arc fills from the first section to wherever the hand is.
  const progress = useTransform(rotation, (v) => Math.min(1, Math.max(0, (v - DIAL_START) / span)));
  const handTransform = useTransform(rotation, (v) => `rotate(${v}deg)`);

  // Minor ticks every 2°, across the travelled span only: every mark means something.
  const ticks: { deg: number; major: number | null }[] = [];
  // Starting 6° before the first section keeps every section angle on the 2° grid.
  for (let d = DIAL_START - 6; d <= spanEnd; d += 2) {
    const majorIndex = sections.findIndex((_, i) => Math.abs(dialAngle(i) - d) < 0.01);
    ticks.push({ deg: d, major: majorIndex >= 0 ? majorIndex : null });
  }

  return (
    <div
      className="fixed left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-auto z-50"
      style={{ width: SIZE, height: SIZE }}
    >
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 overflow-visible" aria-hidden>
        <defs>
          <radialGradient id="dial-face" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="85%" stopColor="#fbfcfd" />
            <stop offset="100%" stopColor="#f3f6f9" />
          </radialGradient>
          <filter id="dial-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="18" stdDeviation="22" floodColor="#0f172a" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Face */}
        <circle cx={C} cy={C} r={R_EDGE} fill="url(#dial-face)" filter="url(#dial-shadow)" />
        <circle cx={C} cy={C} r={R_EDGE} fill="none" stroke="#e2e8f0" strokeWidth="1" />
        <circle cx={C} cy={C} r={R_INNER} fill="none" stroke="#eef2f6" strokeWidth="1" />
        <circle cx={C} cy={C} r={R_INNER - 34} fill="none" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="1 5" />

        {/* Progress track + arc */}
        <path d={arcPath(R_ARC, DIAL_START, spanEnd)} fill="none" stroke="#eef2f6" strokeWidth="3" strokeLinecap="round" />
        <motion.path
          d={arcPath(R_ARC, DIAL_START, spanEnd)}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ pathLength: progress }}
        />

        {/* Ticks: major ticks at sections carry state (visited / current / upcoming). */}
        {ticks.map(({ deg, major }) => {
          const isMajor = major !== null;
          const len = isMajor ? 15 : 5;
          const [x0, y0] = polar(R_TICK, deg);
          const [x1, y1] = polar(R_TICK - len, deg);
          let stroke = "#d5dde6";
          if (isMajor) stroke = major! < currentIndex ? "color-mix(in srgb, var(--accent) 55%, #cbd5e1)" : major === currentIndex ? "var(--accent)" : "#94a3b8";
          return (
            <line
              key={deg}
              x1={x0.toFixed(2)} y1={y0.toFixed(2)} x2={x1.toFixed(2)} y2={y1.toFixed(2)}
              stroke={stroke}
              strokeWidth={isMajor ? (major === currentIndex ? 2.5 : 1.5) : 1}
              strokeLinecap="round"
              style={{ transition: "stroke 300ms ease" }}
            />
          );
        })}
      </svg>

      {/* Hand */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 origin-left will-change-transform"
        style={{ width: HAND_LEN, height: 2, marginTop: -1, transform: handTransform }}
      >
        <span className="absolute inset-0 rounded-full bg-slate-900" />
        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-[3px] rounded-full" style={{ background: "var(--accent)" }} />
      </motion.div>
      <span aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white ring-[1.5px] ring-slate-900 shadow-sm" />

      {/* Section labels */}
      <ol className="absolute left-1/2 top-1/2 w-0 h-0">
        {sections.map((sec, i) => {
          const active = i === currentIndex;
          const deg = dialAngle(i);
          const x = LABEL_R * Math.cos(rad(deg));
          const y = LABEL_R * Math.sin(rad(deg));
          return (
            <li key={sec.id} className="absolute" style={{ transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translateY(-50%)` }}>
              <button
                onClick={() => jumpToSection(i)}
                aria-current={active ? "true" : undefined}
                className="group flex items-baseline gap-2 whitespace-nowrap py-1.5 pr-2 cursor-pointer"
              >
                <span
                  className="font-mono text-[11px] tabular transition-colors"
                  style={{ color: active ? "var(--accent-strong)" : "#94a3b8" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`text-[15px] tracking-[-0.01em] transition-colors ${
                    active ? "font-semibold text-slate-900" : "font-medium text-slate-500 group-hover:text-slate-900"
                  }`}
                >
                  {sec.title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ===================================================================== */
/* Mobile: menu trigger + slide-in sheet with a matching progress ring.   */
/* ===================================================================== */

/** iOS-like ease: quick to start, long soft landing. */
const SHEET_EASE = [0.32, 0.72, 0, 1] as const;

function MobileNav({ sections, currentIndex, jumpToSection }: WatchDialProps) {
  // Local state: opening the menu re-renders only the menu, not the whole dial page.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const close = () => setIsSidebarOpen(false);

  useEffect(() => {
    if (!isSidebarOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSidebarOpen]);

  const n = sections.length;
  const ringR = 22;
  const ringC = 2 * Math.PI * ringR;
  const current = sections[currentIndex];

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen((o) => !o)}
        aria-label="Open section menu"
        aria-expanded={isSidebarOpen}
        className="lg:hidden fixed top-[26px] left-4 z-[10001] w-11 h-11 rounded-xl bg-white text-slate-800 ring-1 ring-slate-200 shadow-sm flex items-center justify-center pointer-events-auto active:scale-95 transition-transform"
      >
        <Menu className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-[10002]">
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }}
              exit={{ opacity: 0, transition: { duration: 0.22, ease: "easeIn" } }}
              onClick={close}
              // A plain scrim: a backdrop blur is re-rendered every frame of the fade and stutters on phones.
              className="absolute inset-0 bg-slate-950/50 pointer-events-auto"
            />
            <motion.nav
              aria-label="Sections"
              initial={{ x: "-100%" }}
              animate={{ x: 0, transition: { duration: 0.34, ease: SHEET_EASE } }}
              exit={{ x: "-100%", transition: { duration: 0.26, ease: [0.4, 0, 1, 1] } }}
              style={{ willChange: "transform" }}
              className="absolute left-0 top-0 h-full w-[300px] max-w-[85vw] bg-white shadow-[8px_0_32px_rgba(15,23,42,0.18)] flex flex-col pointer-events-auto transform-gpu"
            >
              <div className="flex items-center justify-between h-[72px] pl-5 pr-3 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden>
                    <circle cx="26" cy="26" r={ringR} fill="none" stroke="#eef2f6" strokeWidth="3" />
                    <circle
                      cx="26" cy="26" r={ringR} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round"
                      strokeDasharray={`${(ringC * (currentIndex + 1)) / n} ${ringC}`}
                      transform="rotate(-90 26 26)"
                      style={{ transition: "stroke-dasharray 400ms cubic-bezier(0.22,1,0.36,1)" }}
                    />
                    <text x="26" y="30" textAnchor="middle" className="font-mono" fontSize="12" fill="#0f172a">
                      {String(currentIndex + 1).padStart(2, "0")}
                    </text>
                  </svg>
                  <div className="leading-tight">
                    <p className="text-[15px] font-semibold text-slate-900">{current.title}</p>
                    <p className="text-xs text-slate-500">{current.subtitle}</p>
                  </div>
                </div>
                <button onClick={close} aria-label="Close menu" className="btn btn-close btn-icon btn-sm">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ol className="flex-1 overflow-y-auto py-3">
                {sections.map((sec, i) => {
                  const active = i === currentIndex;
                  return (
                    <li key={sec.id}>
                      <button
                        onClick={() => { jumpToSection(i); close(); }}
                        aria-current={active ? "true" : undefined}
                        className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-colors ${active ? "bg-slate-50" : "hover:bg-slate-50"}`}
                      >
                        <span aria-hidden className="h-[2px] flex-shrink-0 transition-all" style={{ width: active ? 18 : 10, background: active ? "var(--accent)" : i < currentIndex ? "color-mix(in srgb, var(--accent) 55%, #cbd5e1)" : "#cbd5e1" }} />
                        <span className="font-mono text-[11px] tabular w-5" style={{ color: active ? "var(--accent-strong)" : "#94a3b8" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className={`block text-[15px] ${active ? "font-semibold text-slate-900" : "font-medium text-slate-700"}`}>{sec.title}</span>
                          <span className="block text-xs text-slate-500">{sec.subtitle}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              {/* On phones the view switch and themes live here, so nothing floats over the content. */}
              <div className="p-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">View</span>
                  <DialViewToggle />
                </div>
                <ThemeSwatches />
              </div>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Theme picker for the mobile sheet: one swatch per theme, the active one ringed. */
function ThemeSwatches() {
  const { activeTheme, setThemeById } = useGlobalTheme();
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">Theme</span>
      <div role="radiogroup" aria-label="Theme" className="flex items-center gap-2">
        {THEMES.map((t) => {
          const on = t.id === activeTheme.id;
          return (
            <button
              key={t.id}
              role="radio"
              aria-checked={on}
              aria-label={t.name}
              onClick={() => setThemeById(t.id)}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90"
              style={{ boxShadow: on ? "0 0 0 2px #fff, 0 0 0 4px var(--accent)" : "inset 0 0 0 1px #e2e8f0" }}
            >
              <span aria-hidden className="w-6 h-6 rounded-full" style={{ backgroundImage: t.gradient }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
