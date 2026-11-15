"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function StartForm() {
  const router = useRouter();
  const [adult, setAdult] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/attempts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ageConfirmed: adult }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message);
      router.push(`/test/${body.id}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not start the test. Try again.");
      setBusy(false);
    }
  }

  return (
    <div className="stack">
      <label className="check">
        <input id="age-confirm" type="checkbox" checked={adult} onChange={(event) => setAdult(event.target.checked)} />
        <span>I am 18 or older.</span>
      </label>
      <button className="btn btn-primary" disabled={!adult || busy} onClick={start}>
        Start the free test
      </button>
      {error && <p className="error" role="alert">{error}</p>}
    </div>
  );
}
