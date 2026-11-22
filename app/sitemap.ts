import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/site";
import { ARTICLES } from "./data/writing";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/profile`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/writing`, changeFrequency: "monthly", priority: 0.8 },
    ...ARTICLES.map((a) => ({ url: `${SITE_URL}/writing/${a.slug}`, lastModified: a.published, changeFrequency: "yearly" as const, priority: 0.7 })),
  ];
}
