"use client";

import { useId, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cx } from "@/lib/format";

type State = { kind: "idle" | "loading" | "success" | "error" | "unavailable"; message?: string };

export function NewsletterForm({ tone = "light", source = "newsletter", compact }: { tone?: "light" | "dark"; source?: string; compact?: boolean }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<State>({ kind: "idle" });
  const [fieldError, setFieldError] = useState<string | null>(null);
  const dark = tone === "dark";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setFieldError("Please enter a valid email address.");
      return;
    }
    if (!consent) {
      setFieldError("Please confirm you'd like to receive updates.");
      return;
    }
    setFieldError(null);
    setState({ kind: "loading" });
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), consent, source, company: fd.get("company") ?? "" }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) setState({ kind: "success", message: data?.message });
      else if (res.status === 503) setState({ kind: "unavailable", message: data?.message });
      else setState({ kind: "error", message: data?.message ?? "Something went wrong. Please try again." });
    } catch {
      setState({ kind: "error", message: "We couldn't connect. Please check your connection and try again." });
    }
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {state.kind === "success" ? (
          <motion.div key="ok" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} role="status" className="py-2">
            <p className={cx("serif text-3xl", dark ? "text-ivory" : "text-ink")}>You’re on the list.</p>
            <p className={cx("mt-2 max-w-md text-sm leading-relaxed", dark ? "text-ivory/75" : "text-stone")}>
              {state.message ?? "Please check your inbox to confirm your subscription. We’ll only write when there is something real to share."}
            </p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} noValidate initial={false} exit={{ opacity: 0 }} className="w-full">
            <div className={cx("flex items-end gap-4 border-b transition-colors", dark ? "border-ivory/40 focus-within:border-ivory" : "border-ink/40 focus-within:border-ink")}>
              <div className="min-w-0 flex-1">
                <label htmlFor={`${id}-email`} className={cx("eyebrow block", dark ? "text-ivory/60" : "text-stone")}>
                  Email address
                </label>
                <input
                  id={`${id}-email`}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!fieldError}
                  aria-describedby={`${id}-msg`}
                  placeholder="you@example.com"
                  className={cx("w-full bg-transparent py-3 outline-none", compact ? "text-base" : "text-lg", dark ? "placeholder:text-ivory/30" : "placeholder:text-stone/50")}
                />
              </div>
              <button
                type="submit"
                disabled={state.kind === "loading"}
                className={cx("group mb-1 flex min-h-11 items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em] disabled:opacity-50", dark ? "text-ivory" : "text-ink")}
              >
                {state.kind === "loading" ? "Sending…" : "Subscribe"}
                <svg width="22" height="8" viewBox="0 0 22 8" aria-hidden className="transition-transform duration-500 group-hover:translate-x-1.5">
                  <path d="M0 4h20M17 1l3 3-3 3" stroke="currentColor" fill="none" />
                </svg>
              </button>
            </div>
            {/* honeypot */}
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>
                Company <input name="company" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <label className={cx("mt-4 flex cursor-pointer items-start gap-3 text-xs leading-relaxed", dark ? "text-ivory/70" : "text-stone")}>
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className={cx("mt-0.5 h-4 w-4 shrink-0 appearance-none border transition-colors", dark ? "border-ivory/50 checked:bg-gold checked:border-gold" : "border-ink/50 checked:bg-ink checked:border-ink")}
              />
              <span>I’d like to receive product updates by email. I can unsubscribe at any time. See our <a href="/privacy" className="underline underline-offset-2">privacy notice</a>.</span>
            </label>
            <div id={`${id}-msg`} aria-live="polite" className="min-h-6 pt-2 text-xs">
              {fieldError && <p className={dark ? "text-rose" : "text-error"}>{fieldError}</p>}
              {state.kind === "error" && <p className={dark ? "text-rose" : "text-error"}>{state.message}</p>}
              {state.kind === "unavailable" && (
                <p className={dark ? "text-sand" : "text-gold-deep"}>{state.message ?? "Sign-ups aren’t open yet — nothing was saved. Please try again soon."}</p>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
