import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/format";

type Variant = "solid" | "outline" | "light" | "outlineLight" | "text" | "textLight";

const base =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden text-[0.7rem] font-semibold uppercase tracking-[0.24em] transition-[color,background-color,border-color,opacity] duration-500 ease-[var(--ease-luxe)] disabled:cursor-not-allowed disabled:opacity-45";

const variants: Record<Variant, string> = {
  solid: "min-h-12 px-8 bg-ink text-ivory hover:bg-indigo",
  outline: "min-h-12 px-8 border border-ink/80 text-ink hover:bg-ink hover:text-ivory",
  light: "min-h-12 px-8 bg-ivory text-ink hover:bg-sand",
  outlineLight: "min-h-12 px-8 border border-ivory/70 text-ivory hover:bg-ivory hover:text-ink",
  text: "min-h-11 px-0 text-ink",
  textLight: "min-h-11 px-0 text-ivory",
};

function Inner({ children, variant, arrow }: { children: ReactNode; variant: Variant; arrow?: boolean }) {
  const isText = variant === "text" || variant === "textLight";
  return (
    <>
      <span className={cx("relative", isText && "link-underline-static")}>{children}</span>
      {arrow && (
        <svg width="22" height="8" viewBox="0 0 22 8" aria-hidden className="relative transition-transform duration-500 ease-[var(--ease-luxe)] group-hover:translate-x-1.5">
          <path d="M0 4h20M17 1l3 3-3 3" stroke="currentColor" fill="none" strokeWidth="1" />
        </svg>
      )}
    </>
  );
}

export function ButtonLink({
  variant = "solid",
  arrow,
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; arrow?: boolean }) {
  return (
    <Link className={cx(base, variants[variant], className)} {...props}>
      <Inner variant={variant} arrow={arrow}>
        {children}
      </Inner>
    </Link>
  );
}

export function Button({
  variant = "solid",
  arrow,
  className,
  children,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; arrow?: boolean }) {
  return (
    <button className={cx(base, variants[variant], className)} {...props}>
      <Inner variant={variant} arrow={arrow}>
        {children}
      </Inner>
    </button>
  );
}
