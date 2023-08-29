-- Migration number: 0007 	 2023-08-29T06:51:58.079Z
DROP TABLE IF EXISTS announcements;
CREATE TABLE IF NOT EXISTS announcements (
  announced_at DATETIME DEFAULT (datetime('NOW', 'UTC')),
  message_en TEXT,
  message_zh TEXT,
  uri TEXT
);
