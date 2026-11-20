"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, PanInfo, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import type { ProjectItem } from "../../data/types";
import { SmartImage } from "./SmartImage";

const INTERVAL_MS = 5200;

/**
 * Profile cover as a carousel of live systems.
 *
 * - Story-style segment bar on top (social look); the active segment fills
 *   over the slide's duration.
 * - Slides cross-fade with a slow push-in (the exhibit's print-in-focus feel).
 * - Swipe or drag: the release velocity is projected forward (Apple's
 *   decay projection) so a flick advances even when the drag was short.
 * - Auto-advance pauses on hover, focus and when the tab is hidden; it is
 *   off entirely under reduced motion.
 */
export function CoverCarousel({ slides, onOpen }: { slides: ProjectItem[]; onOpen: (p: ProjectItem) => void }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0); // restarts the segment fill on manual moves
  const reduced = !!useReducedMotion();
  const timer = useRef<number | null>(null);
  const n = slides.length;

  const go = useCallback((next: number) => {
    setIndex(((next % n) + n) % n);
    setCycle((c) => c + 1);
  }, [n]);

  useEffect(() => {
    if (reduced || paused || n < 2) return;
    timer.current = window.setTimeout(() => go(index + 1), INTERVAL_MS);
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [index, paused, reduced, n, go, cycle]);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    // Project where the flick is heading, then decide (decelerationRate 0.998).
    const projected = info.offset.x + (info.velocity.x / 1000) * 0.998 / (1 - 0.998);
    if (projected < -120) go(index + 1);
    else if (projected > 120) go(index - 1);
  };

  const slide = slides[index];

  return (
    <div
      className="relative h-52 sm:h-72 overflow-hidden bg-[#0b0b0e] group/cover"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Selected systems"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.name}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }, scale: { duration: reduced ? 0 : 6, ease: "linear" } }}
          drag={n > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={onDragEnd}
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${n}: ${slide.name}`}
        >
          <SmartImage src={slide.cover!} alt="" dark loading="eager" draggable={false} className="w-full h-full" imgClassName="object-cover object-top select-none pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* Neutral scrims for legibility only: screenshots keep their true colours. */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-3/4 pointer-events-none bg-gradient-to-t from-black/90 via-black/55 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-16 pointer-events-none bg-gradient-to-b from-black/40 to-transparent" />

      {/* Story segments */}
      <div className="absolute top-3 inset-x-3 sm:inset-x-5 flex gap-1.5 z-10" role="tablist" aria-label="Choose a system">
        {slides.map((s, i) => (
          <button
            key={s.name}
            role="tab"
            aria-selected={i === index}
            aria-label={`Show ${s.name}`}
            onClick={() => go(i)}
            className="relative flex-1 h-[3px] rounded-full bg-white/30 overflow-hidden cursor-pointer before:absolute before:-inset-y-3 before:inset-x-0 before:content-['']"
          >
            <span
              key={`${i}-${cycle}-${index}`}
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: i === index ? "var(--accent)" : "#fff",
                width: i < index ? "100%" : i === index ? (reduced || paused ? "100%" : undefined) : "0%",
                animation: i === index && !reduced && !paused ? `cover-fill ${INTERVAL_MS}ms linear forwards` : undefined,
              }}
            />
          </button>
        ))}
      </div>

      {/* Caption */}
      {/* Sits above the avatar, which overlaps the cover's bottom-left edge. */}
      <div className="absolute left-4 sm:left-8 bottom-16 sm:bottom-[4.5rem] right-28 sm:right-40 z-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.name}
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-1.5"
          >
            <button
              type="button"
              onClick={() => onOpen(slide)}
              className="block text-left display text-white text-[1.6rem] sm:text-[2.4rem] leading-[1] hover:underline decoration-1 underline-offset-4 cursor-pointer"
            >
              {slide.name.split(" - ")[0]}
              <ArrowUpRight className="inline-block ml-1.5 w-5 h-5 sm:w-6 sm:h-6 align-baseline opacity-80" />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      {n > 1 && (
        <div className="absolute right-3 sm:right-6 bottom-4 sm:bottom-6 z-10 flex gap-2">
          <button type="button" onClick={() => go(index - 1)} aria-label="Previous system" className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-colors active:scale-95">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button type="button" onClick={() => go(index + 1)} aria-label="Next system" className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-colors active:scale-95">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
