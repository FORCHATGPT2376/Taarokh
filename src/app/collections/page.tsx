import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/editorial/PageHeader";
import { Img } from "@/components/ui/Img";
import { Reveal } from "@/components/ui/Reveal";
import { collections } from "@/data/collections";
import { productsInCollection } from "@/data/products";
import { cx } from "@/lib/format";

export const metadata: Metadata = {
  title: "Collections — Sanganer, Bagru & Jharokha",
  description: "Three collections of heritage-inspired watch straps: Sanganer florals, Bagru lattices and Jharokha architectural line work.",
  alternates: { canonical: "/collections" },
};

export default function CollectionsPage() {
  return (
    <>
      <PageHeader crumbs={[{ href: "/collections", label: "Collections" }]} eyebrow="Three studies" title={["The Collections"]} intro="Each collection begins with a different view of Jaipur — its printed cloth, and its architecture." />
      <div className="pb-32">
        {collections.map((c, i) => {
          const count = productsInCollection(c.handle).length;
          const flip = i % 2 === 1;
          return (
            <section key={c.handle} className={cx("container-luxe grid items-center gap-10 py-14 md:grid-cols-12 md:gap-8 md:py-20")} aria-labelledby={`c-${c.handle}`}>
              <Reveal className={cx("md:col-span-7", flip && "md:order-2 md:col-start-6")}>
                <Link href={`/collections/${c.handle}`} className="group block">
                  <Img src={c.image} alt={c.imageAlt} aspect="5/4" sizes="(min-width: 768px) 58vw, 100vw" imgClassName="transition-transform duration-[1.8s] ease-[var(--ease-luxe)] group-hover:scale-[1.05]" />
                </Link>
              </Reveal>
              <Reveal delay={0.15} className={cx("md:col-span-4", flip ? "md:order-1 md:col-start-1" : "md:col-start-9")}>
                <p className="serif text-6xl text-gold-deep/80">{c.number}</p>
                <h2 id={`c-${c.handle}`} className="eyebrow mt-6 text-sm tracking-[0.42em]">{c.name}</h2>
                <p className="serif mt-4 text-3xl leading-snug">{c.tagline}</p>
                <p className="mt-5 text-sm leading-relaxed text-stone">{c.description[0]}</p>
                <Link href={`/collections/${c.handle}`} className="mt-8 inline-flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em]">
                  <span className="link-underline-static">Explore {count} {count === 1 ? "strap" : "straps"}</span> <span aria-hidden>→</span>
                </Link>
              </Reveal>
            </section>
          );
        })}
      </div>
    </>
  );
}
