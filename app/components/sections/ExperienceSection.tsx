"use client";

import React from "react";
import { Section } from "../../types";
import { useGlobalTheme } from "../../context/ThemeContext";

interface ExperienceSectionProps {
  sec: Section;
}

export function ExperienceSection({ sec }: { sec: Section }) {
  const { activeTheme } = useGlobalTheme();

  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-bold text-slate-900 tracking-tight">{sec.title}</h2>
      <h4 className={`text-xs font-mono uppercase tracking-wider font-bold transition-colors duration-300 ${activeTheme.textColor}`}>
        — {sec.subtitle || "Professional History"}
      </h4>
      <p 
        className="text-slate-600 text-base leading-relaxed border-l-2 pl-6 transition-all duration-300"
        style={{ borderColor: activeTheme.fillColor }}
      >
        Building fault-tolerant software infrastructures for high-throughput enterprise scale environments. Managing microservices, container pools, and secure network layers.
      </p>
    </div>
  );
}