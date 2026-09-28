"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { MESSAGE_MAX, validateContact, type ContactErrors, type ContactPayload } from "@/lib/contact";
import { profile } from "@/lib/data";

const initial: ContactPayload = { name: "", email: "", subject: "", message: "" };
type Status = "idle" | "loading" | "success" | "error";

const ERROR_TEXT: Record<string, string> = {
  rate_limited: "Too many messages in a short time. Please try again in a few minutes.",
  not_configured: "The message service isn't set up yet.",
};

export default function ContactForm() {
  const [form, setForm] = useState(initial);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorText, setErrorText] = useState("");

  const update = (field: keyof ContactPayload, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = validateContact(form);
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website: honeypot }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.fields) setErrors(data.fields);
        setErrorText(ERROR_TEXT[data.error] ?? "Something went wrong while sending.");
        setStatus("error");
        return;
      }
      setStatus("success");
      setForm(initial);
    } catch {
      setErrorText("Network error — check your connection.");
      setStatus("error");
    }
  }

  return (
    <form className="cform panel" onSubmit={submit} noValidate>
      <div className="code__bar mono">
        <span className="code__dots">
          <i />
          <i />
          <i />
        </span>
        <span>compose_message.sh</span>
        <span className="accent">→ telegram</span>
      </div>

      <div className="cform__body">
        <div className="cform__row">
          <Field label="--name" error={errors.name}>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              aria-invalid={!!errors.name}
            />
          </Field>
          <Field label="--email" error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
            />
          </Field>
        </div>
        <Field label="--subject" error={errors.subject}>
          <input
            value={form.subject}
            onChange={(e) => update("subject", e.target.value)}
            placeholder="What would you like to discuss?"
            aria-invalid={!!errors.subject}
          />
        </Field>
        <Field label="--message" error={errors.message}>
          <textarea
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="A little context about your project, role, or idea…"
            maxLength={MESSAGE_MAX}
            rows={5}
            aria-invalid={!!errors.message}
          />
          <span className="cform__count mono">
            {form.message.length} / {MESSAGE_MAX}
          </span>
        </Field>

        {/* Honeypot for bots — hidden from people and screen readers */}
        <input
          className="cform__trap"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          name="website"
        />

        {status === "success" && (
          <output className="cform__note cform__note--ok mono">✓ Message delivered. I&apos;ll get back to you soon.</output>
        )}
        {status === "error" && (
          <p role="alert" className="cform__note cform__note--err mono">
            ✗ {errorText} You can also{" "}
            <a href={profile.emailHref} target="_blank" rel="noopener noreferrer">
              email me directly
            </a>
            .
          </p>
        )}

        <button className="btn cform__submit" type="submit" disabled={status === "loading"}>
          <span>{status === "loading" ? "[ sending… ]" : "[ send_message ]"}</span>
        </button>
      </div>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="cform__field">
      <span className="cform__label mono">{label}</span>
      {children}
      {error && <span className="cform__error mono">{error}</span>}
    </label>
  );
}
