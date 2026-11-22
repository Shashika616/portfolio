import type { Metadata } from "next";
import { ARTICLES } from "../data/writing";
import { PROFILE } from "../data/profile";
import { WritingBar } from "./WritingBar";
import { WritingGrid } from "./WritingGrid";

export const metadata: Metadata = {
  title: "Writing | Shashika Fernando",
  description: "Engineering write-ups by Shashika Fernando: architecture decisions, production numbers and the trade-offs behind them.",
  alternates: { canonical: "/writing" },
};

export default function WritingIndex() {
  return (
    <main className="min-h-dvh bg-[var(--background)]">
      <WritingBar />
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-32 pb-24">
        <header className="max-w-2xl mb-10">
          <p className="font-mono text-[12px] tracking-[0.14em] uppercase text-slate-500">The engineering journal</p>
          <h1 className="display mt-3 text-[3.2rem] sm:text-[4.6rem] leading-[0.95] text-slate-900">Writing</h1>
          <p className="mt-4 text-[17px] leading-7 text-slate-600 text-pretty">
            How the systems on this site were built: the decisions, the numbers and the trade-offs. By {PROFILE.name}.
          </p>
        </header>
        <WritingGrid articles={ARTICLES} />
      </div>
    </main>
  );
}
