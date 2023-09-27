-- Migration number: 0011 	 2023-09-27T04:34:12.862Z
BEGIN TRANSACTION;

ALTER TABLE announcements RENAME TO _announcements_old;

CREATE TABLE announcements (
  id VARCHAR(255) PRIMARY KEY,
  announced_at DATETIME DEFAULT (datetime('NOW', 'UTC')),
  message_en TEXT,
  message_zh TEXT,
  uri TEXT,
  roles TEXT NOT NULL DEFAULT '[]'
);

INSERT INTO announcements (id, announced_at, message_en, message_zh, uri, roles)
  SELECT
    LOWER(HEX(RANDOMBLOB(4))) || '-' || LOWER(HEX(RANDOMBLOB(2))) || '-' || LOWER(HEX(RANDOMBLOB(2))) || '-' || LOWER(HEX(RANDOMBLOB(2))) || '-' || LOWER(HEX(RANDOMBLOB(6))) AS id,
    announced_at, message_en, message_zh, uri, roles
  FROM _announcements_old;

DROP TABLE _announcements_old;

COMMIT;
