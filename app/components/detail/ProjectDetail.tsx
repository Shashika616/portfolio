"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import type { ProjectItem } from "../../data/types";
import { MediaGallery } from "../ui/MediaGallery";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { EngineeringNotes } from "./EngineeringNotes";
import { SequenceDiagram } from "./SequenceDiagram";
import { ThreatModel } from "./ThreatModel";
import { SecurityModelView } from "./SecurityModelView";
import { LowLevelDesignView } from "./LowLevelDesignView";
import { SmartImage } from "../ui/SmartImage";
import { GithubIcon } from "../ui/BrandIcons";

/**
 * Case-study layout for a project: summary and links first (what a recruiter
 * needs in ten seconds), then problem → requirements → solution → features →
 * highlights → architecture → media.
 */
export function ProjectDetail({ project }: { project: ProjectItem }) {
  return (
    <article className="px-5 sm:px-10 py-8 sm:py-10 space-y-10 max-w-3xl mx-auto">
      {project.cover && (
        <SmartImage src={project.cover} alt={project.name} loading="eager" className="w-full aspect-[16/9] rounded-xl ring-1 ring-slate-200" imgClassName="object-cover object-top" />
      )}
      <header className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge badge-neutral">{project.category}</span>
          {project.year && <span className="text-xs text-slate-500 tabular">{project.year}</span>}
        </div>
        <h2 className="display text-[2.1rem] sm:text-[2.75rem] text-slate-900 text-balance">
          {project.name}
        </h2>
        <p className="text-base sm:text-lg leading-relaxed text-slate-600 text-pretty">{project.introduction}</p>
        {(project.playLink || project.githubLink) && (
          <div className="flex flex-wrap gap-2.5 pt-1">
            {project.playLink && (
              <a href={project.playLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Open live <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-github">
                <GithubIcon className="w-4 h-4" /> Source code
              </a>
            )}
          </div>
        )}
        <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
          {project.tech.map((t) => <li key={t} className="tag">{t}</li>)}
        </ul>
      </header>

      <Block title="Problem">
        <p className="text-[15px] leading-7 text-slate-700 text-pretty">{project.problemStatement}</p>
      </Block>

      <Block title="Requirements">
        <List items={project.requirements} />
      </Block>

      <Block title="Solution">
        <p className="text-[15px] leading-7 text-slate-700 text-pretty">{project.solution}</p>
      </Block>

      {project.coreFeatures?.length ? (
        <Block title="Core features"><List items={project.coreFeatures} /></Block>
      ) : null}

      {project.technicalHighlights?.length ? (
        <Block title="Engineering highlights"><List items={project.technicalHighlights} accent /></Block>
      ) : null}

      {project.searchVisibility?.length ? (
        <Block title="Search and AI visibility (SEO / GEO)"><List items={project.searchVisibility} accent /></Block>
      ) : null}

      {project.engineering ? (
        <Block title="Engineering">
          <EngineeringNotes notes={project.engineering} />
        </Block>
      ) : null}

      <Block title="Architecture">
        {project.architectureDiagram && <ArchitectureDiagram diagram={project.architectureDiagram} title={project.name} />}
        <p className="text-[15px] leading-7 text-slate-700 text-pretty">{project.architecture}</p>
      </Block>

      {project.sequence ? (
        <Block title="Request flow">
          <SequenceDiagram flow={project.sequence} />
        </Block>
      ) : null}

      {project.security ? (
        <Block title="Threat model (STRIDE)">
          <SecurityModelView model={project.security} />
        </Block>
      ) : project.threats?.length ? (
        <Block title="Threat model">
          <ThreatModel threats={project.threats} />
        </Block>
      ) : null}

      {project.lowLevel ? (
        <Block title="Low-level design">
          <LowLevelDesignView design={project.lowLevel} />
        </Block>
      ) : null}

      {project.mediaGroups?.length ? (
        <Block title="Diagrams and screens">
          <MediaGallery groups={project.mediaGroups} alt={project.name} />
        </Block>
      ) : null}
    </article>
  );
}

export function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      {/* Bold, clear subtitle marked with the site's dial tick. */}
      <h3 className="flex items-center gap-3 text-[19px] sm:text-[21px] font-bold tracking-[-0.01em] text-slate-900">
        <span aria-hidden className="w-4 h-[3px] rounded-full flex-shrink-0" style={{ background: "var(--accent)" }} />
        {title}
      </h3>
      {children}
    </section>
  );
}

/** Bulleted list whose markers are dial ticks; accented lists use the theme colour. */
export function List({ items, accent = false }: { items: readonly string[]; accent?: boolean }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3.5 text-[15px] leading-7 text-slate-700">
          <span
            aria-hidden
            className="mt-[13px] flex-shrink-0 h-[2px]"
            style={{ width: accent ? 14 : 10, background: accent ? "var(--accent)" : "#94a3b8" }}
          />
          <span className="text-pretty">{item}</span>
        </li>
      ))}
    </ul>
  );
}
