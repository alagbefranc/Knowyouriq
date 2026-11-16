import { BellCurve } from "@/components/BellCurve";
import { Certificate } from "@/components/Certificate";
import { StartForm } from "@/components/StartForm";
import { formatMoney, PLAN, termsLine } from "@/lib/billing";
import { QUESTION_COUNT, SKILL_LABELS, SKILLS } from "@/lib/questions";

// Everything in the "sample" sections is an illustration with made-up values, and is labelled as one.
const SAMPLE = { estimate: 120, low: 114, high: 126, percentile: 91, skills: [5, 4, 3, 4, 5] };

export default function Landing() {
  return (
    <main>
      {/* First-run hero: the artwork leads, headline and copy follow. The start question stays still so it can be tapped at once. */}
      <div className="hero first-run">
        <img className="beat" style={{ "--s": 0.96 } as React.CSSProperties} src="/art/hero.webp" alt="" width={800} height={800} fetchPriority="high" />
      </div>
      <div className="stack center hero-copy first-run">
        <h1 className="beat" style={{ "--d": "90ms", "--y": "10px" } as React.CSSProperties}>
          How sharp are you <mark>today?</mark>
        </h1>
        <p className="muted beat" style={{ "--d": "150ms", "--y": "6px" } as React.CSSProperties}>
          {QUESTION_COUNT} picture puzzles across five worlds. About 10 minutes.
        </p>
      </div>
      <StartForm />
      <p className="caption center-text">
        Free to take. Your score and report need a paid plan, {formatMoney(PLAN.trialPriceCents)} to start. <a href="#plan">See the plan</a>
      </p>

      <section className="stack">
        <h2>Three steps to your score</h2>
        <ol className="steps">
          <li><span className="tile tile-sm">1</span><div><strong>Play the test</strong><p className="muted">{QUESTION_COUNT} puzzles in five worlds: patterns, numbers, spatial, verbal and memory.</p></div></li>
          <li><span className="tile tile-sm">2</span><div><strong>Unlock your score</strong><p className="muted">Your estimate, its likely range, and how you compare with other test takers.</p></div></li>
          <li><span className="tile tile-sm">3</span><div><strong>See your strengths</strong><p className="muted">A result for each skill, your cognitive style, and a certificate with your name.</p></div></li>
        </ol>
      </section>

      <section className="panel" aria-label="Sample report">
        <span className="label">Sample report</span>
        <span className="score">{SAMPLE.estimate}</span>
        <p>
          Likely range {SAMPLE.low} to {SAMPLE.high}. <strong>Higher than {SAMPLE.percentile}% of test takers.</strong>
        </p>
        <BellCurve estimate={SAMPLE.estimate} low={SAMPLE.low} high={SAMPLE.high} percentile={SAMPLE.percentile} />
        <div className="lines">
          {SKILLS.map((skill, row) => (
            <div key={skill}>
              <span className="row" style={{ justifyContent: "flex-start" }}>
                <img className="thumb" src={`/art/worlds/${skill}.webp`} alt="" width={44} height={44} loading="lazy" />
                {SKILL_LABELS[skill]}
              </span>
              <span className="pips" role="img" aria-label={`${SAMPLE.skills[row]} of 5`}>
                {[0, 1, 2, 3, 4].map((k) => <i key={k} data-on={k < SAMPLE.skills[row]!} />)}
              </span>
            </div>
          ))}
        </div>
        <div className="row" style={{ justifyContent: "flex-start" }}>
          <img className="medal" src="/art/profiles/strategist.webp" alt="" width={104} height={104} loading="lazy" />
          <div>
            <span className="label">Cognitive style · for fun</span>
            <h2>Strategist</h2>
          </div>
        </div>
        <p className="caption">An example with made-up values, to show what your report looks like.</p>
      </section>

      <section className="stack" aria-label="Sample certificate">
        <h2>A certificate with your name</h2>
        <Certificate sample name="Alex Morgan" estimate={SAMPLE.estimate} date="1 June 2026" id="4829 1375" />
      </section>

      <section className="panel" id="plan" data-testid="pricing-notice">
        <span className="label">The plan</span>
        <h2>{formatMoney(PLAN.trialPriceCents)} for {PLAN.trialDays} days</h2>
        <ul className="includes">
          <li>Your score estimate and its likely range</li>
          <li>How you compare with other test takers</li>
          <li>Your result in each of the five skills</li>
          <li>Your cognitive style</li>
          <li>A certificate with your name</li>
        </ul>
        <p>
          Taking the test is free. Seeing your score and report needs a paid plan: <strong>{termsLine()}</strong>
        </p>
        <a className="btn btn-primary" href="#start">Start the free test</a>
      </section>
      <p className="caption">
        Your result is an estimate of reasoning ability from an online test, for education and entertainment. It is not a clinical assessment.
      </p>
    </main>
  );
}
