import { notFound, redirect } from "next/navigation";
import { Paywall } from "@/components/Paywall";
import { ScoreScale } from "@/components/ScoreScale";
import { addDays, consentLabel, formatDate, formatMoney, PLAN, termsLine } from "@/lib/billing";
import { AppError } from "@/lib/errors";
import { SKILL_LABELS } from "@/lib/questions";
import { getPlan, getTeaser, type Teaser } from "@/lib/service";

const Redact = ({ w }: { w: number }) => <span className="redact" style={{ width: `${w}ch` }} />;

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let teaser: Teaser;
  try {
    teaser = await getTeaser(id);
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
  const [low, high] = teaser.band.split(" to ").map(Number) as [number, number];

  return (
    <main>
      <div className="stack center">
        <img className="quo beat" style={{ "--s": 0.9 } as React.CSSProperties} src="/art/quo-celebrate.webp" alt="" width={210} height={210} />
        <h1 className="beat" style={{ "--d": "60ms", "--y": "8px" } as React.CSSProperties}>Test complete</h1>
      </div>
      <section className="panel" aria-label="Your free result">
        <span className="label">Your score band · free</span>
        <span className="big" data-testid="band">{teaser.band}</span>
        <ScoreScale low={low} high={high} />
        <div className="row" style={{ justifyContent: "flex-start" }}>
          <img className="thumb" src={`/art/worlds/${teaser.strongest}.webp`} alt="" width={44} height={44} />
          <p>
            Strongest skill: <strong data-testid="strongest">{SKILL_LABELS[teaser.strongest]}</strong>
          </p>
        </div>
      </section>
      <section className="panel" aria-label="In the full report">
        <span className="label">In the full report</span>
        <div className="lines" aria-hidden="true">
          <span>Your estimate <Redact w={5} /></span>
          <span>Likely range <Redact w={9} /></span>
          <span>Higher than <Redact w={12} /></span>
          <span>Five-skill breakdown <Redact w={10} /></span>
          <span>Cognitive style <Redact w={12} /></span>
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
