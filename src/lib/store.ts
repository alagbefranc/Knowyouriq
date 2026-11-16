import type { Subscription } from "./billing";
import type { ProfileId } from "./profile";
import type { Skill } from "./questions";
import type { Estimate, SectionScores } from "./scoring";

export interface AttemptResult extends Estimate {
  sections: SectionScores;
  strongest: Skill;
  weakest: Skill[];
  profile: ProfileId;
}

export interface Attempt {
  id: string;
  createdAt: Date;
  /** Self-reported age band chosen on the first screen. */
  ageBand?: string;
  answers: Record<string, { choice: number; ms: number }>;
  completedAt?: Date;
  result?: AttemptResult;
  subscription?: Subscription;
}

export interface Store {
  getAttempt(id: string): Promise<Attempt | undefined>;
  saveAttempt(attempt: Attempt): Promise<void>;
}

const DATE_KEYS = new Set(["createdAt", "completedAt", "startedAt", "currentPeriodEnd", "cancelledAt", "reminderSentAt", "refundedAt", "at"]);

/** Attempts are stored as JSON. Dates go in as ISO strings and come back as Dates. */
export function serializeAttempt(attempt: Attempt): string {
  return JSON.stringify(attempt);
}

export function deserializeAttempt(json: string): Attempt {
  return JSON.parse(json, (key, value) => (DATE_KEYS.has(key) && typeof value === "string" ? new Date(value) : value)) as Attempt;
}

/** In-memory store for local development and tests. Data is lost on restart. */
export class MemoryStore implements Store {
  private attempts = new Map<string, string>();
  async getAttempt(id: string) {
    const json = this.attempts.get(id);
    return json ? deserializeAttempt(json) : undefined;
  }
  async saveAttempt(attempt: Attempt) {
    this.attempts.set(attempt.id, serializeAttempt(attempt));
  }
}

/** The part of Cloudflare's D1 API this app uses. */
export interface D1Like {
  prepare(sql: string): {
    bind(...values: unknown[]): {
      first<T = Record<string, unknown>>(): Promise<T | null>;
      run(): Promise<unknown>;
    };
  };
}

/** Durable store on Cloudflare D1. Schema: migrations/0001_attempts.sql. */
export class D1Store implements Store {
  constructor(private readonly db: D1Like) {}

  async getAttempt(id: string) {
    const row = await this.db.prepare("SELECT data FROM attempts WHERE id = ?").bind(id).first<{ data: string }>();
    return row ? deserializeAttempt(row.data) : undefined;
  }

  async saveAttempt(attempt: Attempt) {
    const status = attempt.subscription?.status ?? null;
    await this.db
      .prepare(
        `INSERT INTO attempts (id, data, created_at, completed_at, subscription_status, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)
         ON CONFLICT(id) DO UPDATE SET data = ?2, completed_at = ?4, subscription_status = ?5, updated_at = ?6`,
      )
      .bind(attempt.id, serializeAttempt(attempt), attempt.createdAt.toISOString(), attempt.completedAt?.toISOString() ?? null, status, new Date().toISOString())
      .run();
  }
}

const holder = globalThis as unknown as { __kyiqMemory?: Store };

/** True only inside the Cloudflare Workers runtime (deployed, or `wrangler dev`). */
const onWorkers = () => typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";

/**
 * The store for this request: D1 on Cloudflare Workers, otherwise one in-memory
 * store per server process. On Workers a missing DB binding is an error, never
 * a silent fall back to memory, so a misconfigured deploy cannot lose data quietly.
 */
export async function defaultStore(): Promise<Store> {
  if (onWorkers()) {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as { DB?: D1Like }).DB;
    if (!db) throw new Error("D1 binding DB is missing. Check d1_databases in wrangler.jsonc.");
    return new D1Store(db);
  }
  holder.__kyiqMemory ??= new MemoryStore();
  return holder.__kyiqMemory;
}
