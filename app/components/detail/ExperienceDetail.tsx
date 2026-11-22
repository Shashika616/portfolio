"use client";

import React from "react";
import { MapPin, Calendar } from "lucide-react";
import type { ExperienceItem } from "../../data/types";
import { Block, List } from "./ProjectDetail";
import { MediaGallery } from "../ui/MediaGallery";

/** Role detail: impact first (achievements), then responsibilities, challenges, stack. */
export function ExperienceDetail({ item }: { item: ExperienceItem }) {
  return (
    <article className="px-5 sm:px-10 py-8 sm:py-10 space-y-10 max-w-3xl mx-auto">
      <header className="space-y-4">
        {item.type && <span className="badge badge-neutral">{item.type}</span>}
        <div>
          <h2 className="display text-[2.1rem] sm:text-[2.75rem] text-slate-900">{item.title}</h2>
          <p className="text-lg text-slate-700 mt-1">{item.company}</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1.5"><Calendar className="w-4 h-4" />{item.duration}</span>
          {item.location && <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" />{item.location}</span>}
        </div>
        <p className="text-base sm:text-lg leading-relaxed text-slate-600 text-pretty">{item.description}</p>
      </header>

      {item.highlights?.length ? (
        <dl className={`grid grid-cols-1 gap-px bg-slate-200/70 rounded-xl overflow-hidden ring-1 ring-slate-200/70 ${item.highlights.length === 1 ? "sm:max-w-xs" : item.highlights.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
          {item.highlights.map((h) => (
            <div key={h.label} className="bg-white px-4 py-4">
              <dt className="sr-only">{h.label}</dt>
              <dd className="display text-[2rem] leading-none tabular" style={{ color: "var(--accent-strong)" }}>{h.value}</dd>
              <dd className="mt-2 text-[13px] leading-5 text-slate-600">{h.label}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      <Block title="Impact"><List items={item.achievements} accent /></Block>
      <Block title="Responsibilities"><List items={item.responsibilities} /></Block>
      <Block title="Challenges"><List items={item.challenges} /></Block>
      <Block title="Stack">
        <ul className="flex flex-wrap gap-1.5">{item.tech.map((t) => <li key={t} className="tag">{t}</li>)}</ul>
      </Block>
      {item.mediaGroups?.length ? (
        <Block title="Media"><MediaGallery groups={item.mediaGroups} alt={`${item.title} at ${item.company}`} /></Block>
      ) : null}
    </article>
  );
}
