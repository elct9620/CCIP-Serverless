-- Migration number: 0001 	 2023-08-20T03:09:23.080Z
ALTER TABLE attendees
  ADD first_used_at DATETIME NULL;
