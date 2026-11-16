"use client";

export function PrintButton() {
  return (
    <button className="btn btn-primary" onClick={() => window.print()}>
      Save or print
    </button>
  );
}
