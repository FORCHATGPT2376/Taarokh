import type { Metadata } from "next";
import { PageHeader } from "@/components/editorial/PageHeader";
import { CheckoutForm } from "@/components/commerce/CheckoutForm";

export const metadata: Metadata = { title: "Checkout — Cash on Delivery", robots: { index: false, follow: false }, alternates: { canonical: "/checkout" } };

export default function CheckoutPage() {
  return (
    <>
      <PageHeader crumbs={[{ href: "/cart", label: "Bag" }, { href: "/checkout", label: "Checkout" }]} eyebrow="Cash on Delivery" title={["Checkout"]} intro="Tell us where to deliver. You pay in cash when your strap arrives, and we call to confirm every order before dispatch." />
      <section className="container-luxe pb-32">
        <CheckoutForm />
      </section>
    </>
  );
}
