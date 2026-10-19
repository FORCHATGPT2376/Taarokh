import { Monogram } from "@/components/brand/Monogram";

/** Branded loading state shown while route content streams in. */
export function PageSkeleton({ variant = "product" }: { variant?: "product" | "article" | "grid" }) {
  return (
    <div className="container-luxe py-12" aria-busy="true" aria-label="Loading">
      <div className="h-3 w-48 animate-pulse bg-ink/5" />
      {variant === "product" ? (
        <div className="mt-8 grid gap-12 lg:grid-cols-12">
          <div className="relative aspect-[4/5] animate-pulse bg-ink/5 lg:col-span-7">
            <Monogram className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-ink/15" />
          </div>
          <div className="space-y-4 lg:col-span-5">
            <div className="h-3 w-32 animate-pulse bg-ink/5" />
            <div className="h-12 w-3/4 animate-pulse bg-ink/5" />
            <div className="h-4 w-full animate-pulse bg-ink/5" />
            <div className="h-14 w-full animate-pulse bg-ink/5" />
          </div>
        </div>
      ) : (
        <div className="mt-10 space-y-6">
          <div className="h-16 w-2/3 animate-pulse bg-ink/5" />
          <div className="aspect-[3/1] w-full animate-pulse bg-ink/5" />
        </div>
      )}
    </div>
  );
}
