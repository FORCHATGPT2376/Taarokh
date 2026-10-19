"use client";

import Script from "next/script";
import { useEffect, useId, useRef, useState } from "react";
import { contactSchema, contactTopics, topicLabels } from "@/lib/validation";
import { cx } from "@/lib/format";

type Errors = Partial<Record<string, string>>;
const turnstileKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactForm() {
  const id = useId();
  const started = useRef(0);
  useEffect(() => {
    started.current = Date.now();
  }, []);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<{ kind: "idle" | "sending" | "sent" | "error" | "unavailable"; message?: string }>({ kind: "idle" });
  const [topic, setTopic] = useState<string>("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      topic: String(fd.get("topic") ?? ""),
      orderId: String(fd.get("orderId") ?? ""),
      message: String(fd.get("message") ?? ""),
      consent: fd.get("consent") === "on",
      company: String(fd.get("company") ?? ""),
      startedAt: started.current,
      turnstileToken: String(fd.get("cf-turnstile-response") ?? "") || undefined,
    };
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] ??= issue.message;
      setErrors(errs);
      const first = Object.keys(errs)[0];
      (e.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    setErrors({});
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const body = await res.json().catch(() => null);
      if (res.ok) setStatus({ kind: "sent" });
      else if (res.status === 503) setStatus({ kind: "unavailable", message: body?.message });
      else {
        if (body?.errors) setErrors(body.errors);
        setStatus({ kind: "error", message: body?.message ?? "Something went wrong. Please try again." });
      }
    } catch {
      setStatus({ kind: "error", message: "We couldn't connect. Please check your connection and try again — your message has not been sent." });
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="border border-line bg-paper p-10">
        <p className="eyebrow text-gold-deep">Message received</p>
        <p className="serif mt-4 text-4xl">Thank you.</p>
        <p className="mt-4 max-w-md leading-relaxed text-stone">We&rsquo;ve received your message and will reply by email. A copy of what you sent is not stored on this device.</p>
      </div>
    );
  }

  const field = "w-full border-b border-ink/40 bg-transparent py-3 text-base outline-none transition-colors focus:border-ink aria-[invalid=true]:border-error";
  const label = "eyebrow block text-[0.6rem] text-stone";
  const err = (k: string) => errors[k] && <p id={`${id}-${k}-e`} className="mt-2 text-xs text-error">{errors[k]}</p>;
  const a11y = (k: string) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${id}-${k}-e` : undefined });

  return (
    <form onSubmit={submit} noValidate className="space-y-8">
      {turnstileKey && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />}
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className={label}>Name</label>
          <input id={`${id}-name`} name="name" autoComplete="name" className={field} {...a11y("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={label}>Email</label>
          <input id={`${id}-email`} name="email" type="email" autoComplete="email" inputMode="email" className={field} {...a11y("email")} />
          {err("email")}
        </div>
      </div>
      <fieldset>
        <legend className={label}>What is it about?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {contactTopics.map((t) => (
            <label key={t} className={cx("inline-flex min-h-10 cursor-pointer items-center border px-4 text-xs transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-1", topic === t ? "border-ink bg-ink text-ivory" : "border-line-strong hover:border-ink")}>
              <input type="radio" name="topic" value={t} className="sr-only" checked={topic === t} onChange={() => setTopic(t)} {...(t === contactTopics[0] ? a11y("topic") : {})} />
              {topicLabels[t]}
            </label>
          ))}
        </div>
        {err("topic")}
      </fieldset>
      {topic === "existing-order" && (
        <div>
          <label htmlFor={`${id}-order`} className={label}>Order ID</label>
          <input id={`${id}-order`} name="orderId" className={field} {...a11y("orderId")} />
          {err("orderId")}
        </div>
      )}
      <div>
        <label htmlFor={`${id}-msg`} className={label}>Message</label>
        <textarea id={`${id}-msg`} name="message" rows={6} className={cx(field, "resize-y")} placeholder={topic === "size-help" ? "Your watch model and lug width (if known). You can attach photos when we reply." : ""} {...a11y("message")} />
        {err("message")}
      </div>
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>Company <input name="company" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {turnstileKey && <div className="cf-turnstile" data-sitekey={turnstileKey} data-theme="light" />}
      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-stone">
          <input type="checkbox" name="consent" className="mt-1 h-4 w-4 shrink-0 appearance-none border border-ink/50 checked:border-ink checked:bg-ink" {...a11y("consent")} />
          <span>I agree that TAAROKH may use my name and email to reply to this message, as described in the <a href="/privacy" className="underline underline-offset-2">privacy notice</a>. This does not subscribe me to marketing.</span>
        </label>
        {err("consent")}
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <button type="submit" disabled={status.kind === "sending"} className="min-h-12 bg-ink px-10 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-ivory transition-colors hover:bg-indigo disabled:opacity-50">
          {status.kind === "sending" ? "Sending…" : "Send message"}
        </button>
        <div aria-live="polite" className="text-sm">
          {status.kind === "error" && <p className="text-error">{status.message}</p>}
          {status.kind === "unavailable" && <p className="text-gold-deep">{status.message ?? "Our contact inbox isn’t connected yet — your message was not sent."}</p>}
        </div>
      </div>
    </form>
  );
}
