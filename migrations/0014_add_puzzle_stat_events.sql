-- Migration number: 0014 	 2023-10-05T12:25:49.002Z
DROP TABLE IF EXISTS puzzle_stat_events;
CREATE TABLE puzzle_stat_events (
  id VARCHAR(255) PRIMARY KEY,
  type VARCHAR(255) NOT NULL,
  aggregate_id VARCHAR(255) NOT NULL,
  version INTEGER NOT NULL,
  payload TEXT NOT NULL,
  occurred_at DATETIME NOT NULL DEFAULT (datetime('NOW', 'UTC'))
);
CREATE UNIQUE INDEX idx_puzzle_stat_events_aggregate_id_version ON puzzle_stat_events (aggregate_id, version);
