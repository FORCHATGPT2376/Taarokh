import type { Metadata } from "next";
import { PageHeader } from "@/components/editorial/PageHeader";
import { BagContents } from "@/components/commerce/BagContents";

export const metadata: Metadata = { title: "Your Bag", robots: { index: false, follow: true }, alternates: { canonical: "/cart" } };

export default function CartPage() {
  return (
    <>
      <PageHeader crumbs={[{ href: "/cart", label: "Bag" }]} title={["Your bag"]} />
      <section className="container-luxe pb-32">
        <BagContents variant="page" />
      </section>
    </>
  );
}
