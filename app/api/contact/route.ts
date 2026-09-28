import { validateContact, type ContactPayload } from "@/lib/contact";

export const runtime = "nodejs";

// Simple in-memory rate limit: 5 messages per 10 minutes per IP (resets on server restart).
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Delivers contact-form messages to Telegram via a bot. */
export async function POST(req: Request) {
  // Project-specific names so machine-wide TELEGRAM_* variables from other projects can't take over
  const token = process.env.CONTACT_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.CONTACT_TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: Partial<ContactPayload> & { website?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field
  if (body.website) return Response.json({ ok: true });

  const form: ContactPayload = {
    name: String(body.name ?? ""),
    email: String(body.email ?? ""),
    subject: String(body.subject ?? ""),
    message: String(body.message ?? ""),
  };
  const errors = validateContact(form);
  if (Object.keys(errors).length) {
    return Response.json({ error: "invalid", fields: errors }, { status: 400 });
  }

  const text = [
    "📨 <b>New portfolio message</b>",
    "",
    `<b>From:</b> ${escapeHtml(form.name.trim())}`,
    `<b>Email:</b> ${escapeHtml(form.email.trim())}`,
    `<b>Subject:</b> ${escapeHtml(form.subject.trim())}`,
    "",
    escapeHtml(form.message.trim()),
  ].join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("Telegram sendMessage failed", res.status, await res.text());
      return Response.json({ error: "delivery_failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("Telegram sendMessage error", err);
    return Response.json({ error: "delivery_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
