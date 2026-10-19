import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage } from "@/components/editorial/PolicyPage";
import { TBC } from "@/components/editorial/DraftNotice";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Returns & Exchanges", description: "How returns, exchanges and defect reports will work at TAAROKH.", alternates: { canonical: "/returns" } };

export default function Page() {
  const p = site.policies;
  return (
    <PolicyPage slug="returns" title="Returns & Exchanges" intro="How to return or exchange a strap, and what to do if something isn't right.">
      <h2>Return window</h2>
      <p>Return or exchange period: <TBC value={p.returnWindowDays ? `${p.returnWindowDays} days from delivery` : null} />.</p>
      <h2>Exchanging a width</h2>
      <p>Choosing the right width matters. If you believe you selected the wrong width, please <Link href="/contact">contact us</Link> before your order is dispatched. Exchange terms after delivery: <TBC value={p.exchangePolicy} />.</p>
      <h2>Condition of returned items</h2>
      <p>Eligibility will depend on the product&rsquo;s condition and the applicable law. Final conditions (for example, unworn and in original packaging) will be published here before launch.</p>
      <h2>Defects</h2>
      <p>If a strap arrives damaged or develops a manufacturing defect, please send your order ID, photographs of the issue and when it occurred. We will review it against this policy and tell you the next steps. Your statutory rights as a consumer are not affected.</p>
      <h2>Refunds</h2>
      <p>Refund method and timing: <TBC value={null} />. Refunds are processed back through the original payment provider; TAAROKH never stores card details.</p>
      <h2>How to start a return</h2>
      <ol>
        <li>Contact us with your order ID and the reason for the return.</li>
        <li>We will confirm eligibility and send return instructions.</li>
        <li>Once received and inspected, we will process the exchange or refund.</li>
      </ol>
    </PolicyPage>
  );
}
