export default function NotFound() {
  return (
    <main className="center">
      <img className="quo" src="/art/quo-thinking.webp" alt="" width={210} height={210} />
      <h1>We could not find that test</h1>
      <p className="muted">It may have expired. You can start a new one.</p>
      <a className="btn btn-primary" href="/">Start the free test</a>
    </main>
  );
}
