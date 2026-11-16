import { notFound, redirect } from "next/navigation";
import { Paywall } from "@/components/Paywall";
import { addDays, consentLabel, formatDate, formatMoney, PLAN, termsLine } from "@/lib/billing";
import { AppError } from "@/lib/errors";
import { QUESTION_COUNT } from "@/lib/questions";
import { getLockedResult, getPlan } from "@/lib/service";

// The whole result is paid. This screen shows nothing derived from the score:
// no band, no strongest skill, no hint of how the visitor did.
export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let answered: number;
  try {
    answered = (await getLockedResult(id)).answered;
  } catch (error) {
    if (error instanceof AppError && error.status === 404) notFound();
    if (error instanceof AppError && error.code === "attempt_incomplete") redirect(`/test/${id}`);
    throw error;
  }
  let subscribed = false;
  try {
    subscribed = (await getPlan(id)).status !== "ended";
  } catch {
    subscribed = false;
  }
  if (subscribed) redirect(`/report/${id}`);

  return (
    <main>
      <div className="stack center">
        <img className="quo beat" style={{ "--s": 0.9 } as React.CSSProperties} src="/art/quo-celebrate.webp" alt="" width={210} height={210} />
        <span className="label">{answered} of {QUESTION_COUNT} answered</span>
        <h1 className="beat" style={{ "--d": "60ms", "--y": "8px" } as React.CSSProperties}>
          Your score is <mark>ready</mark>
        </h1>
        <p className="muted">We have scored all five worlds. Unlock your report to see how you did.</p>
      </div>
      <section className="panel" aria-label="Your locked result" data-testid="locked">
        <span className="label">Your estimate</span>
        <div className="locked-score" role="img" aria-label="Locked until you unlock your report">
          <span className="tile tile-q tile-lg">?</span>
          <span className="tile tile-q tile-lg">?</span>
          <span className="tile tile-q tile-lg">?</span>
        </div>
        <span className="label">Your report includes</span>
        <ul className="includes">
          <li>Your score estimate and its likely range</li>
          <li>How you compare with other test takers</li>
          <li>Your result in each of the five skills</li>
          <li>Your strongest and weakest skills</li>
          <li>Your cognitive style</li>
        </ul>
      </section>
      <Paywall
        attemptId={id}
        heading={`Unlock your score: ${formatMoney(PLAN.trialPriceCents)} for ${PLAN.trialDays} days`}
        terms={termsLine()}
        renewsOn={formatDate(addDays(new Date(), PLAN.trialDays))}
        consentLabel={consentLabel()}
      />
    </main>
  );
}
