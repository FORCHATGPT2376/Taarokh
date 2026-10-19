import type { Metadata } from "next";
import { PageHeader } from "@/components/editorial/PageHeader";
import { JournalNav } from "@/components/editorial/JournalNav";
import { ArticleCard } from "@/components/editorial/ArticleCard";
import { Reveal } from "@/components/ui/Reveal";
import { articles } from "@/data/journal";

export const metadata: Metadata = {
  title: "Journal — Watch Straps, Craft & Jaipur Design",
  description: "Guides to lug width and strap choice, and stories on Sanganeri and Bagru printing and Jaipur's architecture.",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  const [lead, ...rest] = articles;
  return (
    <>
      <PageHeader crumbs={[{ href: "/journal", label: "Journal" }]} eyebrow="The journal" title={["Notes on craft", "and time."]} intro="Practical guides to fit and materials, and short essays on the design traditions behind our straps." />
      <JournalNav />
      <section className="container-luxe py-16">
        <Reveal>
          <ArticleCard article={lead} large sizes="(min-width: 1024px) 80vw, 100vw" />
        </Reveal>
        <div className="mt-24 grid gap-x-8 gap-y-20 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((a, i) => (
            <Reveal key={a.slug} delay={(i % 3) * 0.1}>
              <ArticleCard article={a} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
