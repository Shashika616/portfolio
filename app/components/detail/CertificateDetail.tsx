"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import type { CertificateItem } from "../../data/types";
import { Block } from "./ProjectDetail";

export function CertificateDetail({ cert }: { cert: CertificateItem }) {
  return (
    <article className="px-5 sm:px-10 py-8 sm:py-10 space-y-8 max-w-3xl mx-auto">
      {cert.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cert.imageUrl} alt={`${cert.name} certificate`} className="w-full max-w-lg mx-auto rounded-xl ring-1 ring-slate-200 shadow-sm" />
      )}
      <header className="space-y-3">
        <h2 className="text-2xl font-bold tracking-[-0.02em] text-slate-900 text-balance">{cert.name}</h2>
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">{cert.issuer}</span>
          <span className="mx-2 text-slate-300">·</span>
          <span className="tabular">{cert.date}</span>
          {cert.credentialId && (
            <>
              <span className="mx-2 text-slate-300">·</span>
              <span className="font-mono text-xs">ID {cert.credentialId}</span>
            </>
          )}
        </p>
        <p className="text-[15px] leading-7 text-slate-700 text-pretty">{cert.description}</p>
      </header>
      <Block title="Skills covered">
        <ul className="flex flex-wrap gap-1.5">{cert.skills.map((s) => <li key={s} className="tag">{s}</li>)}</ul>
      </Block>
      <a href={cert.verifyLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
        Verify credential <ArrowUpRight className="w-4 h-4" />
      </a>
    </article>
  );
}
