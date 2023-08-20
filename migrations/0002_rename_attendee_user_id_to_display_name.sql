-- Migration number: 0002 	 2023-08-20T06:39:08.611Z
ALTER TABLE attendees
RENAME COLUMN user_id TO display_name;
