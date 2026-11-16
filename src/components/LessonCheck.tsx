"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Check } from "@/lib/courses";

const LETTERS = ["A", "B", "C", "D"];

// A quick check at the end of a lesson. Unlike the test, this is practice:
// each answer shows straight away whether it was right, and why.
export function LessonCheck(props: { attemptId: string; lessonId: string; checks: Check[]; nextHref: string; last: boolean }) {
  const router = useRouter();
  const [picked, setPicked] = useState<(number | null)[]>(() => props.checks.map(() => null));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const answered = picked.every((choice) => choice !== null);

  async function finish() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/learn/${props.attemptId}/lessons`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lessonId: props.lessonId }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message);
      router.push(props.nextHref);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save your progress. Try again.");
      setBusy(false);
    }
  }

  return (
    <section className="stack" aria-label="Quick check">
      <h2>Quick check</h2>
      {props.checks.map((check, i) => {
        const choice = picked[i] ?? null;
        return (
          <div className="stack" key={check.question} data-testid="check">
            <p className="prompt">{check.question}</p>
            <div className="opts">
              {check.options.map((option, k) => (
                <button
                  key={option}
                  className="opt"
                  data-testid="check-option"
                  data-result={choice === null ? undefined : k === check.answer ? "right" : k === choice ? "wrong" : undefined}
                  aria-pressed={choice === k}
                  disabled={choice !== null}
                  onClick={() => setPicked(picked.map((value, j) => (j === i ? k : value)))}
                >
                  <span className="chip">{LETTERS[k]}</span>
                  <span>{option}</span>
                </button>
              ))}
            </div>
            {choice !== null && (
              <p className="enter" role="status" data-testid="check-why">
                <strong>{choice === check.answer ? "Correct." : "Not quite."}</strong> {check.why}
              </p>
            )}
          </div>
        );
      })}
      <button className="btn btn-primary" disabled={!answered || busy} onClick={finish}>
        {props.last ? "Finish course" : "Complete and continue"}
      </button>
      {error && <p className="error" role="alert">{error}</p>}
    </section>
  );
}
