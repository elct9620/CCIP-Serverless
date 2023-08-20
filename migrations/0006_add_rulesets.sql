-- Migration number: 0006 	 2023-08-20T09:51:25.545Z
DROP TABLE IF EXISTS rulesets;
CREATE TABLE IF NOT EXISTS rulesets (
		name VARCHAR(255) NOT NULL,
		event_id VARCHAR(255) NOT NULL,
		scenarios TEXT NOT NULL DEFAULT '{}',
		PRIMARY KEY (event_id, name)
);
