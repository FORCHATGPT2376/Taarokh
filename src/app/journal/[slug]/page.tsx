import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { articles, articleWords, getArticle, journalCategories } from "@/data/journal";
import { site } from "@/data/site";
import { readingTime } from "@/lib/format";
import { Breadcrumbs } from "@/components/editorial/Breadcrumbs";
import { Markdown } from "@/components/editorial/Markdown";
import { ArticleCard } from "@/components/editorial/ArticleCard";
import { Img } from "@/components/ui/Img";
import { LineReveal } from "@/components/ui/Reveal";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { ButtonLink } from "@/components/ui/Button";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const a = getArticle((await params).slug);
  if (!a) return { title: "Story not found" };
  return {
    title: a.title,
    description: a.dek,
    alternates: { canonical: `/journal/${a.slug}` },
    openGraph: { type: "article", title: a.title, description: a.dek, publishedTime: a.publishedAt, images: [{ url: a.image, alt: a.imageAlt }] },
  };
}

export default function ArticlePage({ params }: PageProps<"/journal/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton variant="article" />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: { params: PageProps<"/journal/[slug]">["params"] }) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const cat = journalCategories[a.category];
  const related = [...articles.filter((x) => x.slug !== a.slug && x.category === a.category), ...articles.filter((x) => x.slug !== a.slug && x.category !== a.category)].slice(0, 3);
  const mins = readingTime(articleWords(a));
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.dek,
    image: `${site.url}${a.image}`,
    datePublished: a.publishedAt,
    publisher: { "@type": "Organization", name: "TAAROKH" },
    mainEntityOfPage: `${site.url}/journal/${a.slug}`,
  };
  const date = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(a.publishedAt));
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <header className="container-luxe pt-12 sm:pt-20">
        <Breadcrumbs items={[{ href: "/journal", label: "Journal" }, { href: `/journal/category/${a.category}`, label: cat.label }]} />
        <div className="mx-auto mt-14 max-w-4xl text-center">
          <p className="eyebrow text-gold-deep">{cat.label}</p>
          <h1 className="serif mt-6 text-[clamp(2.4rem,1.4rem+3.6vw,4.75rem)] font-light leading-[1.04]">
            <LineReveal immediate lines={[a.title]} />
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-stone">{a.dek}</p>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-stone">
            <time dateTime={a.publishedAt}>{date}</time> · {mins} min read
          </p>
        </div>
      </header>
      <div className="container-luxe mt-14">
        <Img src={a.image} alt={a.imageAlt} aspect="16/9" priority sizes="100vw" />
      </div>
      <div className="container-luxe">
        <div className="prose-luxe mx-auto max-w-[40rem] py-16 sm:py-24 [&>p:first-child]:first-letter:float-left [&>p:first-child]:first-letter:mr-3 [&>p:first-child]:first-letter:font-serif [&>p:first-child]:first-letter:text-[4.2rem] [&>p:first-child]:first-letter:leading-[0.85] [&>p:first-child]:first-letter:text-ink">
          <Markdown source={a.body} />
        </div>
        <div className="mx-auto flex max-w-[40rem] flex-wrap items-center justify-between gap-6 border-t border-line py-10">
          <p className="serif text-2xl">Find a strap that fits.</p>
          <ButtonLink href="/shop" variant="outline" arrow>Explore the collection</ButtonLink>
        </div>
      </div>
      <section className="border-t border-line bg-paper py-24" aria-labelledby="related-stories">
        <div className="container-luxe">
          <div className="flex items-end justify-between">
            <h2 id="related-stories" className="serif text-4xl sm:text-5xl">Further reading</h2>
            <Link href="/journal" className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] link-underline-static">All stories</Link>
          </div>
          <div className="mt-12 grid gap-14 md:grid-cols-3 md:gap-8">
            {related.map((r) => <ArticleCard key={r.slug} article={r} />)}
          </div>
        </div>
      </section>
    </article>
  );
}
