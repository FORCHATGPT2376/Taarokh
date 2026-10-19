"use client";

import Image from "next/image";
import { useState } from "react";
import { imageMeta } from "@/lib/images";
import { cx } from "@/lib/format";
import { Monogram } from "@/components/brand/Monogram";

/**
 * Image with consistent treatment: fixed aspect box (no layout shift), blur
 * placeholder, optional "Concept render" note, and a branded failure state.
 */
export function Img({
  src,
  alt,
  sizes = "100vw",
  priority,
  className,
  imgClassName,
  note,
  aspect,
  children,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  note?: string;
  /** CSS aspect-ratio, e.g. "4/5". Omit when the parent sizes the box. */
  aspect?: string;
  children?: React.ReactNode;
}) {
  const meta = imageMeta(src);
  const [failed, setFailed] = useState(false);
  return (
    <div className={cx("relative overflow-hidden bg-ivory-deep", className)} style={aspect ? { aspectRatio: aspect } : undefined}>
      {failed ? (
        <div role="img" aria-label={alt} className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-sand/40 text-stone">
          <Monogram className="h-10 w-10 opacity-60" />
          <span className="eyebrow text-[0.6rem]">Image unavailable</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder={meta ? "blur" : "empty"}
          blurDataURL={meta?.blur}
          className={cx("object-cover", imgClassName)}
          onError={() => setFailed(true)}
        />
      )}
      {note && !failed && (
        <span className="pointer-events-none absolute bottom-3 left-3 bg-ink/55 px-2 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-ivory/90 backdrop-blur-[2px]">
          {note}
        </span>
      )}
      {children}
    </div>
  );
}
