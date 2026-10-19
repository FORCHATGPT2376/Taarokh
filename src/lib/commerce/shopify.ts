import type { CommerceProvider, CheckoutResult } from "./types";

/**
 * Shopify Storefront API provider (hosted checkout).
 * Env: SHOPIFY_STORE_DOMAIN (e.g. taarokh.myshopify.com),
 *      SHOPIFY_STOREFRONT_ACCESS_TOKEN, optional SHOPIFY_API_VERSION.
 * Each live variant needs `shopifyVariantId` (gid://shopify/ProductVariant/…).
 */
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const version = process.env.SHOPIFY_API_VERSION || "2025-10";

const CART_CREATE = /* GraphQL */ `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`;

export const shopify: CommerceProvider = {
  name: "shopify",
  isConfigured: () => Boolean(domain && token),
  async createCheckout(lines): Promise<CheckoutResult> {
    if (!domain || !token) return { ok: false, code: "not_configured", message: "Shopify is not configured." };
    try {
      const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token },
        body: JSON.stringify({
          query: CART_CREATE,
          variables: { input: { lines: lines.map((l) => ({ merchandiseId: l.externalVariantId, quantity: l.quantity })) } },
        }),
        cache: "no-store",
      });
      if (!res.ok) return { ok: false, code: "provider_error", message: `Checkout service responded ${res.status}.` };
      const json = await res.json();
      const errs = json?.data?.cartCreate?.userErrors ?? json?.errors;
      const url: string | undefined = json?.data?.cartCreate?.cart?.checkoutUrl;
      if (!url || (Array.isArray(errs) && errs.length)) {
        return { ok: false, code: "provider_error", message: "The checkout could not be created." };
      }
      return { ok: true, url };
    } catch {
      return { ok: false, code: "provider_error", message: "The checkout service could not be reached." };
    }
  },
};
