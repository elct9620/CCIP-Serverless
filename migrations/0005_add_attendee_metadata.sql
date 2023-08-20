-- Migration number: 0005 	 2023-08-20T08:45:11.169Z
ALTER TABLE attendees
	ADD COLUMN metadata TEXT NOT NULL DEFAULT '{}';
