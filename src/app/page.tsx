import { StartForm } from "@/components/StartForm";
import { termsLine } from "@/lib/billing";
import { QUESTION_COUNT } from "@/lib/questions";

export default function Landing() {
  return (
    <main>
      {/* First-run hero: the artwork leads, headline and copy follow. The form stays still so it can be tapped at once. */}
      <div className="hero first-run">
        <img className="beat" style={{ "--s": 0.96 } as React.CSSProperties} src="/art/hero.webp" alt="" width={800} height={800} fetchPriority="high" />
      </div>
      <div className="stack center hero-copy first-run">
        <h1 className="beat" style={{ "--d": "90ms", "--y": "10px" } as React.CSSProperties}>
          How sharp are you <mark>today?</mark>
        </h1>
        <p className="muted beat" style={{ "--d": "150ms", "--y": "6px" } as React.CSSProperties}>
          {QUESTION_COUNT} puzzles across five worlds: patterns, numbers, spatial, verbal and memory. About 10 minutes.
        </p>
      </div>
      <StartForm />
      <div className="panel" data-testid="pricing-notice">
        <span className="label">Fees</span>
        <p>
          Taking the test is free. Seeing your score and report needs a paid plan: <strong>{termsLine()}</strong>
        </p>
      </div>
      <p className="caption">
        Your result is an estimate of reasoning ability from an online test, for education and entertainment. It is not a clinical assessment.
      </p>
    </main>
  );
}
