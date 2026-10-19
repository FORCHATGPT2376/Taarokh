import Link from "next/link";
import { footerNav, site } from "@/data/site";
import { Wordmark } from "@/components/brand/Wordmark";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { FooterNewsletter } from "./FooterNewsletter";

export function Footer() {
  return (
    <footer className="dark-surface relative overflow-hidden bg-ink text-ivory">
      <div className="container-luxe pt-24 sm:pt-32">
        <FooterNewsletter>
        <div className="mb-24 grid gap-16 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="eyebrow text-gold">Notes from Jaipur</p>
            <p className="serif mt-5 max-w-md text-4xl leading-tight sm:text-5xl">New collections, design stories, occasional updates.</p>
          </div>
          <div className="lg:pt-10">
            <NewsletterForm tone="dark" source="footer" compact />
          </div>
        </div>
        </FooterNewsletter>

        <div className="grid gap-12 border-t border-line-dark pt-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <p className="text-sm leading-relaxed text-ivory/70">
              Contemporary straps for traditional analog watches, inspired by the textile traditions and architecture of Jaipur.
            </p>
            {site.contact.supportPhone && (
              <p className="mt-6">
                <a href={`tel:${site.contact.supportPhone.replace(/\s/g, "")}`} className="serif text-2xl text-ivory link-underline">{site.contact.supportPhone}</a>
              </p>
            )}
            <p className="mt-6 text-xs leading-relaxed text-ivory/50">
              Independent aftermarket straps. Not affiliated with or endorsed by any watch brand.
            </p>
          </div>
          {Object.entries(footerNav).map(([title, links]) => (
            <nav key={title} aria-label={title}>
              <p className="eyebrow text-ivory/50">{title}</p>
              <ul className="mt-5 space-y-3">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-ivory/85 link-underline hover:text-ivory">
                      {l.label}
                    </Link>
                  </li>
                ))}
                {title === "House" && site.social.instagram && (
                  <li>
                    <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-ivory/85 link-underline hover:text-ivory">
                      Instagram
                    </a>
                  </li>
                )}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-24 flex justify-center text-ivory/90">
          <Wordmark stacked />
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line-dark py-8 text-[0.68rem] tracking-[0.08em] text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {site.copyrightYear} {site.contact.businessName ?? "TAAROKH"}. All rights reserved.</p>
          <p className="italic serif text-sm tracking-normal text-ivory/60">Designed with Jaipur in mind.</p>
          <Link href="/credits" className="link-underline">Image credits</Link>
        </div>
      </div>
    </footer>
  );
}
