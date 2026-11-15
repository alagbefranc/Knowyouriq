export default function NotFound() {
  return (
    <main>
      <span className="label">Not on file</span>
      <h1>We could not find that test</h1>
      <p className="muted">It may have expired. You can start a new one.</p>
      <a className="btn btn-primary" href="/">Start the free test <span className="arrow" aria-hidden="true">→</span></a>
    </main>
  );
}
