-- Migration number: 0008 	 2023-08-31T07:08:41.321Z
ALTER TABLE announcements
  ADD COLUMN roles TEXT NOT NULL DEFAULT '[]';
