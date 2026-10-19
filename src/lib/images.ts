import manifest from "@/data/image-manifest.json";

type Entry = { width: number; height: number; blur: string };
const m = manifest as Record<string, Entry>;

/** Intrinsic size + blur placeholder for a rendered image, if known. */
export function imageMeta(src: string): Entry | undefined {
  return m[src];
}
