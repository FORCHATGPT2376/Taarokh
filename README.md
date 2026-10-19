# TAAROKH | JAIPUR

Contemporary watch straps for traditional analog watches, inspired by the textile traditions and architecture of Jaipur.

This repository is the complete website: a Next.js 16 (App Router) store with an editorial brand experience, a data-driven catalogue, a persistent bag, a pluggable commerce provider (Shopify Storefront API), newsletter and contact integrations, SEO, and an original procedural image pipeline.

> **Status: catalogue preview.** Following the business plan, the site launches in *preview mode*. Visitors can browse, read, size their watch and fill a bag that is saved on their device. Checkout is disabled and every product is labelled as a concept until real, tested straps exist. Nothing on the site claims sales, reviews, artisans, certifications or history that has not been verified.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # optional; everything works without credentials
npm run dev                    # http://localhost:3000
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm run art` | Re-render all concept imagery into `public/images` (needs Chromium) |
| `npm run qa` | Visual QA sweep: 23 routes × 8 widths (overflow, console errors, broken images, h1s) |
| `npm run e2e` | 24 functional end-to-end tests (bag, filters, forms, gallery, menu, SEO files) |

`qa` and `e2e` run against a server on `PORT` (default `3001`): `npm run build && npx next start -p 3001`, then `PORT=3001 npm run e2e`.

---

## Project structure

```
src/
  app/                  routes (home, shop, collections, products, journal, size-guide,
                        our-story, the-craft, contact, cart, search, faq, care,
                        shipping, returns, privacy, terms, api/*, sitemap, robots, 404)
  components/
    brand/              wordmark, monogram
    layout/             header, mobile menu, search overlay, footer
    home/               hero, strap selector, milestones
    product/            product card, gallery, purchase panel, shop grid & filters
    commerce/           cart provider, drawer, bag contents, quantity control
    editorial/          page header, breadcrumbs, markdown renderer, article card, policy layout
    sizing/             diagrams, sizing assistant
    forms/              newsletter & contact forms
    ui/                 button, reveal motion, image, accordion, skeleton, focus trap
  data/                 ← all editable content (see below)
  lib/
    art/                procedural art engine (patterns, strap, watch) — also powers the live selector
    commerce/           availability rules, provider interface, Shopify provider
    validation.ts       zod schemas (shared client/server)
scripts/                render-art, qa, e2e, shot (screenshot helper)
public/images/          rendered concept imagery (replace with photography)
```

---

## Editing content (no component changes needed)

| What | Where |
| --- | --- |
| Products, prices, variants, specs, images, SEO | `src/data/products.ts` |
| Collections | `src/data/collections.ts` |
| Journal articles (lightweight Markdown) | `src/data/journal.ts` |
| FAQ | `src/data/faq.ts` |
| Store mode, policy values, contact details, navigation | `src/data/site.ts` + env vars |
| Verified milestones (e.g. "100+ straps sold") | `src/data/milestones.ts` |
| Genuine customer reviews | `src/data/reviews.ts` |
| Verified supplier / artisan credits | `credits` array in `src/app/the-craft/page.tsx` |

### Product model

Every product has an id, handle, name, design name, collection, status (`draft` | `preview` | `live`), price (INR) with `priceConfirmed`, colour/material families (used by filters), descriptions, inspiration, **provenance** (exactly what is verified), images with alt text and an optional "Concept render" note, specs (each flagged `verified`), construction, buckle, care, variants, related products and SEO.

Each **variant** has SKU, lug width, buckle width, length, `status` (`live` | `preview` | `planned` | `unavailable`), `stock` (`null` = not configured — never invented) and an optional `shopifyVariantId`.

All purchase rules live in one function, `variantAvailability()` in `src/lib/commerce/availability.ts`, used by the product page, the bag and the server-side checkout route:

- `planned` widths are shown but cannot be selected.
- `preview` variants can sit in the preview bag but can never be checked out.
- `live` variants are purchasable only when the product is `live` and `stock > 0`, capped at `site.maxPerOrder`.
- The bag re-validates stored contents against the catalogue on every load (unknown items are dropped and quantities clamped).

### Taking a product live

1. Photograph the real strap. Replace the files in `public/images/products/<handle>/` (keep the names), or update `images` and remove the `note`.
2. Set `priceConfirmed: true`, confirm specs (`verified: true`) and write the verified `provenance`.
3. On each QC-released variant, set `status: "live"`, the real `stock` and `shopifyVariantId`, then set the product's `status: "live"`.
4. When the merchant account, policies and dispatch process are ready, set `NEXT_PUBLIC_STORE_MODE=live` and the Shopify variables.

Product JSON-LD is only emitted for live, purchasable products with a confirmed price. No rating markup is generated unless genuine reviews exist.

### Milestones and reviews

`<Milestones />` renders nothing unless an entry is `verified`, `display: true` **and** has `evidenceRef`, `approvedBy` and `approvedAt`. Reviews require `consentToPublish`, and `verifiedPurchase` may only be set when the review is matched to a real order.

---

## Integrations

Everything works without credentials and fails honestly: the UI **never** reports a subscription, message or order that did not happen.

| Feature | Provider | Env vars | Without credentials |
| --- | --- | --- | --- |
| Checkout | Shopify Storefront API (`cartCreate` → hosted `checkoutUrl`) | `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Bag works; checkout shows "preview mode", API returns 503 |
| Newsletter | Mailchimp (double opt-in) or Buttondown | `MAILCHIMP_API_KEY` + `MAILCHIMP_AUDIENCE_ID`, or `BUTTONDOWN_API_KEY` | "Sign-ups aren't open yet — nothing was saved." |
| Contact form | Resend | `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | "Your message was not sent." |
| Spam protection | Honeypot + minimum fill time + per-IP rate limit + server validation; optional Cloudflare Turnstile | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Built-in measures still active |

To add another commerce backend (for example a Razorpay-based checkout), implement `CommerceProvider` in `src/lib/commerce/` and register it in `src/lib/commerce/index.ts`. The site never collects card details.

---

## Imagery

No product photography exists yet, so every image is **original procedural artwork** generated by `scripts/render-art.mts` using `src/lib/art/` and `scripts/art/`:

- three print families drawn from scratch (Sanganer buti, Bagru jaal, Jharokha arcade) in 7 colourways;
- a generic, unbranded three-hand analog watch;
- surfaces (sandstone, linen, slate), jaali light and shadow, depth of field and film grain;
- an original architectural illustration and technical diagrams.

Every image is labelled on-site as a "Concept render" or "Illustration". No third-party watch brands, photos or protected artworks are used. `src/data/image-manifest.json` stores intrinsic sizes and blur placeholders. Re-run `npm run art` after changing colourways, or replace the files with real photography using the same paths and aspect ratios (products 1:1 source, shown 4:5; editorial 3:2 / 4:5; hero 2400×1400 desktop and 1200×1900 mobile).

---

## Deployment (Vercel recommended)

1. Push the repository to GitHub and import it in Vercel (framework: Next.js; defaults are fine).
2. Add the environment variables from `.env.example`, at minimum `NEXT_PUBLIC_SITE_URL`.
3. Deploy, then add the custom domain with HTTPS and a www→apex (or apex→www) redirect.
4. Submit `https://<domain>/sitemap.xml` in Google Search Console.

Any Node 20.9+ host works: `npm run build && npm start`. The in-memory rate limiter is per instance; on multi-instance hosting, swap it for a shared store such as Upstash Redis (`src/lib/rate-limit.ts`).

---

## Quality checks performed

- `npm run lint`, `npm run typecheck` and `npm run build`: clean (50 routes, mostly static).
- `npm run qa`: 0 issues across 23 routes at 320, 375, 390, 430, 768, 1024, 1440 and 1920 px (no horizontal overflow, console errors, failed requests or broken images; one `h1` per page).
- `npm run e2e`: 24/24 passing, covering:
  - required width selection and blocked planned widths;
  - the per-order maximum, bag persistence and sanitising of tampered storage;
  - preview-mode checkout refusal;
  - filters, sorting and the empty state;
  - the gallery and lightbox;
  - honest newsletter and contact failures and form validation;
  - the sizing assistant, search, strap selector and mobile menu;
  - the skip link, robots.txt, sitemap.xml and the 404 page.
- Screenshots: `docs/screenshots/`.

Accessibility measures:

- semantic landmarks and a skip link;
- visible focus styles;
- focus-trapped dialogs (bag, menu, search, filters, lightbox) that close with Escape;
- labelled controls and `aria-live` form feedback;
- reduced-motion support (`MotionConfig reducedMotion="user"` and a CSS override);
- colour tokens chosen for AA contrast: `stone` and `gold-deep` are used for small text on ivory, and pure gold only on dark backgrounds.

---

## Remaining launch dependencies

These need founder decisions or real-world evidence and cannot be built:

1. **Physical product**: tested samples (fit, wear, colourfastness, attachment), final specs, lengths and hole spacing, and QC release per batch.
2. **Real photography** of each strap, replacing the concept renders.
3. **Confirmed prices**, SKUs, stock and the material composition and provenance for each product, with GI/hand-block claims only if documented.
4. **Legal and business**: trademark and domain clearance, the legal merchant entity (an adult or business account holder), GST and invoicing advice, a grievance officer, and business address and contact details.
5. **Policies**: final shipping, returns, privacy and terms, reviewed against the Consumer Protection (E-Commerce) Rules and the DPDP Act. Fill in the `site.policies` values.
6. **Accounts and credentials**: Shopify (or another provider) with an India payment gateway, a mailing-list provider, Resend with a verified sending domain (SPF/DKIM/DMARC), and optionally Turnstile and analytics (add a consent mechanism first).
7. **Operations**: courier and dispatch process, order emails, a support inbox and a returns workflow.
8. **Optional**: real Instagram URL, analytics (GA4 + Search Console), and verified milestones and reviews once they exist.
