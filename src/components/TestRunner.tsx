"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SKILL_LABELS, type PublicQuestion } from "@/lib/questions";

const LETTERS = ["A", "B", "C", "D", "E"];

async function post(url: string, body?: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? "Request failed");
  return data;
}

export function TestRunner(props: { attemptId: string; questions: PublicQuestion[]; answeredIds: string[] }) {
  const { attemptId, questions } = props;
  const router = useRouter();
  // Resume at the first unanswered question after a refresh.
  const [index, setIndex] = useState(() => {
    const done = new Set(props.answeredIds);
    const first = questions.findIndex((item) => !done.has(item.id));
    return first === -1 ? questions.length : first;
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [sectionDone, setSectionDone] = useState<string | null>(null);
  const [memorizing, setMemorizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shownAt = useRef(0);
  const finishing = useRef(false);

  const question = questions[index];

  useEffect(() => {
    if (!question || sectionDone) return;
    setSelected(null);
    if (question.memorize) {
      setMemorizing(true);
      const timer = setTimeout(() => {
        setMemorizing(false);
        shownAt.current = performance.now();
      }, question.memorize.ms);
      return () => clearTimeout(timer);
    }
    setMemorizing(false);
    shownAt.current = performance.now();
  }, [question, sectionDone]);

  useEffect(() => {
    if (index < questions.length || sectionDone || finishing.current) return;
    finishing.current = true;
    post(`/api/attempts/${attemptId}/complete`)
      .then(() => router.push(`/result/${attemptId}`))
      .catch((cause: Error) => {
        finishing.current = false;
        setError(cause.message);
      });
  }, [index, questions.length, sectionDone, attemptId, router]);

  async function choose(choice: number) {
    if (!question || selected !== null) return;
    setSelected(choice);
    setError(null);
    try {
      await post(`/api/attempts/${attemptId}/answers`, {
        questionId: question.id,
        choice,
        ms: performance.now() - shownAt.current,
      });
      const next = questions[index + 1];
      if (!next || next.skill !== question.skill) setSectionDone(SKILL_LABELS[question.skill]);
      setIndex(index + 1);
    } catch (cause) {
      setSelected(null);
      setError(cause instanceof Error ? cause.message : "Could not save your answer. Try again.");
    }
  }

  if (sectionDone) {
    const last = index >= questions.length;
    return (
      <div className="stack center enter" key={`done-${index}`}>
        <img src="/brand/quo-thinking.webp" alt="" width={160} height={160} />
        <h1>Section complete: {sectionDone}</h1>
        <p className="muted">{last ? "That was the last one." : `${questions.length - index} questions to go.`}</p>
        <button className="btn btn-primary" onClick={() => setSectionDone(null)}>
          {last ? "See my result" : "Continue"}
        </button>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="stack center">
        <img src="/brand/quo-detective.webp" alt="" width={160} height={160} />
        <h1>Scoring your answers</h1>
        {error ? <p className="error" role="alert">{error}</p> : <p className="muted">Comparing each section with the norm group.</p>}
      </div>
    );
  }

  return (
    <div className="stack">
      <div className="row label">
        <span>{SKILL_LABELS[question.skill]}</span>
        <span data-testid="position">{index + 1} of {questions.length}</span>
      </div>
      <div className="track" role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={index}>
        <div className="fill" style={{ transform: `scaleX(${index / questions.length})` }} />
      </div>
      <div className="stack enter" key={question.id}>
        {memorizing && question.memorize ? (
          <>
            <p className="label">Remember this</p>
            <p className="memo" data-testid="memorize">{question.memorize.text}</p>
          </>
        ) : (
          <>
            <p className="prompt" data-testid="prompt">{question.prompt}</p>
            {question.options.map((option, choice) => (
              <button
                key={option}
                className="opt"
                data-testid="option"
                aria-pressed={selected === choice}
                disabled={selected !== null}
                onClick={() => choose(choice)}
              >
                <span className="key">{LETTERS[choice]}</span>
                {option}
              </button>
            ))}
          </>
        )}
      </div>
      {error && <p className="error" role="alert">{error}</p>}
    </div>
  );
}
