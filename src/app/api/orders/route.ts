import { products } from "@/data/products";
import { site } from "@/data/site";
import { variantAvailability, variantPrice } from "@/lib/commerce/availability";
import { orderSchema } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { formatPrice } from "@/lib/format";

/**
 * Cash on Delivery orders.
 * The server re-validates every line against the catalogue and recomputes
 * prices, then delivers the order to the store through whichever channels
 * are configured:
 *   - ORDER_WEBHOOK_URL: POST JSON (e.g. a Google Apps Script that appends to a Sheet, Zapier, Make)
 *   - RESEND_API_KEY + ORDER_TO_EMAIL (or CONTACT_TO_EMAIL) + CONTACT_FROM_EMAIL: email to the store,
 *     plus a confirmation to the customer when they gave an email
 * If no channel is configured, or every channel fails, the order is NOT reported as placed.
 */
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function orderId() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (const b of crypto.getRandomValues(new Uint8Array(6))) s += alphabet[b % alphabet.length];
  return `TRK-${s}`;
}

export async function POST(req: Request) {
  if (!rateLimit(`order:${clientIp(req)}`, 5, 30 * 60_000)) return Response.json({ message: "Too many orders from this connection. Please call us to order." }, { status: 429 });
  const parsed = orderSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[i.path.join(".")] ??= i.message;
    return Response.json({ message: "Please check the highlighted fields.", errors }, { status: 400 });
  }
  const o = parsed.data;
  if (o.company) return Response.json({ message: "Order could not be placed." }, { status: 400 });

  const items = [];
  for (const l of o.lines) {
    const product = products.find((p) => p.variants.some((v) => v.id === l.variantId));
    const variant = product?.variants.find((v) => v.id === l.variantId);
    if (!product || !variant) return Response.json({ message: "An item in your bag is no longer available. Please refresh your bag." }, { status: 409 });
    const a = variantAvailability(product, variant);
    if (a.max <= 0 || l.quantity > a.max) return Response.json({ message: `${product.name} (${variant.lugWidthMm} mm) isn't available in that quantity.` }, { status: 409 });
    const unit = variantPrice(product, variant);
    items.push({ sku: variant.sku, name: product.name, width: `${variant.lugWidthMm} mm`, quantity: l.quantity, unitPrice: unit, lineTotal: unit * l.quantity });
  }
  const subtotal = items.reduce((n, i) => n + i.lineTotal, 0);
  const order = {
    id: orderId(),
    createdAt: new Date().toISOString(),
    payment: "Cash on Delivery",
    status: "awaiting_phone_confirmation",
    customer: o.customer,
    address: o.address,
    notes: o.notes ?? "",
    items,
    subtotal,
    currency: "INR",
    shipping: site.policies.shippingCharges ?? "to be confirmed on call",
  };

  const webhook = process.env.ORDER_WEBHOOK_URL;
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.ORDER_TO_EMAIL || process.env.CONTACT_TO_EMAIL;
  if (!webhook && !(key && from && to)) {
    return Response.json(
      { message: `Online orders aren't connected yet, so this order was not placed. Please call ${site.contact.supportPhone} to order.` },
      { status: 503 },
    );
  }

  let delivered = false;
  if (webhook) {
    try {
      const r = await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(order) });
      delivered ||= r.ok;
    } catch {}
  }
  if (key && from && to) {
    const rows = items.map((i) => `<tr><td>${esc(i.name)} · ${i.width}<br><small>${i.sku}</small></td><td>× ${i.quantity}</td><td style="text-align:right">${formatPrice(i.lineTotal)}</td></tr>`).join("");
    const addr = [o.address.line1, o.address.line2, o.address.landmark && `Landmark: ${o.address.landmark}`, `${o.address.city}, ${o.address.state} ${o.address.pincode}`].filter(Boolean).map((x) => esc(String(x))).join("<br>");
    const html = `<h2>Order ${order.id} — Cash on Delivery</h2><p><strong>${esc(o.customer.name)}</strong> · +91 ${o.customer.phone}${o.customer.email ? ` · ${esc(o.customer.email)}` : ""}</p><p>${addr}</p><table cellpadding="6">${rows}</table><p><strong>Subtotal: ${formatPrice(subtotal)}</strong> (shipping ${esc(String(order.shipping))})</p>${o.notes ? `<p>Notes: ${esc(o.notes)}</p>` : ""}`;
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: [to], subject: `New COD order ${order.id} — ${o.customer.name}`, html }),
      });
      delivered ||= r.ok;
      if (r.ok && o.customer.email) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from,
            to: [o.customer.email],
            subject: `Your TAAROKH order ${order.id}`,
            html: `<p>Thank you, ${esc(o.customer.name)}. We've received your order <strong>${order.id}</strong>.</p><p>We'll call you on +91 ${o.customer.phone} to confirm it before dispatch. You'll pay in cash on delivery.</p>${html}`,
          }),
        }).catch(() => {});
      }
    } catch {}
  }
  if (!delivered) return Response.json({ message: `We couldn't send your order just now, so it was not placed. Please try again or call ${site.contact.supportPhone}.` }, { status: 502 });
  return Response.json({ ok: true, orderId: order.id, subtotal });
}
