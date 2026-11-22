import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ARTICLES, findArticle, type Block } from "../../data/writing";
import { PROFILE } from "../../data/profile";
import { SITE_URL } from "../../lib/site";
import { WritingBar } from "../WritingBar";

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = findArticle((await params).slug);
  if (!a) return {};
  return {
    title: `${a.title} | Shashika Fernando`,
    description: a.dek,
    alternates: { canonical: `/writing/${a.slug}` },
    openGraph: { type: "article", title: a.title, description: a.dek, publishedTime: a.published, authors: [PROFILE.name] },
  };
}

const date = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

function Render({ b }: { b: Block }) {
  switch (b.kind) {
    case "p":
      return <p className="text-[17px] leading-8 text-slate-700 text-pretty">{b.text}</p>;
    case "h":
      return <h2 className="display pt-6 text-[1.9rem] sm:text-[2.2rem] leading-tight text-slate-900">{b.text}</h2>;
    case "list":
      return (
        <ul className="space-y-2.5 pl-5 list-disc marker:text-[var(--accent-strong)]">
          {b.items.map((it) => <li key={it} className="text-[17px] leading-7 text-slate-700 pl-1 text-pretty">{it}</li>)}
        </ul>
      );
    case "table":
      return (
        <figure className="rounded-2xl overflow-hidden" style={{ boxShadow: "inset 0 0 0 1px #e2e8f0" }}>
          <table className="w-full text-left text-[15px]">
            <thead style={{ background: "color-mix(in srgb, var(--accent) 8%, #fff)" }}>
              <tr>{b.head.map((h) => <th key={h} scope="col" className="px-4 py-3 font-semibold text-slate-900">{h}</th>)}</tr>
            </thead>
            <tbody>
              {b.rows.map(([k, v]) => (
                <tr key={k} className="border-t border-slate-100">
                  <th scope="row" className="px-4 py-3 font-medium text-slate-700 align-top">{k}</th>
                  <td className="px-4 py-3 text-slate-900 tabular">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <figcaption className="px-4 py-2.5 text-[13px] text-slate-500 border-t border-slate-100">{b.caption}</figcaption>
        </figure>
      );
    case "note":
      return <p className="text-[15px] leading-6 text-slate-600 pl-4 border-l-2" style={{ borderColor: "var(--accent)" }}>{b.text}</p>;
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = findArticle((await params).slug);
  if (!a) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: a.title,
    description: a.dek,
    datePublished: a.published,
    author: { "@type": "Person", name: PROFILE.name, url: `${SITE_URL}/profile` },
    url: `${SITE_URL}/writing/${a.slug}`,
    keywords: a.tags.join(", "),
  };

  return (
    <main className="min-h-dvh bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <WritingBar />
      <article className="max-w-2xl mx-auto px-4 sm:px-8 pt-32 pb-24">
        <header className="space-y-5">
          <div className="flex flex-wrap gap-2">{a.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
          <h1 className="display text-[2.6rem] sm:text-[3.6rem] leading-[1.02] text-slate-900 text-balance">{a.title}</h1>
          <p className="text-[19px] leading-8 text-slate-600 text-pretty">{a.dek}</p>
          <p className="font-mono text-[12px] tabular text-slate-500">{PROFILE.name} · {date(a.published)} · {a.readMinutes} min read</p>
        </header>
        <div className="mt-12 space-y-6">
          {a.body.map((b, i) => <Render key={i} b={b} />)}
        </div>
        <footer className="mt-16 pt-8 border-t border-slate-900/10">
          <Link href="/writing" className="btn btn-secondary"><ArrowLeft className="w-4 h-4" /> All writing</Link>
        </footer>
      </article>
    </main>
  );
}
