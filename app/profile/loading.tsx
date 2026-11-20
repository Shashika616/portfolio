/**
 * Route-level skeleton for /profile. Mirrors the real layout 1:1 (masthead,
 * cover, avatar, name, stats, tabs, two posts, side rail) so nothing jumps
 * when the page arrives. Shapes glow in the active theme (see .skeleton).
 */
export default function ProfileLoading() {
  return (
    <div className="min-h-dvh bg-[#f4f6f9]" aria-busy="true" aria-label="Loading profile">
      {/* Dark masthead with the wordmark's footprint */}
      <div className="h-[78dvh] bg-[#232325] flex flex-col items-center justify-center gap-5">
        <div className="skeleton skeleton-dark h-[clamp(4rem,14vw,11rem)] w-[min(80vw,900px)] rounded-xl" />
        <div className="skeleton skeleton-dark h-6 w-64 rounded-md" />
      </div>
      <div className="relative -mt-[0dvh] max-w-6xl mx-auto sm:px-6 sm:pt-6">
        <section className="bg-white sm:rounded-3xl ring-1 ring-slate-200/80 overflow-hidden skeleton-glow">
          <div className="skeleton h-52 sm:h-72" />
          <div className="px-5 sm:px-8 pb-6">
            <div className="-mt-12 sm:-mt-14 w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-white skeleton" />
            <div className="mt-4 space-y-3 max-w-2xl">
              <div className="skeleton h-10 w-72 rounded-lg" />
              <div className="skeleton h-4 w-40 rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-4/5 rounded" />
              <div className="flex gap-3 pt-1">
                {[80, 110, 70, 100].map((w) => <div key={w} className="skeleton h-4 rounded" style={{ width: w }} />)}
              </div>
            </div>
          </div>
          <div className="flex gap-6 px-6 h-12 items-center border-t border-slate-100">
            {[56, 84, 92, 52].map((w) => <div key={w} className="skeleton h-4 rounded" style={{ width: w }} />)}
          </div>
        </section>

        <div className="mt-3 sm:mt-6 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-3 sm:gap-6 items-start">
          <div className="space-y-4">
            <div className="flex gap-2 px-3 sm:px-0">
              {[48, 60, 84, 96, 120].map((w) => <div key={w} className="skeleton h-[34px]" style={{ width: w, clipPath: "polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)" }} />)}
            </div>
            {[0, 1].map((i) => (
              <article key={i} className="bg-white sm:rounded-2xl ring-1 ring-slate-200/80 overflow-hidden">
                <div className="px-5 pt-4 flex items-center gap-3">
                  <div className="skeleton w-10 h-10 rounded-full" />
                  <div className="space-y-1.5">
                    <div className="skeleton h-3.5 w-32 rounded" />
                    <div className="skeleton h-3 w-24 rounded" />
                  </div>
                </div>
                <div className="px-5 pt-3 space-y-2">
                  <div className="skeleton h-7 w-3/4 rounded-md" />
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-4 w-2/3 rounded" />
                </div>
                <div className="skeleton mt-3 aspect-[16/9]" />
                <div className="px-5 py-3 flex gap-1.5">
                  {[60, 48, 72, 56].map((w) => <div key={w} className="skeleton h-5 rounded" style={{ width: w }} />)}
                </div>
              </article>
            ))}
          </div>
          <aside className="hidden lg:block space-y-4">
            {[180, 140, 110].map((h) => (
              <div key={h} className="bg-white rounded-2xl ring-1 ring-slate-200/80 p-5 space-y-3">
                <div className="skeleton h-4 w-24 rounded" />
                <div className="skeleton rounded-lg" style={{ height: h - 40 }} />
              </div>
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
}
