"use client";

import { CvButton } from "../ui/CvPicker";
import React, { useState } from "react";
import { motion } from "framer-motion";
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

      {/* The back page, as on the profile: dark, with a large serif invitation. */}
      <motion.div
        className="rounded-3xl bg-[#141416] text-white p-7 sm:p-10 space-y-7"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <a href={`mailto:${PROFILE.email}`} className="group block w-fit" data-cursor="Write">
          <span className="display italic block text-[3rem] sm:text-[4.4rem] leading-[0.9]">Write to me</span>
          <span className="mt-3 inline-flex items-center gap-2 text-lg text-white/70 group-hover:text-white transition-colors break-all">
            {PROFILE.email} <ArrowUpRight className="w-5 h-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </a>
        <div className="flex flex-wrap gap-2.5 pt-2 border-t border-white/15">
          <a href={`mailto:${PROFILE.email}`} className="btn btn-primary mt-5">
            <Mail className="w-4 h-4" /> Email me
          </a>
          <button onClick={copy} className="btn mt-5 bg-white/10 text-white border-white/20 hover:bg-white/20" aria-live="polite">
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy address"}
          </button>
          <CvButton className="btn mt-5 bg-white text-slate-900 hover:bg-white/90">
            <Download className="w-4 h-4" /> CV
          </CvButton>
        </div>
      </motion.div>

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
