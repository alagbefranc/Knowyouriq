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
  const [low, high] = teaser.band.split(" to ").map(Number) as [number, number];

  return (
    <main>
      <div className="stack" style={{ position: "relative" }}>
        <span className="label">25 of 25 answered</span>
        <h1 className="beat" style={{ "--y": "8px" } as React.CSSProperties}>
          Test<br />complete
        </h1>
        {/* Quo appears once, as the reward sticker on a finished test. */}
        <img className="sticker beat" style={{ "--d": "120ms", "--s": 0.9, "--r": "9deg" } as React.CSSProperties} src="/brand/quo-celebrate.webp" alt="" width={104} height={104} />
      </div>
      <section className="section" aria-label="Your free result">
        <span className="label">Your score band · free</span>
        <span className="big" data-testid="band">{teaser.band}</span>
        <ScoreScale low={low} high={high} />
        <p>
          Strongest skill: <strong data-testid="strongest">{SKILL_LABELS[teaser.strongest]}</strong>
        </p>
      </section>
      <section className="section" aria-label="In the full report">
        <span className="label">In the full report</span>
        <div className="lines" aria-hidden="true">
          <span>Your estimate <Redact w={4} /></span>
          <span>Likely range <span><Redact w={3} /> to <Redact w={3} /></span></span>
          <span>Higher than <span><Redact w={2} />% of test takers</span></span>
          <span>Five-skill breakdown <Redact w={9} /></span>
          <span>Cognitive style <Redact w={11} /></span>
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
