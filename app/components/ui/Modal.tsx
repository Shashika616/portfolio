"use client";

import React, { useEffect, useRef, ReactNode } from "react";
import { useIsClient } from "../../lib/client";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name; also shown in the header bar. */
  title: string;
  /** Optional element on the right of the header, before the close button. */
  headerAction?: ReactNode;
  children: ReactNode;
  size?: "md" | "lg";
}

/**
 * The one dialog used across the site (project, experience, certificate, CV,
 * media preview). Portals to <body>, locks page scroll, closes on Escape or
 * backdrop click, returns focus to the trigger, and marks its scroll pane with
 * `.modal-scroll-pane` so the dashboard's wheel/keyboard section navigation
 * stands down while it is open.
 *
 * Motion: critically damped spring (no overshoot) in, short fade out, both
 * anchored to the same path.
 */
export function Modal({ open, onClose, title, headerAction, children, size = "lg" }: ModalProps) {
  const mounted = useIsClient();
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const { style } = document.body;
    const prevOverflow = style.overflow;
    style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // Only the top-most dialog closes (a media preview can sit over a project).
      const dialogs = document.querySelectorAll('[role="dialog"]');
      if (dialogs[dialogs.length - 1] !== panelRef.current) return;
      onClose();
    };
    document.addEventListener("keydown", onKey);
    // Move focus into the dialog after it mounts.
    const t = window.setTimeout(() => panelRef.current?.focus(), 30);

    return () => {
      style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      returnFocus.current?.focus?.();
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center sm:p-6 isolate">
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-[6px]"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={{ opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.99, transition: { duration: 0.16, ease: "easeIn" } }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className={`relative w-full ${size === "lg" ? "sm:max-w-4xl" : "sm:max-w-2xl"} h-[92dvh] sm:h-[86dvh] bg-white rounded-t-3xl sm:rounded-2xl shadow-[0_30px_80px_rgba(15,23,42,0.25)] ring-1 ring-slate-900/5 flex flex-col overflow-hidden outline-none`}
          >
            <div className="flex items-center justify-between gap-3 pl-5 sm:pl-7 pr-2 sm:pr-3 h-14 border-b border-slate-100 flex-shrink-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{title}</p>
              <div className="flex items-center gap-1 flex-shrink-0">
                {headerAction}
                <button onClick={onClose} className="btn btn-close btn-icon btn-sm" aria-label="Close" data-cursor="Close">
                  <X className="w-[18px] h-[18px]" strokeWidth={2} />
                </button>
              </div>
            </div>
            <div className="modal-scroll-pane flex-1 overflow-y-auto overscroll-contain select-text">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
