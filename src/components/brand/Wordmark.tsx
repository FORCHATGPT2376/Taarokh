import { cx } from "@/lib/format";

/**
 * TAAROKH wordmark: widely-tracked serif capitals with a hairline and
 * JAIPUR set small in the sans. `stacked` is used in the footer.
 */
export function Wordmark({ stacked = false, className, subtle }: { stacked?: boolean; className?: string; subtle?: boolean }) {
  if (stacked) {
    return (
      <span className={cx("inline-flex flex-col items-center leading-none", className)} aria-label="TAAROKH Jaipur">
        <span aria-hidden className="serif text-[clamp(2.75rem,8vw,6.5rem)] font-[450] tracking-[0.3em] pl-[0.3em]">
          TAAROKH
        </span>
        <span aria-hidden className="mt-4 flex items-center gap-4 text-[0.65rem] font-semibold tracking-[0.6em] pl-[0.6em] opacity-80">
          <span className="h-px w-10 bg-current opacity-50" />
          JAIPUR
          <span className="h-px w-10 bg-current opacity-50" />
        </span>
      </span>
    );
  }
  return (
    <span className={cx("inline-flex items-center leading-none", className)} aria-label="TAAROKH Jaipur">
      <span aria-hidden className="serif text-[1.35rem] font-medium tracking-[0.34em] sm:text-[1.5rem]">
        TAAROKH
      </span>
      <span aria-hidden className={cx("mx-3 h-4 w-px bg-current opacity-35", subtle && "hidden sm:block")} />
      <span aria-hidden className={cx("text-[0.55rem] font-semibold tracking-[0.42em] opacity-75", subtle && "hidden sm:inline")}>
        JAIPUR
      </span>
    </span>
  );
}
