-- Migration number: 0013 	 2023-10-01T08:36:33.178Z
BEGIN TRANSACTION;

ALTER TABLE announcements RENAME TO _announcements_old;

CREATE TABLE announcements (
  id VARCHAR(255) PRIMARY KEY,
  announced_at DATETIME DEFAULT (datetime('NOW', 'UTC')),
  message TEXT NOT NULL DEFAULT '{}',
  uri TEXT,
  roles TEXT NOT NULL DEFAULT '[]'
);

INSERT INTO announcements (id, announced_at, message, uri, roles)
  SELECT
    id,
    announced_at,
    '{"en-US":"' || message_en || '","zh-TW":"' || message_zh || '"}',
    uri,
    roles
  FROM _announcements_old;

DROP TABLE _announcements_old;

COMMIT;
