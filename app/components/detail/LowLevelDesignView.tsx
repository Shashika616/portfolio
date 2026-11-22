"use client";

import React from "react";
import type { LowLevelDesign } from "../../data/types";
import { List } from "./ProjectDetail";

/** Low-level design: concurrency, the data layer, key routines and the trade-offs taken. */
export function LowLevelDesignView({ design }: { design: LowLevelDesign }) {
  return (
    <div className="space-y-7">
      {design.concurrency?.length ? <Group title="Concurrency"><List items={design.concurrency} accent /></Group> : null}
      {design.data?.length ? <Group title="Data layer"><List items={design.data} accent /></Group> : null}
      {design.routines?.length ? (
        <Group title="Key routines">
          <dl className="divide-y divide-slate-100 rounded-xl ring-1 ring-slate-200 bg-white">
            {design.routines.map((r) => (
              <div key={r.name} className="p-4 space-y-1">
                <dt className="font-mono text-[13px] font-semibold text-slate-900">{r.name}</dt>
                <dd className="text-[14px] leading-6 text-slate-700 text-pretty">{r.detail}</dd>
              </div>
            ))}
          </dl>
        </Group>
      ) : null}
      {design.tradeoffs?.length ? <Group title="Trade-offs, stated"><List items={design.tradeoffs} /></Group> : null}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h4 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-500">{title}</h4>
      {children}
    </section>
  );
}
