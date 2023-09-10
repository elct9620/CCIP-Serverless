-- Migration number: 0010 	 2023-09-10T12:15:34.901Z
DROP TABLE IF EXISTS puzzle_activity_events;
CREATE TABLE puzzle_activity_events (
  id VARCHAR(255) PRIMARY KEY,
  type VARCHAR(255) NOT NULL,
  aggregate_id VARCHAR(255) NOT NULL,
  version INTEGER NOT NULL,
  payload TEXT NOT NULL,
  occurred_at DATETIME NOT NULL DEFAULT (datetime('NOW', 'UTC'))
);
CREATE UNIQUE INDEX idx_puzzle_activity_events_aggregate_id_version ON puzzle_activity_events (aggregate_id, version);
