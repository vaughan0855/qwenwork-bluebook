CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  helpfulness TEXT NOT NULL,
  valuable_json TEXT NOT NULL,
  action_json TEXT NOT NULL,
  nps INTEGER NOT NULL CHECK (nps >= 0 AND nps <= 10),
  reason TEXT NOT NULL DEFAULT '',
  submitted_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_feedback_submitted_at ON feedback (submitted_at);
