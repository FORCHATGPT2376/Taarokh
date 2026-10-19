import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/editorial/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";
import { TBC } from "@/components/editorial/DraftNotice";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about sizing, materials, an order or a collaboration — get in touch with TAAROKH.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const c = site.contact;
  return (
    <>
      <PageHeader crumbs={[{ href: "/contact", label: "Contact" }]} eyebrow="Contact" title={["We'd like to", "hear from you."]} intro="Sizing questions are the most common — send your watch model and we'll check before you order." />
      <section className="container-luxe grid gap-16 pb-32 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
        <aside className="space-y-10 lg:col-span-4 lg:col-start-9">
          <div className="border-t border-line pt-6">
            <p className="eyebrow text-[0.6rem] text-stone">Phone &amp; WhatsApp</p>
            <p className="mt-2 serif text-3xl">{c.supportPhone ? <a href={`tel:${c.supportPhone.replace(/\s/g, "")}`} className="link-underline">{c.supportPhone}</a> : <TBC value={null} />}</p>
            <p className="mt-1 text-xs text-stone">Call to order, or for help with sizing.</p>
          </div>
          <div className="border-t border-line pt-6">
            <p className="eyebrow text-[0.6rem] text-stone">Email</p>
            <p className="mt-2 serif text-2xl">{c.supportEmail ? <a href={`mailto:${c.supportEmail}`} className="link-underline">{c.supportEmail}</a> : <TBC value={null} />}</p>
          </div>
          <div className="border-t border-line pt-6">
            <p className="eyebrow text-[0.6rem] text-stone">Response hours</p>
            <p className="mt-2 text-sm"><TBC value={c.supportHours} /></p>
          </div>
          <div className="border-t border-line pt-6">
            <p className="eyebrow text-[0.6rem] text-stone">Business details</p>
            <p className="mt-2 text-sm leading-relaxed"><TBC value={c.businessName} /><br /><TBC value={c.businessAddress} /></p>
            <p className="mt-3 text-sm">Grievance contact: <TBC value={c.grievanceOfficer} /></p>
          </div>
          <div className="border-t border-line pt-6 text-sm leading-relaxed text-stone">
            <p>Before you write: our <Link href="/size-guide" className="underline underline-offset-2">size guide</Link> and <Link href="/faq" className="underline underline-offset-2">FAQ</Link> answer the most common questions.</p>
          </div>
        </aside>
      </section>
    </>
  );
}
