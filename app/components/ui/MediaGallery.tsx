"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, Play } from "lucide-react";
import type { MediaGroup, MediaItem } from "../../data/types";
import { Modal } from "./Modal";
import { SmartImage } from "./SmartImage";

const isVideo = (url: string) => /\.(mp4|webm|ogg|mov)$/i.test(url);

/** One captioned carousel per media group, with a full-size preview dialog. */
export function MediaGallery({ groups, alt }: { groups: MediaGroup[]; alt: string }) {
  const [preview, setPreview] = useState<MediaItem | null>(null);

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <GroupCarousel key={group.groupTitle} group={group} alt={alt} onExpand={setPreview} />
      ))}

      <Modal open={!!preview} onClose={() => setPreview(null)} title={preview?.label ?? "Preview"} size="lg">
        {preview && (
          <div className="h-full flex items-center justify-center bg-slate-50 p-3 sm:p-6">
            {isVideo(preview.url) ? (
              <video src={preview.url} className="max-w-full max-h-full rounded-lg" controls autoPlay playsInline />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview.url} alt={`${alt}: ${preview.label}`} className="max-w-full max-h-full object-contain rounded-lg" />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function GroupCarousel({ group, alt, onExpand }: { group: MediaGroup; alt: string; onExpand: (m: MediaItem) => void }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const item = group.items[index];
  const many = group.items.length > 1;

  const go = (next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex((next + group.items.length) % group.items.length);
  };

  return (
    <figure className="space-y-3">
      <figcaption className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-slate-900">{group.groupTitle}</span>
        {many && (
          <span className="text-xs text-slate-500 tabular">
            {index + 1} / {group.items.length}
          </span>
        )}
      </figcaption>

      <div className="relative rounded-xl overflow-hidden bg-slate-50 ring-1 ring-slate-200">
        <div className="relative aspect-video">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.button
              key={item.url}
              type="button"
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              onClick={() => onExpand(item)}
              className="absolute inset-0 w-full h-full cursor-zoom-in group"
              aria-label={`Open ${item.label} full size`}
            >
              {isVideo(item.url) ? (
                <>
                  <video src={item.url} className="w-full h-full object-contain" muted playsInline preload="metadata" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-14 h-14 rounded-full bg-white/90 shadow-lg flex items-center justify-center">
                      <Play className="w-6 h-6 text-slate-900 ml-0.5" fill="currentColor" />
                    </span>
                  </span>
                </>
              ) : (
                <SmartImage src={item.url} alt={`${alt}: ${item.label}`} className="w-full h-full" imgClassName="object-contain" />
              )}
              <span className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/90 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4 text-slate-700" />
              </span>
            </motion.button>
          </AnimatePresence>

          {many && (
            <>
              <button type="button" onClick={() => go(index - 1)} aria-label="Previous image" className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md ring-1 ring-slate-900/5 flex items-center justify-center text-slate-800 hover:bg-white active:scale-95 transition z-10">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button type="button" onClick={() => go(index + 1)} aria-label="Next image" className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md ring-1 ring-slate-900/5 flex items-center justify-center text-slate-800 hover:bg-white active:scale-95 transition z-10">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-slate-600 truncate">{item.label}</span>
        {many && (
          <div className="flex items-center gap-1.5" role="tablist" aria-label={`${group.groupTitle} images`}>
            {group.items.map((m, i) => (
              <button
                key={m.url + i}
                role="tab"
                aria-selected={i === index}
                aria-label={`Show image ${i + 1}`}
                onClick={() => go(i)}
                className="h-1.5 rounded-full transition-all"
                style={{ width: i === index ? 18 : 6, background: i === index ? "var(--accent)" : "#cbd5e1" }}
              />
            ))}
          </div>
        )}
      </div>
    </figure>
  );
}
