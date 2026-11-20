"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CATALOG } from "../data/catalog";
import { EXPERIENCE } from "../data/experience";
import type { ProjectItem, CertificateItem, ExperienceItem } from "../data/types";
import { Modal } from "../components/ui/Modal";
import { ProjectDetail } from "../components/detail/ProjectDetail";
import { ExperienceDetail } from "../components/detail/ExperienceDetail";
import { CertificateDetail } from "../components/detail/CertificateDetail";
import ThemeSelector from "../components/ThemeSelector";
import { MenuOverlay } from "../components/MenuOverlay";
import { GlassBar } from "../components/GlassBar";
import { ViewSwitcher } from "../components/ViewSwitcher";
import { takeScrollToWork } from "../lib/navigation";
import { CoverSpread } from "../components/profile/CoverSpread";
import { ContentsIndex } from "../components/profile/ContentsIndex";
import { FeatureStory } from "../components/profile/FeatureStory";
import { CareerTimeline } from "../components/profile/CareerTimeline";
import { Colophon } from "../components/profile/Colophon";
import { IssueIndex } from "../components/profile/IssueIndex";

/**
 * /profile as an editorial issue about the work:
 *   Cover → Contents → Features → Career → Colophon.
 * Everything is read from app/data; nothing here owns copy.
 */

const ALL_WORK: ProjectItem[] = [...CATALOG.projects, ...CATALOG.researches, ...CATALOG.games];
const FEATURED = ALL_WORK.filter((p) => p.featured);
const ORDERED = [...FEATURED, ...ALL_WORK.filter((p) => !p.featured)];
const STATS = [
  { n: ALL_WORK.length, label: "projects" },
  { n: ALL_WORK.filter((p) => p.status === "In production" || p.playLink).length, label: "live or playable" },
  { n: EXPERIENCE.length, label: "roles" },
  { n: CATALOG.certificates.length, label: "credentials" },
];

export default function ProfilePage() {
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [role, setRole] = useState<ExperienceItem | null>(null);
  const [cert, setCert] = useState<CertificateItem | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const contentsRef = useRef<HTMLDivElement>(null);

  // Arriving from the gallery's "Profile" switch: open at the contents.
  useEffect(() => {
    if (!takeScrollToWork()) return;
    window.setTimeout(() => document.getElementById("contents")?.scrollIntoView({ behavior: "smooth", block: "start" }), 350);
  }, []);

  return (
    <div className="min-h-dvh bg-[var(--background)] text-slate-900">
      <GlassBar alwaysLight onMenu={() => setMenuOpen(true)} left={<ViewSwitcher active="feed" />} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      <IssueIndex />

      {/* Right gutter on large screens keeps the section index clear of content. */}
      <main className="lg:pr-14">
        <CoverSpread stories={FEATURED} onOpen={setProject} stats={STATS} />

        <div ref={contentsRef}>
          <ContentsIndex items={ORDERED} onOpen={setProject} />
        </div>

        <section id="features" className="px-5 sm:px-10 pb-10 scroll-mt-20">
          <motion.h2
            className="display text-[clamp(3rem,9vw,7rem)] leading-[0.85] text-slate-900 mb-4"
            initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            Features
          </motion.h2>
          {FEATURED.map((p, i) => <FeatureStory key={p.name} project={p} index={i} onOpen={setProject} />)}
        </section>

        <CareerTimeline roles={EXPERIENCE} onOpen={setRole} />

        <Colophon certificates={CATALOG.certificates} onCert={setCert} />
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
