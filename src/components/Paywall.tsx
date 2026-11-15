"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// The price and renewal terms block. Wording, position and size are fixed by
// PRD requirements M1-M3; no countdowns or urgency elements belong here.
export function Paywall(props: { attemptId: string; heading: string; terms: string; renewsOn: string; consentLabel: string }) {
  const router = useRouter();
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ attemptId: props.attemptId, consent }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message);
      router.push(`/report/${props.attemptId}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Payment did not go through. Try again.");
      setBusy(false);
    }
  }

  return (
    <section className="card card-lift" aria-label="Start your trial">
      <h2>{props.heading}</h2>
      <p data-testid="terms">
        <strong>{props.terms}</strong> Your plan renews on {props.renewsOn}.
      </p>
      <label className="check">
        <input id="renewal-consent" type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
        <span>{props.consentLabel}</span>
      </label>
      <button className="btn btn-primary" disabled={!consent || busy} onClick={pay}>
        Start 7-day trial
      </button>
      {error && <p className="error" role="alert">{error}</p>}
      <p className="caption">Cancel in two taps from Account. We email you a reminder on day 5.</p>
    </section>
  );
}
