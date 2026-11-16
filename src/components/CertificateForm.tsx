"use client";

import { useState } from "react";

export function CertificateForm({ attemptId }: { attemptId: string }) {
  const [name, setName] = useState("");
  const ready = name.trim().length > 0;
  return (
    <form className="stack" action={`/certificate/${attemptId}`} method="get">
      <label className="stack" style={{ gap: 6 }} htmlFor="certificate-name">
        <span>Name to print on your certificate</span>
        <input id="certificate-name" className="field" name="name" value={name} onChange={(event) => setName(event.target.value)} maxLength={60} autoComplete="name" enterKeyHint="done" />
      </label>
      <button className="btn btn-secondary" disabled={!ready}>Create my certificate</button>
    </form>
  );
}
