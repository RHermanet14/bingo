DROP TABLE IF EXISTS rooms;
CREATE TABLE rooms (
	id uuid PRIMARY KEY,
	host text,
	type text CHECK (type IN ('Public', 'Private')),
	password text /* TODO */
	size INT CHECK (size BETWEEN 0 AND 30),
	created_at timestamp default now()
);