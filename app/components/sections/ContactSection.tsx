"use client";

import React from "react";
import { Section } from "../../types";

interface ContactSectionProps {
  sec: Section;
}

export function ContactSection({ sec }: ContactSectionProps) {
  return (
    <>
      <h2 className="text-4xl font-bold text-slate-900 tracking-tight">{sec.title}</h2>
      <p className="text-slate-600 text-base leading-relaxed">
        Looking to configure a performant systems cluster or review language architectures? Let's initialize a direct network socket link sequence.
      </p>
      <div className="pt-4">
        <a href="mailto:contact@domain.com" className="inline-block font-mono text-xs text-blue-600 border border-blue-200 bg-blue-50/50 px-8 py-4 rounded-xl hover:bg-blue-100/80 transition-all font-bold shadow-sm">
          INITIATE_CONTACT_SEQUENCE
        </a>
      </div>
    </>
  );
}