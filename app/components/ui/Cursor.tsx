"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";

type Mode = "dot" | "label" | "lens";

/**
 * Exhibit cursor (fine pointers only, off under reduced motion).
 *
 * - default: a small dot with a slow dashed halo that trails behind.
 * - over links/buttons: the halo grows and shows a short label
 *   (from `data-cursor`, else "Open").
 * - over `[data-cursor="view"]` (images, gallery tiles): a translucent lens
 *   with a "+", like the reference gallery.
 *
 * It never hides the native cursor except on the exhibit stage, where the
 * stage sets `cursor: none` itself.
 */
export function Cursor() {
  const reduced = useReducedMotion();
  const finePointer = useSyncExternalStore(
    (cb) => { const mq = window.matchMedia("(pointer: fine)"); mq.addEventListener("change", cb); return () => mq.removeEventListener("change", cb); },
    () => window.matchMedia("(pointer: fine)").matches,
    () => false
  );
  const enabled = finePointer && !reduced;
  const [mode, setMode] = useState<Mode>("dot");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Dot tracks 1:1; the halo follows on a critically damped spring.
  const hx = useSpring(x, { bounce: 0, duration: 0.45 });
  const hy = useSpring(y, { bounce: 0, duration: 0.45 });

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const el = (e.target as Element | null)?.closest?.("[data-cursor], a, button, [role=button], [role=tab]") as HTMLElement | null;
      if (!el) { setMode("dot"); return; }
      const tag = el.getAttribute("data-cursor");
      if (tag === "view") { setMode("lens"); return; }
      if (tag === "none") { setMode("dot"); return; }
      setMode("label");
      setLabel(tag ?? "");
    };
    const onLeave = () => setVisible(false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = mode === "lens" ? 96 : mode === "label" ? (label ? 64 : 40) : 30;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[20000]" style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms" }}>
      {/* Halo / lens */}
      <motion.div className="absolute top-0 left-0" style={{ x: hx, y: hy }}>
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center"
          animate={{
            width: size,
            height: size,
            backgroundColor: mode === "lens" ? "rgba(186, 230, 253, 0.55)" : mode === "label" ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0)",
            borderColor: mode === "dot" ? "rgba(120,120,120,0.55)" : "rgba(0,0,0,0)",
          }}
          transition={{ type: "spring", bounce: 0, duration: 0.35 }}
          style={{ borderWidth: 1, borderStyle: "dashed", mixBlendMode: mode === "dot" ? "difference" : "normal", backdropFilter: mode === "lens" ? "blur(2px)" : undefined }}
        >
          <AnimatePresence mode="wait">
            {mode === "lens" && (
              <motion.span key="plus" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Plus className="w-4 h-4 text-slate-800" strokeWidth={1.5} />
              </motion.span>
            )}
            {mode === "label" && label && (
              <motion.span
                key={label}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[11px] font-semibold tracking-[0.04em] text-slate-900"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      {/* Dot */}
      <motion.div className="absolute top-0 left-0" style={{ x, y }}>
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          animate={{ width: mode === "dot" ? 6 : 0, height: mode === "dot" ? 6 : 0 }}
          style={{ mixBlendMode: "difference" }}
        />
      </motion.div>
    </div>
  );
}
