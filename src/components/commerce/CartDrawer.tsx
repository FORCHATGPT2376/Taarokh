"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";
import { BagContents } from "./BagContents";
import { useFocusTrap } from "@/components/ui/useFocusTrap";

const ease = [0.22, 1, 0.36, 1] as const;

export function CartDrawer() {
  const { isOpen, close, count } = useCart();
  const panel = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useFocusTrap(panel, isOpen, close);

  useEffect(() => {
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70]">
          <motion.div
            className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={close}
            aria-hidden
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="bag-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-[28rem] flex-col bg-ivory shadow-[0_0_80px_rgba(0,0,0,0.18)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5 sm:px-8">
              <div className="flex items-baseline gap-3">
                <h2 id="bag-title" className="serif text-2xl">
                  Your bag
                </h2>
                <span className="text-xs tabular-nums text-stone">
                  {count} {count === 1 ? "item" : "items"}
                </span>
              </div>
              <button type="button" onClick={close} className="-mr-2 grid h-11 w-11 place-items-center transition-transform duration-500 hover:rotate-90" aria-label="Close bag">
                <X size={20} strokeWidth={1} />
              </button>
            </div>
            <BagContents onNavigate={close} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
