import { Bubble } from "@/components/Bubble";
import { StartForm } from "@/components/StartForm";
import { termsLine } from "@/lib/billing";
import { QUESTION_COUNT } from "@/lib/questions";

export default function Landing() {
  return (
    <main>
      {/* First-run hero: the headline leads, the specimen follows. The form below stays still so it can be tapped at once. */}
      <div className="stack first-run">
        <span className="label">{QUESTION_COUNT} items · 5 sections · about 10 minutes</span>
        <h1 className="beat" style={{ "--y": "10px" } as React.CSSProperties}>
          How sharp are you <mark>today?</mark>
        </h1>
        <p className="muted beat" style={{ "--d": "90ms", "--y": "6px" } as React.CSSProperties}>
          A reasoning test across patterns, numbers, spatial, verbal and memory. Fill in a bubble, move on.
        </p>
      </div>
      <div className="specimen beat first-run" style={{ "--d": "150ms", "--y": "8px", "--r": "-1.5deg" } as React.CSSProperties} aria-hidden="true">
        <span className="label">Sample item</span>
        <span className="q">2, 4, 8, 16, ?</span>
        <span className="choices">
          <span><Bubble small /> 20</span>
          <span><Bubble small /> 24</span>
          <span><Bubble small filled /> 32</span>
          <span><Bubble small /> 64</span>
        </span>
      </div>
      <StartForm />
      <div className="notice" data-testid="pricing-notice">
        <span className="label">Fees</span>
        <p>
          The test is free. The full report and daily training are part of a paid plan: <strong>{termsLine()}</strong>
        </p>
      </div>
      <p className="caption">
        Your result is an estimate of reasoning ability from an online test, for education and entertainment. It is not a clinical assessment.
      </p>
    </main>
  );
}
