"use client";

import React, { useState } from "react";
import { Section } from "../../types";
import { EXPERIENCE } from "../../data/experience";
import type { ExperienceItem } from "../../data/types";
import { Modal } from "../ui/Modal";
import { ExperienceDetail } from "../detail/ExperienceDetail";
import { SectionHeader } from "./SectionHeader";
import { Capabilities } from "../profile/Capabilities";
import { CareerTimeline } from "../profile/CareerTimeline";

export function ExperienceSection({ sec }: { sec: Section }) {
  const [open, setOpen] = useState<ExperienceItem | null>(null);

  return (
    <div className="section-body space-y-12">
      <SectionHeader title={sec.title} lede="What I built, what I owned, and the results." />

      <Capabilities compact />

      {/* Same drawing timeline as the profile's Career, sized for the card. */}
      <div className="pt-4">
        <CareerTimeline roles={EXPERIENCE} onOpen={setOpen} embedded />
      </div>

      <Modal open={!!open} onClose={() => setOpen(null)} title={open ? `${open.title}, ${open.company}` : ""}>
        {open && <ExperienceDetail item={open} />}
      </Modal>
    </div>
  );
}
