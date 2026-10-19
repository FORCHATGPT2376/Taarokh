import type { Metadata } from "next";
import { PolicyPage } from "@/components/editorial/PolicyPage";
import { TBC } from "@/components/editorial/DraftNotice";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Privacy", description: "What personal data TAAROKH collects, why, and your choices.", alternates: { canonical: "/privacy" } };

export default function Page() {
  return (
    <PolicyPage slug="privacy" title="Privacy" intro="We collect as little as we need, and only for clear purposes. This draft describes how the site currently works.">
      <h2>Who is responsible</h2>
      <p>Data controller / business: <TBC value={site.contact.businessName} />. Contact: <TBC value={site.contact.supportEmail} />. Grievance contact: <TBC value={site.contact.grievanceOfficer} />.</p>
      <h2>What this site collects today</h2>
      <ul>
        <li><strong>Orders</strong>: your name, phone, optional email and delivery address, sent to us so we can confirm and deliver your Cash on Delivery order.</li>
        <li><strong>Your bag</strong> is stored only in your own browser (local storage) so it survives page reloads. It is not sent to us until you start a checkout.</li>
        <li><strong>Newsletter sign-ups</strong>: your email address and your consent, sent to our mailing-list provider, only when you tick the consent box. You can unsubscribe from any email.</li>
        <li><strong>Contact messages</strong>: your name, email, topic, optional order ID and message, sent to our support inbox so we can reply. Contacting us does not subscribe you to marketing.</li>
        <li><strong>Server logs</strong>: standard technical logs kept by our hosting provider, and your IP address used briefly to limit spam.</li>
      </ul>
      <h2>What we don&rsquo;t collect</h2>
      <p>We never collect payment card details — all orders are Cash on Delivery. We don&rsquo;t ask for dates of birth, ID documents or unrelated sensitive information.</p>
      <h2>Analytics and cookies</h2>
      <p>No analytics or advertising cookies are currently set. If analytics are added, this notice and any consent controls will be updated first.</p>
      <h2>Service providers</h2>
      <p>Hosting, email delivery, mailing list and checkout providers process data on our behalf. Names of providers: <TBC value={null} />.</p>
      <h2>Retention</h2>
      <p>Retention periods: <TBC value={null} />.</p>
      <h2>Your rights</h2>
      <p>Subject to applicable law, including India&rsquo;s Digital Personal Data Protection Act, you may ask to access, correct or erase your personal data, or withdraw consent. Contact us using the details above.</p>
    </PolicyPage>
  );
}
