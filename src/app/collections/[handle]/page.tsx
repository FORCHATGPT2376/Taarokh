import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { collections, getCollection } from "@/data/collections";
import { productsInCollection } from "@/data/products";
import { Breadcrumbs } from "@/components/editorial/Breadcrumbs";
import { ProductCard } from "@/components/product/ProductCard";
import { Img } from "@/components/ui/Img";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { PageSkeleton } from "@/components/ui/Skeleton";

export function generateStaticParams() {
  return collections.map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[handle]">): Promise<Metadata> {
  const c = getCollection((await params).handle);
  if (!c) return { title: "Collection not found" };
  return { title: `${c.name} Collection — Watch Straps`, description: `${c.tagline} ${c.description[0]}`, alternates: { canonical: `/collections/${c.handle}` }, openGraph: { images: [{ url: c.image, alt: c.imageAlt }] } };
}

export default function CollectionPage({ params }: PageProps<"/collections/[handle]">) {
  return (
    <Suspense fallback={<PageSkeleton variant="grid" />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: { params: PageProps<"/collections/[handle]">["params"] }) {
  const c = getCollection((await params).handle);
  if (!c) notFound();
  const items = productsInCollection(c.handle);
  const others = collections.filter((x) => x.handle !== c.handle);
  return (
    <>
      <section className={c.tone === "dark" ? "dark-surface bg-ink text-ivory" : "bg-paper"}>
        <div className="container-luxe grid gap-12 py-12 md:grid-cols-12 md:items-end md:py-20">
          <div className="md:col-span-5">
            <div className={c.tone === "dark" ? "[&_*]:!text-ivory/70" : ""}>
              <Breadcrumbs items={[{ href: "/collections", label: "Collections" }, { href: `/collections/${c.handle}`, label: c.name }]} />
            </div>
            <p className={`serif mt-12 text-7xl ${c.tone === "dark" ? "text-gold" : "text-gold-deep/80"}`}>{c.number}</p>
            <h1 className="serif mt-4 text-headline font-light">
              <LineReveal immediate lines={[c.name]} />
            </h1>
            <p className="serif mt-5 text-2xl leading-snug">{c.tagline}</p>
            <div className={`mt-6 space-y-4 text-sm leading-relaxed ${c.tone === "dark" ? "text-ivory/70" : "text-stone"}`}>
              {c.description.map((d) => <p key={d}>{d}</p>)}
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <Img src={c.image} alt={c.imageAlt} aspect="4/5" priority sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
        </div>
      </section>
      <section className="container-luxe py-24" aria-label={`${c.name} straps`}>
        <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1}>
              <ProductCard product={p} index={i} priority={i < 3} />
            </Reveal>
          ))}
        </div>
      </section>
      <section className="border-t border-line">
        <div className="container-luxe grid gap-6 py-16 sm:grid-cols-2">
          {others.map((o) => (
            <Link key={o.handle} href={`/collections/${o.handle}`} className="group flex items-center gap-6">
              <Img src={o.image} alt="" aspect="1/1" className="w-24 shrink-0" sizes="96px" imgClassName="transition-transform duration-1000 group-hover:scale-110" />
              <div>
                <p className="eyebrow text-[0.6rem] text-stone">Collection {o.number}</p>
                <p className="serif mt-1 text-3xl link-underline">{o.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
