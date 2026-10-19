export function DraftNotice({ children }: { children?: React.ReactNode }) {
  return (
    <div role="note" className="border border-gold-deep/50 bg-sand/25 px-5 py-4 text-sm leading-relaxed text-ink-soft">
      <p className="eyebrow text-gold-deep">Draft — under review before launch</p>
      <p className="mt-2">
        {children ?? "This page is a structured draft. Final terms will be published after the business details, operations and applicable Indian consumer and data-protection requirements have been reviewed. Items marked “to be confirmed” are not yet decided."}
      </p>
    </div>
  );
}

export function TBC({ value }: { value: string | number | null | undefined }) {
  if (value === null || value === undefined || value === "") return <span className="italic text-stone">to be confirmed</span>;
  return <>{value}</>;
}
