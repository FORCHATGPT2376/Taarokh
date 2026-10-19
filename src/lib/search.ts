import { products } from "@/data/products";
import { articles, journalCategories } from "@/data/journal";
import { collections } from "@/data/collections";

export interface SearchItem {
  type: "Strap" | "Journal" | "Collection" | "Page";
  title: string;
  href: string;
  text: string;
  image?: string;
}

const pages: SearchItem[] = [
  { type: "Page", title: "Size Guide", href: "/size-guide", text: "lug width measure strap length wrist buckle spring bar quick release fit compatibility" },
  { type: "Page", title: "Our Story", href: "/our-story", text: "born of jaipur about brand inspiration" },
  { type: "Page", title: "The Craft", href: "/the-craft", text: "textiles patterns construction materials finishing care block printing provenance" },
  { type: "Page", title: "Strap Care", href: "/care", text: "care cleaning fabric water storage" },
  { type: "Page", title: "FAQ", href: "/faq", text: "questions smartwatch compatibility delivery returns hand block printed" },
  { type: "Page", title: "Shipping", href: "/shipping", text: "delivery dispatch shipping india" },
  { type: "Page", title: "Returns & Exchanges", href: "/returns", text: "returns exchange refund width" },
  { type: "Page", title: "Contact", href: "/contact", text: "contact email support help order" },
];

export const searchIndex: SearchItem[] = [
  ...products
    .filter((p) => p.status !== "draft")
    .map((p) => ({
      type: "Strap" as const,
      title: p.name,
      href: `/products/${p.handle}`,
      text: [p.design, p.collection, p.color, p.material, p.shortDescription, ...p.variants.map((v) => `${v.lugWidthMm}mm ${v.lugWidthMm} mm`)].join(" "),
      image: p.images[0]?.src,
    })),
  ...collections.map((c) => ({ type: "Collection" as const, title: `${c.name} Collection`, href: `/collections/${c.handle}`, text: `${c.tagline} ${c.description.join(" ")}`, image: c.image })),
  ...articles.map((a) => ({ type: "Journal" as const, title: a.title, href: `/journal/${a.slug}`, text: `${a.dek} ${journalCategories[a.category].label}`, image: a.image })),
  ...pages,
];

export function search(q: string): SearchItem[] {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return searchIndex
    .map((item) => {
      const hay = `${item.title} ${item.text}`.toLowerCase();
      const title = item.title.toLowerCase();
      let score = 0;
      for (const t of terms) {
        if (!hay.includes(t)) return { item, score: -1 };
        score += title.includes(t) ? 3 : 1;
      }
      return { item, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.item);
}
