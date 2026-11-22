"use client";

import Link from "next/link";
import { Gauge, Newspaper } from "lucide-react";

/**
 * Two-way view switch on the dial page: the current view (Dial) and the
 * other one (Profile). Same glass and pill language as ViewSwitcher on
 * /gallery and /profile, so switching views looks the same everywhere.
 */
export function DialViewToggle() {
  const item = "h-9 px-3 rounded-[10px] inline-flex items-center gap-1.5 text-[14px] font-medium";
  return (
    <div role="group" aria-label="View" className="glass-bar glass-bar--light rounded-[14px] p-1 inline-flex items-center gap-0.5">
      <span
        aria-current="page"
        className={item}
        style={{ backgroundColor: "color-mix(in srgb, var(--accent) 14%, transparent)", color: "var(--accent-strong)" }}
      >
        <Gauge className="w-4 h-4" strokeWidth={1.75} /> Dial
      </span>
      <Link
        href="/profile"
        data-cursor="Profile"
        className={`${item} text-slate-700 hover:text-slate-900 hover:bg-slate-900/5 transition-colors`}
      >
        <Newspaper className="w-4 h-4" strokeWidth={1.75} /> Profile
      </Link>
    </div>
  );
}
