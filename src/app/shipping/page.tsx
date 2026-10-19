import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage } from "@/components/editorial/PolicyPage";
import { TBC } from "@/components/editorial/DraftNotice";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Shipping", description: "Where TAAROKH ships, dispatch times, delivery charges and tracking.", alternates: { canonical: "/shipping" } };

export default function Page() {
  const p = site.policies;
  return (
    <PolicyPage slug="shipping" title="Shipping" intro="Where we deliver, how long it takes, and what it costs. Details are published once our courier and production process are confirmed.">
      <h2>Where we ship</h2>
      <p>At launch we intend to deliver within: <strong>{p.shippingRegions.join(", ")}</strong>. International shipping is not offered until logistics and compliance are ready.</p>
      <h2>Dispatch and delivery</h2>
      <ul>
        <li>Processing / dispatch time: <TBC value={p.dispatchTime} /></li>
        <li>Estimated delivery time: <TBC value={p.deliveryEstimate} /></li>
        <li>Delivery charges: <TBC value={p.shippingCharges} /></li>
      </ul>
      <p>Charges and delivery estimates will always be shown before you pay. We will never add hidden fees at checkout.</p>
      <h2>Tracking</h2>
      <p>Once your order is handed to the courier, you will receive a tracking reference by email. Order status updates will reflect real courier events only.</p>
      <h2>Delays and exceptions</h2>
      <p>If a delivery is delayed, lost or arrives damaged, please <Link href="/contact">contact us</Link> with your order ID and photographs where relevant. We will explain the next steps under our <Link href="/returns">returns and defect policy</Link>.</p>
      <h2>Orders during the preview</h2>
      <p>The site is currently a catalogue preview. No orders can be placed, and nothing is shipped.</p>
    </PolicyPage>
  );
}
