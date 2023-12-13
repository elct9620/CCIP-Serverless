-- Migration number: 0015 	 2023-12-13T13:44:13.922Z
DROP TABLE IF EXISTS puzzle_configs;
CREATE TABLE puzzle_configs (
  event_id VARCHAR(255) PRIMARY KEY,
  pieces TEXT NOT NULL
);
