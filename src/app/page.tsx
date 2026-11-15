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
      <div className="stack center">
        <img src="/brand/quo-wave.webp" alt="" width={200} height={200} fetchPriority="high" />
        <h1>How sharp are you today?</h1>
        <p className="muted">
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
