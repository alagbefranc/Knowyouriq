import { notFound, redirect } from "next/navigation";
import { BellCurve } from "@/components/BellCurve";
import { Bubble } from "@/components/Bubble";
import { formatDate, formatMoney } from "@/lib/billing";
import { AppError } from "@/lib/errors";
import { PROFILES } from "@/lib/profile";
import { SKILL_LABELS, SKILLS } from "@/lib/questions";
import { getReport } from "@/lib/service";

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let report: ReturnType<typeof getReport>;
  try {
    report = getReport(id);
  } catch (error) {
    if (error instanceof AppError && error.status === 404) notFound();
    if (error instanceof AppError && error.code === "attempt_incomplete") redirect(`/test/${id}`);
    if (error instanceof AppError && error.status === 402) redirect(`/result/${id}`);
    throw error;
  }
  const { result, plan } = report;
  const profile = PROFILES[result.profile];

  return (
    <main>
      <section className="stack" aria-label="Your estimate">
        <span className="label">Your estimate</span>
        <span className="score beat" style={{ "--y": "10px" } as React.CSSProperties} data-testid="estimate">{result.estimate}</span>
        <p>
          Likely range {result.low} to {result.high}. <mark><strong>Higher than {result.percentile}% of test takers.</strong></mark>
        </p>
        <BellCurve estimate={result.estimate} low={result.low} high={result.high} percentile={result.percentile} />
      </section>
      <section className="section">
        <h2>Your five skills</h2>
        <div className="lines">
          {SKILLS.map((skill, row) => (
            <div key={skill}>
              <span>{SKILL_LABELS[skill]}</span>
              <span className="dots" role="img" aria-label={`${result.sections[skill]} of 5`}>
                {[0, 1, 2, 3, 4].map((k) => (
                  // Marks land row by row with shrinking gaps; this screen is seen once.
                  <Bubble key={k} small filled={k < result.sections[skill]} className="beat" style={{ "--d": `${[0, 60, 110, 150, 180][row]! + k * 25}ms`, "--s": 0.8 } as React.CSSProperties} />
                ))}
              </span>
            </div>
          ))}
        </div>
      </section>
      <section className="section">
        <span className="label">Your cognitive style · for fun</span>
        <span className="stamp" data-testid="profile">{profile.name}</span>
        <p>{profile.blurb}</p>
      </section>
      <section className="section">
        <span className="label">Your plan</span>
        {plan.nextCharge ? (
          <p data-testid="plan-line">
            Renews on {formatDate(plan.nextCharge.at)} for {formatMoney(plan.nextCharge.amountCents)}.
          </p>
        ) : (
          <p data-testid="plan-line">Cancelled. You keep access until {formatDate(plan.accessUntil)}.</p>
        )}
        <a className="btn btn-secondary" href={`/account/${id}`}>Manage plan <span className="arrow" aria-hidden="true">→</span></a>
      </section>
      <p className="caption">
        This is an estimate from a short online test using provisional scoring. It is not a clinical assessment.
      </p>
    </main>
  );
}
