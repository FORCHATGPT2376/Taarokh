export interface CheckoutLine {
  variantId: string;
  quantity: number;
}

export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; code: "not_configured" | "invalid_cart" | "provider_error"; message: string };

/**
 * A commerce backend. The catalogue itself lives in src/data/products.ts;
 * the provider is responsible for creating a secure hosted checkout.
 * Card details are never collected by this site.
 */
export interface CommerceProvider {
  name: string;
  isConfigured(): boolean;
  createCheckout(lines: { externalVariantId: string; quantity: number }[]): Promise<CheckoutResult>;
}
