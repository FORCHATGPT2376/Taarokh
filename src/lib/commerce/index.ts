import { shopify } from "./shopify";
import type { CommerceProvider } from "./types";

/**
 * Select the commerce provider. Add another provider (e.g. Razorpay-backed
 * custom checkout) by implementing CommerceProvider and registering it here.
 */
const providers: Record<string, CommerceProvider> = { shopify };

export function getProvider(): CommerceProvider | null {
  const name = process.env.COMMERCE_PROVIDER || "shopify";
  const p = providers[name];
  return p && p.isConfigured() ? p : null;
}

export * from "./types";
