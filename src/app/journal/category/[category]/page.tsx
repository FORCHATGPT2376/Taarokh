import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "@/components/editorial/PageHeader";
import { JournalNav } from "@/components/editorial/JournalNav";
import { ArticleCard } from "@/components/editorial/ArticleCard";
import { articles, journalCategories, type JournalCategory } from "@/data/journal";
import { PageSkeleton } from "@/components/ui/Skeleton";

export function generateStaticParams() {
  return Object.keys(journalCategories).map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps<"/journal/category/[category]">): Promise<Metadata> {
  const c = journalCategories[(await params).category as JournalCategory];
  if (!c) return { title: "Not found" };
  return { title: `${c.label} — Journal`, description: c.description, alternates: { canonical: `/journal/category/${(await params).category}` } };
}

export default function CategoryPage({ params }: PageProps<"/journal/category/[category]">) {
  return (
    <Suspense fallback={<PageSkeleton variant="grid" />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: { params: PageProps<"/journal/category/[category]">["params"] }) {
  const key = (await params).category as JournalCategory;
  const cat = journalCategories[key];
  if (!cat) notFound();
  const list = articles.filter((a) => a.category === key);
  return (
    <>
      <PageHeader crumbs={[{ href: "/journal", label: "Journal" }, { href: `/journal/category/${key}`, label: cat.label }]} eyebrow="Journal" title={[cat.label]} intro={cat.description} />
      <JournalNav active={key} />
      <section className="container-luxe grid gap-x-8 gap-y-20 py-16 md:grid-cols-2 lg:grid-cols-3">
        {list.map((a) => <ArticleCard key={a.slug} article={a} />)}
      </section>
    </>
  );
}
