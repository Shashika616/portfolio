/**
 * Route skeleton for /profile, shaped 1:1 like the magazine cover (masthead,
 * issue line, name, cover lines, portrait). Shapes glow in the active theme.
 */
export default function ProfileLoading() {
  return (
    <div className="min-h-dvh bg-[var(--background)] pt-24 px-5 sm:px-10" aria-busy="true" aria-label="Loading profile">
      <div className="skeleton h-[clamp(4rem,16vw,14rem)] w-[min(92vw,1100px)] rounded-md" />
      <div className="skeleton h-8 w-full mt-3 rounded" />
      <div className="mt-8 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-5 order-2 lg:order-1">
          <div className="skeleton h-14 w-3/4 rounded-md" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-5/6 rounded" />
          {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-9 w-full rounded" />)}
          <div className="flex gap-2.5">
            {[120, 80, 44, 44].map((w, i) => <div key={i} className="skeleton h-11 rounded-xl" style={{ width: w }} />)}
          </div>
        </div>
        <div className="lg:col-span-5 order-1 lg:order-2">
          <div className="skeleton skeleton-glow aspect-[4/5] w-full" />
        </div>
      </div>
    </div>
  );
}
