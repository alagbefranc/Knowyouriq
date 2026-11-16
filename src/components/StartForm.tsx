"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const BANDS = [
  { value: "18-24", label: "18 to 24" },
  { value: "25-34", label: "25 to 34" },
  { value: "35-44", label: "35 to 44" },
  { value: "45+", label: "45 or older" },
];

// The first tap is the first question: choosing an age band starts the test.
// It doubles as the 18+ check, so there is no separate checkbox.
export function StartForm() {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function start(ageBand: string) {
    setBusy(ageBand);
    setMessage(null);
    try {
      const response = await fetch("/api/attempts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ageBand }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message);
      router.push(`/test/${body.id}`);
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Could not start the test. Try again.");
      setBusy(null);
    }
  }

  return (
    <div className="stack" id="start">
      <p className="prompt center-text">How old are you?</p>
      <div className="opts opts-grid">
        {BANDS.map((band) => (
          <button key={band.value} className="btn btn-primary" disabled={busy !== null} onClick={() => start(band.value)}>
            {band.label}
          </button>
        ))}
      </div>
      <button className="link-btn" disabled={busy !== null} onClick={() => setMessage("KnowYourIQ is for people aged 18 or older.")}>
        I am under 18
      </button>
      {message && <p className="error center-text" role="status">{message}</p>}
    </div>
  );
}
