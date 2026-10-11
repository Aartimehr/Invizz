"use client";

import { useState, type FormEvent } from "react";
import { store, whatsappLink } from "@/lib/store";

type Status = "idle" | "sending" | "done" | "invalid" | "closed" | "failed";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function EarlyAccessForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const address = email.trim();
    if (!emailPattern.test(address)) return setStatus("invalid");

    setStatus("sending");
    try {
      const response = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: address }),
      });
      if (response.ok) return setStatus("done");
      const result: { error?: string } = await response.json().catch(() => ({}));
      setStatus(result.error === "invalid-email" ? "invalid" : result.error === "not-configured" ? "closed" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  // Success is shown only after the server confirms the mailing list accepted the address.
  if (status === "done") {
    return (
      <p className="early-done" role="status">
        You&apos;re on the list. We&apos;ll write to <strong>{email.trim()}</strong> when there is something to see.
      </p>
    );
  }

  return (
    <form className="early-form" onSubmit={handleSubmit} noValidate>
      <div className="early-row">
        <label className="visually-hidden" htmlFor="early-email">Email address</label>
        <input
          id="early-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Your email address"
          value={email}
          onChange={(event) => { setEmail(event.target.value); if (status !== "sending") setStatus("idle"); }}
          aria-invalid={status === "invalid"}
          aria-describedby="early-note"
          disabled={status === "sending"}
          required
        />
        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Get Early Access"}
        </button>
      </div>
      <p className="early-note" id="early-note" role={status === "idle" || status === "sending" ? undefined : "alert"}>
        {status === "invalid" && "Please enter a valid email address."}
        {status === "failed" && "That didn't go through. Please try again in a moment."}
        {status === "closed" && (
          <>
            Our email list isn&apos;t open just yet, so we haven&apos;t saved your address.{" "}
            <a href={whatsappLink(`Hi ${store.name}! Please tell me when the first drop is here.`)} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a> and we&apos;ll tell you first.
          </>
        )}
        {(status === "idle" || status === "sending") && "We only ask for your email address."}
      </p>
    </form>
  );
}
