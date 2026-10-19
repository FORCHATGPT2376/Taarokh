"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useRef, useState } from "react";
import type { ProductImage } from "@/types/catalog";
import { imageMeta } from "@/lib/images";
import { cx } from "@/lib/format";
import { useFocusTrap } from "@/components/ui/useFocusTrap";

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const lbRef = useRef<HTMLDivElement>(null);
  useFocusTrap(lbRef, lightbox, () => setLightbox(false));
  const img = images[i];
  const go = (d: number) => setI((n) => (n + d + images.length) % images.length);

  return (
    <div className="lg:grid lg:grid-cols-[4.5rem_1fr] lg:gap-6">
      <ul className="order-2 mt-4 flex gap-3 overflow-x-auto lg:order-1 lg:mt-0 lg:flex-col" aria-label="Product images">
        {images.map((im, n) => (
          <li key={im.src} className="shrink-0">
            <button
              type="button"
              onClick={() => setI(n)}
              aria-label={`Show image ${n + 1} of ${images.length}`}
              aria-current={n === i}
              className={cx("relative block aspect-[4/5] w-16 overflow-hidden transition-opacity duration-500 lg:w-full", n === i ? "opacity-100 ring-1 ring-ink ring-offset-2 ring-offset-ivory" : "opacity-55 hover:opacity-100")}
            >
              <Image src={im.src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          </li>
        ))}
      </ul>

      <div className="relative order-1 lg:order-2">
        <div
          className="relative aspect-[4/5] cursor-zoom-in overflow-hidden bg-ivory-deep"
          onMouseMove={(e) => {
            if (window.matchMedia("(hover: none)").matches) return;
            const r = e.currentTarget.getBoundingClientRect();
            setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
          }}
          onMouseLeave={() => setZoom(null)}
          onClick={() => setLightbox(true)}
          onTouchStart={(e) => ((e.currentTarget as HTMLElement).dataset.x = String(e.touches[0].clientX))}
          onTouchEnd={(e) => {
            const x0 = Number((e.currentTarget as HTMLElement).dataset.x);
            const dx = e.changedTouches[0].clientX - x0;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          }}
        >
          <AnimatePresence initial={false}>
            <motion.div key={img.src} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }}>
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 55vw, 100vw"
                placeholder={imageMeta(img.src) ? "blur" : "empty"}
                blurDataURL={imageMeta(img.src)?.blur}
                className="object-cover transition-transform duration-300 ease-out"
                style={zoom ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
              />
            </motion.div>
          </AnimatePresence>
          {img.note && <span className="pointer-events-none absolute bottom-3 left-3 bg-ink/55 px-2 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-ivory/90">{img.note}</span>}
          <span className="pointer-events-none absolute right-3 top-3 grid h-9 w-9 place-items-center bg-ivory/80 text-ink" aria-hidden>
            <Expand size={14} strokeWidth={1.2} />
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-stone">
          <span className="tabular-nums">{String(i + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
          <div className="flex gap-1">
            <button type="button" onClick={() => go(-1)} className="grid h-10 w-10 place-items-center hover:text-ink" aria-label="Previous image"><ChevronLeft size={18} strokeWidth={1} /></button>
            <button type="button" onClick={() => go(1)} className="grid h-10 w-10 place-items-center hover:text-ink" aria-label="Next image"><ChevronRight size={18} strokeWidth={1} /></button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div ref={lbRef} role="dialog" aria-modal="true" aria-label={`${name} — enlarged image`} className="fixed inset-0 z-[80] flex flex-col bg-ink text-ivory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-xs tabular-nums text-ivory/60">{i + 1} / {images.length}</span>
              <button type="button" onClick={() => setLightbox(false)} className="grid h-11 w-11 place-items-center" aria-label="Close enlarged image"><X size={22} strokeWidth={1} /></button>
            </div>
            <div className="relative flex-1 overflow-auto">
              <div className="relative mx-auto h-[150vmin] w-[150vmin] max-w-none sm:h-full sm:w-full">
                <Image src={img.src} alt={img.alt} fill sizes="100vw" quality={90} className="object-contain" />
              </div>
            </div>
            <div className="flex justify-center gap-4 py-4">
              <button type="button" onClick={() => go(-1)} className="grid h-11 w-11 place-items-center" aria-label="Previous image"><ChevronLeft size={20} strokeWidth={1} /></button>
              <button type="button" onClick={() => go(1)} className="grid h-11 w-11 place-items-center" aria-label="Next image"><ChevronRight size={20} strokeWidth={1} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
