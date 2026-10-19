import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/editorial/PageHeader";
import { SearchResults } from "@/components/layout/SearchResults";

export const metadata: Metadata = { title: "Search", robots: { index: false, follow: true } };

export default function SearchPage() {
  return (
    <>
      <PageHeader crumbs={[{ href: "/search", label: "Search" }]} title={["Search"]} />
      <Suspense fallback={<div className="container-luxe h-40" aria-busy="true" />}>
        <SearchResults />
      </Suspense>
    </>
  );
}
