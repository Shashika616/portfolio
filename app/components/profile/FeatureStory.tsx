"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import type { ProjectItem } from "../../data/types";
import { SmartImage } from "../ui/SmartImage";
import { GithubIcon } from "../ui/BrandIcons";
import { WordsReveal } from "../ui/WordsReveal";

const EASE = [0.16, 1, 0.3, 1] as const;
const imageOf = (p: ProjectItem) =>
  p.cover ?? p.mediaGroups?.flatMap((g) => g.items).find((m) => !/\.(mp4|webm|ogg|mov)$/i.test(m.url))?.url ?? "";

/**
 * One featured project as a magazine spread. The print wipes open from its
 * spine as it enters and drifts on scroll (parallax); the headline resolves
 * word by word; a pull quote comes from the project's real engineering
 * highlights. Spreads alternate sides.
 */
export function FeatureStory({ project, index, onOpen }: { project: ProjectItem; index: number; onOpen: (p: ProjectItem) => void }) {
  const ref = useRef<HTMLElement>(null);
  // Trigger from the spread, not the clipped print: a fully clipped element never reports as in view.
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const flip = index % 2 === 1;
  const photo = (project.cover ?? "").startsWith("/work/");
  const quote = project.pullQuote ?? project.summary;
  const title = project.name.split(" - ")[0];

  return (
    <article ref={ref} className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center py-14 sm:py-20 border-t border-slate-900/10">
      <motion.button
        type="button"
        onClick={() => onOpen(project)}
        data-cursor="view"
        aria-label={`Open ${title} case study`}
        className={`relative block w-full lg:col-span-7 aspect-[4/3] overflow-hidden ${photo ? "bg-slate-200" : "bg-white ring-1 ring-slate-200"} ${flip ? "lg:order-2" : ""}`}
        initial={{ clipPath: flip ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }}
        animate={inView ? { clipPath: "inset(0 0% 0 0%)" } : undefined}
        transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
      >
        <motion.div className="absolute inset-x-0 -inset-y-[8%]" style={{ y: imgY }}>
          <SmartImage src={imageOf(project)} alt="" className={`w-full h-full ${photo ? "" : "p-6"}`} imgClassName={photo ? "object-cover object-top" : "object-contain"} />
        </motion.div>
      </motion.button>

      <div className={`lg:col-span-5 space-y-6 ${flip ? "lg:order-1" : ""}`}>
        <motion.p
          className="font-mono text-[12px] tabular text-slate-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {String(index + 1).padStart(2, "0")} / {project.category}{project.year ? ` / ${project.year}` : ""}
        </motion.p>
        <h3 className="display text-[clamp(2.4rem,4.6vw,3.8rem)] leading-[0.95] text-slate-900">
          <WordsReveal as="span" text={title} stagger={0.08} className="inline" />
        </h3>
        <WordsReveal text={project.summary ?? project.introduction} stagger={0.012} delay={0.2} className="text-[17px] leading-relaxed text-slate-700 text-pretty" />
        {quote && (
          <motion.blockquote
            className="relative pl-8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          >
            <span aria-hidden className="absolute left-0 -top-3 display text-6xl leading-none" style={{ color: "var(--accent)" }}>“</span>
            <p className="display italic text-[1.35rem] leading-snug text-slate-800 text-pretty">{quote}</p>
          </motion.blockquote>
        )}
        <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
          {project.tech.slice(0, 6).map((t) => <li key={t} className="tag">{t}</li>)}
        </ul>
        <div className="flex flex-wrap gap-2.5 pt-1">
          <button className="btn btn-primary" onClick={() => onOpen(project)}>Read the case study <ArrowRight className="w-4 h-4" /></button>
          {project.playLink && <a href={project.playLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary"><Play className="w-4 h-4" /> Live</a>}
          {project.githubLink && <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-github"><GithubIcon className="w-4 h-4" /> Source</a>}
        </div>
      </div>
    </article>
  );
}
