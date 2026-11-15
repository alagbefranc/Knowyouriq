import { SCORE_MAX, SCORE_MIN } from "@/lib/scoring";

const pct = (score: number) => ((score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100;

/** The 70 to 140 number line with one stretch highlighted. */
export function ScoreScale(props: { low: number; high: number }) {
  const ticks = [70, 80, 90, 100, 110, 120, 130, 140];
  return (
    <div className="scale" role="img" aria-label={`Scale from ${SCORE_MIN} to ${SCORE_MAX} with ${props.low} to ${props.high} highlighted`}>
      <span className="seg" style={{ left: `${pct(props.low)}%`, width: `${pct(props.high) - pct(props.low)}%` }} />
      <span className="axis" />
      {ticks.map((t) => (
        <span key={t}>
          <span className="tick" style={{ left: `${pct(t)}%` }} />
          <span className="num" style={{ left: `${pct(t)}%` }}>{t}</span>
        </span>
      ))}
    </div>
  );
}
