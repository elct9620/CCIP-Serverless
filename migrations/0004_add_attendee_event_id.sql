-- Migration number: 0004 	 2023-08-20T08:35:31.342Z
ALTER TABLE attendees
  ADD event_id VARCHAR(255) NOT NULL;
