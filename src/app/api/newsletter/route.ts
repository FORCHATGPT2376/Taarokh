import { newsletterSchema } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/**
 * Newsletter sign-up. Providers (first configured wins):
 *  - Mailchimp: MAILCHIMP_API_KEY, MAILCHIMP_AUDIENCE_ID (double opt-in: status "pending")
 *  - Buttondown: BUTTONDOWN_API_KEY
 * When none is configured we return 503 and the UI says nothing was saved.
 */
export async function POST(req: Request) {
  if (!rateLimit(`nl:${clientIp(req)}`, 5, 10 * 60_000)) return Response.json({ message: "Too many attempts. Please try again in a few minutes." }, { status: 429 });
  const body = await req.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) return Response.json({ message: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 400 });
  const { email, company } = parsed.data;
  if (company) return Response.json({ ok: true }); // honeypot: silently accept, store nothing

  const mcKey = process.env.MAILCHIMP_API_KEY;
  const mcList = process.env.MAILCHIMP_AUDIENCE_ID;
  const bdKey = process.env.BUTTONDOWN_API_KEY;

  try {
    if (mcKey && mcList) {
      const dc = mcKey.split("-")[1];
      const res = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${mcList}/members`, {
        method: "POST",
        headers: { Authorization: `Basic ${Buffer.from(`any:${mcKey}`).toString("base64")}`, "Content-Type": "application/json" },
        body: JSON.stringify({ email_address: email, status: "pending", tags: [parsed.data.source ?? "website"] }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok || json?.title === "Member Exists") return Response.json({ ok: true, message: "Please check your inbox to confirm your subscription." });
      return Response.json({ message: "We couldn't add you to the list just now. Nothing was saved — please try again later." }, { status: 502 });
    }
    if (bdKey) {
      const res = await fetch("https://api.buttondown.email/v1/subscribers", {
        method: "POST",
        headers: { Authorization: `Token ${bdKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ email_address: email, tags: [parsed.data.source ?? "website"] }),
      });
      if (res.ok || res.status === 409) return Response.json({ ok: true, message: "Please check your inbox to confirm your subscription." });
      return Response.json({ message: "We couldn't add you to the list just now. Nothing was saved — please try again later." }, { status: 502 });
    }
  } catch {
    return Response.json({ message: "The mailing list service could not be reached. Nothing was saved." }, { status: 502 });
  }
  return Response.json({ message: "Sign-ups aren't open yet — our mailing list isn't connected, so nothing was saved. Please check back soon." }, { status: 503 });
}
