"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import type { ProjectItem, CertificateItem } from "../../data/types";
import { SmartImage } from "./SmartImage";

const MAX_TAGS = 4;

/*
 * Cards are <article>s with one real action. The action button stretches over
 * the whole card (after:inset-0), so the full surface is clickable while the
 * markup stays valid and screen readers hear a short, specific label.
 */

export function ProjectCard({ project, onOpen }: { project: ProjectItem; onOpen: () => void }) {
  const extra = project.tech.length - MAX_TAGS;
  return (
    <article className="accent-card group relative w-full bg-white rounded-2xl border overflow-hidden flex flex-col">
      {project.cover && (
        <div className="aspect-[16/9] overflow-hidden bg-slate-100 border-b border-slate-100">
          <SmartImage src={project.cover} alt="" className="w-full h-full" imgClassName="object-cover object-top group-hover:scale-[1.04]" />
        </div>
      )}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500">{project.category}</span>
        </div>
        <h3 className="display text-[1.6rem] leading-[1.05] text-slate-900 text-balance">{project.name}</h3>
        {(project.summary ?? project.introduction) && (
          <p className="text-sm leading-6 text-slate-600 line-clamp-3 text-pretty">{project.summary ?? project.introduction}</p>
        )}
        <ul className="flex flex-wrap gap-1.5 mt-auto pt-1" aria-label="Tech stack">
          {project.tech.slice(0, MAX_TAGS).map((t) => <li key={t} className="tag">{t}</li>)}
          {extra > 0 && <li className="tag">+{extra}</li>}
        </ul>
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Read case study: ${project.name}`}
          className="self-start inline-flex items-center gap-1.5 text-sm font-semibold pt-1 cursor-pointer after:absolute after:inset-0 after:content-['']"
          style={{ color: "var(--accent-strong)" }}
        >
          Read case study
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
    </article>
  );
}

export function CertificateCard({ cert, onOpen }: { cert: CertificateItem; onOpen: () => void }) {
  return (
    <article className="accent-card group relative w-full bg-white rounded-2xl border p-4 flex gap-4 items-center">
      {cert.imageUrl && (
        <div className="w-20 h-16 sm:w-24 sm:h-[72px] flex-shrink-0 rounded-lg overflow-hidden bg-slate-50 ring-1 ring-slate-200">
          <SmartImage src={cert.imageUrl} alt="" className="w-full h-full" imgClassName="object-cover" />
        </div>
      )}
      <div className="min-w-0 flex-1 space-y-1">
        <h3 className="text-[15px] font-semibold leading-snug text-slate-900 text-balance">
          <button type="button" onClick={onOpen} className="text-left cursor-pointer after:absolute after:inset-0 after:content-['']">
            {cert.name}
          </button>
        </h3>
        <p className="text-sm text-slate-500">
          {cert.issuer} <span className="text-slate-300">·</span> <span className="tabular">{cert.date}</span>
        </p>
      </div>
      <ArrowRight aria-hidden className="w-4 h-4 flex-shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
    </article>
  );
}
