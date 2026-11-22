import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ARTICLES } from "../data/writing";
import { PROFILE } from "../data/profile";
import { WritingBar } from "./WritingBar";

export const metadata: Metadata = {
  title: "Writing | Shashika Fernando",
  description: "Engineering write-ups by Shashika Fernando: architecture decisions, production numbers and the trade-offs behind them.",
  alternates: { canonical: "/writing" },
};

const date = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default function WritingIndex() {
  return (
    <main className="min-h-dvh bg-white">
      <WritingBar />
      <div className="max-w-3xl mx-auto px-4 sm:px-8 pt-32 pb-24">
        <h1 className="display text-[3rem] sm:text-[4.2rem] leading-none text-slate-900">Writing</h1>
        <p className="mt-4 text-[17px] leading-7 text-slate-600 max-w-xl text-pretty">
          How the systems on this site were built: the decisions, the numbers and the trade-offs. By {PROFILE.name}.
        </p>
        <ol className="mt-14 border-t border-slate-900/10">
          {ARTICLES.map((a) => (
            <li key={a.slug} className="border-b border-slate-900/10">
              <Link href={`/writing/${a.slug}`} className="group block py-8">
                <p className="font-mono text-[12px] tabular text-slate-500">{date(a.published)} · {a.readMinutes} min read</p>
                <h2 className="display mt-2 text-[1.9rem] sm:text-[2.3rem] leading-tight text-slate-900 transition-transform duration-500 group-hover:translate-x-1.5">{a.title}</h2>
                <p className="mt-3 text-[15px] leading-6 text-slate-600 text-pretty">{a.dek}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold" style={{ color: "var(--accent-strong)" }}>
                  Read <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
