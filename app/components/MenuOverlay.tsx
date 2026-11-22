"use client";

import React, { useEffect, useState } from "react";
import { CvPicker } from "./ui/CvPicker";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { PROFILE } from "../data/profile";
import { THEMES, useGlobalTheme } from "../context/ThemeContext";
import { useRouter } from "next/navigation";
import { goToDial } from "../lib/navigation";

/**
 * Full-screen menu: large serif destinations that rise out of a blur in
 * sequence, plus the theme palettes. Closes on Escape or after navigating.
 */
export function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { activeTheme, setThemeById } = useGlobalTheme();
  const router = useRouter();
  const [cvOpen, setCvOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const items: { label: string; note: string; href?: string; onClick?: () => void; external?: boolean; download?: boolean }[] = [
    { label: "The Dial", note: "Interactive", onClick: () => { onClose(); goToDial(router.push); } },
    { label: "Gallery", note: "Every system", href: "/gallery" },
    { label: "Profile", note: "The quick read", href: "/profile" },
    { label: "Writing", note: "How it was built", href: "/writing" },
    { label: "Contact", note: "Email", href: `mailto:${PROFILE.email}`, external: true },
    { label: "CV", note: "Four versions", onClick: () => setCvOpen(true) },
  ];

  return (
    <>
    <CvPicker open={cvOpen} onClose={() => setCvOpen(false)} />
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9500] bg-[#111113] text-white flex flex-col"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="h-14 px-4 sm:px-6 flex items-center justify-between">
            <span className="text-sm text-white/60">{PROFILE.name}</span>
            <button onClick={onClose} className="btn btn-close btn-sm" data-cursor="Close">
              Close <X className="w-4 h-4" />
            </button>
          </div>
          <nav className="flex-1 flex flex-col justify-center px-6 sm:px-16 gap-1">
            {items.map((it, i) => {
              const inner = (
                <>
                  <span className="display text-[clamp(2.8rem,9vw,6.5rem)] leading-[0.95] group-hover:italic transition-[font-style]">{it.label}</span>
                  <span className="text-xs tracking-[0.16em] uppercase text-white/40 group-hover:text-white/80 transition-colors">{it.note}</span>
                </>
              );
              const cls = "group flex items-baseline gap-5 w-fit";
              return (
                <motion.div
                  key={it.label}
                  initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  {it.href ? (
                    it.href.startsWith("/") && !it.download ? (
                      <Link href={it.href} className={cls} onClick={onClose}>{inner}</Link>
                    ) : (
                      <a href={it.href} className={cls} download={it.download} target={it.external ? "_blank" : undefined} rel={it.external ? "noopener noreferrer" : undefined}>{inner}</a>
                    )
                  ) : (
                    <button type="button" className={cls} onClick={it.onClick}>{inner}</button>
                  )}
                </motion.div>
              );
            })}
          </nav>
          <motion.div
            className="px-6 sm:px-16 pb-8 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.7 } }}
          >
            <span className="text-xs tracking-[0.16em] uppercase text-white/40 mr-2">Palette</span>
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setThemeById(t.id)}
                aria-label={`${t.name} theme`}
                aria-pressed={activeTheme.id === t.id}
                className={`w-7 h-7 rounded-full transition-transform ${activeTheme.id === t.id ? "ring-2 ring-white ring-offset-2 ring-offset-[#111113] scale-110" : "opacity-70 hover:opacity-100"}`}
                style={{ backgroundImage: t.gradient }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
