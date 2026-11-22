/**
 * Route skeleton for /gallery, shaped like its dark stage: the glass bar,
 * the big WORK title, then a collage of prints. Shapes glow in the theme.
 */
const PRINTS = [
  "col-span-2 row-span-2", "col-span-1 row-span-1", "col-span-1 row-span-2",
  "col-span-1 row-span-1", "col-span-2 row-span-1", "col-span-1 row-span-1", "col-span-1 row-span-1",
];

export default function GalleryLoading() {
  return (
    <div className="min-h-dvh bg-[#262626] px-4 sm:px-8 pt-24 pb-16" aria-busy="true" aria-label="Loading gallery">
      <div className="fixed top-3 inset-x-3 sm:inset-x-6 h-14 rounded-2xl skeleton skeleton-dark" />
      <div className="skeleton skeleton-dark h-[clamp(5rem,18vw,15rem)] w-[min(80vw,900px)] rounded-md mx-auto" />
      <div className="mt-12 max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 auto-rows-[120px] sm:auto-rows-[170px] [grid-auto-flow:dense] gap-3 sm:gap-4">
        {PRINTS.map((c, i) => <div key={i} className={`skeleton skeleton-dark rounded-xl ${c}`} />)}
      </div>
    </div>
  );
}
