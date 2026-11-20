"use client";

import { CvButton } from "../ui/CvPicker";
import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Download } from "lucide-react";
import { PROFILE, SKILLS, EDUCATION } from "../../data/profile";
import type { CertificateItem } from "../../data/types";
import { GithubIcon, LinkedinIcon } from "../ui/BrandIcons";

const EASE = [0.16, 1, 0.3, 1] as const;

function Col({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className="space-y-4"
    >
      <h3 className="text-[12px] tracking-[0.16em] uppercase text-white/45 pb-3 border-b border-white/15">{title}</h3>
      {children}
    </motion.section>
  );
}

/**
 * The back cover: who, where from, what with, credentials, and how to reach
 * me, set like a magazine colophon on a dark page.
 */
export function Colophon({ certificates, onCert }: { certificates: CertificateItem[]; onCert: (c: CertificateItem) => void }) {
  return (
    <section id="colophon" className="bg-[#141416] text-white px-5 sm:px-10 lg:-mr-14 lg:pr-24 pt-20 sm:pt-28 pb-16 scroll-mt-20">
      {/* Full bleed: lg:-mr-14 cancels the page's right gutter so the dark page reaches the edge. */}
      <motion.a
        href={`mailto:${PROFILE.email}`}
        className="group block w-fit"
        data-cursor="Write"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: EASE }}
      >
        <span className="display italic text-[clamp(3rem,10vw,8rem)] leading-[0.9] block">Write to me</span>
        <span className="mt-3 inline-flex items-center gap-2 text-lg text-white/70 group-hover:text-white transition-colors break-all">
          {PROFILE.email} <ArrowUpRight className="w-5 h-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </motion.a>

      <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <Col title="About">
          {PROFILE.about.map((t) => <p key={t.slice(0, 16)} className="text-[14px] leading-6 text-white/75 text-pretty">{t}</p>)}
        </Col>
        <Col title="Education" delay={0.08}>
          {EDUCATION.map((e) => (
            <div key={e.school}>
              <p className="text-[15px] font-medium">{e.school}</p>
              <p className="text-[14px] text-white/70">{e.degree}</p>
              <p className="text-[12px] text-white/45 tabular">{e.year}{e.grade ? ` · ${e.grade}` : ""}</p>
            </div>
          ))}
        </Col>
        <Col title="Toolbox" delay={0.16}>
          {SKILLS.map((g) => (
            <p key={g.group} className="text-[13px] leading-6">
              <span className="text-white/45">{g.group}: </span>
              <span className="text-white/85">{g.items.join(", ")}</span>
            </p>
          ))}
        </Col>
        <Col title="Credentials" delay={0.24}>
          <ul className="space-y-2">
            {certificates.map((c) => (
              <li key={c.name}>
                <button onClick={() => onCert(c)} className="group text-left text-[14px] leading-snug text-white/85 hover:text-white">
                  {c.name}
                  <span className="block text-[12px] text-white/45">{c.issuer} · {c.date}</span>
                </button>
              </li>
            ))}
          </ul>
        </Col>
      </div>

      <div className="mt-16 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2.5">
          <CvButton className="btn btn-sm bg-white text-slate-900 hover:bg-white/90"><Download className="w-4 h-4" /> CV</CvButton>
          <a href={PROFILE.links.github} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-github ring-1 ring-white/20"><GithubIcon className="w-4 h-4" /> GitHub</a>
          <a href={PROFILE.links.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-linkedin"><LinkedinIcon className="w-4 h-4" /> LinkedIn</a>
        </div>
        <p className="text-[12px] text-white/40">© {new Date().getFullYear()} {PROFILE.name} · {PROFILE.location}</p>
      </div>
    </section>
  );
}
