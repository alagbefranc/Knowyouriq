import { StartForm } from "@/components/StartForm";
import { termsLine } from "@/lib/billing";
import { QUESTION_COUNT } from "@/lib/questions";

export default function Landing() {
  return (
    <main>
      <picture>
        <source srcSet="/brand/knowyouriq-wordmark-reversed.svg" media="(prefers-color-scheme: dark)" />
        <img src="/brand/knowyouriq-wordmark.svg" alt="KnowYourIQ" width={151} height={35} />
      </picture>
      {/* First-run hero: Quo leads, headline and copy follow. The form below stays still so it can be tapped at once. */}
      <div className="stack center first-run">
        <img className="beat" style={{ "--s": 0.92 } as React.CSSProperties} src="/brand/quo-wave.webp" alt="" width={200} height={200} fetchPriority="high" />
        <h1 className="beat" style={{ "--d": "90ms", "--y": "10px" } as React.CSSProperties}>How sharp are you today?</h1>
        <p className="muted beat" style={{ "--d": "150ms", "--y": "6px" } as React.CSSProperties}>
          {QUESTION_COUNT} quick questions across patterns, numbers, spatial, verbal and memory. About 10 minutes.
        </p>
      </div>
      <StartForm />
      <p data-testid="pricing-notice">
        The test is free. The full report and daily training are part of a paid plan: <strong>{termsLine()}</strong>
      </p>
      <p className="caption">
        Your result is an estimate of reasoning ability from an online test, for education and entertainment. It is not a clinical assessment.
      </p>
    </main>
  );
}
