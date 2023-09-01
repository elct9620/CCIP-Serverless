-- Migration number: 0009 	 2023-09-01T06:22:31.739Z
BEGIN TRANSACTION;

ALTER TABLE announcements RENAME TO _announcements_old;

CREATE TABLE announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  announced_at DATETIME DEFAULT (datetime('NOW', 'UTC')),
  message_en TEXT,
  message_zh TEXT,
  uri TEXT,
  roles TEXT NOT NULL DEFAULT '[]'
);

INSERT INTO announcements (id, announced_at, message_en, message_zh, uri, roles)
  SELECT id, announced_at, message_en, message_zh, uri, roles
  FROM _announcements_old;

DROP TABLE _announcements_old;

COMMIT;
