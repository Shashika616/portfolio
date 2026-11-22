/** Route skeleton for an article, shaped like it: tags, title, dek, byline, cover, paragraphs. */
export default function ArticleLoading() {
  return (
    <main className="min-h-dvh bg-white" aria-busy="true" aria-label="Loading article">
      <div className="fixed top-3 inset-x-3 sm:inset-x-6 h-14 rounded-2xl skeleton" />
      <div className="max-w-2xl mx-auto px-4 sm:px-8 pt-32 pb-24">
        <div className="flex gap-2">{[92, 52, 80].map((w, i) => <div key={i} className="skeleton h-7 rounded" style={{ width: w }} />)}</div>
        <div className="skeleton h-12 sm:h-14 w-full mt-5 rounded-md" />
        <div className="skeleton h-12 sm:h-14 w-3/4 mt-3 rounded-md" />
        <div className="skeleton h-5 w-full mt-6 rounded" />
        <div className="skeleton h-5 w-5/6 mt-2 rounded" />
        <div className="skeleton h-3 w-56 mt-6 rounded" />
        <div className="skeleton skeleton-glow w-full aspect-[16/9] mt-10 rounded-2xl" />
        <div className="mt-12 space-y-3">
          {["w-full", "w-full", "w-11/12", "w-4/5", "w-full", "w-2/3"].map((w, i) => <div key={i} className={`skeleton h-4 ${w} rounded`} />)}
        </div>
      </div>
    </main>
  );
}
