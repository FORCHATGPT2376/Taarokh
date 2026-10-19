import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/editorial/PageHeader";
import { Accordion } from "@/components/ui/Accordion";
import { faq } from "@/data/faq";

export const metadata: Metadata = { title: "Frequently Asked Questions", description: "Answers on fit, compatibility, materials, hand-block printing and orders.", alternates: { canonical: "/faq" } };

export default function FaqPage() {
  const cats = ["Fit", "Product", "Orders"] as const;
  return (
    <>
      <PageHeader crumbs={[{ href: "/faq", label: "FAQ" }]} eyebrow="Customer care" title={["Questions,", "answered plainly."]} />
      <section className="container-luxe grid gap-16 pb-32 lg:grid-cols-12">
        <div className="space-y-16 lg:col-span-8">
          {cats.map((c) => (
            <div key={c}>
              <h2 className="serif mb-6 text-3xl">{c}</h2>
              <Accordion defaultOpen={-1} items={faq.filter((f) => f.category === c).map((f) => ({ title: f.q, content: <p className="max-w-2xl">{f.a}</p> }))} />
            </div>
          ))}
        </div>
        <aside className="lg:col-span-3 lg:col-start-10">
          <p className="serif text-2xl">Still unsure?</p>
          <p className="mt-3 text-sm leading-relaxed text-stone">Send us your watch model and we&rsquo;ll check the fit with you.</p>
          <Link href="/contact" className="mt-6 inline-flex min-h-12 items-center bg-ink px-8 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-ivory hover:bg-indigo">Contact us</Link>
        </aside>
      </section>
    </>
  );
}
