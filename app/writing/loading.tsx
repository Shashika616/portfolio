/**
 * Route skeleton for /writing, shaped 1:1 like the page: glass bar, header,
 * topic chips and view switch, then one six-card mosaic block. Glows in the theme.
 */
const MOSAIC = ["col-span-2 row-span-2", "col-span-1 row-span-2", "col-span-1 row-span-2", "col-span-2 row-span-1", "col-span-1 row-span-1", "col-span-1 row-span-1"];

export default function WritingLoading() {
  return (
    <main className="min-h-dvh bg-[var(--background)]" aria-busy="true" aria-label="Loading writing">
      <div className="fixed top-3 inset-x-3 sm:inset-x-6 h-14 rounded-2xl skeleton" />
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-32 pb-24">
        <div className="skeleton h-3 w-44 rounded" />
        <div className="skeleton h-16 sm:h-20 w-64 mt-4 rounded-md" />
        <div className="skeleton h-4 w-full max-w-xl mt-5 rounded" />
        <div className="skeleton h-4 w-2/3 max-w-md mt-2 rounded" />
        <div className="mt-10 mb-10 flex flex-col-reverse gap-4 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap gap-2">{[44, 96, 76, 40, 104, 82].map((w, i) => <div key={i} className="skeleton h-9 rounded-md" style={{ width: w }} />)}</div>
          <div className="skeleton h-11 w-64 rounded-[14px]" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[168px] sm:auto-rows-[200px] lg:auto-rows-[220px] [grid-auto-flow:dense] gap-3 sm:gap-4">
          {MOSAIC.map((c, i) => <div key={i} className={`skeleton skeleton-glow rounded-2xl ${c}`} />)}
        </div>
      </div>
    </main>
  );
}
