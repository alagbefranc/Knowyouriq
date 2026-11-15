// Where an estimate sits among test takers: the normal curve (mean 100, SD 15),
// shaded up to the estimate, with the likely range highlighted on the axis.
const W = 420, H = 150, BASE = 118, X0 = 55, X1 = 145;
const x = (score: number) => ((score - X0) / (X1 - X0)) * W;
const y = (score: number) => BASE - Math.exp(-0.5 * ((score - 100) / 15) ** 2) * 100;

function path(from: number, to: number): string {
  const points: string[] = [];
  for (let s = from; s <= to; s += 1) points.push(`${x(s).toFixed(1)} ${y(s).toFixed(1)}`);
  return points.join(" L");
}

export function BellCurve(props: { estimate: number; low: number; high: number; percentile: number }) {
  const { estimate, low, high } = props;
  const labelAnchor = estimate > 120 ? "end" : estimate < 80 ? "start" : "middle";
  return (
    <svg className="curve" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Your estimate of ${estimate} on the curve of all test takers, higher than ${props.percentile} percent`}>
      <path className="area" d={`M${x(X0)} ${BASE} L${path(X0, estimate)} L${x(estimate)} ${BASE} Z`} />
      <rect className="range" x={x(low)} y={BASE + 2} width={x(high) - x(low)} height={9} />
      <path className="line" d={`M${path(X0, X1)}`} />
      <line className="axis" x1={0} x2={W} y1={BASE} y2={BASE} />
      <line className="you" x1={x(estimate)} x2={x(estimate)} y1={y(estimate) - 12} y2={BASE} />
      <text className="you-label" x={x(estimate)} y={y(estimate) - 18} textAnchor={labelAnchor}>YOU</text>
      {[70, 85, 100, 115, 130].map((t) => (
        <text key={t} x={x(t)} y={H - 4} textAnchor="middle">{t}</text>
      ))}
    </svg>
  );
}
