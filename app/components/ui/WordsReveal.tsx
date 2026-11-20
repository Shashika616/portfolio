"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue, useInView } from "framer-motion";

/**
 * Text that appears word by word, like the reference's editor's letter.
 *
 * mode="scroll": each word brightens as the paragraph scrolls through the
 *   viewport (pass `container` when the scroller is not the window).
 * mode="time":   words resolve in sequence once the paragraph is in view.
 */
export function WordsReveal({
  text,
  className,
  mode = "time",
  container,
  stagger = 0.035,
  delay = 0,
  dim = 0.12,
}: {
  text: string;
  className?: string;
  mode?: "scroll" | "time";
  container?: React.RefObject<HTMLElement | null>;
  stagger?: number;
  delay?: number;
  dim?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(/\s+/);

  if (mode === "scroll") return <ScrollWords words={words} className={className} container={container} dim={dim} innerRef={ref} />;
  return <TimeWords words={words} className={className} stagger={stagger} delay={delay} innerRef={ref} />;
}

function TimeWords({ words, className, stagger, delay, innerRef }: { words: string[]; className?: string; stagger: number; delay: number; innerRef: React.RefObject<HTMLParagraphElement | null> }) {
  const inView = useInView(innerRef, { once: true, margin: "0px 0px -10% 0px" });
  return (
    <p ref={innerRef} className={className}>
      {/* Spaces live between the spans so lines wrap normally. */}
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, filter: "blur(8px)", y: 6 }}
            animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0 } : undefined}
            transition={{ duration: 0.6, delay: delay + i * stagger, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </p>
  );
}

function ScrollWords({ words, className, container, dim, innerRef }: { words: string[]; className?: string; container?: React.RefObject<HTMLElement | null>; dim: number; innerRef: React.RefObject<HTMLParagraphElement | null> }) {
  const { scrollYProgress } = useScroll({ target: innerRef, container, offset: ["start 0.92", "end 0.55"] });
  return (
    <p ref={innerRef} className={className}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <Word progress={scrollYProgress} start={i / words.length} end={(i + 1) / words.length} dim={dim}>
            {w}
          </Word>
          {i < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </p>
  );
}

function Word({ children, progress, start, end, dim }: { children: React.ReactNode; progress: MotionValue<number>; start: number; end: number; dim: number }) {
  const opacity = useTransform(progress, [start, end], [dim, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}
