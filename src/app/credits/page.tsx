import type { Metadata } from "next";
import { PageHeader } from "@/components/editorial/PageHeader";
import { Img } from "@/components/ui/Img";
import { imageCredits } from "@/data/image-credits";

export const metadata: Metadata = { title: "Image Credits", description: "Photographs used on the TAAROKH website and their licences.", alternates: { canonical: "/credits" } };

export default function CreditsPage() {
  const list = imageCredits.filter((c) => !c.title.endsWith("(detail crop)"));
  return (
    <>
      <PageHeader crumbs={[{ href: "/credits", label: "Image credits" }]} eyebrow="With thanks" title={["Image credits"]} intro="Photographs of Jaipur and of block-printing craft are used under open licences. Product images of TAAROKH straps are our own digital renderings." />
      <section className="container-luxe pb-32">
        <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <li key={c.file}>
              <Img src={c.file} alt={c.subject} aspect="4/3" sizes="(min-width:1024px) 30vw, 90vw" />
              <p className="serif mt-4 text-2xl leading-tight">{c.subject}</p>
              <p className="mt-2 text-sm text-stone">
                By {c.author} ·{" "}
                {c.licenseUrl ? <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer license" className="underline underline-offset-2">{c.license}</a> : c.license}
                {" · "}
                <a href={c.source} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Source</a>
              </p>
              <p className="mt-1 text-xs text-stone">Resized{c.title.includes("cotton") ? " and cropped" : ""} for this site.</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
