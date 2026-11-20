import React from "react";

/** Figures worth pulling out of running text: 35%, 99.5%, 50+, 100+, 5 → 2, 14 decision… */
const FIGURE = /(\d+(?:\.\d+)?\s?(?:%|\+)|\d+\s?→\s?\d+)/g;

/** Wraps metrics inside a sentence in a strong, accent-coloured span. */
export function emphasize(text: string): React.ReactNode {
  const parts = text.split(FIGURE);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold tabular" style={{ color: "var(--accent-strong)" }}>
        {part}
      </strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}
