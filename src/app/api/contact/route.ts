import { contactSchema, topicLabels } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/**
 * Contact form → email via Resend.
 * Env: RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL (verified sender).
 * Optional spam check: TURNSTILE_SECRET_KEY (+ NEXT_PUBLIC_TURNSTILE_SITE_KEY).
 * Built-in: honeypot, minimum fill time, per-IP rate limit, server-side validation.
 */
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60_000)) return Response.json({ message: "Too many messages. Please try again later." }, { status: 429 });
  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0])] ??= i.message;
    return Response.json({ message: "Please check the highlighted fields.", errors }, { status: 400 });
  }
  const d = parsed.data;
  if (d.company) return Response.json({ ok: true }); // honeypot
  if (d.startedAt && Date.now() - d.startedAt < 2500) return Response.json({ message: "That was quick — please try again." }, { status: 400 });

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const v = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret: turnstileSecret, response: d.turnstileToken ?? "", remoteip: ip }),
    })
      .then((r) => r.json())
      .catch(() => ({ success: false }));
    if (!v.success) return Response.json({ message: "We couldn't verify the spam check. Please try again." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !to || !from) {
    return Response.json({ message: "Our contact inbox isn't connected yet, so your message was not sent. Please try again soon." }, { status: 503 });
  }
  const html = `<h2>New message — ${esc(topicLabels[d.topic])}</h2>
<p><strong>From:</strong> ${esc(d.name)} &lt;${esc(d.email)}&gt;</p>
${d.orderId ? `<p><strong>Order ID:</strong> ${esc(d.orderId)}</p>` : ""}
<p style="white-space:pre-wrap">${esc(d.message)}</p>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: d.email, subject: `[TAAROKH] ${topicLabels[d.topic]} — ${d.name}`, html }),
    });
    if (!res.ok) return Response.json({ message: "Your message couldn't be delivered. Please try again later." }, { status: 502 });
  } catch {
    return Response.json({ message: "The email service could not be reached. Your message was not sent." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
