/**
 * Site-wide configuration. Edit here (or via environment variables) —
 * no component changes required.
 *
 * Anything set to `null` is displayed to customers as "to be confirmed"
 * rather than invented.
 */

export type StoreMode = "preview" | "live";

// NEXT_PUBLIC_* values must be read literally so Next.js can inline them for the browser.
const env = (v: string | undefined) => (v && v.trim() !== "" ? v.trim() : null);

export const site = {
  name: "TAAROKH",
  fullName: "TAAROKH | JAIPUR",
  tagline: "Contemporary watch straps inspired by the artistry of Jaipur.",
  url: env(process.env.NEXT_PUBLIC_SITE_URL) ?? "https://www.taarokh.com",
  locale: "en_IN",
  copyrightYear: 2026,
  currency: "INR" as const,

  /**
   * "preview": catalogue is visible, the bag works, checkout is disabled.
   * "live": only variants with status "live" and stock > 0 can be bought,
   * and checkout redirects to the configured commerce provider.
   */
  storeMode: (env(process.env.NEXT_PUBLIC_STORE_MODE) === "live" ? "live" : "preview") as StoreMode,

  /**
   * Payment method offered at checkout. Only Cash on Delivery is enabled:
   * orders are sent to the store (see /api/orders) and confirmed by phone
   * before dispatch; nothing is charged online.
   */
  payment: "cod" as const,

  /** Max units of one variant per order (prevents accidental bulk orders). */
  maxPerOrder: 5,

  contact: {
    supportEmail: env(process.env.NEXT_PUBLIC_SUPPORT_EMAIL),
    supportPhone: env(process.env.NEXT_PUBLIC_SUPPORT_PHONE) ?? "+91 7378010000",
    supportHours: env(process.env.NEXT_PUBLIC_SUPPORT_HOURS),
    businessName: env(process.env.NEXT_PUBLIC_BUSINESS_NAME),
    businessAddress: env(process.env.NEXT_PUBLIC_BUSINESS_ADDRESS),
    grievanceOfficer: env(process.env.NEXT_PUBLIC_GRIEVANCE_OFFICER),
  },

  social: {
    instagram: env(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  },

  /** Commercial terms — leave null until confirmed by the founder. */
  policies: {
    shippingRegions: ["India"] as string[],
    dispatchTime: null as string | null,
    deliveryEstimate: null as string | null,
    shippingCharges: null as string | null,
    returnWindowDays: null as number | null,
    exchangePolicy: null as string | null,
    taxNote: null as string | null,
    paymentProviders: "Cash on Delivery only" as string | null,
    lastReviewed: null as string | null,
  },
};

export const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/our-story", label: "Our Story" },
  { href: "/the-craft", label: "The Craft" },
  { href: "/journal", label: "Journal" },
];

export const footerNav = {
  Shop: [
    { href: "/shop", label: "All straps" },
    { href: "/collections", label: "Collections" },
    { href: "/size-guide", label: "Size guide" },
    { href: "/care", label: "Strap care" },
  ],
  House: [
    { href: "/our-story", label: "Our Story" },
    { href: "/the-craft", label: "The Craft" },
    { href: "/journal", label: "Journal" },
    { href: "/contact", label: "Contact" },
  ],
  Support: [
    { href: "/faq", label: "FAQ" },
    { href: "/shipping", label: "Shipping" },
    { href: "/returns", label: "Returns" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
};
