"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { products } from "@/data/products";
import { variantAvailability, variantPrice } from "@/lib/commerce/availability";
import type { Product, Variant } from "@/types/catalog";

const KEY = "taarokh.bag.v1";

export interface CartLine {
  variantId: string;
  quantity: number;
}

export interface ResolvedLine extends CartLine {
  product: Product;
  variant: Variant;
  unitPrice: number;
  max: number;
  availabilityKind: "purchasable" | "preview" | "unavailable";
}

interface CartContext {
  lines: ResolvedLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  ready: boolean;
  open: () => void;
  close: () => void;
  add: (variantId: string, quantity: number) => { ok: boolean; message?: string };
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  notice: string | null;
}

const Ctx = createContext<CartContext | null>(null);

const index = new Map<string, { product: Product; variant: Variant }>();
for (const p of products) for (const v of p.variants) index.set(v.id, { product: p, variant: v });

/** Re-validate stored lines against the current catalogue: drop unknown/unavailable, clamp quantities. */
function sanitize(raw: unknown): { lines: CartLine[]; changed: boolean } {
  if (!Array.isArray(raw)) return { lines: [], changed: false };
  let changed = false;
  const out: CartLine[] = [];
  for (const r of raw) {
    const id = typeof r?.variantId === "string" ? r.variantId : null;
    const q = Number.isInteger(r?.quantity) ? r.quantity : 0;
    const hit = id ? index.get(id) : undefined;
    if (!hit) {
      changed = true;
      continue;
    }
    const a = variantAvailability(hit.product, hit.variant);
    if (a.max <= 0 || q <= 0) {
      changed = true;
      continue;
    }
    const clamped = Math.min(q, a.max);
    if (clamped !== q) changed = true;
    if (!out.some((l) => l.variantId === id)) out.push({ variantId: id!, quantity: clamped });
  }
  return { lines: out, changed };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const loaded = useRef(false);
  const rawRef = useRef<CartLine[]>([]);
  useEffect(() => {
    rawRef.current = raw;
  }, [raw]);

  useEffect(() => {
    try {
      const { lines, changed } = sanitize(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
      // Hydrating from localStorage (an external system) after mount is intentional.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRaw(lines);
      if (changed) setNotice("Your bag was updated to reflect current availability.");
    } catch {
      setRaw([]);
    }
    loaded.current = true;
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) {
        try {
          setRaw(sanitize(JSON.parse(e.newValue ?? "[]")).lines);
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(raw));
    } catch {}
  }, [raw]);

  const lines = useMemo<ResolvedLine[]>(
    () =>
      raw.flatMap((l) => {
        const hit = index.get(l.variantId);
        if (!hit) return [];
        const a = variantAvailability(hit.product, hit.variant);
        return [{ ...l, ...hit, unitPrice: variantPrice(hit.product, hit.variant), max: a.max, availabilityKind: a.kind }];
      }),
    [raw],
  );

  const add = useCallback((variantId: string, quantity: number) => {
    const hit = index.get(variantId);
    if (!hit) return { ok: false, message: "This option could not be found." };
    const a = variantAvailability(hit.product, hit.variant);
    if (a.max <= 0) return { ok: false, message: "This option is not currently available." };
    const current = rawRef.current.find((l) => l.variantId === variantId)?.quantity ?? 0;
    const message = current + quantity > a.max ? `A maximum of ${a.max} per order applies.` : undefined;
    setRaw((prev) => {
      const existing = prev.find((l) => l.variantId === variantId);
      const next = Math.min((existing?.quantity ?? 0) + quantity, a.max);
      return existing ? prev.map((l) => (l.variantId === variantId ? { ...l, quantity: next } : l)) : [...prev, { variantId, quantity: next }];
    });
    setNotice(null);
    setOpen(true);
    return { ok: true, message };
  }, []);

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    const hit = index.get(variantId);
    if (!hit) return;
    const a = variantAvailability(hit.product, hit.variant);
    const q = Math.max(0, Math.min(Math.floor(quantity), a.max));
    setRaw((prev) => (q === 0 ? prev.filter((l) => l.variantId !== variantId) : prev.map((l) => (l.variantId === variantId ? { ...l, quantity: q } : l))));
  }, []);

  const remove = useCallback((variantId: string) => setRaw((prev) => prev.filter((l) => l.variantId !== variantId)), []);
  const clear = useCallback(() => setRaw([]), []);

  const value: CartContext = {
    lines,
    count: lines.reduce((n, l) => n + l.quantity, 0),
    subtotal: lines.reduce((n, l) => n + l.quantity * l.unitPrice, 0),
    isOpen,
    ready,
    open: () => setOpen(true),
    close: () => setOpen(false),
    add,
    setQuantity,
    remove,
    clear,
    notice,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
