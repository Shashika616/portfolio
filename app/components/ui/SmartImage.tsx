"use client";

import React, { useCallback, useState } from "react";

/**
 * Image with a 1:1 theme-glow skeleton. The wrapper keeps the image's box,
 * the skeleton sweeps in the active accent until the file arrives, then the
 * image sharpens in from a blur (the exhibit's print-into-focus).
 * Cached images skip the skeleton (checked via `complete` on mount).
 */
export function SmartImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  dark = false,
  loading = "lazy",
  draggable,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  dark?: boolean;
  loading?: "lazy" | "eager";
  draggable?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const ref = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  // No source: keep the shape with a skeleton rather than an <img src=""> (which refetches the page).
  if (!src) return <span aria-hidden className={`skeleton block ${dark ? "skeleton-dark" : ""} ${className}`} />;

  return (
    <span className={`relative block overflow-hidden ${className}`}>
      {!loaded && <span aria-hidden className={`skeleton absolute inset-0 ${dark ? "skeleton-dark" : ""}`} />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        src={src}
        alt={alt}
        loading={loading}
        draggable={draggable}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full transition-[opacity,filter,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          loaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-[1.03]"
        } ${imgClassName}`}
      />
    </span>
  );
}
