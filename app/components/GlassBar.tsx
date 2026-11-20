"use client";

import React, { useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { PROFILE } from "../data/profile";

/**
 * Floating glass navigation shared by /profile and /gallery.
 * Dark glass with white text over the dark stage, frosted light glass with
 * dark text once the page has risen over it (after `lightAfter` of the
 * viewport height). Styles: .glass-bar in globals.css (solid under
 * prefers-reduced-transparency).
 */
export function GlassBar({ left, onMenu, lightAfter = 0.62 }: { left: React.ReactNode; onMenu: () => void; lightAfter?: number }) {
  const { scrollY } = useScroll();
  const [onLight, setOnLight] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setOnLight(y > window.innerHeight * lightAfter));
  return (
    <header className="fixed top-3 inset-x-3 sm:inset-x-6 z-50">
      <div
        className={`glass-bar ${onLight ? "glass-bar--light" : "glass-bar--dark"} h-14 px-3 sm:px-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-2xl transition-[background-color,color,box-shadow,border-color] duration-500`}
      >
        <div className="justify-self-start">{left}</div>
        <span className="justify-self-center display text-lg sm:text-2xl whitespace-nowrap">{PROFILE.name}</span>
        <button onClick={onMenu} className="justify-self-end text-[15px] h-10 px-2 rounded-lg hover:bg-white/10">Menu</button>
      </div>
    </header>
  );
}
