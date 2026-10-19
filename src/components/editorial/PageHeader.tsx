import type { ReactNode } from "react";
import { LineReveal, Reveal } from "@/components/ui/Reveal";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

export function PageHeader({ eyebrow, title, intro, crumbs, children }: { eyebrow?: string; title: string[]; intro?: ReactNode; crumbs?: Crumb[]; children?: ReactNode }) {
  return (
    <section className="container-luxe pb-14 pt-12 sm:pb-20 sm:pt-20">
      {crumbs && <Breadcrumbs items={crumbs} />}
      {eyebrow && (
        <Reveal>
          <p className="eyebrow mt-10 text-gold-deep">{eyebrow}</p>
        </Reveal>
      )}
      <h1 className="serif mt-6 text-headline font-light">
        <LineReveal immediate lines={title} />
      </h1>
      {intro && (
        <Reveal delay={0.25} className="mt-8 max-w-xl text-lg leading-relaxed text-stone">
          {intro}
        </Reveal>
      )}
      {children}
    </section>
  );
}
