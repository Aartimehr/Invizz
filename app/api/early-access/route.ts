// Receives an early-access sign-up from the homepage and passes it to the mailing list.
// The list's address is kept in the EARLY_ACCESS_WEBHOOK_URL environment variable on the server, never in the browser.
// Until that is set, this answers "not-configured" and the form tells the visitor honestly that the list is not open.

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function answer(status: number, body: { ok: true } | { error: string }) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  let email = "";
  try {
    const body: unknown = await request.json();
    if (body && typeof body === "object" && "email" in body && typeof body.email === "string") email = body.email.trim().toLowerCase();
  } catch {
    return answer(400, { error: "invalid-email" });
  }
  if (email.length > 254 || !emailPattern.test(email)) return answer(400, { error: "invalid-email" });

  const webhook = process.env.EARLY_ACCESS_WEBHOOK_URL;
  if (!webhook) return answer(503, { error: "not-configured" });

  try {
    const forwarded = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, source: "homepage-early-access", signedUpAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
    // Only a clear yes from the mailing list counts as subscribed.
    if (!forwarded.ok) return answer(502, { error: "list-unavailable" });
  } catch {
    return answer(502, { error: "list-unavailable" });
  }

  return answer(200, { ok: true });
}
