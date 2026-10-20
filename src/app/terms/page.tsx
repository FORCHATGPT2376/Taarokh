import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage } from "@/components/editorial/PolicyPage";
import { TBC } from "@/components/editorial/DraftNotice";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Terms & Conditions", description: "Terms governing use of the TAAROKH website and purchases.", alternates: { canonical: "/terms" } };

export default function Page() {
  return (
    <PolicyPage slug="terms" title="Terms & Conditions" intro="The terms that apply when you use this website and, once orders open, when you buy from us.">
      <h2>About us</h2>
      <p>This website is operated by <TBC value={site.contact.businessName} />, <TBC value={site.contact.businessAddress} />.</p>
      <h2>Orders and images</h2>
      <p>Images marked &ldquo;concept render&rdquo; or &ldquo;illustration&rdquo; are not photographs of finished products. An order is confirmed only after we call you to verify it.</p>
      <h2>Product information and compatibility</h2>
      <p>We aim to describe products accurately. Straps are designed for watches with standard spring-bar lugs of the stated width; compatibility depends on your watch&rsquo;s case and attachment system. Please read the <Link href="/size-guide">size guide</Link> before ordering.</p>
      <h2>Independence</h2>
      <p>TAAROKH straps are independent aftermarket accessories. We are not affiliated with, sponsored by or endorsed by any watch manufacturer. Watch brand names, where mentioned, are used only to describe compatibility.</p>
      <h2>Prices and payment</h2>
      <p>Prices are in Indian Rupees. Tax treatment: <TBC value={site.policies.taxNote} />. Payment: <TBC value={site.policies.paymentProviders} /> — you pay the courier in cash when the order is delivered. We never ask for card details.</p>
      <h2>Orders</h2>
      <p>An order is accepted only after we confirm it with you by phone. You will receive an order reference when you place it.</p>
      <h2>Intellectual property</h2>
      <p>All designs, prints, imagery and text on this site are original works of TAAROKH unless stated otherwise, and may not be reproduced without permission.</p>
      <h2>Governing law</h2>
      <p>Governing law and jurisdiction: <TBC value={null} />.</p>
    </PolicyPage>
  );
}
