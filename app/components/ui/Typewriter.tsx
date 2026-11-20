"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Types paragraphs out in real time with a blinking caret. Natural rhythm:
 * a little pause after commas and longer after sentence ends. `instant`
 * completes immediately (Skip). Calls `onDone` once when everything is typed.
 * Reduced motion: shows the full text at once.
 */
export function Typewriter({
  paragraphs,
  cps = 55,
  startDelay = 300,
  instant = false,
  onDone,
  onProgress,
  className = "",
  paragraphClassName = "",
}: {
  paragraphs: string[];
  cps?: number;
  startDelay?: number;
  instant?: boolean;
  onDone?: () => void;
  onProgress?: () => void;
  className?: string;
  paragraphClassName?: string;
}) {
  const reduced = useReducedMotion();
  const total = paragraphs.reduce((n, p) => n + p.length, 0);
  const [count, setCount] = useState(0);
  const doneRef = useRef(false);
  const finished = instant || reduced || count >= total;

  useEffect(() => {
    if (instant || reduced) return;
    let i = 0;
    let timer: number;
    const flat = paragraphs.join("");
    const tick = () => {
      i += 1;
      setCount(i);
      onProgress?.();
      if (i >= flat.length) return;
      const ch = flat[i - 1];
      const pause = ch === "." || ch === ":" || ch === ";" ? 260 : ch === "," ? 110 : 0;
      timer = window.setTimeout(tick, 1000 / cps + pause);
    };
    timer = window.setTimeout(tick, startDelay);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instant, reduced]);

  useEffect(() => {
    if (finished && !doneRef.current) {
      doneRef.current = true;
      onDone?.();
    }
  }, [finished, onDone]);

  // Slice the typed character count back into paragraphs.
  const typedChars = finished ? total : count;
  const starts = paragraphs.map((_, i) => paragraphs.slice(0, i).reduce((n, p) => n + p.length, 0));
  const shown = paragraphs.map((p, i) => p.slice(0, Math.max(0, Math.min(p.length, typedChars - starts[i]))));
  const caretAt = finished ? -1 : shown.findIndex((s, i) => s.length < paragraphs[i].length);

  return (
    <div className={className}>
      {/* Screen readers get the whole text at once, not character by character. */}
      <p className="sr-only">{paragraphs.join(" ")}</p>
      {paragraphs.map((p, i) =>
        shown[i].length > 0 || i === caretAt ? (
          <p key={i} aria-hidden className={paragraphClassName}>
            {shown[i]}
            {i === caretAt && <span className="typewriter-caret" />}
          </p>
        ) : null
      )}
    </div>
  );
}
