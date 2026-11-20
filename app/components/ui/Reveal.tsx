"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * Scroll-in reveal in the exhibit's vocabulary: content rises a little and
 * sharpens out of a soft blur, on an expo ease-out. Plays once per element.
 * Reduced motion is handled globally by <MotionConfig reducedMotion="user">.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      // A print arriving: slightly curled toward the viewer, then flat and sharp.
      initial={{ opacity: 0, y: 34, rotateX: 16, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
      style={{ transformPerspective: 1200, transformOrigin: "50% 100%" }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Comp>
  );
}

/** Enter/exit used when a filter changes the set of cards (with layout re-flow). */
export const cardPresence = {
  initial: { opacity: 0, scale: 0.98, filter: "blur(6px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.98, filter: "blur(4px)", transition: { duration: 0.18 } },
  transition: { type: "spring" as const, bounce: 0, duration: 0.55 },
};
