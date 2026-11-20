"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const CYCLE = 2.4;   // seconds for one left→right→left pass
const LIFT = -9;     // px each letter rises
const HALF = 0.035;  // fraction of the cycle a single bump takes on each side

/**
 * Loader made of the name itself: each letter lifts in turn, the wave runs
 * left → right, then back right → left, and repeats. Every letter gets two
 * bumps per cycle, one on the outbound pass and one on the return, timed so
 * the bumps travel as one wave. Static under reduced motion.
 */
export function NameLoader({ text = "SHASHIKA", className = "" }: { text?: string; className?: string }) {
  const reduced = useReducedMotion();
  const letters = text.split("");
  const n = letters.length;

  return (
    <span role="status" aria-label="Loading" className={`inline-flex ${className}`}>
      {letters.map((ch, i) => {
        const a = (n === 1 ? 0 : i / (n - 1)) * 0.42 + 0.04; // outbound bump
        const b = 1 - a;                                      // return bump
        return (
          <motion.span
            key={i}
            aria-hidden
            className="inline-block"
            animate={reduced ? undefined : { y: [0, 0, LIFT, 0, 0, LIFT, 0, 0], opacity: [0.45, 0.45, 1, 0.45, 0.45, 1, 0.45, 0.45] }}
            transition={{
              duration: CYCLE,
              times: [0, a - HALF, a, a + HALF, b - HALF, b, b + HALF, 1],
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {ch}
          </motion.span>
        );
      })}
    </span>
  );
}
