import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { publishedProducts } from "@/data/products";
import { collections } from "@/data/collections";
import { articles, journalCategories } from "@/data/journal";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${site.url}${p}`;
  const pages = ["", "/shop", "/collections", "/our-story", "/the-craft", "/journal", "/size-guide", "/contact", "/faq", "/care", "/shipping", "/returns", "/privacy", "/terms", "/credits"];
  return [
    ...pages.map((p) => ({ url: u(p || "/"), changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...collections.map((c) => ({ url: u(`/collections/${c.handle}`), priority: 0.8 })),
    ...publishedProducts().map((p) => ({ url: u(`/products/${p.handle}`), priority: 0.9, images: p.images.map((i) => u(i.src)) })),
    ...articles.map((a) => ({ url: u(`/journal/${a.slug}`), lastModified: a.publishedAt, priority: 0.6 })),
    ...Object.keys(journalCategories).map((k) => ({ url: u(`/journal/category/${k}`), priority: 0.4 })),
  ];
}
