"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Hides the footer sign-up on pages that already feature one prominently. */
export function FooterNewsletter({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <>{children}</>;
}
