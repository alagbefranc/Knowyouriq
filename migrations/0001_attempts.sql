-- One row per test attempt. The full attempt (answers, result, subscription)
-- is stored as JSON in `data`; the other columns exist for lookups and reports.
CREATE TABLE IF NOT EXISTS attempts (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL,
  completed_at TEXT,
  subscription_status TEXT,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS attempts_created_at ON attempts (created_at);
CREATE INDEX IF NOT EXISTS attempts_subscription_status ON attempts (subscription_status);
