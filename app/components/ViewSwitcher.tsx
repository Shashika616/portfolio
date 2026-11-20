"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LayoutGrid, Rows3 } from "lucide-react";
import { handOffGalleryMode, requestScrollToWork } from "../lib/navigation";

export type WorkView = "collage" | "grid" | "feed";

const OPTIONS: { id: WorkView; label: string; Icon: typeof LayoutGrid }[] = [
  { id: "collage", label: "Collage", Icon: LayoutDashboard },
  { id: "grid", label: "Grid", Icon: LayoutGrid },
  { id: "feed", label: "Feed", Icon: Rows3 },
];

/**
 * Segmented switch between the three ways to browse the work. Each option
 * has its own icon; the selected one sits on a sliding pill and shows its
 * label (desktop). Collage/Grid live on /gallery, Feed on /profile; switching
 * across pages hands the choice over in memory (see viewGate).
 */
export function ViewSwitcher({ active, onLocal }: { active: WorkView; onLocal?: (v: WorkView) => void }) {
  const router = useRouter();

  const choose = (v: WorkView) => {
    if (v === active) return;
    const onGallery = active !== "feed";
    if (v === "feed") {
      requestScrollToWork();
      router.push("/profile");
    } else if (onGallery) {
      onLocal?.(v);
    } else {
      handOffGalleryMode(v);
      router.push("/gallery");
    }
  };

  return (
    <div role="radiogroup" aria-label="Browse the work as" className="relative flex items-center gap-0.5">
      {OPTIONS.map(({ id, label, Icon }) => {
        const on = id === active;
        return (
          <button
            key={id}
            role="radio"
            aria-checked={on}
            aria-label={label}
            onClick={() => choose(id)}
            data-cursor={label}
            className={`relative h-9 px-2.5 sm:px-3 rounded-[10px] inline-flex items-center gap-1.5 text-[14px] transition-opacity ${on ? "" : "opacity-60 hover:opacity-100"}`}
          >
            {on && (
              <motion.span
                layoutId="view-switcher-pill"
                className="absolute inset-0 rounded-[10px]"
                // Tint from the text colour (works on dark and light glass); not opacity,
                // because shared-layout animation writes opacity inline.
                style={{ backgroundColor: "color-mix(in srgb, currentColor 16%, transparent)" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              />
            )}
            <Icon className="relative w-4 h-4" strokeWidth={1.75} />
            {on && <span className="relative hidden sm:inline">{label}</span>}
          </button>
        );
      })}
    </div>
  );
}
