"use client";

import { useState } from "react";

// Cancelling takes two taps: Cancel plan, then Confirm. No survey, no chat.
export function CancelPlan(props: { attemptId: string; ended: boolean; initiallyCancelled: boolean; accessUntil: string; nextCharge: string | null }) {
  const [cancelled, setCancelled] = useState(props.initiallyCancelled);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/plan/${props.attemptId}/cancel`, { method: "POST" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message);
      setCancelled(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not cancel. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (props.ended) return <p data-testid="plan-status">Your plan has ended.</p>;
  if (cancelled) {
    return (
      <p data-testid="plan-status" role="status">
        Your plan is cancelled. You will not be charged again. You keep access until {props.accessUntil}.
      </p>
    );
  }
  return (
    <div className="stack">
      <p data-testid="plan-status">Next charge: {props.nextCharge}.</p>
      {confirming ? (
        <div className="stack">
          <p>Cancel now and you keep access until {props.accessUntil}. You will not be charged again.</p>
          <button className="btn btn-danger" disabled={busy} onClick={confirm}>Confirm cancel</button>
          <button className="btn btn-secondary" disabled={busy} onClick={() => setConfirming(false)}>Keep my plan</button>
        </div>
      ) : (
        <button className="btn btn-danger" onClick={() => setConfirming(true)}>Cancel plan</button>
      )}
      {error && <p className="error" role="alert">{error}</p>}
    </div>
  );
}
