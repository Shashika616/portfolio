"use client";

import React, { useState } from "react";
import { Mail, Copy, Check, ArrowUpRight, Download } from "lucide-react";
import { Section } from "../../types";
import { PROFILE } from "../../data/profile";
import { GithubIcon, LinkedinIcon } from "../ui/BrandIcons";
import { SectionHeader } from "./SectionHeader";

export function ContactSection({ sec }: { sec: Section }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  return (
    <div className="section-body space-y-10">
      <SectionHeader
        title={sec.title}
        lede="Hiring, collaborating, or curious about one of these projects? Email is the fastest way to reach me."
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5">
        <p className="text-xl sm:text-2xl font-semibold tracking-[-0.015em] text-slate-900 break-all">{PROFILE.email}</p>
        <div className="flex flex-wrap gap-2.5">
          <a href={`mailto:${PROFILE.email}`} className="btn btn-primary">
            <Mail className="w-4 h-4" /> Email me
          </a>
          <button onClick={copy} className="btn btn-secondary" aria-live="polite">
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy address"}
          </button>
          <a href={PROFILE.cv} download className="btn btn-ghost">
            <Download className="w-4 h-4" /> CV
          </a>
        </div>
      </div>

      <ul className="grid sm:grid-cols-2 gap-3">
        {[
          { href: PROFILE.links.linkedin, label: "LinkedIn", note: "Professional profile", Icon: LinkedinIcon, brand: "#0a66c2" },
          { href: PROFILE.links.github, label: "GitHub", note: "Source for public projects", Icon: GithubIcon, brand: "#181717" },
        ].map(({ href, label, note, Icon, brand }) => (
          <li key={label}>
            <a href={href} target="_blank" rel="noopener noreferrer" className="accent-card group flex items-center gap-4 rounded-2xl border bg-white p-5">
              <span className="w-11 h-11 rounded-xl text-white flex items-center justify-center flex-shrink-0 shadow-sm" style={{ background: brand }}>
                <Icon className="w-5 h-5" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[15px] font-semibold text-slate-900">{label}</span>
                <span className="block text-sm text-slate-500 truncate">{note}</span>
              </span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
