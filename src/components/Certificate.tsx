/** The certificate card. Always states that the score is an estimate from an online test. */
export function Certificate(props: { name: string; estimate: number; date: string; id: string; sample?: boolean }) {
  return (
    <div className="cert" data-testid="certificate">
      <img src="/brand/knowyouriq-wordmark-reversed.svg" alt="KnowYourIQ" width={120} height={26} />
      <span className="label">{props.sample ? "Sample certificate" : "Certificate of completion"}</span>
      <p className="muted">awarded to</p>
      <p className="cert-name" data-testid="certificate-name">{props.name}</p>
      <p className="muted">for completing the KnowYourIQ reasoning test with an estimated score of</p>
      <p className="cert-score">{props.estimate}</p>
      <div className="row caption">
        <span>{props.date}</span>
        <span>Certificate {props.id}</span>
      </div>
      <p className="caption">An estimate from a short online test. Not a clinical assessment.</p>
    </div>
  );
}
