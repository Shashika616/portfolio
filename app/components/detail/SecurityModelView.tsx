"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import type { SecurityModel, Stride } from "../../data/types";

const EASE = [0.16, 1, 0.3, 1] as const;
const ORDER: Stride[] = ["Spoofing", "Tampering", "Repudiation", "Information disclosure", "Denial of service", "Elevation of privilege"];

/**
 * STRIDE threat model. What is protected and where trust changes come first,
 * then each category's threats: the threat, the control, where the control
 * lives in the code, and what is still accepted.
 */
export function SecurityModelView({ model }: { model: SecurityModel }) {
  const groups = ORDER.map((s) => ({ s, items: model.threats.filter((t) => t.stride === s) })).filter((g) => g.items.length);
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-3">
        <Panel title="What is protected" items={model.assets} />
        <Panel title="Where trust changes" items={model.boundaries} />
      </div>
      {groups.map(({ s, items }) => (
        <section key={s} className="space-y-2.5">
          <h4 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-500">{s}</h4>
          <ul className="space-y-2.5">
            {items.map((t, i) => (
              <motion.li
                key={t.threat}
                className="rounded-xl bg-white ring-1 ring-slate-200 overflow-hidden"
                initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06, duration: 0.55, ease: EASE }}
              >
                <div className="p-3.5 space-y-2">
                  {t.owasp && <span className="tag">{t.owasp}</span>}
                  <p className="flex gap-2.5 text-[14px] leading-6 text-slate-800">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-1 text-rose-600" aria-label="Threat" />
                    {t.threat}
                  </p>
                </div>
                <div className="p-3.5 space-y-2" style={{ background: "color-mix(in srgb, var(--accent) 7%, #fff)", borderTop: "1px solid color-mix(in srgb, var(--accent) 18%, transparent)" }}>
                  <p className="flex gap-2.5 text-[14px] leading-6 text-slate-800">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: "var(--accent-strong)" }} aria-label="Control" />
                    {t.control}
                  </p>
                  {t.where && <p className="pl-[26px] font-mono text-[12px] leading-5 text-slate-500 break-words">{t.where}</p>}
                  {t.residual && (
                    <p className="pl-[26px] text-[13px] leading-5 text-amber-800"><span className="font-semibold">Accepted: </span>{t.residual}</p>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl bg-[#fbfcfd] ring-1 ring-slate-200 p-4">
      <h4 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-500 mb-2">{title}</h4>
      <ul className="space-y-1.5">
        {items.map((it) => (
          <li key={it} className="flex gap-2.5 text-[14px] leading-6 text-slate-700">
            <span aria-hidden className="mt-[11px] w-2.5 h-[2px] flex-shrink-0" style={{ background: "var(--accent)" }} />
            <span className="text-pretty">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
