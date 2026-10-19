import { products } from "@/data/products";
import { site } from "@/data/site";
import { variantAvailability } from "@/lib/commerce/availability";
import { getProvider } from "@/lib/commerce";
import { checkoutSchema } from "@/lib/validation";

/**
 * Validates the bag against the catalogue (status, stock, limits) on the
 * server, then asks the configured provider for a hosted checkout URL.
 * Never simulates payment and never creates an order itself.
 */
export async function POST(req: Request) {
  const parsed = checkoutSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ code: "invalid_cart", message: "Your bag couldn't be read. Please refresh and try again." }, { status: 400 });

  if (site.storeMode !== "live") {
    return Response.json({ code: "not_configured", message: "Checkout isn't open yet — this is a catalogue preview. Nothing has been charged." }, { status: 503 });
  }

  const lines: { externalVariantId: string; quantity: number }[] = [];
  for (const l of parsed.data.lines) {
    const product = products.find((p) => p.variants.some((v) => v.id === l.variantId));
    const variant = product?.variants.find((v) => v.id === l.variantId);
    if (!product || !variant) return Response.json({ code: "invalid_cart", message: "An item in your bag is no longer available." }, { status: 409 });
    const a = variantAvailability(product, variant);
    if (a.kind !== "purchasable" || l.quantity > a.max) {
      return Response.json({ code: "invalid_cart", message: `${product.name} (${variant.lugWidthMm} mm) is not available in that quantity. Please update your bag.` }, { status: 409 });
    }
    if (!variant.shopifyVariantId) return Response.json({ code: "not_configured", message: "This item isn't connected to checkout yet." }, { status: 503 });
    lines.push({ externalVariantId: variant.shopifyVariantId, quantity: l.quantity });
  }

  const provider = getProvider();
  if (!provider) return Response.json({ code: "not_configured", message: "Checkout isn't configured yet. Nothing has been charged." }, { status: 503 });
  const result = await provider.createCheckout(lines);
  if (!result.ok) return Response.json(result, { status: result.code === "not_configured" ? 503 : 502 });
  return Response.json({ url: result.url });
}
