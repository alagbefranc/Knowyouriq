import { notFound, redirect } from "next/navigation";
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
      <h1>Your report</h1>
      <section className="score-card beat" style={{ "--s": 0.96 } as React.CSSProperties} aria-label="Your estimate">
        <span className="label">Your estimate</span>
        <span className="score" data-testid="estimate">{result.estimate}</span>
        <span>Likely range {result.low} to {result.high}</span>
        <span className="pill">Higher than {result.percentile}% of test takers</span>
      </section>
      <section className="card">
        <h2>Your five skills</h2>
        <div className="bars">
          {SKILLS.map((skill, i) => (
            <div className="bar-row" key={skill}>
              <img src={`/brand/skill-${skill}.webp`} alt="" width={36} height={36} />
              <div className="stack" style={{ gap: 4 }}>
                <span>{SKILL_LABELS[skill]}</span>
                <div className="track"><div className="fill" style={{ "--p": result.sections[skill] * 20, "--d": `${[0, 60, 110, 150, 180][i]}ms` } as React.CSSProperties} /></div>
              </div>
              <strong>{result.sections[skill]}/5</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="card">
        <div className="row" style={{ justifyContent: "flex-start" }}>
          <img src={`/brand/profile-${result.profile}.webp`} alt="" width={72} height={72} />
          <div>
            <span className="label">Your cognitive style · for fun</span>
            <h2 data-testid="profile">{profile.name}</h2>
          </div>
        </div>
        <p>{profile.blurb}</p>
      </section>
      <section className="card">
        <h2>Your plan</h2>
        {plan.nextCharge ? (
          <p data-testid="plan-line">
            Renews on {formatDate(plan.nextCharge.at)} for {formatMoney(plan.nextCharge.amountCents)}.
          </p>
        ) : (
          <p data-testid="plan-line">Cancelled. You keep access until {formatDate(plan.accessUntil)}.</p>
        )}
        <a className="btn btn-secondary" href={`/account/${id}`}>Manage plan</a>
      </section>
      <p className="caption">
        This is an estimate from a short online test using provisional scoring. It is not a clinical assessment.
      </p>
    </main>
  );
}
