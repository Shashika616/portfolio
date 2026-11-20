"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/** Counts a figure like "99.5%", "50+", "31" up from zero when it scrolls into view. */
export function CountUp({ value, className, style }: { value: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();
  const m = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  const [shown, setShown] = useState(m ? `${m[1]}0${m[3]}` : value);

  useEffect(() => {
    if (!m || !inView) return;
    const target = parseFloat(m[2]);
    const decimals = (m[2].split(".")[1] ?? "").length;
    if (reduced) return;
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setShown(`${m[1]}${v.toFixed(decimals)}${m[3]}`),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return <span ref={ref} className={className} style={style} aria-label={value}>{reduced ? value : shown}</span>;
}
