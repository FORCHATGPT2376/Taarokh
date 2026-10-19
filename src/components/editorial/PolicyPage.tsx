import type { ReactNode } from "react";
import { PageHeader } from "./PageHeader";
import { DraftNotice } from "./DraftNotice";
import { site } from "@/data/site";

export function PolicyPage({ slug, title, intro, children, draft = true }: { slug: string; title: string; intro?: string; children: ReactNode; draft?: boolean }) {
  return (
    <>
      <PageHeader crumbs={[{ href: `/${slug}`, label: title }]} eyebrow="Customer care" title={[title]} intro={intro} />
      <section className="container-luxe grid gap-12 pb-32 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-[calc(var(--header-offset)+2rem)]">
            {draft && <DraftNotice />}
            <p className="mt-6 text-xs text-stone">Last reviewed: {site.policies.lastReviewed ?? "not yet reviewed"}</p>
          </div>
        </aside>
        <div className="prose-luxe max-w-[42rem] lg:col-span-8 lg:col-start-5">{children}</div>
      </section>
    </>
  );
}
