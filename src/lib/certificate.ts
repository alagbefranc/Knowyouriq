/** A short, stable certificate number derived from the attempt id, e.g. "4829 1375". */
export function certificateId(attemptId: string): string {
  let hash = 2166136261;
  for (const char of attemptId) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0;
  const digits = String(hash % 100_000_000).padStart(8, "0");
  return `${digits.slice(0, 4)} ${digits.slice(4)}`;
}

/** Cleans a name typed by the customer for printing on the certificate. */
export function certificateName(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw.replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 60);
}
