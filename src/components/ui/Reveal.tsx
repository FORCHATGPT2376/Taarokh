"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Fade-and-rise on scroll into view. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
  ...rest
}: { children: ReactNode; delay?: number; y?: number; className?: string; as?: "div" | "section" | "li" | "article" } & Omit<HTMLMotionProps<"div">, "children">) {
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.1, ease, delay }}
      {...rest}
    >
      {children}
    </M>
  );
}

/** Image reveal: a curtain that lifts off the image. */
export function MaskReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ clipPath: "inset(12% 0% 12% 0%)", opacity: 0.4 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.5, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Headline lines that rise from behind a mask. */
export function LineReveal({ lines, className, delay = 0, immediate = false }: { lines: string[]; className?: string; delay?: number; immediate?: boolean }) {
  return (
    <span className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            initial={{ y: "105%" }}
            {...(immediate ? { animate: { y: "0%" } } : { whileInView: { y: "0%" }, viewport: { once: true } })}
            transition={{ duration: 1.25, ease, delay: delay + i * 0.12 }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Hairline that draws in from the left. */
export function Rule({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <motion.div
      aria-hidden
      className={`h-px origin-left ${dark ? "bg-ivory/20" : "bg-line-strong"} ${className ?? ""}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.6, ease }}
    />
  );
}
