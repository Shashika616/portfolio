"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { BookOpen, Download, Mail, MapPin, Play, ChevronDown } from "lucide-react";
import { PROFILE, SKILLS, EDUCATION, FOCUS_AREAS } from "../data/profile";
import { CATALOG } from "../data/catalog";
import { EXPERIENCE } from "../data/experience";
import type { ProjectItem, CertificateItem, ExperienceItem } from "../data/types";
import { Modal } from "../components/ui/Modal";
import { GithubIcon, LinkedinIcon } from "../components/ui/BrandIcons";
import { CertificateCard } from "../components/ui/ProjectCard";
import { CoverCarousel } from "../components/ui/CoverCarousel";
import { SmartImage } from "../components/ui/SmartImage";
import { ProjectDetail } from "../components/detail/ProjectDetail";
import { ExperienceDetail } from "../components/detail/ExperienceDetail";
import { CertificateDetail } from "../components/detail/CertificateDetail";
import { ExperienceCard } from "../components/sections/ExperienceSection";
import ThemeSelector from "../components/ThemeSelector";
import { MenuOverlay } from "../components/MenuOverlay";
import { GlassBar } from "../components/GlassBar";
import { ViewSwitcher } from "../components/ViewSwitcher";
import { takeScrollToWork } from "../lib/navigation";
import { AnimatePresence } from "framer-motion";
import { Reveal, cardPresence } from "../components/ui/Reveal";
import { availableFilters, WORK_FILTERS } from "../data/filters";

type Tab = "work" | "experience" | "certificates" | "about";

const ALL_WORK: ProjectItem[] = [...CATALOG.projects, ...CATALOG.researches, ...CATALOG.games];
const FEED: ProjectItem[] = [...ALL_WORK.filter((p) => p.featured), ...ALL_WORK.filter((p) => !p.featured)];
// Cover carousel: shipped and live systems with real screenshots first.
const COVER_SLIDES: ProjectItem[] = [...ALL_WORK]
  .filter((p) => p.cover && (p.cover.startsWith("/work/") || p.featured || p.playLink))
  .sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
  .slice(0, 7);
const FEED_FILTERS = availableFilters(FEED);
const LIVE_COUNT = ALL_WORK.filter((p) => p.status === "In production" || p.playLink).length;

const firstImage = (p: ProjectItem) =>
  p.cover
    ? { url: p.cover, label: "Cover" }
    : p.mediaGroups?.flatMap((g) => g.items).find((m) => !/\.(mp4|webm|ogg|mov)$/i.test(m.url));

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>("work");
  const [filterId, setFilterId] = useState("all");
  const feed = useMemo(() => FEED.filter(WORK_FILTERS.find((f) => f.id === filterId)?.test ?? (() => true)), [filterId]);
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [role, setRole] = useState<ExperienceItem | null>(null);
  const [cert, setCert] = useState<CertificateItem | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const workAnchor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!takeScrollToWork()) return;
    window.setTimeout(() => workAnchor.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 350);
  }, []);

  const tabs = useMemo(
    () => [
      { id: "work" as const, label: "Work", n: FEED.length },
      { id: "experience" as const, label: "Experience", n: EXPERIENCE.length },
      { id: "certificates" as const, label: "Certificates", n: CATALOG.certificates.length },
      { id: "about" as const, label: "About", n: null },
    ],
    []
  );

  return (
    <div className="min-h-dvh bg-[#f4f6f9]">
      <GlassBar
        onMenu={() => setMenuOpen(true)}
        left={<ViewSwitcher active="feed" />}
      />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Masthead: giant wordmark on a dark stage; the page rises over it. */}
      <div className="sticky top-0 h-[100dvh] bg-[#232325] overflow-hidden flex flex-col items-center justify-center" aria-hidden>
        <MastheadWord />
      </div>

      <main className="relative z-10 -mt-[22dvh] bg-[#f4f6f9] rounded-t-[28px] shadow-[0_-30px_60px_rgba(0,0,0,0.25)]">
       <div className="max-w-6xl mx-auto px-0 sm:px-6 pb-24 pt-3 sm:pt-6">
        {/* ============ Profile card ============ */}
        <Reveal as="section" className="bg-white sm:rounded-3xl ring-1 ring-slate-200/80 overflow-hidden">
          <CoverCarousel slides={COVER_SLIDES} onOpen={setProject} />
          <div className="px-5 sm:px-8 pb-6">
            <div className="flex items-end justify-between gap-4 -mt-12 sm:-mt-14">
              <span className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-[3px] bg-white shadow-md flex-shrink-0">
                <span className="relative block w-full h-full rounded-full p-[2px]" style={{ backgroundImage: "var(--accent-gradient)" }}>
                  <span className="relative block w-full h-full rounded-full overflow-hidden ring-2 ring-white">
                    <Image src={PROFILE.avatar} alt={PROFILE.name} fill priority sizes="112px" className="object-cover" />
                  </span>
                </span>
              </span>
              <div className="hidden sm:flex items-center gap-2 pb-1">
                <a className="btn btn-github btn-icon" href={PROFILE.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <GithubIcon className="w-[18px] h-[18px]" />
                </a>
                <a className="btn btn-linkedin btn-icon" href={PROFILE.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <LinkedinIcon className="w-[18px] h-[18px]" />
                </a>
                <a className="btn btn-secondary" href={PROFILE.cv} download>
                  <Download className="w-4 h-4" /> CV
                </a>
              </div>
            </div>

            <div className="mt-4 space-y-3 max-w-2xl">
              <div>
                <h1 className="display text-[2.6rem] sm:text-[3.2rem] text-slate-900">{PROFILE.name}</h1>
                <p className="text-[15px] text-slate-700">{PROFILE.title}</p>
              </div>
              <p className="text-[15px] leading-relaxed text-slate-600 text-pretty">{PROFILE.headline}</p>
              <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" />{PROFILE.location}</span>
                <a href={PROFILE.links.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-slate-900">
                  <GithubIcon className="w-4 h-4" /> Shashika616
                </a>
              </p>
              <p className="flex flex-wrap items-center gap-y-1 text-sm text-slate-600">
                <Stat n={FEED.length} label="projects" />
                <Sep />
                <Stat n={LIVE_COUNT} label="live or playable" />
                <Sep />
                <Stat n={EXPERIENCE.length} label="roles" />
                <Sep />
                <Stat n={CATALOG.certificates.length} label="certificates" />
              </p>
              <div className="flex sm:hidden flex-wrap gap-2 pt-1">
                <a className="btn btn-secondary btn-sm" href={PROFILE.cv} download><Download className="w-4 h-4" /> CV</a>
                <a className="btn btn-github btn-sm btn-icon" href={PROFILE.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GithubIcon className="w-4 h-4" /></a>
                <a className="btn btn-linkedin btn-sm btn-icon" href={PROFILE.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedinIcon className="w-4 h-4" /></a>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div role="tablist" aria-label="Profile sections" className="grid grid-cols-4 sm:flex sm:gap-1 px-1 sm:px-6 border-t border-slate-100">
            {tabs.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  className={`relative h-12 px-1 sm:px-4 text-[13px] sm:text-sm whitespace-nowrap text-center transition-colors ${active ? "font-semibold text-slate-900" : "font-medium text-slate-500 hover:text-slate-900"}`}
                >
                  {t.label}
                  {t.n !== null && <span className="hidden sm:inline ml-1.5 text-xs text-slate-400 tabular">{t.n}</span>}
                  {active && <span aria-hidden className="absolute left-3 right-3 bottom-0 h-[3px] rounded-t-sm" style={{ background: "var(--accent)" }} />}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* ============ Body: feed + rail ============ */}
        <div className="mt-3 sm:mt-6 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-3 sm:gap-6 items-start">
          <div ref={workAnchor} className="space-y-3 sm:space-y-4 min-w-0 scroll-mt-24" role="tabpanel">
            {tab === "work" && (
              <>
                <div className="flex flex-wrap gap-2 px-3 sm:px-0" aria-label="Filter work">
                  {FEED_FILTERS.map((f) => (
                    <button key={f.id} className="chip" aria-pressed={filterId === f.id} onClick={() => setFilterId(f.id)}>
                      {f.label}
                      <span className="ml-1.5 text-[11px] opacity-60 tabular">{f.count}</span>
                    </button>
                  ))}
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {feed.map((p, i) => (
                      <motion.div key={p.name} layout="position" {...cardPresence}>
                        <Reveal delay={Math.min(i, 2) * 0.06}>
                          <WorkPost project={p} onOpen={() => setProject(p)} />
                        </Reveal>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}

            {tab === "experience" && (
              <div className="space-y-3 sm:space-y-4 px-3 sm:px-0">
                {EXPERIENCE.map((e) => <ExperienceCard key={e.id} item={e} onOpen={() => setRole(e)} />)}
              </div>
            )}

            {tab === "certificates" && (
              <div className="grid gap-3 px-3 sm:px-0">
                {CATALOG.certificates.map((c) => <CertificateCard key={c.name} cert={c} onOpen={() => setCert(c)} />)}
              </div>
            )}

            {tab === "about" && (
              <article className="bg-white sm:rounded-2xl ring-1 ring-slate-200/80 p-5 sm:p-8 space-y-10">
                <div className="space-y-4 max-w-2xl">
                  {PROFILE.about.map((t) => <p key={t.slice(0, 20)} className="text-[16px] leading-7 text-slate-700 text-pretty">{t}</p>)}
                </div>
                <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
                  {FOCUS_AREAS.map((f) => (
                    <div key={f.title} className="space-y-1.5">
                      <dt className="text-[15px] font-semibold text-slate-900 pb-2 border-b border-slate-100">{f.title}</dt>
                      <dd className="text-sm leading-6 text-slate-600 text-pretty pt-1">{f.desc}</dd>
                    </div>
                  ))}
                </dl>
                <div className="lg:hidden space-y-8">
                  <Toolbox />
                  <Education />
                </div>
              </article>
            )}
          </div>

          {/* Right rail */}
          {/* Sticky below the glass bar, never taller than the screen; cards fold. */}
          <aside className="hidden lg:block space-y-3 sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain pb-2 [scrollbar-width:thin]">
            <Reveal delay={0.1}>
              <RailCard title="Toolbox" defaultOpen={false} summary={<ToolboxSummary />}>
                <Toolbox compact />
              </RailCard>
            </Reveal>
            <Reveal delay={0.18}><RailCard title="Education"><Education compact /></RailCard></Reveal>
            <RailCard title="Get in touch">
              <p className="text-sm text-slate-600 break-all">{PROFILE.email}</p>
              <div className="flex gap-2 pt-3">
                <a href={`mailto:${PROFILE.email}`} className="btn btn-primary btn-sm flex-1"><Mail className="w-4 h-4" /> Email</a>
                <a href={PROFILE.links.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-linkedin btn-sm btn-icon" aria-label="LinkedIn"><LinkedinIcon className="w-4 h-4" /></a>
              </div>
            </RailCard>
          </aside>
        </div>
       </div>
      </main>

      <ThemeSelector />

      <Modal open={!!project} onClose={() => setProject(null)} title={project?.name ?? ""}>
        {project && <ProjectDetail project={project} />}
      </Modal>
      <Modal open={!!role} onClose={() => setRole(null)} title={role ? `${role.title}, ${role.company}` : ""}>
        {role && <ExperienceDetail item={role} />}
      </Modal>
      <Modal open={!!cert} onClose={() => setCert(null)} title={cert?.name ?? ""} size="md">
        {cert && <CertificateDetail cert={cert} />}
      </Modal>
    </div>
  );
}

/* ---------------------------------------------------------------------- */

/** Giant wordmark that sharpens in, then drifts and dims as the page rises over it. */
function MastheadWord() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, -120]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0.25]);
  return (
    <motion.div style={{ y, opacity }} className="text-center px-4">
      <motion.p
        className="display uppercase leading-[0.85] text-[clamp(4rem,17vw,15rem)] tracking-[0.06em]"
        style={{ color: "color-mix(in srgb, var(--accent) 35%, #8a817e)" }}
        initial={{ opacity: 0, filter: "blur(18px)", letterSpacing: "0.3em" }}
        animate={{ opacity: 1, filter: "blur(0px)", letterSpacing: "0.06em" }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      >
        Shashika
      </motion.p>
      <motion.p
        className="display italic text-white/55 text-[clamp(1.2rem,3vw,2rem)] mt-4"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        Selected systems, 2024 to 2026
      </motion.p>
    </motion.div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <span className="whitespace-nowrap">
      <span className="font-semibold text-slate-900 tabular">{n}</span> {label}
    </span>
  );
}
const Sep = () => <span className="mx-2 text-slate-300" aria-hidden>/</span>;

/** A project rendered as a social post: author line, text, media, stack, action bar. */
function WorkPost({ project, onOpen }: { project: ProjectItem; onOpen: () => void }) {
  const img = firstImage(project);
  const kind = CATALOG.researches.includes(project) ? "Research" : CATALOG.games.includes(project) ? "Game" : project.category;
  return (
    <article className="bg-white sm:rounded-2xl ring-1 ring-slate-200/80 overflow-hidden">
      <div className="px-4 sm:px-5 pt-4 flex items-center gap-3">
        <span className="relative w-10 h-10 rounded-full overflow-hidden ring-1 ring-slate-200 flex-shrink-0">
          <Image src={PROFILE.avatar} alt="" fill sizes="40px" className="object-cover" />
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="text-sm font-semibold text-slate-900 truncate">{PROFILE.name}</p>
          <p className="text-xs text-slate-500 truncate">{kind}{project.year ? ` · ${project.year}` : ""}</p>
        </div>
      </div>

      <div className="px-4 sm:px-5 pt-3 space-y-2">
        <h2 className="display text-[1.75rem] leading-[1.05] text-slate-900 text-balance">{project.name}</h2>
        <p className="text-[15px] leading-relaxed text-slate-700 text-pretty">{project.summary ?? project.introduction}</p>
      </div>

      {img && (
        <button type="button" onClick={onOpen} className="block w-full mt-3 bg-slate-50 border-y border-slate-100 cursor-pointer" aria-label={`Open ${project.name} case study`}>
          <SmartImage src={img.url} alt={`${project.name}: ${img.label}`} className="w-full aspect-[16/9]" imgClassName="object-cover object-top" />
        </button>
      )}

      <ul className="px-4 sm:px-5 pt-3 flex flex-wrap gap-1.5" aria-label="Tech stack">
        {project.tech.slice(0, 6).map((t) => <li key={t} className="tag">{t}</li>)}
        {project.tech.length > 6 && <li className="tag">+{project.tech.length - 6}</li>}
      </ul>

      {/* Action bar: colour follows purpose (read = primary, live = theme tint, source = GitHub). */}
      <div className="mt-3 px-3 sm:px-4 py-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
        <button onClick={onOpen} className="btn btn-primary btn-sm">
          <BookOpen className="w-4 h-4" /> Case study
        </button>
        {project.playLink && (
          <a href={project.playLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
            <Play className="w-4 h-4" /> Live
          </a>
        )}
        {project.githubLink && (
          <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-github btn-sm">
            <GithubIcon className="w-4 h-4" /> Source
          </a>
        )}
        {!project.githubLink && project.status === "Client work" && (
          <span className="ml-auto text-xs text-slate-400">Private repository</span>
        )}
      </div>
    </article>
  );
}

/** Foldable rail card: header toggles the body; height animates; state is announced. */
function RailCard({
  title,
  children,
  defaultOpen = true,
  summary,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  /** Shown under the header while folded. */
  summary?: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = `rail-${title.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <section className="bg-white rounded-2xl ring-1 ring-slate-200/80">
      <h2>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={id}
          className="w-full flex items-center justify-between gap-3 px-5 h-12 text-left text-sm font-semibold text-slate-900 rounded-2xl hover:bg-slate-50 transition-colors"
          data-cursor={open ? "Fold" : "Open"}
        >
          {title}
          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </button>
      </h2>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="body"
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">{children}</div>
          </motion.div>
        ) : summary ? (
          <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 pb-4 -mt-1">
            {summary}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function ToolboxSummary() {
  const all = SKILLS.flatMap((g) => g.items);
  return (
    <div className="space-y-2">
      <p className="text-xs text-slate-500">{all.length} tools across {SKILLS.length} areas</p>
      <div className="flex flex-wrap gap-1.5">
        {all.slice(0, 6).map((t) => <span key={t} className="tag">{t}</span>)}
        <span className="tag">+{all.length - 6}</span>
      </div>
    </div>
  );
}

function Toolbox({ compact = false }: { compact?: boolean }) {
  return (
    <div className="space-y-4">
      {!compact && <h3 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-slate-500">Toolbox</h3>}
      {SKILLS.map((s) => (
        <div key={s.group} className="space-y-1.5">
          <p className="text-xs font-medium text-slate-500">{s.group}</p>
          <div className="flex flex-wrap gap-1.5">{s.items.map((i) => <span key={i} className="tag">{i}</span>)}</div>
        </div>
      ))}
    </div>
  );
}

function Education({ compact = false }: { compact?: boolean }) {
  return (
    <div className="space-y-4">
      {!compact && <h3 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-slate-500">Education</h3>}
      {EDUCATION.map((e) => (
        <div key={e.school} className="space-y-0.5">
          <p className="text-sm font-semibold text-slate-900">{e.school}</p>
          <p className="text-sm text-slate-600">{e.degree}</p>
          <p className="text-xs text-slate-500 tabular">{e.year}{e.grade ? ` · ${e.grade}` : ""}</p>
        </div>
      ))}
    </div>
  );
}
