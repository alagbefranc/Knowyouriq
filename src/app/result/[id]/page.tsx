import { notFound, redirect } from "next/navigation";
import { Paywall } from "@/components/Paywall";
import { addDays, consentLabel, formatDate, formatMoney, PLAN, termsLine } from "@/lib/billing";
import { AppError } from "@/lib/errors";
import { SKILL_LABELS } from "@/lib/questions";
import { getPlan, getTeaser, type Teaser } from "@/lib/service";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let teaser: Teaser;
  try {
    teaser = getTeaser(id);
  } catch (error) {
    if (error instanceof AppError && error.status === 404) notFound();
    if (error instanceof AppError && error.code === "attempt_incomplete") redirect(`/test/${id}`);
    throw error;
  }
  let subscribed = false;
  try {
    subscribed = getPlan(id).status !== "ended";
  } catch {
    subscribed = false;
  }
  if (subscribed) redirect(`/report/${id}`);

  return (
    <main>
      <div className="stack center">
        <img className="beat" style={{ "--s": 0.9 } as React.CSSProperties} src="/brand/quo-celebrate.webp" alt="" width={140} height={140} />
        <h1 className="beat" style={{ "--d": "60ms", "--y": "8px" } as React.CSSProperties}>Test complete</h1>
      </div>
      <section className="card" aria-label="Your free result">
        <span className="label">Your score band</span>
        <span className="band" data-testid="band">{teaser.band}</span>
        <div className="row" style={{ justifyContent: "flex-start" }}>
          <img src={`/brand/skill-${teaser.strongest}.webp`} alt="" width={40} height={40} />
          <p>
            Strongest skill: <strong data-testid="strongest">{SKILL_LABELS[teaser.strongest]}</strong>
          </p>
        </div>
      </section>
      <section className="card" aria-hidden="true">
        <span className="label">In your full report</span>
        <div className="blurred stack">
          <span className="score">1●●</span>
          <p>Likely range ●●● to ●●● · Higher than ●●% of test takers</p>
          <p>Five-skill breakdown and your cognitive style</p>
        </div>
      </section>
      <Paywall
        attemptId={id}
        heading={`${formatMoney(PLAN.trialPriceCents)} for ${PLAN.trialDays} days`}
        terms={termsLine()}
        renewsOn={formatDate(addDays(new Date(), PLAN.trialDays))}
        consentLabel={consentLabel()}
      />
    </main>
  );
}
