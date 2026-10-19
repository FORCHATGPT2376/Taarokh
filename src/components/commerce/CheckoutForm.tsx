"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useId, useState } from "react";
import { indianStates } from "@/data/india";
import { site } from "@/data/site";
import { formatPrice, cx } from "@/lib/format";
import { orderSchema } from "@/lib/validation";
import { useCart } from "./CartProvider";
import { EmptyBag } from "./EmptyBag";

type Errors = Record<string, string>;

export function CheckoutForm() {
  const id = useId();
  const { lines, subtotal, ready, clear, remove } = useCart();
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<{ kind: "idle" | "sending" | "error"; message?: string }>({ kind: "idle" });
  const [placed, setPlaced] = useState<{ orderId: string; subtotal: number; phone: string } | null>(null);

  if (placed) {
    return (
      <div role="status" className="mx-auto max-w-2xl border border-line bg-paper p-8 text-center sm:p-14">
        <p className="eyebrow text-gold-deep">Order received</p>
        <p className="serif mt-5 text-5xl">Thank you.</p>
        <p className="mt-6 text-sm text-stone">Your order reference</p>
        <p className="serif mt-1 text-3xl tracking-[0.12em]">{placed.orderId}</p>
        <p className="mx-auto mt-6 max-w-md leading-relaxed text-ink-soft">
          We&rsquo;ll call you on <strong>+91 {placed.phone}</strong> to confirm the order and delivery time. Please keep <strong>{formatPrice(placed.subtotal)}</strong> plus any delivery charge ready to pay in cash on delivery.
        </p>
        <p className="mt-4 text-sm text-stone">Questions? Call <a className="underline underline-offset-2" href={`tel:${site.contact.supportPhone?.replace(/\s/g, "")}`}>{site.contact.supportPhone}</a>.</p>
        <Link href="/shop" className="mt-10 inline-flex min-h-12 items-center bg-ink px-8 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-ivory hover:bg-indigo">Continue browsing</Link>
      </div>
    );
  }

  if (!ready) return <div className="h-96 animate-pulse bg-ink/5" aria-busy="true" />;
  if (lines.length === 0) return <div className="border border-line"><EmptyBag /></div>;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const g = (k: string) => String(fd.get(k) ?? "");
    const body = {
      lines: lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
      customer: { name: g("name"), phone: g("phone"), email: g("email") },
      address: { line1: g("line1"), line2: g("line2"), landmark: g("landmark"), city: g("city"), state: g("state"), pincode: g("pincode") },
      notes: g("notes"),
      payment: "cod" as const,
      agree: fd.get("agree") === "on",
      company: g("company"),
    };
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      const errs: Errors = {};
      for (const i of parsed.error.issues) errs[i.path.join(".")] ??= i.message;
      setErrors(errs);
      const first = Object.keys(errs)[0]?.split(".").pop();
      if (first) (e.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    setErrors({});
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.orderId) {
        setPlaced({ orderId: data.orderId, subtotal: data.subtotal, phone: parsed.data.customer.phone });
        clear();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (data?.errors) setErrors(data.errors);
      setState({ kind: "error", message: data?.message ?? "Your order could not be placed. Please try again." });
    } catch {
      setState({ kind: "error", message: `We couldn't connect, so your order was not placed. Check your connection or call ${site.contact.supportPhone}.` });
    }
  }

  const field = "w-full border-b border-ink/40 bg-transparent py-3 text-base outline-none transition-colors focus:border-ink aria-[invalid=true]:border-error";
  const label = "eyebrow block text-[0.6rem] text-stone";
  const F = ({ name, path, labelText, type = "text", auto, mode, optional, wide, placeholder }: { name: string; path: string; labelText: string; type?: string; auto?: string; mode?: "tel" | "numeric" | "email"; optional?: boolean; wide?: boolean; placeholder?: string }) => (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label htmlFor={`${id}-${name}`} className={label}>{labelText}{optional && <span className="normal-case tracking-normal"> (optional)</span>}</label>
      <input id={`${id}-${name}`} name={name} type={type} autoComplete={auto} inputMode={mode} placeholder={placeholder} className={field} aria-invalid={!!errors[path]} aria-describedby={errors[path] ? `${id}-${name}-e` : undefined} />
      {errors[path] && <p id={`${id}-${name}-e`} className="mt-2 text-xs text-error">{errors[path]}</p>}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="grid gap-14 lg:grid-cols-12">
      <div className="space-y-14 lg:col-span-7">
        <fieldset>
          <legend className="serif text-3xl">Contact</legend>
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            {F({ name: "name", path: "customer.name", labelText: "Full name", auto: "name", wide: true })}
            {F({ name: "phone", path: "customer.phone", labelText: "Mobile number", type: "tel", auto: "tel-national", mode: "tel", placeholder: "98765 43210" })}
            {F({ name: "email", path: "customer.email", labelText: "Email", type: "email", auto: "email", mode: "email", optional: true })}
          </div>
        </fieldset>
        <fieldset>
          <legend className="serif text-3xl">Delivery address</legend>
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            {F({ name: "line1", path: "address.line1", labelText: "House / flat no., building, street", auto: "address-line1", wide: true })}
            {F({ name: "line2", path: "address.line2", labelText: "Area / locality", auto: "address-line2", optional: true, wide: true })}
            {F({ name: "landmark", path: "address.landmark", labelText: "Landmark", optional: true })}
            {F({ name: "pincode", path: "address.pincode", labelText: "PIN code", auto: "postal-code", mode: "numeric", placeholder: "302001" })}
            {F({ name: "city", path: "address.city", labelText: "City / town", auto: "address-level2" })}
            <div>
              <label htmlFor={`${id}-state`} className={label}>State</label>
              <select id={`${id}-state`} name="state" defaultValue="" autoComplete="address-level1" className={cx(field, "cursor-pointer")} aria-invalid={!!errors["address.state"]}>
                <option value="" disabled>Choose state</option>
                {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors["address.state"] && <p className="mt-2 text-xs text-error">{errors["address.state"]}</p>}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={`${id}-notes`} className={label}>Delivery notes <span className="normal-case tracking-normal">(optional)</span></label>
              <textarea id={`${id}-notes`} name="notes" rows={2} className={cx(field, "resize-y")} />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend className="serif text-3xl">Payment</legend>
          <label className="mt-6 flex items-start gap-4 border border-ink bg-paper p-5">
            <input type="radio" name="payment" value="cod" defaultChecked className="mt-1 h-4 w-4 accent-[var(--color-ink)]" />
            <span>
              <span className="block font-semibold">Cash on Delivery</span>
              <span className="mt-1 block text-sm text-stone">Pay the courier in cash when your strap arrives. No card or UPI details are collected online.</span>
            </span>
          </label>
        </fieldset>
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden"><input name="company" tabIndex={-1} autoComplete="off" /></div>
      </div>

      <aside className="lg:col-span-5">
        <div className="border border-line bg-paper p-6 sm:p-8 lg:sticky lg:top-[calc(var(--header-offset)+2rem)]">
          <p className="serif text-3xl">Order summary</p>
          <ul className="mt-6 divide-y divide-line">
            {lines.map((l) => {
              const img = l.product.images[1] ?? l.product.images[0];
              return (
                <li key={l.variantId} className="flex gap-4 py-4">
                  <span className="relative block aspect-[4/5] w-16 shrink-0 overflow-hidden bg-ivory-deep"><Image src={img.src} alt="" fill sizes="64px" className="object-cover" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="serif text-xl leading-tight">{l.product.name}</p>
                    <p className="text-xs text-stone">{l.variant.lugWidthMm} mm lug · Qty {l.quantity}</p>
                    <button type="button" onClick={() => remove(l.variantId)} className="mt-1 inline-flex min-h-10 items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ink-soft hover:text-error">
                      <Trash2 size={13} strokeWidth={1.4} aria-hidden /> Remove<span className="sr-only"> {l.product.name}</span>
                    </button>
                  </div>
                  <p className="text-sm tabular-nums">{formatPrice(l.unitPrice * l.quantity)}</p>
                </li>
              );
            })}
          </ul>
          <dl className="mt-2 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-stone">Subtotal</dt><dd className="tabular-nums">{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-stone">Delivery</dt><dd className="italic text-stone">{site.policies.shippingCharges ?? "confirmed on call"}</dd></div>
            <div className="flex justify-between border-t border-line pt-3"><dt className="eyebrow">Pay on delivery</dt><dd className="serif text-2xl tabular-nums">{formatPrice(subtotal)}</dd></div>
          </dl>
          <label className="mt-6 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-stone">
            <input type="checkbox" name="agree" className="mt-0.5 h-4 w-4 shrink-0 appearance-none border border-ink/50 checked:border-ink checked:bg-ink" aria-invalid={!!errors.agree} />
            <span>I&rsquo;ve checked my strap width{lines.length > 1 ? "s" : ""} and agree to the <Link href="/terms" className="underline underline-offset-2">terms</Link> and <Link href="/returns" className="underline underline-offset-2">returns policy</Link>.</span>
          </label>
          {errors.agree && <p className="mt-2 text-xs text-error">{errors.agree}</p>}
          <button type="submit" disabled={state.kind === "sending"} className="mt-6 min-h-13 w-full bg-ink px-6 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-ivory transition-colors hover:bg-indigo disabled:opacity-50">
            {state.kind === "sending" ? "Placing order…" : "Place order · Cash on Delivery"}
          </button>
          <div aria-live="polite">{state.kind === "error" && <p role="alert" className="mt-4 text-sm text-error">{state.message}</p>}</div>
          <p className="mt-4 text-xs leading-relaxed text-stone">We call every customer to confirm the order before dispatch. Straps are made to order, so delivery time is confirmed on that call.</p>
        </div>
      </aside>
    </form>
  );
}
