"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Eye, FileText, Check, ArrowLeft, Package } from "lucide-react";
import { CVS, CV_BUNDLE, PROFILE } from "../../data/profile";
import { Modal } from "./Modal";

type Cv = (typeof CVS)[number];

/** Trigger a same-origin download without navigating. */
function download(href: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = href.split("/").pop() ?? "";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * CV chooser: one card per role (preview or download), multi-select with
 * "Download selected", and "Download all" as a single ZIP (browsers often
 * block several downloads at once; one archive avoids that).
 */
export function CvPicker({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [preview, setPreview] = useState<Cv | null>(null);

  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const chosen = CVS.filter((c) => selected.includes(c.id));

  const downloadSelected = () => {
    if (chosen.length === CVS.length) return download(CV_BUNDLE);
    // Space the downloads out a little so browsers treat them as separate files.
    chosen.forEach((c, i) => window.setTimeout(() => download(c.file), i * 450));
  };

  const close = () => { setPreview(null); onClose(); };

  return (
    <Modal open={open} onClose={close} title={preview ? `${preview.role} CV` : "Download CV"} size="lg">
      <AnimatePresence mode="wait" initial={false}>
        {preview ? (
          <motion.div key="preview" className="h-full flex flex-col" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-between gap-3 px-5 sm:px-7 py-3 border-b border-slate-100">
              <button className="btn btn-ghost btn-sm" onClick={() => setPreview(null)}><ArrowLeft className="w-4 h-4" /> All CVs</button>
              <button className="btn btn-primary btn-sm" onClick={() => download(preview.file)}><Download className="w-4 h-4" /> Download</button>
            </div>
            <iframe src={preview.file} title={`${PROFILE.name}, ${preview.role} CV`} className="flex-1 w-full min-h-[70dvh] bg-slate-100" />
          </motion.div>
        ) : (
          <motion.div key="list" className="px-5 sm:px-10 py-8 sm:py-10 space-y-8 max-w-3xl mx-auto" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
            <header className="space-y-2">
              <h2 className="display text-[2.4rem] sm:text-[2.9rem] leading-none text-slate-900">Choose a CV</h2>
              <p className="text-[15px] text-slate-600">Each one tailored to the role. Pick one, several, or all three.</p>
            </header>

            <ul className="space-y-3" role="group" aria-label="CVs">
              {CVS.map((c, i) => {
                const on = selected.includes(c.id);
                return (
                  <motion.li
                    key={c.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-colors"
                    style={{
                      background: on ? "color-mix(in srgb, var(--accent) 8%, #fff)" : "#fff",
                      boxShadow: on ? "inset 0 0 0 1.5px var(--accent)" : "inset 0 0 0 1px #e2e8f0",
                    }}
                  >
                    <label className="flex items-start gap-3.5 flex-1 min-w-0 cursor-pointer">
                      <input type="checkbox" checked={on} onChange={() => toggle(c.id)} className="sr-only" />
                      <span
                        aria-hidden
                        className="mt-0.5 w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors"
                        style={{ background: on ? "var(--accent-strong)" : "#fff", boxShadow: on ? "none" : "inset 0 0 0 1.5px #94a3b8" }}
                      >
                        {on && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-2 text-[16px] font-semibold text-slate-900">
                          <FileText className="w-4 h-4" style={{ color: "var(--accent-strong)" }} /> {c.role}
                        </span>
                        <span className="block mt-1 text-[14px] leading-5 text-slate-600">{c.focus}</span>
                      </span>
                    </label>
                    <div className="flex gap-2 sm:flex-shrink-0">
                      <button className="btn btn-ghost btn-sm" onClick={() => setPreview(c)}><Eye className="w-4 h-4" /> Preview</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => download(c.file)}><Download className="w-4 h-4" /> Download</button>
                    </div>
                  </motion.li>
                );
              })}
            </ul>

            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100">
              <button className="btn btn-primary mt-4" disabled={chosen.length === 0} onClick={downloadSelected}>
                <Download className="w-4 h-4" /> Download selected{chosen.length ? ` (${chosen.length})` : ""}
              </button>
              <button className="btn btn-secondary mt-4" onClick={() => download(CV_BUNDLE)}>
                <Package className="w-4 h-4" /> Download all (ZIP)
              </button>
              <button className="btn btn-ghost btn-sm mt-4 ml-auto" onClick={() => setSelected(selected.length === CVS.length ? [] : CVS.map((c) => c.id))}>
                {selected.length === CVS.length ? "Clear selection" : "Select all"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}

/** Drop-in replacement for every "Download CV" link: same look, opens the picker. */
export function CvButton({ className, children }: { className: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>{children}</button>
      <CvPicker open={open} onClose={() => setOpen(false)} />
    </>
  );
}
