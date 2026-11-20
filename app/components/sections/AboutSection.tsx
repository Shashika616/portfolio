"use client";

import React, { useState } from "react";
import { MapPin, FileText } from "lucide-react";
import { PROFILE, SKILLS } from "../../data/profile";
import { CvPicker } from "../ui/CvPicker";
import { GithubIcon, LinkedinIcon } from "../ui/BrandIcons";
import { SectionHeader } from "./SectionHeader";

export function AboutSection() {
  const [cvOpen, setCvOpen] = useState(false);

  return (
    <div className="section-body space-y-12">
      <SectionHeader title="About" />

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PROFILE.portrait}
          alt={`Portrait of ${PROFILE.name}`}
          // The site's "machined plate" shape, as on the profile cover.
          style={{ clipPath: "polygon(9% 0%, 100% 0%, 100% 92%, 91% 100%, 0% 100%, 0% 8%)" }}
          className="w-40 h-40 md:w-52 md:h-52 object-cover flex-shrink-0"
        />
        <div className="space-y-4 max-w-2xl">
          {PROFILE.about.map((p) => (
            <p key={p.slice(0, 24)} className="text-[17px] leading-8 text-slate-700 text-pretty">{p}</p>
          ))}
          <p className="flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="w-4 h-4" /> {PROFILE.location}
          </p>
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button className="btn btn-primary" onClick={() => setCvOpen(true)}>
              <FileText className="w-4 h-4" /> View CV
            </button>
            <a className="btn btn-github btn-icon" href={PROFILE.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
              <GithubIcon className="w-[18px] h-[18px]" />
            </a>
            <a className="btn btn-linkedin btn-icon" href={PROFILE.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
              <LinkedinIcon className="w-[18px] h-[18px]" />
            </a>
          </div>
        </div>
      </div>

      <section className="space-y-5" aria-labelledby="skills-heading">
        <h3 id="skills-heading" className="text-[12px] tracking-[0.14em] uppercase text-slate-500">Toolbox</h3>
        <dl className="divide-y divide-slate-900/10 border-y border-slate-900/10">
          {SKILLS.map((s) => (
            <div key={s.group} className="grid sm:grid-cols-[180px_1fr] gap-2 sm:gap-6 py-4">
              <dt className="display text-[1.35rem] leading-tight text-slate-900">{s.group}</dt>
              <dd className="flex flex-wrap gap-1.5">
                {s.items.map((i) => <span key={i} className="tag">{i}</span>)}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="grid md:grid-cols-2 border-t border-slate-900/10" aria-label="How I work">
        <div className="space-y-2 py-5 md:pr-8 border-b border-slate-900/10">
          <h3 className="display text-[1.6rem] leading-tight text-slate-900">Interfaces that feel considered</h3>
          <p className="text-sm leading-6 text-slate-600 text-pretty">
            I enjoy building immersive, interactive experiences on top of solid engineering: from expressive web interfaces to full-stack apps that balance function, performance and user experience.
          </p>
        </div>
        <div className="space-y-2 py-5 md:pl-8 md:border-l border-b border-slate-900/10">
          <h3 className="display text-[1.6rem] leading-tight text-slate-900">How I work</h3>
          <p className="text-sm leading-6 text-slate-600 text-pretty">
            Problem-solving, critical thinking and continuous learning. I work well alone and in teams, and I focus on turning complex ideas into practical, scalable software.
          </p>
        </div>
      </section>

      <CvPicker open={cvOpen} onClose={() => setCvOpen(false)} />
    </div>
  );
}
