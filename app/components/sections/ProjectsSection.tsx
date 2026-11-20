"use client";

import React, { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { availableFilters, WORK_FILTERS } from "../../data/filters";
import { cardPresence } from "../ui/Reveal";
import { Section } from "../../types";
import { CATALOG } from "../../data/catalog";
import type { ProjectItem, CertificateItem } from "../../data/types";
import { Modal } from "../ui/Modal";
import { ProjectCard, CertificateCard } from "../ui/ProjectCard";
import { ProjectDetail } from "../detail/ProjectDetail";
import { CertificateDetail } from "../detail/CertificateDetail";
import { SectionHeader } from "./SectionHeader";

type TabType = "projects" | "researches" | "games" | "certificates";

const TABS: { id: TabType; label: string }[] = [
  { id: "projects", label: "Projects" },
  { id: "researches", label: "Research" },
  { id: "games", label: "Games" },
  { id: "certificates", label: "Certificates" },
];


export function ProjectsSection({ sec }: { sec: Section }) {
  const [tab, setTab] = useState<TabType>("projects");
  const [filterId, setFilterId] = useState("all");
  const [query, setQuery] = useState("");
  const [openProject, setOpenProject] = useState<ProjectItem | null>(null);
  const [openCert, setOpenCert] = useState<CertificateItem | null>(null);

  // Shared platform/kind filters; only those with matches for this tab render.
  const filters = useMemo(() => (tab === "certificates" ? [] : availableFilters(CATALOG[tab])), [tab]);

  const q = query.trim().toLowerCase();

  const projects = useMemo(() => {
    if (tab === "certificates") return [];
    let items = CATALOG[tab];
    const f = WORK_FILTERS.find((w) => w.id === filterId);
    if (f) items = items.filter(f.test);
    if (q) {
      items = items.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.summary ?? "").toLowerCase().includes(q) ||
        p.tech.some((t) => t.toLowerCase().includes(q))
      );
    }
    return items;
  }, [tab, filterId, q]);

  const certificates = useMemo(() => {
    if (tab !== "certificates") return [];
    if (!q) return CATALOG.certificates;
    return CATALOG.certificates.filter((c) =>
      [c.name, c.issuer, c.description, ...c.skills].some((s) => s.toLowerCase().includes(q))
    );
  }, [tab, q]);

  const count = tab === "certificates" ? certificates.length : projects.length;

  const changeTab = (id: TabType) => {
    setTab(id);
    setFilterId("all");
    setQuery("");
  };

  return (
    <div className="section-body space-y-6">
      <SectionHeader
        title={sec.title}
        lede="Shipped products, client systems, research and experiments."
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div role="tablist" aria-label="Work type" className="grid grid-cols-2 sm:inline-flex gap-1 p-1 rounded-xl bg-slate-100 self-stretch sm:self-start">
          {TABS.map((t) => {
            const active = tab === t.id;
            const n = t.id === "certificates" ? CATALOG.certificates.length : CATALOG[t.id].length;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => changeTab(t.id)}
                className={`relative px-3.5 h-9 rounded-lg text-sm font-medium whitespace-nowrap text-center transition-colors ${
                  active ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t.label}
                <span className="ml-1.5 text-xs text-slate-400 tabular">{n}</span>
              </button>
            );
          })}
        </div>

        <label className="relative w-full md:w-64">
          <span className="sr-only">Search {tab}</span>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tab === "certificates" ? "Search certificates or skills" : "Search by name or tech"}
            className="w-full h-10 pl-9 pr-9 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 focus:border-[var(--accent)] focus:outline-none transition-colors [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100">
              <X className="w-4 h-4" />
            </button>
          )}
        </label>
      </div>

      {filters.length > 2 && (
        <div className="flex flex-wrap gap-2" aria-label="Filter work">
          {filters.map((f) => (
            <button key={f.id} className="chip" aria-pressed={filterId === f.id} onClick={() => setFilterId(f.id)}>
              {f.label}
              <span className="ml-1.5 text-[11px] opacity-60 tabular">{f.count}</span>
            </button>
          ))}
        </div>
      )}

      <p className="text-sm text-slate-500" aria-live="polite">
        {count} {count === 1 ? "result" : "results"}
        {q && <> for &ldquo;{query.trim()}&rdquo;</>}
      </p>

      {count === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 py-14 px-6 text-center space-y-3">
          <p className="text-sm text-slate-600">Nothing matches that search.</p>
          <button className="btn btn-secondary btn-sm" onClick={() => { setQuery(""); setFilterId("all"); }}>
            Clear filters
          </button>
        </div>
      ) : tab === "certificates" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {certificates.map((c) => <CertificateCard key={c.name} cert={c} onOpen={() => setOpenCert(c)} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Position-only layout animation: cards glide to new spots without being scaled (no stretch). */}
          <AnimatePresence mode="popLayout" initial={false}>
            {projects.map((p) => (
              <motion.div key={p.name} layout="position" {...cardPresence} className="[&>article]:h-full">
                <ProjectCard project={p} onOpen={() => setOpenProject(p)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal open={!!openProject} onClose={() => setOpenProject(null)} title={openProject?.name ?? ""}>
        {openProject && <ProjectDetail project={openProject} />}
      </Modal>
      <Modal open={!!openCert} onClose={() => setOpenCert(null)} title={openCert?.name ?? ""} size="md">
        {openCert && <CertificateDetail cert={openCert} />}
      </Modal>
    </div>
  );
}
