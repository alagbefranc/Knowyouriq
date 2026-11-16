"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Glyph } from "@/components/Glyph";
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

/** Progress as the form's timing track: one mark per question, in groups of five. */
function Marks(props: { total: number; done: number; current?: boolean }) {
  const groups = Array.from({ length: props.total / 5 }, (_, g) => g);
  return (
    <div className="marks" role="progressbar" aria-label="Questions answered" aria-valuemin={0} aria-valuemax={props.total} aria-valuenow={props.done}>
      {groups.map((g) => (
        <span key={g}>
          {[0, 1, 2, 3, 4].map((k) => {
            const n = g * 5 + k;
            return <i key={k} data-s={n < props.done ? "done" : n === props.done && props.current ? "now" : undefined} />;
          })}
        </span>
      ))}
    </div>
  );
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
  // Id of the memory question whose set has been hidden. Derived this way so the
  // set shows on the very first render of the question, with no flash of the options.
  const [recalled, setRecalled] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const shownAt = useRef(0);
  const finishing = useRef(false);

  const question = questions[index];

  // The memory set hides when its time runs out, or sooner if the player says they are ready.
  const memorizing = Boolean(question?.memorize) && recalled !== question?.id;
  function endMemorizing() {
    if (question) setRecalled(question.id);
    shownAt.current = performance.now();
  }

  useEffect(() => {
    if (!question || sectionDone) return;
    setSelected(null);
    shownAt.current = performance.now();
    if (!question.memorize || recalled === question.id) return;
    const timer = setTimeout(endMemorizing, question.memorize.ms);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, sectionDone, recalled]);

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
    const finished = questions[index - 1]!.skill;
    return (
      <div className="stack" key={`done-${index}`}>
        {/* Seen five times a test: the artwork leads, the words follow in shrinking gaps, done in about 300ms. */}
        <Marks total={questions.length} done={index} />
        <div className="world world-tall beat" style={{ "--s": 0.97 } as React.CSSProperties}>
          <img src={`/art/worlds/${finished}.webp`} alt="" width={960} height={640} />
        </div>
        <span className="label">World {index / 5} of 5 cleared</span>
        <h1 className="beat" style={{ "--d": "50ms", "--y": "8px" } as React.CSSProperties}>
          Section complete: <mark>{sectionDone}</mark>
        </h1>
        <p className="muted beat" style={{ "--d": "90ms", "--y": "4px" } as React.CSSProperties}>{last ? "That was the last one." : `${questions.length - index} questions to go.`}</p>
        <button className="btn btn-primary" onClick={() => setSectionDone(null)}>
          {last ? "See my result" : "Continue"}
        </button>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="stack center">
        <img className="quo" src="/art/quo-detective.webp" alt="" width={210} height={210} />
        <h1>Scoring your answers</h1>
        {error ? <p className="error" role="alert">{error}</p> : <p className="muted">Comparing each section with the norm group.</p>}
      </div>
    );
  }

  const pictures = question.options.every((option) => /^(img|n|w):/.test(option));
  const strip = (tokens: string[]) => {
    const size = tokens.length > 7 ? "xs" : tokens.length > 4 ? "sm" : tokens.length === 1 ? "xl" : "md";
    return tokens.map((token, i) => <Glyph key={i} token={token} size={size} />);
  };

  return (
    <div className="stack">
      <div className="world">
        <img src={`/art/worlds/${question.skill}.webp`} alt="" width={960} height={640} />
        <div className="row label">
          <span>{SKILL_LABELS[question.skill]}</span>
          <span data-testid="position">{index + 1} of {questions.length}</span>
        </div>
      </div>
      <Marks total={questions.length} done={index} current />
      <div className="stack enter" key={`${question.id}-${memorizing ? "show" : "ask"}`}>
        {memorizing && question.memorize ? (
          <>
            <p className="prompt">Remember these</p>
            <div className="tray" data-testid="memorize">{strip(question.memorize.items)}</div>
            <div className="countdown" style={{ "--ms": `${question.memorize.ms}ms` } as React.CSSProperties} />
            <p className="caption center-text">You have {Math.round(question.memorize.ms / 1000)} seconds. Take your time.</p>
            <button className="btn btn-secondary" data-testid="ready" onClick={endMemorizing}>I have got it</button>
          </>
        ) : (
          <>
            <p className="prompt" data-testid="prompt">{question.prompt}</p>
            {question.sequence && <div className="tray">{strip(question.sequence)}</div>}
            <div className={`opts${pictures ? " opts-grid" : ""}`}>
              {question.options.map((option, choice) => (
                <button
                  key={option}
                  className="opt"
                  data-testid="option"
                  aria-pressed={selected === choice}
                  disabled={selected !== null}
                  onClick={() => choose(choice)}
                >
                  <span className="chip">{LETTERS[choice]}</span>
                  <Glyph token={option} size="lg" />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      {error && <p className="error" role="alert">{error}</p>}
    </div>
  );
}
