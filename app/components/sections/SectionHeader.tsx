import React from "react";

/** Shared heading for every dashboard section: one title, one short lede. */
export function SectionHeader({ title, lede }: { title: string; lede?: string }) {
  return (
    <header className="space-y-3 max-w-2xl">
      <h2 className="display text-[2.75rem] sm:text-[3.5rem] text-slate-900 text-balance">{title}</h2>
      {lede && <p className="text-base sm:text-[17px] leading-relaxed text-slate-600 text-pretty">{lede}</p>}
    </header>
  );
}
