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
  answers: Record<string, { choice: number; ms: number }>;
  completedAt?: Date;
  result?: AttemptResult;
  subscription?: Subscription;
}

export interface Store {
  getAttempt(id: string): Attempt | undefined;
  saveAttempt(attempt: Attempt): void;
}

/**
 * In-memory store: enough for development and the test pipeline. Data is lost
 * on restart, so this must be replaced by the database before launch.
 */
export class MemoryStore implements Store {
  private attempts = new Map<string, Attempt>();
  getAttempt(id: string) {
    return this.attempts.get(id);
  }
  saveAttempt(attempt: Attempt) {
    this.attempts.set(attempt.id, attempt);
  }
}

const holder = globalThis as unknown as { __kyiqStore?: Store };

/** One store per server process, shared by every route and page. */
export function defaultStore(): Store {
  holder.__kyiqStore ??= new MemoryStore();
  return holder.__kyiqStore;
}
