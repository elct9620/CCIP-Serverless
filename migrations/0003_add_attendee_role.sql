-- Migration number: 0003 	 2023-08-20T06:40:22.503Z
ALTER TABLE attendees
  ADD role VARCHAR(255) NOT NULL DEFAULT 'audience';
